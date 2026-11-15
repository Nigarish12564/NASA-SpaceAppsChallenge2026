"""
data_manager.py - Data Pipeline, NASA POWER & ASTER DEM Integration
Part of NASA Space Apps Challenge: Earth Analog Finder

Handles caching, local data loading, and resilient API fallback
for Streamlit Community Cloud and local environments.
"""

import os
import math
import time
import requests
import numpy as np
import pandas as pd
import streamlit as st

from sites_data import SITES_CATALOG

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIMATE_FILE = os.path.join(BASE_DIR, "climate_data.csv")
TERRAIN_FILE = os.path.join(BASE_DIR, "terrain_data.csv")


def fetch_nasa_power_climate(lat, lon):
    """
    Fetches climatology parameters from the NASA POWER API.
    Parameters:
    - T2M: Air Temperature at 2m (C)
    - PRECTOTCORR: Precipitation Corrected (mm/day)
    - RH2M: Relative Humidity at 2m (%)
    - ALLSKY_SFC_SW_DWN: All Sky Insolation Incident on a Horizontal Surface (kWh/m2/day)
    """
    url = "https://power.larc.nasa.gov/api/temporal/climatology/point"
    params = {
        "parameters": "T2M,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN",
        "community": "RE",
        "latitude": lat,
        "longitude": lon,
        "format": "JSON",
    }
    r = requests.get(url, params=params, timeout=30)
    r.raise_for_status()
    data = r.json()
    p = data["properties"]["parameter"]
    elevation = data["geometry"]["coordinates"][2]
    return {
        "elevation": elevation,
        "temp": p["T2M"]["ANN"],
        "rain": p["PRECTOTCORR"]["ANN"],
        "humidity": p["RH2M"]["ANN"],
        "sun": p["ALLSKY_SFC_SW_DWN"]["ANN"],
    }


def compute_terrain_metrics(lat, lon):
    """
    Computes terrain slope (degrees) and local relief (meters) using
    a 3x3 elevation grid (~1 km spacing) from ASTER 30m Global DEM via OpenTopoData.
    """
    d = 0.01  # ~1.11 km spacing
    dist_m = d * 111320
    dlon = d / math.cos(math.radians(lat))
    pts = []
    for dy in (1, 0, -1):
        for dx in (-1, 0, 1):
            pts.append((lat + dy * d, lon + dx * dlon))

    loc_str = "|".join(f"{a:.5f},{b:.5f}" for a, b in pts)
    r = requests.get(
        "https://api.opentopodata.org/v1/aster30m",
        params={"locations": loc_str},
        timeout=30,
    )
    r.raise_for_status()
    elev = [x["elevation"] for x in r.json()["results"]]
    if any(v is None for v in elev) or len(elev) < 9:
        return np.nan, np.nan

    z1, z2, z3, z4, z5, z6, z7, z8, z9 = elev[:9]
    dzdx = ((z3 + 2 * z6 + z9) - (z1 + 2 * z4 + z7)) / (8 * dist_m)
    dzdy = ((z1 + 2 * z2 + z3) - (z7 + 2 * z8 + z9)) / (8 * dist_m)
    slope = math.degrees(math.atan(math.hypot(dzdx, dzdy)))
    relief = max(elev) - min(elev)
    return slope, relief


@st.cache_data(ttl=86400, show_spinner=False)
def load_all_analog_data():
    """
    Loads unified analog database with pre-computed NASA POWER and ASTER DEM data.
    Gracefully fills missing values and ensures full metadata compatibility.
    """
    # 1. Load Climate Data
    if os.path.exists(CLIMATE_FILE):
        clim_df = pd.read_csv(CLIMATE_FILE)
    else:
        # Fallback if file doesn't exist
        clim_df = pd.DataFrame(columns=["place", "lat", "lon", "elevation", "temp", "rain", "humidity", "sun"])

    # 2. Load Terrain Data
    if os.path.exists(TERRAIN_FILE):
        terr_df = pd.read_csv(TERRAIN_FILE)
    else:
        terr_df = pd.DataFrame(columns=["place", "slope", "relief"])

    # Merge climate and terrain
    merged = pd.merge(clim_df, terr_df, on="place", how="left")

    # 3. Enhance with SITES_CATALOG metadata
    rows = []
    for _, r in merged.iterrows():
        name = r["place"]
        meta = SITES_CATALOG.get(name, {})
        row_dict = r.to_dict()
        row_dict["country"] = meta.get("country", "Unknown")
        row_dict["region"] = meta.get("region", "Pakistan" if "Pakistan" in meta.get("country", "") else "International")
        row_dict["target_affinity"] = meta.get("target_affinity", "Mars")
        row_dict["category"] = meta.get("category", "Literature Supported")
        row_dict["primary_features"] = meta.get("primary_features", [])
        row_dict["geological_summary"] = meta.get("geological_summary", "Terrestrial analog site.")
        row_dict["scientific_reason"] = meta.get("scientific_reason", "Comparative planetary research.")
        row_dict["citation"] = meta.get("citation", "NASA Planetary Science Literature.")
        rows.append(row_dict)

    df = pd.DataFrame(rows)

    # Impute missing terrain metrics if any with median
    if "slope" in df.columns:
        median_slope = df["slope"].median() if df["slope"].notna().any() else 4.0
        median_relief = df["relief"].median() if df["relief"].notna().any() else 50.0
        df["slope"] = df["slope"].fillna(median_slope)
        df["relief"] = df["relief"].fillna(median_relief)

    return df
