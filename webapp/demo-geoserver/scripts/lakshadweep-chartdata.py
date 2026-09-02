#!/usr/bin/env python3
"""Builds a real MSPLak:ChartData row (District_Boundary's Weather
Parameters bundle) from actual historical weather observations for
Lakshadweep, and emits a SQL file that creates the table and inserts it.
Shape follows ChartBundle/ChartSpec in src/lib/geoserver.ts, matching the
"Weather Parameters" bundle MSPudhu:District_Boundary already has (see
chartdata.py) — but these values are real, not synthetic: daily 2018-2023
observations for Kavaratti, Lakshadweep (10.5669N 72.6420E) from Open-Meteo's
historical archive (ERA5/ERA5-Land reanalysis, https://open-meteo.com,
CC BY 4.0 — attribute Open-Meteo/Copernicus if this data is reused
elsewhere), aggregated into one boxplot per year per parameter.
"""
import json
import statistics
import urllib.request

LAT, LON = 10.5669, 72.6420
START, END = "2018-01-01", "2023-12-31"
DAILY_VARS = [
    "temperature_2m_max", "temperature_2m_min", "precipitation_sum",
    "relative_humidity_2m_mean", "cloud_cover_mean", "pressure_msl_mean",
    "wind_speed_10m_max",
]

url = (
    "https://archive-api.open-meteo.com/v1/archive"
    f"?latitude={LAT}&longitude={LON}&start_date={START}&end_date={END}"
    f"&daily={','.join(DAILY_VARS)}&timezone=UTC"
)
with urllib.request.urlopen(url) as r:
    obs = json.load(r)

years = sorted({t[:4] for t in obs["daily"]["time"]})


def by_year(values):
    grouped = {y: [] for y in years}
    for t, v in zip(obs["daily"]["time"], values):
        if v is not None:
            grouped[t[:4]].append(v)
    return grouped


def boxstats(values):
    q1, med, q3 = statistics.quantiles(values, n=4, method="inclusive")
    return {
        "min": round(min(values), 2), "q1": round(q1, 2),
        "median": round(med, 2), "q3": round(q3, 2), "max": round(max(values), 2),
    }


def yearly_boxplot(title, y_label, values, transform=lambda v: v, monthly=False):
    grouped = by_year(values)
    data = []
    for y in years:
        yearly_vals = [transform(v) for v in grouped[y]]
        if monthly:
            # Group into 12 monthly sums so the box shows real seasonal
            # spread (dry vs. monsoon months) instead of 365 mostly-zero
            # daily readings drowning out the wet season.
            month_sums = {}
            for t, v in zip(obs["daily"]["time"], values):
                if t[:4] == y and v is not None:
                    month_sums[t[:7]] = month_sums.get(t[:7], 0) + transform(v)
            yearly_vals = list(month_sums.values())
        data.append(boxstats(yearly_vals))
    return {
        "chartType": "boxplot", "title": title, "xLabel": "Year", "yLabel": y_label,
        "categories": years, "data": data,
    }


d = obs["daily"]
district_boundary = [
    {
        "title": "Weather Parameters",
        "chapterHeader": "Weather",
        "subpara": "Historical weather parameters, Lakshadweep (Kavaratti, 2018-2023)",
        "about": (
            "Real historical daily weather observations aggregated to one "
            "distribution per year (monthly totals for precipitation, daily "
            "readings otherwise).<br/><br/>"
            "Source: Open-Meteo Historical Weather API "
            "(ERA5/ERA5-Land reanalysis, Copernicus Climate Change Service)"
        ),
        "charts": [
            yearly_boxplot("Precipitation", "mm", d["precipitation_sum"], monthly=True),
            yearly_boxplot("Humidity", "%", d["relative_humidity_2m_mean"]),
            yearly_boxplot("Air Temperature (Min)", "°C", d["temperature_2m_min"]),
            yearly_boxplot("Air Temperature (Max)", "°C", d["temperature_2m_max"]),
            yearly_boxplot("Cloud Cover", "%", d["cloud_cover_mean"]),
            yearly_boxplot("Pressure", "hPa", d["pressure_msl_mean"]),
            yearly_boxplot("Wind Speed", "m/s", d["wind_speed_10m_max"], transform=lambda v: v / 3.6),
        ],
    },
]

rows = {"District_Boundary": {"chart_data": district_boundary, "lon": 72.6420, "lat": 10.5669}}


def sql_escape(s):
    return s.replace("'", "''")


lines = [
    'DROP TABLE IF EXISTS "Lakshadweep_ChartData";',
    (
        'CREATE TABLE "Lakshadweep_ChartData" ('
        '  id text PRIMARY KEY,'
        '  chart_data jsonb NOT NULL,'
        '  geom geometry(Point, 4326)'
        ');'
    ),
]
for key, row in rows.items():
    payload = sql_escape(json.dumps(row["chart_data"]))
    lines.append(
        f'INSERT INTO "Lakshadweep_ChartData" (id, chart_data, geom) VALUES '
        f"('{key}', '{payload}'::jsonb, "
        f"ST_SetSRID(ST_MakePoint({row['lon']}, {row['lat']}), 4326));"
    )

print("\n".join(lines))
