#!/usr/bin/env python3
"""Fetches each published layer's cartographic Title from the live
production GeoServer (marinespatialplanning.in) and writes
../layer-titles.tsv (local_name -> title), for every layer whose live title
is actually more descriptive than its raw name. Run this once (or whenever
the layer list changes) — the output is committed, so publish-layers.sh
doesn't depend on the live server being reachable.

publish-layers.sh's own fallback (replacing "_" with " ") already produces a
readable label for most layers even without an entry here — this only
covers the ones where the live server has something better than that
mechanical reformatting (e.g. "Corals" -> "Unique Mesophotic Corals").
Layers where nobody has ever set a real title anywhere (live server
included) — e.g. LULC_Pondy, Geomorphology_Clipped — aren't covered by
this script at all; give those a name via ../layer-title-overrides.tsv
instead (see that file's own header comment).
"""
import os
import subprocess
import sys
import xml.etree.ElementTree as ET

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SCRIPT_DIR)
NAMES_FILE = os.path.join(ROOT, "referenced_local_names.txt")
OUT_FILE = os.path.join(ROOT, "layer-titles.tsv")

LIVE_WMS = "https://marinespatialplanning.in/geoserver/MSPudhu/wms"


def main():
    with open(NAMES_FILE) as f:
        local_names = {line.strip() for line in f if line.strip()}

    print("Fetching GetCapabilities from live server...", file=sys.stderr)
    xml_bytes = subprocess.run(
        ["curl", "-sf", "--max-time", "30",
         f"{LIVE_WMS}?service=WMS&version=1.1.1&request=GetCapabilities"],
        check=True, capture_output=True,
    ).stdout
    root = ET.fromstring(xml_bytes)

    def walk(el):
        name_el, title_el = el.find("Name"), el.find("Title")
        if name_el is not None and title_el is not None:
            yield name_el.text, title_el.text
        for child in el:
            if child.tag == "Layer":
                yield from walk(child)

    top = root.find("Capability").find("Layer")
    live_titles = dict(walk(top))

    mapping = sorted(
        (name, live_titles[name])
        for name in local_names
        if name in live_titles and live_titles[name] != name
    )

    with open(OUT_FILE, "w") as f:
        for name, title in mapping:
            f.write(f"{name}\t{title}\n")

    skipped = len(local_names) - len(mapping)
    print(f"Wrote {len(mapping)} titles to {OUT_FILE} "
          f"({skipped} layers have no better title on the live server)")


if __name__ == "__main__":
    main()
