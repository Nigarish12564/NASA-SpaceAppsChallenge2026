"""
Earth Analog Finder - Planetary Exploration Dashboard
NASA Space Apps Challenge 2026

Premium scientific dashboard comparing Earth environments to Moon and Mars.
"""

import os
import math
import numpy as np
import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

from sites_data import SITES_CATALOG
from data_manager import load_all_analog_data
from scoring import PLANETARY_MODELS, compute_all_scores

# =============================================================================
# STREAMLIT PAGE SETUP
# =============================================================================
st.set_page_config(
    page_title="Earth Analog Finder | NASA Space Apps",
    page_icon="🪐",
    layout="wide",
    initial_sidebar_state="expanded"
)

# =============================================================================
# HIGH-END MISSION CONTROL HUD STYLING
# =============================================================================
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    }
    code, pre {
        font-family: 'JetBrains Mono', monospace !important;
    }
    
    /* Background */
    .stApp {
        background: #030712;
        color: #F9FAFB;
    }
    
    /* Hero Header */
    .hud-header {
        background: linear-gradient(180deg, rgba(17, 24, 39, 0.8) 0%, rgba(3, 7, 18, 0.95) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px 24px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
    
    .hud-title {
        font-size: 1.9rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: #FFFFFF;
        margin: 0;
    }
    
    .hud-subtitle {
        color: #9CA3AF;
        font-size: 0.92rem;
        margin: 4px 0 0 0;
    }
    
    .hud-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #F3F4F6;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }
    
    /* KPI Metric Cards */
    div[data-testid="stMetric"] {
        background: rgba(17, 24, 39, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 10px !important;
        padding: 14px 18px !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
    }
    div[data-testid="stMetricLabel"] {
        font-size: 0.72rem !important;
        font-weight: 600 !important;
        color: #9CA3AF !important;
        text-transform: uppercase !important;
        letter-spacing: 0.08em !important;
    }
    div[data-testid="stMetricValue"] {
        font-size: 1.65rem !important;
        font-weight: 800 !important;
        color: #FFFFFF !important;
        letter-spacing: -0.02em !important;
    }
    
    /* Visual Site Cards */
    .site-card {
        background: #0B0F19;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 10px;
        padding: 16px 20px;
        margin-bottom: 14px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    
    .site-tag {
        display: inline-block;
        font-size: 0.7rem;
        font-weight: 600;
        background: #1F2937;
        color: #E5E7EB;
        border: 1px solid #374151;
        padding: 2px 8px;
        border-radius: 4px;
        margin: 2px 4px 2px 0;
    }
    
    .site-tag-mars {
        background: rgba(249, 115, 22, 0.15);
        color: #FB923C;
        border: 1px solid rgba(249, 115, 22, 0.4);
    }
    
    .site-tag-moon {
        background: rgba(226, 232, 240, 0.15);
        color: #E2E8F0;
        border: 1px solid rgba(226, 232, 240, 0.4);
    }
    
    .site-tag-nasa {
        background: rgba(59, 130, 246, 0.15);
        color: #60A5FA;
        border: 1px solid rgba(59, 130, 246, 0.4);
    }
    
    .site-tag-pk {
        background: rgba(16, 185, 129, 0.15);
        color: #34D399;
        border: 1px solid rgba(16, 185, 129, 0.4);
    }
    
    .reason-box {
        background: #111827;
        border-left: 3px solid #38BDF8;
        padding: 10px 14px;
        border-radius: 0 6px 6px 0;
        font-size: 0.85rem;
        color: #E5E7EB;
        line-height: 1.45;
        margin: 10px 0;
    }
    
    /* Navigation Tabs */
    .stTabs [data-baseweb="tab-list"] {
        background: transparent;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        gap: 16px;
        padding-bottom: 2px;
    }
    .stTabs [data-baseweb="tab"] {
        color: #9CA3AF;
        font-size: 0.9rem;
        font-weight: 600;
        padding: 8px 6px;
        border-bottom: 2px solid transparent;
        background: transparent !important;
    }
    .stTabs [aria-selected="true"] {
        color: #FFFFFF !important;
        border-bottom: 2px solid #FFFFFF !important;
    }
</style>
""", unsafe_allow_html=True)

# =============================================================================
# DATA ENGINE LOAD
# =============================================================================
raw_df = load_all_analog_data()

# =============================================================================
# SIDEBAR MISSION SETTINGS
# =============================================================================
st.sidebar.markdown("<p style='font-size:0.75rem; font-weight:700; letter-spacing:0.1em; color:#9CA3AF; text-transform:uppercase; margin:0;'>NASA Space Apps 2026</p>", unsafe_allow_html=True)
st.sidebar.markdown("<h2 style='margin:2px 0 16px 0; font-size:1.3rem; color:#FFFFFF;'>Mission Controls</h2>", unsafe_allow_html=True)

# Target Selector
target_options = list(PLANETARY_MODELS.keys())
selected_model_name = st.sidebar.selectbox(
    "Target Planet",
    target_options,
    index=0
)
active_model = PLANETARY_MODELS[selected_model_name]
default_weights = active_model["default_weights"]

# Scope Filter
scope_choice = st.sidebar.radio(
    "View Locations",
    ["All 35 Sites", "Pakistan Only (15)", "International Only (20)"],
    index=0
)

# Minimum Elevation
min_elev = st.sidebar.slider("Min Elevation (meters)", 0, 4500, 0, 250)

# Weights
with st.sidebar.expander("Adjust Scientific Weights", expanded=False):
    st.caption("Customize parameter importance:")
    w_temp = st.slider("Temperature", 0.0, 1.0, float(default_weights["temp"]), 0.05)
    w_rain = st.slider("Aridity (Zero Rain)", 0.0, 1.0, float(default_weights["rain"]), 0.05)
    w_hum = st.slider("Dry Air (Zero Humidity)", 0.0, 1.0, float(default_weights["humidity"]), 0.05)
    w_sun = st.slider("Solar Radiation", 0.0, 1.0, float(default_weights["sun"]), 0.05)
    w_slope = st.slider("Terrain Slope", 0.0, 1.0, float(default_weights["slope"]), 0.05)
    w_relief = st.slider("Local Relief", 0.0, 1.0, float(default_weights["relief"]), 0.05)

custom_weights = {
    "temp": w_temp, "rain": w_rain, "humidity": w_hum,
    "sun": w_sun, "slope": w_slope, "relief": w_relief
}

# =============================================================================
# COMPUTE SCIENTIFIC SCORES
# =============================================================================
scored_df = compute_all_scores(raw_df, selected_model_name, custom_weights)
scored_df["marker_size"] = np.clip(scored_df["score"] * 0.22 + 6, 8, 22)

# Strict Separation of Datasets
pk_sites_df = scored_df[scored_df["region"] == "Pakistan"].sort_values("score", ascending=False).reset_index(drop=True)
pk_sites_df["pk_rank"] = range(1, len(pk_sites_df) + 1)

intl_sites_df = scored_df[scored_df["region"] == "International"].sort_values("score", ascending=False).reset_index(drop=True)
intl_sites_df["intl_rank"] = range(1, len(intl_sites_df) + 1)

# Active Display View based on Scope
if scope_choice == "Pakistan Only (15)":
    view_df = pk_sites_df[pk_sites_df["elevation"] >= min_elev].copy()
elif scope_choice == "International Only (20)":
    view_df = intl_sites_df[intl_sites_df["elevation"] >= min_elev].copy()
else:
    view_df = scored_df[scored_df["elevation"] >= min_elev].sort_values("score", ascending=False).reset_index(drop=True)

view_df["rank"] = range(1, len(view_df) + 1)

# =============================================================================
# TOP HUD HEADER
# =============================================================================
is_mars = "Mars" in selected_model_name
planet_tag = "🔴 MARS MISSION" if is_mars else "⚪ MOON (ARTEMIS)"
target_temp = active_model["targets"]["temp"]

st.markdown(f"""
<div class="hud-header">
    <div>
        <h1 class="hud-title">Earth Analog Finder</h1>
        <p class="hud-subtitle">Terrestrial planetary analog identification • NASA POWER & ASTER GDEM</p>
    </div>
    <div style="display:flex; gap:8px;">
        <span class="hud-pill">{planet_tag}</span>
        <span class="hud-pill">Target Temp: {target_temp}°C</span>
    </div>
</div>
""", unsafe_allow_html=True)

# Top 5 KPI Metrics
k1, k2, k3, k4, k5 = st.columns(5)
k1.metric("Total Catalog", f"{len(scored_df)} Sites", "35 Evaluated")
k2.metric("Pakistan Focus", f"{len(pk_sites_df)} Sites", "15 Promising")
k3.metric("Global Analogs", f"{len(intl_sites_df)} Sites", "20 International")

best_pk = pk_sites_df.iloc[0]
k4.metric("Best in Pakistan", best_pk["place"].split("(")[0].strip(), f"{best_pk['score']:.1f}%")

best_intl = intl_sites_df.iloc[0]
k5.metric("Best Global Site", best_intl["place"].split("(")[0].strip(), f"{best_intl['score']:.1f}%")

st.markdown("<div style='margin-bottom: 12px;'></div>", unsafe_allow_html=True)

# =============================================================================
# MAIN NAVIGATION TABS
# =============================================================================
tab_main, tab_pk, tab_intl, tab_moon, tab_mars, tab_compare, tab_sci = st.tabs([
    "🪐 Main Dashboard",
    "🇵🇰 Pakistan Explorer",
    "🌍 Global Explorer",
    "⚪ Moon Analysis",
    "🔴 Mars Analysis",
    "⚖️ Compare Sites",
    "🔬 Data & Scientific Sources"
])

# =============================================================================
# TAB 1: MAIN DASHBOARD
# =============================================================================
with tab_main:
    col_map_box, col_lead_box = st.columns([1.6, 1.0])
    
    with col_map_box:
        st.markdown("<p style='font-size:0.85rem; font-weight:700; color:#E5E7EB; text-transform:uppercase; margin-bottom:8px;'>Interactive World Analog Map</p>", unsafe_allow_html=True)
        
        # Color palette: Orange-gold for Mars, Silver-white for Moon
        color_scale = ["#374151", "#B45309", "#F59E0B", "#FDE68A"] if is_mars else ["#374151", "#9CA3AF", "#E5E7EB", "#FFFFFF"]
        
        fig_world_map = px.scatter_map(
            view_df,
            lat="lat",
            lon="lon",
            size="marker_size",
            color="score",
            hover_name="place",
            hover_data={
                "region": True,
                "country": True,
                "score": ":.1f",
                "temp": ":.1f",
                "rain": ":.2f",
                "elevation": ":.0f",
                "marker_size": False,
                "lat": False,
                "lon": False
            },
            color_continuous_scale=color_scale,
            range_color=[35, 75],
            center={"lat": 28.0, "lon": 50.0},
            zoom=1.2,
            map_style="carto-darkmatter",
            height=520
        )
        fig_world_map.update_layout(
            margin=dict(l=0, r=0, t=0, b=0),
            paper_bgcolor="#030712",
            plot_bgcolor="#030712",
            coloraxis_colorbar=dict(
                title=dict(text="Match %", font=dict(color="#FFF")),
                tickfont=dict(color="#FFF"),
                len=0.6,
                thickness=12
            )
        )
        st.plotly_chart(fig_world_map, width="stretch")
        st.caption("Circle size and brightness indicate planetary similarity score.")
        
    with col_lead_box:
        st.markdown("<p style='font-size:0.85rem; font-weight:700; color:#E5E7EB; text-transform:uppercase; margin-bottom:8px;'>Top Matches Side-by-Side</p>", unsafe_allow_html=True)
        
        # Side by Side: Top 5 Pakistan vs Top 5 International (Never Mixed)
        st.markdown("**Top 5 in Pakistan:**")
        pk_top5 = pk_sites_df.head(5)[["pk_rank", "place", "score"]].copy()
        st.dataframe(
            pk_top5,
            hide_index=True,
            width="stretch",
            column_config={
                "pk_rank": st.column_config.NumberColumn("#", width="small"),
                "place": st.column_config.TextColumn("Location", width="large"),
                "score": st.column_config.ProgressColumn("Match", min_value=0, max_value=100, format="%.1f%%")
            }
        )
        
        st.markdown("**Top 5 International Sites:**")
        intl_top5 = intl_sites_df.head(5)[["intl_rank", "place", "country", "score"]].copy()
        st.dataframe(
            intl_top5,
            hide_index=True,
            width="stretch",
            column_config={
                "intl_rank": st.column_config.NumberColumn("#", width="small"),
                "place": st.column_config.TextColumn("Location", width="large"),
                "country": st.column_config.TextColumn("Country", width="small"),
                "score": st.column_config.ProgressColumn("Match", min_value=0, max_value=100, format="%.1f%%")
            }
        )

# =============================================================================
# TAB 2: PAKISTAN EXPLORER (Exclusively 15 Pakistan Sites)
# =============================================================================
with tab_pk:
    st.markdown("<h3 style='color:#FFFFFF; margin:0 0 4px 0;'>Pakistan Planetary Analog Explorer</h3>", unsafe_allow_html=True)
    st.caption("15 scientifically selected analog locations in Balochistan, Sindh, Punjab, and Gilgit-Baltistan.")
    
    col_pk_m, col_pk_card = st.columns([1.5, 1.1])
    
    with col_pk_m:
        fig_pk_m = px.scatter_map(
            pk_sites_df,
            lat="lat",
            lon="lon",
            size="marker_size",
            color="score",
            hover_name="place",
            hover_data={
                "pk_rank": True,
                "score": ":.1f",
                "temp": ":.1f",
                "rain": ":.2f",
                "elevation": ":.0f",
                "marker_size": False,
                "lat": False,
                "lon": False
            },
            color_continuous_scale=["#374151", "#10B981", "#34D399", "#A7F3D0"],
            center={"lat": 30.5, "lon": 69.5},
            zoom=4.6,
            map_style="carto-darkmatter",
            height=540
        )
        fig_pk_m.update_layout(
            margin=dict(l=0, r=0, t=0, b=0),
            paper_bgcolor="#030712",
            plot_bgcolor="#030712",
            coloraxis_showscale=False
        )
        st.plotly_chart(fig_pk_m, width="stretch")
        
    with col_pk_card:
        selected_pk_site = st.selectbox(
            "Select a Pakistani Location:",
            pk_sites_df["place"].tolist(),
            index=0
        )
        pk_info = pk_sites_df[pk_sites_df["place"] == selected_pk_site].iloc[0]
        meta_pk = SITES_CATALOG.get(selected_pk_site, {})
        
        # Interactive Gauge Indicator for Visual Score
        fig_pk_gauge = go.Figure(go.Indicator(
            mode="gauge+number",
            value=pk_info["score"],
            domain={'x': [0, 1], 'y': [0, 1]},
            title={'text': f"Similarity to {selected_model_name.split('(')[0]}", 'font': {'size': 14, 'color': '#9CA3AF'}},
            number={'suffix': "%", 'font': {'color': '#FFF', 'size': 32}},
            gauge={
                'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': "#444"},
                'bar': {'color': "#34D399" if pk_info['score'] > 60 else "#F59E0B"},
                'bgcolor': "#111827",
                'borderwidth': 1,
                'bordercolor': "#374151"
            }
        ))
        fig_pk_gauge.update_layout(height=170, margin=dict(l=10, r=10, t=30, b=10), paper_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig_pk_gauge, width="stretch")
        
        # Site Summary Card
        tags_pk = "".join([f"<span class='site-tag site-tag-pk'>{f}</span>" for f in meta_pk.get("primary_features", [])])
        
        st.markdown(f"""
        <div class="site-card">
            <span class="site-tag site-tag-mars">{meta_pk.get('target_affinity', 'Mars')} Analog</span>
            <span class="site-tag">Rank #{pk_info['pk_rank']} in Pakistan</span>
            <h4 style="margin:8px 0 2px 0; color:#FFF; font-size:1.2rem;">{pk_info['place']}</h4>
            <p style="color:#9CA3AF; font-size:0.8rem; margin:0 0 10px 0;">Coordinates: {pk_info['lat']}°N, {pk_info['lon']}°E &bull; Elevation: {pk_info['elevation']:.0f}m</p>
            <div>{tags_pk}</div>
            <div class="reason-box">
                {meta_pk.get('scientific_reason', '')}
            </div>
            <p style="font-size:0.75rem; color:#6B7280; margin:4px 0 0 0;">Reference: {meta_pk.get('citation', '')}</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Telemetry Numbers
        p_c1, p_c2, p_c3 = st.columns(3)
        p_c1.metric("2m Temp", f"{pk_info['temp']:.1f} °C")
        p_c2.metric("Rainfall", f"{pk_info['rain']:.2f} mm/d")
        p_c3.metric("Humidity", f"{pk_info['humidity']:.0f}%")
        
        p_c4, p_c5, p_c6 = st.columns(3)
        p_c4.metric("Solar", f"{pk_info['sun']:.2f} kWh")
        p_c5.metric("Slope", f"{pk_info['slope']:.1f}°")
        p_c6.metric("Relief", f"{pk_info['relief']:.0f} m")

    # Full Pakistan Table
    st.markdown("<p style='font-size:0.85rem; font-weight:700; color:#E5E7EB; text-transform:uppercase; margin:16px 0 8px 0;'>All 15 Pakistan Candidate Sites</p>", unsafe_allow_html=True)
    pk_full_table = pk_sites_df[["pk_rank", "place", "score", "elevation", "temp", "rain", "humidity", "sun", "slope", "relief"]].copy()
    st.dataframe(
        pk_full_table.round(1),
        hide_index=True,
        width="stretch",
        column_config={
            "pk_rank": st.column_config.NumberColumn("#", width="small"),
            "place": st.column_config.TextColumn("Location", width="medium"),
            "score": st.column_config.ProgressColumn("Match", min_value=0, max_value=100, format="%.1f%%"),
            "elevation": st.column_config.NumberColumn("Elev (m)", format="%.0f"),
            "temp": st.column_config.NumberColumn("Temp (°C)", format="%.1f"),
            "rain": st.column_config.NumberColumn("Rain (mm/d)", format="%.2f"),
            "humidity": st.column_config.NumberColumn("RH (%)", format="%.0f"),
            "sun": st.column_config.NumberColumn("Sun (kWh)", format="%.2f"),
            "slope": st.column_config.NumberColumn("Slope (°)", format="%.1f"),
            "relief": st.column_config.NumberColumn("Relief (m)", format="%.0f")
        }
    )

# =============================================================================
# TAB 3: GLOBAL EXPLORER (Exclusively 20 International Sites)
# =============================================================================
with tab_intl:
    st.markdown("<h3 style='color:#FFFFFF; margin:0 0 4px 0;'>International Analog Explorer</h3>", unsafe_allow_html=True)
    st.caption("20 canonically documented international planetary analog sites (excluding Pakistan).")
    
    col_intl_m, col_intl_card = st.columns([1.5, 1.1])
    
    with col_intl_m:
        fig_intl_m = px.scatter_map(
            intl_sites_df,
            lat="lat",
            lon="lon",
            size="marker_size",
            color="score",
            hover_name="place",
            hover_data={
                "intl_rank": True,
                "country": True,
                "category": True,
                "score": ":.1f",
                "temp": ":.1f",
                "rain": ":.2f",
                "elevation": ":.0f",
                "marker_size": False,
                "lat": False,
                "lon": False
            },
            color_continuous_scale=["#374151", "#2563EB", "#60A5FA", "#BFDBFE"],
            center={"lat": 20.0, "lon": 0.0},
            zoom=1.1,
            map_style="carto-darkmatter",
            height=540
        )
        fig_intl_m.update_layout(
            margin=dict(l=0, r=0, t=0, b=0),
            paper_bgcolor="#030712",
            plot_bgcolor="#030712",
            coloraxis_showscale=False
        )
        st.plotly_chart(fig_intl_m, width="stretch")
        
    with col_intl_card:
        selected_intl_site = st.selectbox(
            "Select an International Site:",
            intl_sites_df["place"].tolist(),
            index=0
        )
        intl_info = intl_sites_df[intl_sites_df["place"] == selected_intl_site].iloc[0]
        meta_intl = SITES_CATALOG.get(selected_intl_site, {})
        
        fig_intl_gauge = go.Figure(go.Indicator(
            mode="gauge+number",
            value=intl_info["score"],
            domain={'x': [0, 1], 'y': [0, 1]},
            title={'text': f"Similarity to {selected_model_name.split('(')[0]}", 'font': {'size': 14, 'color': '#9CA3AF'}},
            number={'suffix': "%", 'font': {'color': '#FFF', 'size': 32}},
            gauge={
                'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': "#444"},
                'bar': {'color': "#60A5FA"},
                'bgcolor': "#111827",
                'borderwidth': 1,
                'bordercolor': "#374151"
            }
        ))
        fig_intl_gauge.update_layout(height=170, margin=dict(l=10, r=10, t=30, b=10), paper_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig_intl_gauge, width="stretch")
        
        tags_intl = "".join([f"<span class='site-tag site-tag-nasa'>{f}</span>" for f in meta_intl.get("primary_features", [])])
        
        st.markdown(f"""
        <div class="site-card">
            <span class="site-tag site-tag-nasa">{intl_info['category']}</span>
            <span class="site-tag">{intl_info['country']}</span>
            <h4 style="margin:8px 0 2px 0; color:#FFF; font-size:1.2rem;">{intl_info['place']}</h4>
            <p style="color:#9CA3AF; font-size:0.8rem; margin:0 0 10px 0;">Coordinates: {intl_info['lat']}°, {intl_info['lon']}° &bull; Global Rank: #{intl_info['intl_rank']}</p>
            <div>{tags_intl}</div>
            <div class="reason-box">
                {meta_intl.get('scientific_reason', '')}
            </div>
            <p style="font-size:0.75rem; color:#6B7280; margin:4px 0 0 0;">Reference: {meta_intl.get('citation', '')}</p>
        </div>
        """, unsafe_allow_html=True)
        
        i_c1, i_c2, i_c3 = st.columns(3)
        i_c1.metric("2m Temp", f"{intl_info['temp']:.1f} °C")
        i_c2.metric("Rainfall", f"{intl_info['rain']:.2f} mm/d")
        i_c3.metric("Match", f"{intl_info['score']:.1f}%")

    st.markdown("<p style='font-size:0.85rem; font-weight:700; color:#E5E7EB; text-transform:uppercase; margin:16px 0 8px 0;'>All 20 International Benchmark Sites</p>", unsafe_allow_html=True)
    intl_full_table = intl_sites_df[["intl_rank", "place", "country", "category", "score", "elevation", "temp", "rain", "humidity", "sun"]].copy()
    st.dataframe(
        intl_full_table.round(1),
        hide_index=True,
        width="stretch",
        column_config={
            "intl_rank": st.column_config.NumberColumn("#", width="small"),
            "place": st.column_config.TextColumn("Location", width="large"),
            "country": st.column_config.TextColumn("Country", width="medium"),
            "category": st.column_config.TextColumn("Tier", width="medium"),
            "score": st.column_config.ProgressColumn("Match", min_value=0, max_value=100, format="%.1f%%"),
            "elevation": st.column_config.NumberColumn("Elev (m)", format="%.0f"),
            "temp": st.column_config.NumberColumn("Temp (°C)", format="%.1f"),
            "rain": st.column_config.NumberColumn("Rain (mm/d)", format="%.2f"),
            "humidity": st.column_config.NumberColumn("RH (%)", format="%.0f"),
            "sun": st.column_config.NumberColumn("Sun (kWh)", format="%.2f")
        }
    )

# =============================================================================
# TAB 4: MOON ANALYSIS
# =============================================================================
with tab_moon:
    st.markdown("<h3 style='color:#FFFFFF; margin:0;'>Moon Analog Analysis (Artemis South Pole Target)</h3>", unsafe_allow_html=True)
    st.caption("Target: -53°C sunlit rim equilibrium, zero moisture, 0.9 kWh/m²/day grazing solar irradiance.")
    
    moon_scored = compute_all_scores(raw_df, "Moon (Sunlit South Pole - Artemis Zone)", custom_weights).sort_values("score", ascending=False).reset_index(drop=True)
    
    col_mb, col_mr = st.columns([1.2, 1.2])
    
    with col_mb:
        fig_moon_b = px.bar(
            moon_scored.head(10).iloc[::-1],
            x="score", y="place", orientation="h",
            color="score",
            color_continuous_scale=["#374151", "#9CA3AF", "#E5E7EB", "#FFFFFF"],
            text="score"
        )
        fig_moon_b.update_traces(texttemplate="%{text:.1f}%", textposition="inside")
        fig_moon_b.update_layout(
            template="plotly_dark",
            paper_bgcolor="#030712",
            plot_bgcolor="#030712",
            height=420,
            margin=dict(l=0, r=20, t=10, b=10),
            coloraxis_showscale=False,
            xaxis_title=None, yaxis_title=None
        )
        st.plotly_chart(fig_moon_b, width="stretch")
        
    with col_mr:
        fig_moon_radar = go.Figure()
        feats = ["temp", "rain", "humidity", "sun", "slope", "relief"]
        cats = ["Temperature", "Aridity", "Dry Air", "Solar", "Slope", "Relief"]
        
        fig_moon_radar.add_trace(go.Scatterpolar(
            r=[100]*6 + [100], theta=cats + [cats[0]],
            name="Lunar South Pole Target",
            line=dict(color="#FFFFFF", width=2.5, dash="dash")
        ))
        
        colors_m = ["#93C5FD", "#FBBF24", "#34D399"]
        for idx, row in moon_scored.head(3).iterrows():
            vals = [row[f"s_{f}"] for f in feats]
            fig_moon_radar.add_trace(go.Scatterpolar(
                r=vals + [vals[0]], theta=cats + [cats[0]],
                name=f"{row['place'].split('(')[0].strip()} ({row['score']:.0f}%)",
                line=dict(color=colors_m[idx], width=2)
            ))
            
        fig_moon_radar.update_layout(
            template="plotly_dark",
            paper_bgcolor="#030712",
            polar=dict(
                radialaxis=dict(visible=True, range=[0, 100], gridcolor="#1F2937"),
                angularaxis=dict(gridcolor="#1F2937")
            ),
            height=420,
            margin=dict(l=20, r=20, t=10, b=10)
        )
        st.plotly_chart(fig_moon_radar, width="stretch")

# =============================================================================
# TAB 5: MARS ANALYSIS
# =============================================================================
with tab_mars:
    st.markdown("<h3 style='color:#FFFFFF; margin:0;'>Mars Analog Analysis (Global Surface Target)</h3>", unsafe_allow_html=True)
    st.caption("Target: -59°C global mean, zero liquid rain, 3.5 kWh/m²/day daily insolation.")
    
    mars_scored = compute_all_scores(raw_df, "Mars (Global Average Surface)", custom_weights).sort_values("score", ascending=False).reset_index(drop=True)
    
    col_mar_b, col_mar_r = st.columns([1.2, 1.2])
    
    with col_mar_b:
        fig_mars_b = px.bar(
            mars_scored.head(10).iloc[::-1],
            x="score", y="place", orientation="h",
            color="score",
            color_continuous_scale=["#374151", "#B45309", "#F59E0B", "#FDE68A"],
            text="score"
        )
        fig_mars_b.update_traces(texttemplate="%{text:.1f}%", textposition="inside")
        fig_mars_b.update_layout(
            template="plotly_dark",
            paper_bgcolor="#030712",
            plot_bgcolor="#030712",
            height=420,
            margin=dict(l=0, r=20, t=10, b=10),
            coloraxis_showscale=False,
            xaxis_title=None, yaxis_title=None
        )
        st.plotly_chart(fig_mars_b, width="stretch")
        
    with col_mar_r:
        fig_mars_radar = go.Figure()
        feats = ["temp", "rain", "humidity", "sun", "slope", "relief"]
        cats = ["Temperature", "Aridity", "Dry Air", "Solar", "Slope", "Relief"]
        
        fig_mars_radar.add_trace(go.Scatterpolar(
            r=[100]*6 + [100], theta=cats + [cats[0]],
            name="Mars Global Target",
            line=dict(color="#F59E0B", width=2.5, dash="dash")
        ))
        
        colors_mars = ["#38BDF8", "#F43F5E", "#34D399"]
        for idx, row in mars_scored.head(3).iterrows():
            vals = [row[f"s_{f}"] for f in feats]
            fig_mars_radar.add_trace(go.Scatterpolar(
                r=vals + [vals[0]], theta=cats + [cats[0]],
                name=f"{row['place'].split('(')[0].strip()} ({row['score']:.0f}%)",
                line=dict(color=colors_mars[idx], width=2)
            ))
            
        fig_mars_radar.update_layout(
            template="plotly_dark",
            paper_bgcolor="#030712",
            polar=dict(
                radialaxis=dict(visible=True, range=[0, 100], gridcolor="#1F2937"),
                angularaxis=dict(gridcolor="#1F2937")
            ),
            height=420,
            margin=dict(l=20, r=20, t=10, b=10)
        )
        st.plotly_chart(fig_mars_radar, width="stretch")

# =============================================================================
# TAB 6: LOCATION COMPARISON
# =============================================================================
with tab_compare:
    st.markdown("<h3 style='color:#FFFFFF; margin:0;'>Multi-Site Comparison</h3>", unsafe_allow_html=True)
    st.caption("Side-by-side comparison of selected sites against the active target.")
    
    all_site_names = scored_df["place"].tolist()
    compare_defaults = ["Chagai (Dalbandin)", "Atacama Desert (Chile)", "Deosai Plains", "Dry Valleys (Antarctica)"]
    valid_defaults = [d for d in compare_defaults if d in all_site_names][:4]
    
    chosen_for_comp = st.multiselect("Choose up to 4 locations:", all_site_names, default=valid_defaults)
    
    if len(chosen_for_comp) > 0:
        c_subset = scored_df[scored_df["place"].isin(chosen_for_comp)].copy()
        
        col_c_rad, col_c_bar = st.columns([1.2, 1.2])
        feats = ["temp", "rain", "humidity", "sun", "slope", "relief"]
        cats = ["Temperature", "Aridity", "Dry Air", "Solar", "Slope", "Relief"]
        
        with col_c_rad:
            fig_c_rad = go.Figure()
            fig_c_rad.add_trace(go.Scatterpolar(
                r=[100]*6 + [100], theta=cats + [cats[0]],
                name="Planetary Target",
                line=dict(color="#FFFFFF", width=2.5, dash="dash")
            ))
            
            pals = ["#38BDF8", "#F59E0B", "#10B981", "#EC4899"]
            for idx, (_, r) in enumerate(c_subset.iterrows()):
                vals = [r[f"s_{f}"] for f in feats]
                fig_c_rad.add_trace(go.Scatterpolar(
                    r=vals + [vals[0]], theta=cats + [cats[0]],
                    name=f"{r['place'].split('(')[0].strip()} ({r['score']:.0f}%)",
                    line=dict(color=pals[idx % len(pals)], width=2)
                ))
                
            fig_c_rad.update_layout(
                template="plotly_dark",
                paper_bgcolor="#030712",
                polar=dict(
                    radialaxis=dict(visible=True, range=[0, 100], gridcolor="#1F2937"),
                    angularaxis=dict(gridcolor="#1F2937")
                ),
                height=380,
                margin=dict(l=10, r=10, t=10, b=10)
            )
            st.plotly_chart(fig_c_rad, width="stretch")
            
        with col_c_bar:
            fig_c_bar = px.bar(
                c_subset, x="place", y="score", color="region",
                text="score",
                color_discrete_map={"Pakistan": "#10B981", "International": "#60A5FA"}
            )
            fig_c_bar.update_traces(texttemplate="%{text:.1f}%", textposition="outside")
            fig_c_bar.update_layout(
                template="plotly_dark",
                paper_bgcolor="#030712",
                plot_bgcolor="#030712",
                height=380,
                yaxis_range=[0, 105],
                margin=dict(l=10, r=10, t=10, b=10),
                xaxis_title=None, yaxis_title=None
            )
            st.plotly_chart(fig_c_bar, width="stretch")
            
        # Telemetry Delta Table
        t_active = active_model["targets"]
        matrix_rows = []
        for _, r in c_subset.iterrows():
            matrix_rows.append({
                "Location": r["place"],
                "Region": r["region"],
                "Score": f"{r['score']:.1f}%",
                "Temp (°C)": f"{r['temp']:.1f} (Δ {r['temp'] - t_active['temp']:+.1f})",
                "Rain (mm/d)": f"{r['rain']:.2f} (Δ {r['rain'] - t_active['rain']:+.2f})",
                "Humidity": f"{r['humidity']:.0f}%",
                "Solar": f"{r['sun']:.2f} kWh",
                "Slope": f"{r['slope']:.1f}°"
            })
        st.dataframe(pd.DataFrame(matrix_rows), hide_index=True, width="stretch")

# =============================================================================
# TAB 7: SCIENTIFIC METHODOLOGY & DATASETS
# =============================================================================
with tab_sci:
    st.markdown("<h3 style='color:#FFFFFF; margin:0 0 6px 0;'>Scientific Data & Calculation Model</h3>", unsafe_allow_html=True)
    
    st.markdown("""
    **Transparency Statement:** NASA has not published a single official scalar formula for analog scoring. 
    This application uses the **Planetary Analog Similarity Model (PASM)** with **Gaussian Tolerance Envelopes**:
    """)
    
    st.latex(r"s_k(x_k) = \exp\left( - \frac{1}{2} \left( \frac{x_k - T_k}{\sigma_k} \right)^2 \right) \quad \implies \quad S(x) = 100 \times \frac{\sum w_k s_k(x_k)}{\sum w_k}")
    
    st.markdown("""
    - **Exact Match:** An Earth site identical to the planetary target receives **100.0%**.
    - **Sample Invariant:** Adding or removing candidate sites does not shift existing scores.
    """)
    
    st.markdown("<p style='font-size:0.85rem; font-weight:700; color:#E5E7EB; text-transform:uppercase; margin:16px 0 6px 0;'>Verified NASA Data Parameters</p>", unsafe_allow_html=True)
    params_data = [
        {"Parameter": "Temperature (T2M)", "Source": "NASA POWER Climatology", "Units": "°C", "Planetary Role": "Surface ambient thermal boundary"},
        {"Parameter": "Precipitation (PRECTOTCORR)", "Source": "NASA POWER Climatology", "Units": "mm/day", "Planetary Role": "Aridity & absence of liquid water"},
        {"Parameter": "Relative Humidity (RH2M)", "Source": "NASA POWER Climatology", "Units": "%", "Planetary Role": "Atmospheric moisture deficit"},
        {"Parameter": "Solar Radiation (ALLSKY)", "Source": "NASA POWER Climatology", "Units": "kWh/m²/day", "Planetary Role": "Surface insolation & UV stress"},
        {"Parameter": "Slope", "Source": "ASTER 30m Global DEM", "Units": "Degrees (°)", "Planetary Role": "Traversability & rover terramechanics"},
        {"Parameter": "Relief", "Source": "ASTER 30m Global DEM", "Units": "Meters (m)", "Planetary Role": "1 km topographical roughness"}
    ]
    st.dataframe(pd.DataFrame(params_data), hide_index=True, width="stretch")
    
    st.markdown("<p style='font-size:0.85rem; font-weight:700; color:#E5E7EB; text-transform:uppercase; margin:16px 0 6px 0;'>Scientific Limitations</p>", unsafe_allow_html=True)
    st.markdown("""
    - **2m Air Temp vs Surface Skin Temp:** Moon has no air; Mars has a thin 6 mbar boundary layer with steep ground-to-air temperature differences.
    - **Aridity vs Vacuum:** Terrestrial hyper-aridity cannot replicate the absolute desiccating vacuum of space.
    - **Resolution:** NASA POWER uses ~50 km grid cells; microclimatic pockets (caves, deep craters) are smoothed out.
    """)
    
    st.download_button(
        "Download Complete Evaluated Dataset (CSV)",
        view_df.to_csv(index=False),
        "earth_analog_dataset.csv",
        "text/csv"
    )

st.markdown("<div style='border-top:1px solid rgba(255,255,255,0.1); margin-top:30px; padding-top:12px; font-size:0.75rem; color:#6B7280; text-align:center;'>NASA Space Apps Challenge 2026 &bull; Earth Analog Finder &bull; Powered by NASA POWER API & ASTER GDEM</div>", unsafe_allow_html=True)
