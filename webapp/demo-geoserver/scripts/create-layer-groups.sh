#!/bin/bash
# Creates every layer group the frontend's nav.json expects (see
# ../../../docs/Technical/data_formats.md). Each group gets a
# Title/Abstract, since that's what the sidebar shows when it's selected
# (there's no local text to fall back to).
#
# Order matters: "nested" groups (Environment, Ecology, Human_Activities,
# Socio_Economic, DataRepository) reference *other* layer groups as
# members, so the groups they reference must already exist.
set -e
cd "$(dirname "$0")/.."

GS="http://localhost:8080/geoserver/rest"
AUTH="admin:geoserver"
WS="MSPudhu"

# create_group <name> <title> <abstract> <type:localName> [<type:localName> ...]
# <type> is "layer" for a raw published layer or "layerGroup" for another
# group created earlier in this script.
xml_escape() {
  local s="$1"
  s="${s//&/&amp;}"
  s="${s//</&lt;}"
  s="${s//>/&gt;}"
  printf '%s' "$s"
}

create_group() {
  local name="$1" title abstract
  title=$(xml_escape "$2")
  abstract=$(xml_escape "$3")
  shift 3
  local publishables=""
  for m in "$@"; do
    local type="${m%%:*}" local_name="${m#*:}"
    publishables+="<published type=\"${type}\"><name>${WS}:${local_name}</name></published>"
  done
  local xml="<layerGroup><name>${name}</name><title>${title}</title><abstractTxt>${abstract}</abstractTxt><mode>NAMED</mode><workspace><name>${WS}</name></workspace><publishables>${publishables}</publishables></layerGroup>"
  local code
  code=$(curl -s -o /tmp/layergroup-$name.log -w '%{http_code}' -u "$AUTH" -XPOST \
    -H 'Content-type: text/xml' -d "$xml" "$GS/workspaces/$WS/layergroups")
  if [ "$code" = "201" ]; then
    echo "OK   $name"
  else
    echo "FAIL($code) $name -> $(cat /tmp/layergroup-$name.log)"
  fi
}

echo "== leaf bundle groups (raw layer members) =="

create_group "Boundaries" "Boundaries" \
  "District, village, and khandam boundary layers for Puducherry." \
  "layer:District_Boundary" "layer:VillageBoundary" "layer:VillageNames"

create_group "Lulc" "Land Use Land Cover" \
  "Land use / land cover classification for the Puducherry region." \
  "layer:LULC_Pondy"

create_group "Water_Resources" "Water Resources" \
  "Rivers, tanks, and other water bodies across Puducherry." \
  "layer:District_Boundary" "layer:River" "layer:Tanks"

create_group "Geomorphology" "Geomorphology" \
  "Geomorphological landform classification for the Puducherry coast." \
  "layer:District_Boundary" "layer:Geomorphology_Clipped"

create_group "Mangroves" "Mangroves" \
  "Mangrove cover, 2022." \
  "layer:District_Boundary" "layer:Mangroves_2022"

create_group "Coral_Reefs" "Coral Reefs" \
  "Coral reef locations along the Puducherry coast." \
  "layer:District_Boundary" "layer:Corals"

create_group "Biodiversity" "Biodiversity Hotspots" \
  "Biodiversity hotspots, including Osudu Lake." \
  "layer:District_Boundary" "layer:Osudu_Lake" "layer:Biodiversity_Hotspots"

create_group "Sandy_Area" "Sandy Area" \
  "Sand dunes, spits, and beaches along the Puducherry coast." \
  "layer:District_Boundary" "layer:Sand_Dune" "layer:SandSpit" "layer:Sandy_Beach"

create_group "Fishingzones" "Fish Potential Sites" \
  "Potential fishing zones off the Puducherry coast." \
  "layer:District_Boundary" "layer:Potential_Fishing_Zone"

create_group "Turtle" "Biological Production Hotspots" \
  "Turtle nesting grounds along the Puducherry coast." \
  "layer:District_Boundary" "layer:Turtle_Nesting_Ground"

create_group "Coastal_Structures" "Coastal Protection Structures" \
  "Coastal protection structures around Puducherry." \
  "layer:District_Boundary" "layer:Coastal_Protection_Structures"

