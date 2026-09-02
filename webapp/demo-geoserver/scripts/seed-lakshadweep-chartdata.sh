#!/bin/bash
# Builds and loads the demo MSPLak:ChartData table (District_Boundary's
# Weather Parameters bundle) directly into the compose Postgres, then
# publishes it as a GeoServer feature type. Run after setup-lakshadweep.sh.
# Unlike seed-chartdata.sh, lakshadweep-chartdata.py fetches real historical
# weather data from Open-Meteo's public archive API at run time, so this
# step (only this one) needs internet access.
set -e
cd "$(dirname "$0")/.."

python3 scripts/lakshadweep-chartdata.py > /tmp/msplak-chartdata.sql
PGPASSWORD=mspudhu psql -h localhost -p 55432 -U mspudhu -d mspudhu -f /tmp/msplak-chartdata.sql

code=$(curl -s -o /tmp/publish-lak-ChartData.log -w '%{http_code}' -u admin:geoserver -XPOST \
  -H 'Content-type: text/xml' \
  -d '<featureType><name>ChartData</name><nativeName>Lakshadweep_ChartData</nativeName><srs>EPSG:4326</srs><enabled>true</enabled></featureType>' \
  "http://localhost:8080/geoserver/rest/workspaces/MSPLak/datastores/msplak_postgis/featuretypes")
echo "publish ChartData -> HTTP $code"
