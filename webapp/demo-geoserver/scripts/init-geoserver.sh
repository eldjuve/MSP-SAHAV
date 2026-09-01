#!/bin/bash
# Creates the MSPudhu workspace and its PostGIS datastore. Run once after
# `docker compose up -d`, before load-data.sh / publish-layers.sh.
set -e
cd "$(dirname "$0")/.."

GS="http://localhost:8080/geoserver/rest"
AUTH="admin:geoserver"

# kartoza/geoserver's default data_dir (re-copied fresh on every container
# start, since docker-compose.yml sets EXISTING_DATA_DIR=false) ships with a
# controlflow.properties tuned for a shared production server — only 10
# concurrent WMS GetMap requests globally/per-IP. A single browser tab
# panning a Leaflet map fires far more than 10 concurrent tile requests, so
# requests past the limit get rejected mid-load: some map tiles silently
# never render (a vector layer with many features is more likely to still
# be in flight when the limit bites, since it takes longer to rasterize).
# Raise the limits to something reasonable for a single local developer.
echo "relaxing WMS control-flow limits for local dev"
docker exec mspudhu-demo-geoserver sh -c 'cat > /opt/geoserver/data_dir/controlflow.properties <<EOF
timeout=60
ows.global=200
ows.wms.getmap=100
ows.wfs.getfeature.application/msexcel=4
user=100
ows.gwc=64
user.ows.wps.execute=1000/d;30s
user.ows.wms.getmap=200/s
ip=100
EOF'

curl -sf -u "$AUTH" -XPOST -H 'Content-type: text/xml' \
  -d '<workspace><name>MSPudhu</name></workspace>' \
  "$GS/workspaces" && echo "created workspace MSPudhu" || echo "workspace MSPudhu already exists"

curl -sf -u "$AUTH" -XPOST -H 'Content-type: text/xml' \
  -d '<dataStore>
  <name>mspudhu_postgis</name>
  <connectionParameters>
    <host>db</host>
    <port>5432</port>
    <database>mspudhu</database>
    <user>mspudhu</user>
    <passwd>mspudhu</passwd>
    <dbtype>postgis</dbtype>
  </connectionParameters>
</dataStore>' \
  "$GS/workspaces/MSPudhu/datastores" && echo "created datastore mspudhu_postgis" || echo "datastore mspudhu_postgis already exists"