create_group "Infrastructures" "Infrastructures" \
  "Key public infrastructure across Puducherry." \
  "layer:District_Boundary" "layer:Puducherry_Aqueduct_Locations" "layer:Anganwadi_Balawadi_Centres" \
  "layer:Banks" "layer:Bus_Stations" "layer:Police_Stations" "layer:Railway_Station"

create_group "Archeological_Sites" "Archeological Sites" \
  "Archeological sites across Puducherry." \
  "layer:District_Boundary" "layer:Archeological_Site"

create_group "Coastal_Aquaculture" "Coastal Aquaculture" \
  "Aquaculture sites along the Puducherry coast." \
  "layer:District_Boundary" "layer:Aquaculture"

create_group "Surface_Boats" "Surface Boat Sports" \
  "Surface water sports activity locations." \
  "layer:District_Boundary" "layer:Sports_Activities"

create_group "Scuba" "Scuba Diving" \
  "Scuba diving locations along the Puducherry coast." \
  "layer:District_Boundary" "layer:Scuba_Diving_Locations"

create_group "Risk" "Coastal Inundation Risk" \
  "Coastal inundation risk atlas for Puducherry." \
  "layer:District_Boundary" "layer:CIRA_PY_final"

create_group "Vulnerability" "Vulnerability" \
  "Multi-hazard and tsunami water-level vulnerability layers." \
  "layer:District_Boundary" "layer:Multi_Hazard_Line" "layer:Tsunami_Water_Level"

create_group "Ecology_vs_Human_Activities" "Ecology vs Human Activities" \
  "Conflicts between ecological features and human activities." \
  "layer:District_Boundary" "layer:Mangrove_BoatingConflict" "layer:Mangrove" \
  "layer:Crab_locations" "layer:Tourism_Activity"

create_group "Tourism_vs_Shoreline_Group" "Tourism vs Shoreline" \
  "Conflicts between tourism activity and the shoreline." \
  "layer:District_Boundary" "layer:Tourism_vs_Shoreline" "layer:Tourist_Beach_Puducherry" \
  "layer:Beach_Resorts" "layer:Coastal_Amenities"

create_group "Fisheries_vs_Tourism" "Fisheries vs Tourism" \
  "Conflicts between fisheries and tourism activity." \
  "layer:District_Boundary" "layer:Tourism_vs_Fisheries" "layer:Coastal_Amenities"

echo "== nested groups (layer-group members) =="

create_group "Environment" "Environment" \
  "Environmental features of the Puducherry region." \
  "layerGroup:Geomorphology"

create_group "Ecology" "Ecology" \
  "Ecological features of the Puducherry region." \
  "layerGroup:Mangroves" "layerGroup:Coral_Reefs" "layerGroup:Biodiversity" \
  "layerGroup:Sandy_Area" "layerGroup:Fishingzones" "layerGroup:Turtle"

create_group "Human_Activities" "Human Activities" \
  "Human activity and infrastructure layers for the Puducherry region." \
  "layerGroup:Coastal_Structures" "layerGroup:Infrastructures" "layerGroup:Archeological_Sites"

create_group "Socio_Economic" "Socio Economic" \
  "Socio-economic activity layers for the Puducherry region." \
  "layerGroup:Coastal_Aquaculture" "layerGroup:Surface_Boats" "layerGroup:Scuba"

echo "== top nav anchors =="
# nav.json's other three top-level nav entries need a real group to discover
# from too (see public/config/nav.json), the same way DataRepository anchors
# "Data Repository" below — a single-member group is unusual but valid.

create_group "StatusIndicators" "Status Indicators" \
  "Status indicator layers for the Puducherry region." \
  "layer:Marine_Outfall" "layer:WaterQuality_Buoy"

create_group "Conflicts" "Conflicts & Compatibilities" \
  "Conflicts between marine spatial planning activities in the Puducherry region." \
  "layerGroup:Ecology_vs_Human_Activities" "layerGroup:Tourism_vs_Shoreline_Group" "layerGroup:Fisheries_vs_Tourism"

create_group "Services" "Services" \
  "Service layers for the Puducherry region." \
  "layerGroup:Vulnerability"

echo "== data repository root =="

create_group "DataRepository" "Data Repository" \
  "The full Puducherry Marine Spatial Planning data repository." \
  "layerGroup:Boundaries" "layerGroup:Lulc" "layerGroup:Water_Resources" "layerGroup:Environment" \
  "layerGroup:Ecology" "layerGroup:Human_Activities" "layerGroup:Socio_Economic" "layerGroup:Risk"
