import type { AnalogSite, ParameterBreakdown, AnalogMode } from "../types";
import { PLANETARY_MODELS } from "../data/planetaryModels";

/**
 * Computes Gaussian tolerance similarity for a single physical feature:
 * s = exp( -0.5 * ((val - target) / tolerance)^2 )
 * Returns value in [0.0, 1.0].
 */
export function calculateFeatureSimilarity(
  val: number | null | undefined,
  target: number,
  tolerance: number
): number {
  if (val === null || val === undefined || isNaN(val)) {
    return 0;
  }
  const diff = (val - target) / tolerance;
  return Math.exp(-0.5 * (diff * diff));
}

/**
 * Scores a single site against the selected planetary model and weights.
 * Guarantees:
 * 1. Independent scoring (sample-invariant)
 * 2. Perfect match returns 100.0%
 * 3. Diagnostic parameter breakdown (0-100% per parameter)
 */
export function scoreSite(
  site: AnalogSite,
  mode: AnalogMode,
  customWeights?: Partial<ParameterBreakdown>
): { score: number; featureScores: ParameterBreakdown } {
  const model = PLANETARY_MODELS[mode];
  const targets = model.targets;
  const tolerances = model.tolerances;
  const weights = { ...model.defaultWeights, ...customWeights };

  const featureKeys: (keyof ParameterBreakdown)[] = [
    "temp",
    "rain",
    "humidity",
    "sun",
    "slope",
    "relief",
  ];

  const featureScores: ParameterBreakdown = {
    temp: 0,
    rain: 0,
    humidity: 0,
    sun: 0,
    slope: 0,
    relief: 0,
  };

  let weightedSum = 0;
  let activeWeightSum = 0;

  for (const k of featureKeys) {
    const val = site[k];
    if (val !== undefined && val !== null && !isNaN(val)) {
      const sim = calculateFeatureSimilarity(val, targets[k], tolerances[k]);
      const w = weights[k] || 0;
      featureScores[k] = Math.round(sim * 1000) / 10; // 0.0 - 100.0%
      if (w > 0) {
        weightedSum += sim * w;
        activeWeightSum += w;
      }
    }
  }

  const compositeScore =
    activeWeightSum > 0
      ? Math.round((weightedSum / activeWeightSum) * 1000) / 10
      : 0;

  return { score: compositeScore, featureScores };
}

/**
 * Scores and ranks an entire array of analog sites.
 */
export function computeAllScores(
  sites: AnalogSite[],
  mode: AnalogMode,
  customWeights?: Partial<ParameterBreakdown>
): AnalogSite[] {
  const scored = sites.map((s) => {
    const res = scoreSite(s, mode, customWeights);
    return {
      ...s,
      score: res.score,
      featureScores: res.featureScores,
    };
  });

  // Global ranking
  scored.sort((a, b) => (b.score || 0) - (a.score || 0));
  scored.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  // Regional ranking
  const pkSites = scored.filter((s) => s.region === "Pakistan");
  pkSites.forEach((s, idx) => {
    s.regionalRank = idx + 1;
  });

  const intlSites = scored.filter((s) => s.region === "International");
  intlSites.forEach((s, idx) => {
    s.regionalRank = idx + 1;
  });

  return scored;
}
