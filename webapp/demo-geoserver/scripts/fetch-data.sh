#!/bin/bash
# Downloads GeoJSON for every layer the frontend can select (see
# ../referenced_local_names.txt) from the live production GeoServer at
# marinespatialplanning.in, into demo-geoserver/data/.
#
# **Maintenance only, not run by setup.sh.** The downloaded output is
# committed (like styles/*.sld and layer-titles.tsv), so normal setup
# doesn't depend on the live server being reachable. Only re-run this if
# the live server's data changes or a new layer is added to
# referenced_local_names.txt.
set -e
cd "$(dirname "$0")/.."

mkdir -p data
cd data

BASE='https://marinespatialplanning.in/geoserver/MSPudhu/ows'
ok=0
fail=0
while read -r local_name; do
  fname="${local_name}.json"
  url="${BASE}?service=WFS&version=2.0.0&request=GetFeature&typeName=MSPudhu:${local_name}&outputFormat=application/json&srsName=EPSG:4326"
  code=$(curl -s -o "$fname" -w '%{http_code}' "$url")
  size=$(stat -f%z "$fname" 2>/dev/null || stat -c%s "$fname" 2>/dev/null || echo 0)
  if [ "$code" = "200" ] && [ "$size" -gt 50 ]; then
    ok=$((ok+1))
  else
    fail=$((fail+1))
    echo "FAIL($code,$size): $local_name"
  fi
done < ../referenced_local_names.txt
echo "Fetched OK=$ok FAIL=$fail"
