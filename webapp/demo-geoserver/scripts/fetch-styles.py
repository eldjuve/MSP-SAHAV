#!/usr/bin/env python3
"""Fetches the real cartographic SLD styles from the live production
GeoServer (marinespatialplanning.in) for every layer this demo publishes,
splits the combined GetStyles response into one standalone SLD document per
style under ../styles/, and writes ../styles/layer-style-map.tsv mapping
each layer's local name to its style name. Run this once (or whenever the
layer list changes) — the output is committed, so apply-styles.sh doesn't
depend on the live server being reachable.
"""
import os
import subprocess
import sys
import xml.etree.ElementTree as ET

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SCRIPT_DIR)
STYLES_DIR = os.path.join(ROOT, "styles")
NAMES_FILE = os.path.join(ROOT, "referenced_local_names.txt")

SLD_NS = "http://www.opengis.net/sld"
ET.register_namespace("sld", SLD_NS)
ET.register_namespace("", SLD_NS)
ET.register_namespace("gml", "http://www.opengis.net/gml")
ET.register_namespace("ogc", "http://www.opengis.net/ogc")


def sld_tag(tag):
    return f"{{{SLD_NS}}}{tag}"


LIVE_WMS = "https://marinespatialplanning.in/geoserver/MSPudhu/wms"


def live_capabilities_names():
    """GeoServer's GetStyles throws (and returns nothing for the whole
    batch) if even one requested layer doesn't exist, so filter the
    request down to layers the live server actually has first."""
    xml_bytes = subprocess.run(
        ["curl", "-sf", "--max-time", "30",
         f"{LIVE_WMS}?service=WMS&version=1.1.1&request=GetCapabilities"],
        check=True, capture_output=True,
    ).stdout
    root = ET.fromstring(xml_bytes)
    return {el.text for el in root.iter() if el.tag.endswith("Name") and el.text}


def main():
    with open(NAMES_FILE) as f:
        local_names = [line.strip() for line in f if line.strip()]

    live_names = live_capabilities_names()
    missing = [n for n in local_names if n not in live_names]
    if missing:
        print(f"Not on the live server (skipping): {', '.join(missing)}", file=sys.stderr)
    local_names = [n for n in local_names if n in live_names]

    layers = ",".join(f"MSPudhu:{n}" for n in local_names)
    url = (
        f"{LIVE_WMS}?service=WMS&version=1.1.1&request=GetStyles&layers=" + layers
    )
    print(f"Fetching styles for {len(local_names)} layers from live server...", file=sys.stderr)
    xml_bytes = subprocess.run(
        ["curl", "-sf", "--max-time", "30", url], check=True, capture_output=True
    ).stdout

    root = ET.fromstring(xml_bytes)
    os.makedirs(STYLES_DIR, exist_ok=True)

    mapping = []
    found_local_names = set()
    for named_layer in root.findall(sld_tag("NamedLayer")):
        layer_name = named_layer.find(sld_tag("Name")).text
        local_name = layer_name.split(":", 1)[-1]
        user_style = named_layer.find(sld_tag("UserStyle"))
        if user_style is None:
            continue
        style_name = user_style.find(sld_tag("Name")).text

        doc = ET.Element(sld_tag("StyledLayerDescriptor"), {"version": "1.0.0"})
        doc.append(named_layer)
        out_path = os.path.join(STYLES_DIR, f"{style_name}.sld")
        ET.ElementTree(doc).write(out_path, xml_declaration=True, encoding="UTF-8")

        mapping.append((local_name, style_name))
        found_local_names.add(local_name)
        print(f"  {local_name} -> {style_name}.sld")

    missing = [n for n in local_names if n not in found_local_names]
    if missing:
        print(f"No style found on the live server for: {', '.join(missing)}", file=sys.stderr)

    with open(os.path.join(ROOT, "layer-style-map.tsv"), "w") as f:
        for local_name, style_name in mapping:
            f.write(f"{local_name}\t{style_name}\n")

    print(f"Wrote {len(mapping)} styles to {STYLES_DIR}/ and layer-style-map.tsv")


if __name__ == "__main__":
    main()
