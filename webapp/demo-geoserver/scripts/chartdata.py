#!/usr/bin/env python3
"""Builds demo MSPudhu:ChartData rows and emits a SQL file that creates the
table and inserts them. Shapes follow ChartBundle/ChartSpec in
src/lib/geoserver.ts and GEOSERVER_CHANGES.md. Values are illustrative demo
data, not real measurements."""
import json
import random

random.seed(42)

years = [2018, 2019, 2020, 2021, 2022, 2023]


def boxstats(base, spread):
    q1 = round(base - spread * 0.5, 2)
    med = round(base, 2)
    q3 = round(base + spread * 0.5, 2)
    return {
        "min": round(q1 - spread * 0.4, 2),
        "q1": q1,
        "median": med,
        "q3": q3,
        "max": round(q3 + spread * 0.4, 2),
    }


def weather_boxplot(title, x_label, y_label, base, spread):
    return {
        "chartType": "boxplot",
        "title": title,
        "xLabel": x_label,
        "yLabel": y_label,
        "categories": [str(y) for y in years],
        "data": [boxstats(base + i * 0.3, spread) for i in range(len(years))],
    }


def wq_scatter(title, y_label, base, spread):
    points = []
    for y in years:
        for _ in range(4):
            points.append({"year": y, "value": round(max(0, base + random.uniform(-spread, spread)), 3)})
    return {
        "chartType": "scatter",
        "title": title,
        "xLabel": "Year",
        "yLabel": y_label,
        "series": [{"name": title, "data": points}],
    }


water_quality_buoy = [
    {
        "title": "Water Quality",
        "chapterHeader": "Water Quality",
        "subpara": "Live buoy (Buoy ID: 16600) water-quality parameters, Puducherry coast",
        "about": "Demo values illustrating the DO/DIN/DIP/Chlorophyll trend charts sourced from the live buoy feed.<br/><br/>Source: NCCR (demo data)",
        "charts": [
            wq_scatter("Dissolved Oxygen (DO)", "mg/L", 5.5, 1.2),
            wq_scatter("Dissolved Inorganic Nitrogen (DIN)", "µmol/L", 3.2, 0.8),
            wq_scatter("Dissolved Inorganic Phosphorus (DIP)", "µmol/L", 0.6, 0.2),
            wq_scatter("Chlorophyll", "mg/m³", 2.1, 0.9),
        ],
    },
]

district_boundary = [
    {
        "title": "Weather Parameters",
        "chapterHeader": "Weather",
        "subpara": "Weather parameters for the Puducherry region",
        "about": "Demo weather-parameter distributions by year.<br/><br/>Source: NCCR (demo data)",
        "charts": [
            weather_boxplot("Precipitation", "Year", "mm", 120, 60),
            weather_boxplot("Humidity", "Year", "%", 78, 10),
            weather_boxplot("Air Temperature (Min)", "Year", "°C", 24, 2),
            weather_boxplot("Air Temperature (Max)", "Year", "°C", 33, 2.5),
            weather_boxplot("Cloud Cover", "Year", "okta", 4, 2),
            weather_boxplot("Pressure", "Year", "hPa", 1008, 4),
            weather_boxplot("Wind Speed", "Year", "m/s", 5.5, 2),
        ],
    },
]

metals = ["Cadmium", "Copper", "Mercury", "Zinc", "Lead", "Arsenic", "Chromium", "Monocrotophos"]


def metal_bar(location, base_vals):
    return {
        "chartType": "bar",
        "title": f"Marine Outfall Metal Concentration – {location}",
        "xLabel": "Parameter",
        "yLabel": "Concentration (µg/L)",
        "categories": metals,
        "series": [{"name": location, "data": base_vals}],
    }


marine_outfall = [
    {
        "title": "Marine Outfall Water Quality Criteria",
        "chapterHeader": "Marine Pollution",
        "subpara": "Metal & pesticide concentration at the two marine outfall locations",
        "about": (
            "Demo values illustrating the marine outfall criteria charts for Kalapet and "
            "Thengaithittu (cadmium, copper, mercury, zinc, lead, arsenic, chromium, "
            "monocrotophos).<br/><br/>Source: NCCR (demo data)"
        ),
        "charts": [
            metal_bar("Kalapet", [0.8, 12.4, 0.15, 45.2, 6.1, 1.9, 8.3, 0.05]),
            metal_bar("Thengaithittu", [1.1, 15.8, 0.22, 52.7, 9.4, 2.6, 11.1, 0.09]),
        ],
    }
]

rows = {
    "District_Boundary": {"chart_data": district_boundary, "lon": 79.83, "lat": 11.94},
    "Marine_Outfall": {"chart_data": marine_outfall, "lon": 79.86, "lat": 11.95},
    # Real buoy coordinates recovered from the old app's addBuoys() (Leaflet
    # marker at [11.919712, 79.846512] — see GEOSERVER_CHANGES.md).
    "WaterQuality_Buoy": {"chart_data": water_quality_buoy, "lon": 79.846512, "lat": 11.919712},
}


def sql_escape(s):
    return s.replace("'", "''")


lines = [
    "DROP TABLE IF EXISTS \"ChartData\";",
    (
        'CREATE TABLE "ChartData" ('
        '  id text PRIMARY KEY,'
        '  chart_data jsonb NOT NULL,'
        '  geom geometry(Point, 4326)'
        ');'
    ),
]
for key, row in rows.items():
    payload = sql_escape(json.dumps(row["chart_data"]))
    lines.append(
        f'INSERT INTO "ChartData" (id, chart_data, geom) VALUES '
        f"('{key}', '{payload}'::jsonb, "
        f"ST_SetSRID(ST_MakePoint({row['lon']}, {row['lat']}), 4326));"
    )

print("\n".join(lines))
