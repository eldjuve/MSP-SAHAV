#!/bin/bash
# Publishes every table loaded by load-data.sh as a GeoServer layer in the
# MSPudhu workspace, using the exact local layer names the frontend expects
# (see referenced_local_names.txt / GEOSERVER_CHANGES.md). ChartData is
# published separately by seed-chartdata.sh.
# ogr2ogr "launders" (lowercases) Postgres table names on import, so each
# featureType's nativeName is the lowercased table but its exposed name
# matches the original mixed-case service name.
set -e
cd "$(dirname "$0")/.."

GS="http://localhost:8080/geoserver/rest"
AUTH="admin:geoserver"
WS="MSPudhu"
DS="mspudhu_postgis"

# A layer's Title is what the frontend actually displays (Legend/Layers
# panel, sidebar heading) — its raw name is just an identifier. Priority:
# 1. layer-title-overrides.tsv — hand-curated, e.g. "LULC_Pondy" -> "Land
#    Use" (recovered from the old app's hardcoded Multi_DataTree.json,
#    since neither GeoServer's default nor the live server has anything
#    better for these).
# 2. layer-titles.tsv — fetched from the live production server
#    (scripts/fetch-titles.py) for layers where it already has a genuinely
#    more descriptive title set.
# 3. Otherwise, mechanically reformat the raw name ("_" -> " ") — not as
#    good as a real title, but better than showing raw_underscored_names.
title_for() {
  local name="$1" found=""
  [ -f layer-title-overrides.tsv ] && found=$(awk -F'\t' -v n="$name" '$1==n {print $2; exit}' layer-title-overrides.tsv)
  if [ -z "$found" ] && [ -f layer-titles.tsv ]; then
    found=$(awk -F'\t' -v n="$name" '$1==n {print $2; exit}' layer-titles.tsv)
  fi
  [ -z "$found" ] && found=$(echo "$name" | tr '_' ' ')
  echo "$found"
}

publish() {
  local name="$1" native="$2" title
  title=$(title_for "$name")
  local xml="<featureType><name>${name}</name><nativeName>${native}</nativeName><title>${title}</title><srs>EPSG:4326</srs><enabled>true</enabled></featureType>"
  # PUT updates an already-published layer's metadata (e.g. a re-run picking
  # up a new title); POST creates one that doesn't exist yet.
  put_code=$(curl -s -o /tmp/publish-$name.log -w '%{http_code}' -u "$AUTH" -XPUT \
    -H 'Content-type: text/xml' -d "$xml" \
    "$GS/workspaces/$WS/datastores/$DS/featuretypes/$name")
  if [ "$put_code" = "200" ]; then
    echo "OK   $name -> $title (updated)"
  else
    code=$(curl -s -o /tmp/publish-$name.log -w '%{http_code}' -u "$AUTH" -XPOST \
      -H 'Content-type: text/xml' -d "$xml" \
      "$GS/workspaces/$WS/datastores/$DS/featuretypes")
    if [ "$code" = "201" ]; then
      echo "OK   $name -> $title (created)"
    else
      echo "FAIL(PUT $put_code, POST $code) $name -> $(cat /tmp/publish-$name.log)"
    fi
  fi
}

while read -r svc; do
  local_name="${svc#MSPudhu:}"
  native_name=$(echo "$local_name" | tr '[:upper:]' '[:lower:]')
  publish "$local_name" "$native_name"
done < referenced_local_names.txt
