"""
scoring.py - Planetary Analog Similarity Model (PASM) Engine
Part of NASA Space Apps Challenge: Earth Analog Finder

This module implements a transparent, physically bounded, and sample-independent
similarity scoring methodology for comparing Earth terrestrial environments
with the Moon (Artemis South Pole Exploration Zone) and Mars (Global Surface Average).
"""

import math
import numpy as np
import pandas as pd

# =============================================================================
# PLANETARY TARGETS AND PHYSICAL TOLERANCE SCALES
# =============================================================================
# For each planetary environment, we define:
# - target: The physical condition on the planetary surface.
# - tolerance (sigma): The characteristic scientific deviation envelope.
#   A difference of 1 sigma results in ~60.6% similarity (exp(-0.5)).
#   A difference of 2 sigma results in ~13.5% similarity (exp(-2.0)).
# - default_weights: Relative scientific importance of each environmental parameter.
# =============================================================================

PLANETARY_MODELS = {
    "Mars (Global Average Surface)": {
        "description": "Represents mean Martian surface conditions across the global desert/volcanic plains (Viking, Curiosity, Perseverance datasets).",
        "reference_source": "NASA Mars Fact Sheet & Mars Climate Database v6.1",
        "targets": {
            "temp": -59.0,      # Mean Martian surface air temperature (~214 K)
            "rain": 0.0,        # Zero liquid precipitation (hyper-arid sublimation only)
            "humidity": 0.0,    # Virtually dry atmosphere (~10 precipitable microns column water)
            "sun": 3.5,         # Mean daily solar insolation at surface (accounting for orbital distance 1.52 AU and dust tau)
            "slope": 4.0,       # Gentle, traversable rover terrain (Jezero crater floor / Gale plains)
            "relief": 50.0      # Local 1 km topographical relief (m)
        },
        "tolerances": {
            "temp": 35.0,       # Celsius: accounts for Martian diurnal swing (+20C noon to -125C night)
            "rain": 1.2,        # mm/day: strict aridity constraint
            "humidity": 25.0,   # %: strict dry air constraint
            "sun": 2.5,         # kWh/m2/day: insolation deviation envelope
            "slope": 8.0,       # degrees: traversable terrain slope tolerance
            "relief": 150.0     # meters: local relief envelope
        },
        "default_weights": {
            "temp": 0.22,
            "rain": 0.23,
            "humidity": 0.15,
            "sun": 0.15,
            "slope": 0.13,
            "relief": 0.12
        }
    },
    "Moon (Sunlit South Pole - Artemis Zone)": {
        "description": "Represents sunlit crater rims near the Lunar South Pole (e.g., Shackleton crater rim, Malapert Mountain) targeted by NASA Artemis missions.",
        "reference_source": "LRO Diviner Lunar Radiometer Experiment (Mazarico et al. 2011, Paige et al. 2010)",
        "targets": {
            "temp": -53.0,      # Sunlit south polar rim equilibrium temperature (~220 K)
            "rain": 0.0,        # Absolute vacuum (no liquid precipitation)
            "humidity": 0.0,    # Zero atmospheric moisture
            "sun": 0.9,         # Grazing polar solar irradiance (solar elevation angle < 1.5 degrees)
            "slope": 5.0,       # Traversable lunar highland / polar crater rim slope
            "relief": 60.0      # Local 1 km undulating regolith relief (m)
        },
        "tolerances": {
            "temp": 35.0,       # Celsius: polar thermal envelope
            "rain": 1.0,        # mm/day: vacuum zero-precipitation constraint
            "humidity": 20.0,   # %: vacuum zero-humidity constraint
            "sun": 2.0,         # kWh/m2/day: grazing illumination envelope
            "slope": 8.0,       # degrees: lunar regolith mobility tolerance
            "relief": 150.0     # meters: local crater relief envelope
        },
        "default_weights": {
            "temp": 0.20,
            "rain": 0.25,
            "humidity": 0.15,
            "sun": 0.20,
            "slope": 0.10,
            "relief": 0.10
        }
    }
}


def calculate_feature_similarity(val, target, tolerance):
    """
    Computes Gaussian tolerance similarity for a single feature:
    s = exp( -0.5 * ((val - target) / tolerance)^2 )
    Returns a value in [0.0, 1.0].
    """
    if val is None or np.isnan(val):
        return None
    diff = (val - target) / tolerance
    return math.exp(-0.5 * (diff ** 2))


