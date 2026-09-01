#!/bin/bash
# Uploads every SLD in ../styles/ (fetched from the live production
# GeoServer by fetch-styles.py — real cartography: green mangroves,
# transparent-fill district boundaries, etc.) as a style in the MSPudhu
# workspace, then sets each published layer's default style per
# ../layer-style-map.tsv. Run after publish-layers.sh.
set -e
cd "$(dirname "$0")/.."

GS="http://localhost:8080/geoserver/rest"
AUTH="admin:geoserver"
WS="MSPudhu"

echo "== uploading point-symbol icons =="
for icon in styles/icons/*; do
  [ -e "$icon" ] || continue
  name=$(basename "$icon")
  code=$(curl -s -o /dev/null -w '%{http_code}' -u "$AUTH" -XPUT \
    -H 'Content-type: image/svg+xml' --data-binary "@$icon" \
    "$GS/resource/workspaces/$WS/styles/$name")
  if [ "$code" = "200" ] || [ "$code" = "201" ]; then
    echo "OK   $name"
  else
    echo "FAIL($code) $name"
  fi
done

echo "== uploading styles =="
# These SLDs are fetched verbatim from the live production GeoServer
# (fetch-styles.py) and reference this demo's columns under their original
# production names, which don't match how this pipeline actually creates
# them: ogr2ogr launders every column name to lowercase on import (e.g.
# "Class" -> "class", "GEOMORPHOL" -> "geomorphol"), and load-data.sh always
# names the geometry column "geom" regardless of its original shapefile-era
# name ("the_geom"). An unmodified upload makes GetMap fail with "attribute
# not found" for any style that filters/labels/transforms by attribute or
# explicitly references the geometry column. Fix both up at upload time
# rather than editing the committed SLDs, so re-running fetch-styles.py
# doesn't need to re-apply this fixup.
for sld in styles/*.sld; do
  style_name=$(basename "$sld" .sld)
  normalized="/tmp/style-normalized-$style_name.sld"
  perl -pe 's/(<ogc:PropertyName>)([^<]*)(<\/ogc:PropertyName>)/$1 . lc($2) . $3/ge; s/the_geom/geom/g' "$sld" > "$normalized"
  encoded_name=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$style_name")
  # PUT updates an existing style's raw content; POST creates a new one.
  put_code=$(curl -s -o /tmp/style-upload-"$style_name".log -w '%{http_code}' -u "$AUTH" -XPUT \
    -H 'Content-type: application/vnd.ogc.sld+xml' \
    --data-binary "@$normalized" \
    "$GS/workspaces/$WS/styles/$encoded_name")
  if [ "$put_code" = "200" ]; then
    echo "OK   $style_name (updated)"
  else
    code=$(curl -s -o /tmp/style-upload-"$style_name".log -w '%{http_code}' -u "$AUTH" -XPOST \
      -H 'Content-type: application/vnd.ogc.sld+xml' \
      --data-binary "@$normalized" \
      "$GS/workspaces/$WS/styles?name=$encoded_name")
    if [ "$code" = "201" ]; then
      echo "OK   $style_name (created)"
    else
      echo "FAIL(PUT $put_code, POST $code) $style_name -> $(cat /tmp/style-upload-"$style_name".log)"
    fi
  fi
done

echo "== assigning default styles to layers =="
while IFS=$'\t' read -r layer style; do
  [ -z "$layer" ] && continue
  code=$(curl -s -o /tmp/style-assign-"$layer".log -w '%{http_code}' -u "$AUTH" -XPUT \
    -H 'Content-type: text/xml' \
    -d "<layer><defaultStyle><name>${WS}:${style}</name></defaultStyle></layer>" \
    "$GS/layers/$WS:$layer")
  if [ "$code" = "200" ]; then
    echo "OK   $layer -> $style"
  else
    echo "FAIL($code) $layer -> $style ($(cat /tmp/style-assign-"$layer".log))"
  fi
done < layer-style-map.tsv
