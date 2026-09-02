#!/bin/bash
# Provisions a second demo workspace, MSPLak, from a single real Lakshadweep
# district boundary polygon (data/Lakshadweep_District_Boundary.json — see
# the comment above that file for provenance) to prove out nav.json spanning
# multiple GeoServer workspaces (every layer/WMS/WFS lookup already resolves
# its workspace per-layer from the qualified "workspace:name" — see
# mapStore.ts's wmsUrlForWorkspace/wfsUrlForWorkspace). Reuses the same
# "mspudhu" Postgres database as the MSPudhu workspace (a second
# workspace/datastore pointing at the same db is standard GeoServer
# practice — tables are just named distinctly) and load-data.sh, which
# already loads every data/*.json generically regardless of workspace.
# Run after load-data.sh (see setup.sh).
set -e
cd "$(dirname "$0")/.."

GS="http://localhost:8080/geoserver/rest"
AUTH="admin:geoserver"
WS="MSPLak"
DS="msplak_postgis"

echo "== workspace + datastore =="
curl -sf -u "$AUTH" -XPOST -H 'Content-type: text/xml' \
  -d "<workspace><name>${WS}</name></workspace>" \
  "$GS/workspaces" && echo "created workspace $WS" || echo "workspace $WS already exists"

curl -sf -u "$AUTH" -XPOST -H 'Content-type: text/xml' \
  -d "<dataStore>
  <name>${DS}</name>
  <connectionParameters>
    <host>db</host>
    <port>5432</port>
    <database>mspudhu</database>
    <user>mspudhu</user>
    <passwd>mspudhu</passwd>
    <dbtype>postgis</dbtype>
  </connectionParameters>
</dataStore>" \
  "$GS/workspaces/$WS/datastores" && echo "created datastore $DS" || echo "datastore $DS already exists"

echo "== publishing layer =="
xml='<featureType><name>District_Boundary</name><nativeName>lakshadweep_district_boundary</nativeName><title>District Boundary</title><srs>EPSG:4326</srs><enabled>true</enabled></featureType>'
put_code=$(curl -s -o /tmp/publish-lak-District_Boundary.log -w '%{http_code}' -u "$AUTH" -XPUT \
  -H 'Content-type: text/xml' -d "$xml" \
  "$GS/workspaces/$WS/datastores/$DS/featuretypes/District_Boundary")
if [ "$put_code" = "200" ]; then
  echo "OK   District_Boundary (updated)"
else
  code=$(curl -s -o /tmp/publish-lak-District_Boundary.log -w '%{http_code}' -u "$AUTH" -XPOST \
    -H 'Content-type: text/xml' -d "$xml" \
    "$GS/workspaces/$WS/datastores/$DS/featuretypes")
  if [ "$code" = "201" ]; then
    echo "OK   District_Boundary (created)"
  else
    echo "FAIL(PUT $put_code, POST $code) District_Boundary -> $(cat /tmp/publish-lak-District_Boundary.log)"
  fi
fi

echo "== style (reuse MSPudhu's district.sld, re-pointed at this workspace) =="
sed 's/MSPudhu:District_Boundary/MSPLak:District_Boundary/' styles/district.sld > /tmp/style-lakshadweep-district.sld
put_code=$(curl -s -o /tmp/style-upload-lak-district.log -w '%{http_code}' -u "$AUTH" -XPUT \
  -H 'Content-type: application/vnd.ogc.sld+xml' \
  --data-binary "@/tmp/style-lakshadweep-district.sld" \
  "$GS/workspaces/$WS/styles/district")
if [ "$put_code" = "200" ]; then
  echo "OK   district style (updated)"
else
  code=$(curl -s -o /tmp/style-upload-lak-district.log -w '%{http_code}' -u "$AUTH" -XPOST \
    -H 'Content-type: application/vnd.ogc.sld+xml' \
    --data-binary "@/tmp/style-lakshadweep-district.sld" \
    "$GS/workspaces/$WS/styles?name=district")
  if [ "$code" = "201" ]; then
    echo "OK   district style (created)"
  else
    echo "FAIL(PUT $put_code, POST $code) district style -> $(cat /tmp/style-upload-lak-district.log)"
  fi
fi

code=$(curl -s -o /tmp/style-assign-lak-district.log -w '%{http_code}' -u "$AUTH" -XPUT \
  -H 'Content-type: text/xml' \
  -d "<layer><defaultStyle><name>${WS}:district</name></defaultStyle></layer>" \
  "$GS/layers/$WS:District_Boundary")
if [ "$code" = "200" ]; then
  echo "OK   District_Boundary -> district style"
else
  echo "FAIL($code) style assign -> $(cat /tmp/style-assign-lak-district.log)"
fi

echo "== layer group (nav.json anchor) =="
xml="<layerGroup><name>Boundaries</name><title>Boundaries</title><abstractTxt>District boundary for Lakshadweep.</abstractTxt><mode>NAMED</mode><workspace><name>${WS}</name></workspace><publishables><published type=\"layer\"><name>${WS}:District_Boundary</name></published></publishables></layerGroup>"
code=$(curl -s -o /tmp/layergroup-lak-boundaries.log -w '%{http_code}' -u "$AUTH" -XPOST \
  -H 'Content-type: text/xml' -d "$xml" "$GS/workspaces/$WS/layergroups")
if [ "$code" = "201" ]; then
  echo "OK   Boundaries"
else
  echo "FAIL($code) Boundaries -> $(cat /tmp/layergroup-lak-boundaries.log)"
fi
