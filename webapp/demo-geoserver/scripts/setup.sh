#!/bin/bash
# Full end-to-end demo GeoServer setup: brings up docker compose, creates
# the workspace/datastore, loads the committed demo data (data/*.json,
# already fetched from the live marinespatialplanning.in GeoServer and
# committed) into PostGIS, publishes every layer, creates the layer groups
# the frontend's nav config expects, applies the real cartographic styles
# (styles/*.sld, already fetched from the live server and committed), and
# seeds the demo ChartData table. See ../README.md.
set -e
cd "$(dirname "$0")/.."

echo "==> starting docker compose (postgis + geoserver)"
docker compose up -d

echo "==> waiting for GeoServer REST API"
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' -u admin:geoserver http://localhost:8080/geoserver/rest/about/version.xml || true)
  [ "$code" = "200" ] && break
  sleep 5
done
[ "$code" = "200" ] || { echo "GeoServer did not become ready"; exit 1; }

echo "==> creating workspace + datastore"
bash scripts/init-geoserver.sh

echo "==> loading layers into PostGIS"
bash scripts/load-data.sh

echo "==> publishing layers to GeoServer"
bash scripts/publish-layers.sh

echo "==> creating layer groups for nav.json"
bash scripts/create-layer-groups.sh

echo "==> applying real cartographic styles"
bash scripts/apply-styles.sh

echo "==> seeding demo ChartData"
bash scripts/seed-chartdata.sh

echo "==> provisioning second demo workspace (MSPLak / Lakshadweep)"
bash scripts/setup-lakshadweep.sh

echo "==> seeding Lakshadweep ChartData (real weather data, needs internet)"
bash scripts/seed-lakshadweep-chartdata.sh

echo "==> done. GeoServer: http://localhost:8080/geoserver ; WMS base: http://localhost:8080/geoserver/MSPudhu/wms"