def score_location(row, model_name, custom_weights=None):
    """
    Calculates the Planetary Analog Similarity Score (0 to 100) and
    parameter breakdown for a single site row.
    
    Guarantees:
    1. Independent scoring: Adding or removing other sites does not affect this score.
    2. Exact match returns 100.0%.
    3. Handles missing terrain gracefully by renormalizing weights across available features.
    """
    model = PLANETARY_MODELS[model_name]
    targets = model["targets"]
    tolerances = model["tolerances"]
    weights = custom_weights if custom_weights is not None else model["default_weights"]

    feature_scores = {}
    weighted_sum = 0.0
    active_weight_sum = 0.0

    for feat, target in targets.items():
        if feat in row and not pd.isna(row[feat]):
            sim = calculate_feature_similarity(row[feat], target, tolerances[feat])
            w = weights.get(feat, 1.0)
            if sim is not None and w > 0:
                feature_scores[feat] = sim * 100.0  # Scale to 0-100%
                weighted_sum += sim * w
                active_weight_sum += w
        else:
            feature_scores[feat] = None

    if active_weight_sum > 0:
        composite_score = (weighted_sum / active_weight_sum) * 100.0
    else:
        composite_score = 0.0

    return composite_score, feature_scores


def compute_all_scores(df, model_name, custom_weights=None):
    """
    Computes scores and parameter breakdowns for an entire DataFrame.
    Returns the dataframe with:
    - 'score': Composite Planetary Similarity Index (0-100)
    - 's_temp', 's_rain', 's_humidity', 's_sun', 's_slope', 's_relief': Individual % similarities
    """
    df = df.copy()
    scores = []
    feat_breakdown = {f"s_{k}": [] for k in PLANETARY_MODELS[model_name]["targets"]}

    for _, row in df.iterrows():
        comp_score, feat_scores = score_location(row, model_name, custom_weights)
        scores.append(comp_score)
        for k in feat_breakdown:
            feat_name = k.replace("s_", "")
            feat_breakdown[k].append(feat_scores.get(feat_name, np.nan))

    df["score"] = scores
    for k, vals in feat_breakdown.items():
        df[k] = vals

    return df


# =============================================================================
# VERIFICATION UNIT TESTS
# =============================================================================
if __name__ == "__main__":
    print("Running PASM Mathematical Verification Tests...")
    
    # Test Case 1: Exact Match to Mars Target must equal 100.0%
    mars_target = PLANETARY_MODELS["Mars (Global Average Surface)"]["targets"]
    test_row_perfect = pd.Series(mars_target)
    score_perfect, breakdown_perfect = score_location(test_row_perfect, "Mars (Global Average Surface)")
    assert abs(score_perfect - 100.0) < 1e-6, f"Expected 100.0, got {score_perfect}"
    print("[PASS] Test 1: Perfect match to Mars target yields 100.0%")
    
    # Test Case 2: Exact Match to Moon Target must equal 100.0%
    moon_target = PLANETARY_MODELS["Moon (Sunlit South Pole - Artemis Zone)"]["targets"]
    test_row_moon = pd.Series(moon_target)
    score_moon, breakdown_moon = score_location(test_row_moon, "Moon (Sunlit South Pole - Artemis Zone)")
    assert abs(score_moon - 100.0) < 1e-6, f"Expected 100.0, got {score_moon}"
    print("[PASS] Test 2: Perfect match to Moon target yields 100.0%")
    
    # Test Case 3: Sample Independence Proof
    row_atacama = pd.Series({"temp": 14.51, "rain": 0.03, "humidity": 24.88, "sun": 7.2, "slope": 4.65, "relief": 267.0})
    s1, _ = score_location(row_atacama, "Mars (Global Average Surface)")
    
    # Adding arbitrary other rows to a dataframe should NOT change Atacama's score
    df_sample1 = pd.DataFrame([row_atacama, pd.Series({"temp": 40.0, "rain": 10.0, "humidity": 90.0, "sun": 2.0, "slope": 20.0, "relief": 500.0})])
    df_sample2 = pd.DataFrame([row_atacama, pd.Series({"temp": -80.0, "rain": 0.0, "humidity": 5.0, "sun": 1.0, "slope": 1.0, "relief": 10.0})])
    
    res1 = compute_all_scores(df_sample1, "Mars (Global Average Surface)")
    res2 = compute_all_scores(df_sample2, "Mars (Global Average Surface)")
    assert abs(res1.loc[0, "score"] - s1) < 1e-6
    assert abs(res2.loc[0, "score"] - s1) < 1e-6
    print(f"[PASS] Test 3: Site Independence verified. Atacama score is invariant at {s1:.2f}% across different sample sets.")
    
    print("All mathematical validation tests passed successfully!")
