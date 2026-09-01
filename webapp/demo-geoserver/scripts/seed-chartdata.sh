#!/bin/bash
# Builds and loads the demo MSPudhu:ChartData table (District_Boundary and
# Marine_Outfall rows) directly into the compose Postgres, then publishes
# it as a GeoServer feature type. Run after init-geoserver.sh.
set -e
cd "$(dirname "$0")/.."

python3 scripts/chartdata.py > /tmp/mspudhu-chartdata.sql
PGPASSWORD=mspudhu psql -h localhost -p 55432 -U mspudhu -d mspudhu -f /tmp/mspudhu-chartdata.sql

code=$(curl -s -o /tmp/publish-ChartData.log -w '%{http_code}' -u admin:geoserver -XPOST \
  -H 'Content-type: text/xml' \
  -d '<featureType><name>ChartData</name><nativeName>ChartData</nativeName><srs>EPSG:4326</srs><enabled>true</enabled></featureType>' \
  "http://localhost:8080/geoserver/rest/workspaces/MSPudhu/datastores/mspudhu_postgis/featuretypes")
echo "publish ChartData -> HTTP $code"
