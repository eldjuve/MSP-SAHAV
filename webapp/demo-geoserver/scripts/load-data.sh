#!/bin/bash
# Loads every downloaded GeoJSON layer in demo-geoserver/data/ into the
# demo PostGIS database, using a throwaway GDAL container on the compose
# network so no local ogr2ogr install is required.
set -e
cd "$(dirname "$0")/.."

NETWORK="demo-geoserver_default"
DATA_DIR="$(pwd)/data"

ok=0
fail=0
for f in "$DATA_DIR"/*.json; do
  base=$(basename "$f" .json)
  echo "Loading $base..."
  if docker run --rm --network "$NETWORK" -v "$DATA_DIR:/data" \
    ghcr.io/osgeo/gdal:alpine-small-latest \
    ogr2ogr -f PostgreSQL "PG:host=db user=mspudhu password=mspudhu dbname=mspudhu" \
    "/data/$base.json" \
    -nln "$base" -lco GEOMETRY_NAME=geom -lco FID=gid \
    -nlt PROMOTE_TO_MULTI -t_srs EPSG:4326 -overwrite -skipfailures \
    > /tmp/ogr2ogr-$base.log 2>&1; then
    ok=$((ok+1))
  else
    fail=$((fail+1))
    echo "  FAILED: $base (see /tmp/ogr2ogr-$base.log)"
  fi
done
echo "Loaded OK=$ok FAIL=$fail"
