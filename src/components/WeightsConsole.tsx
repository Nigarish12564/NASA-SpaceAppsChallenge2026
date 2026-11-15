import { Sliders, RotateCcw, Info, CheckCircle2 } from "lucide-react";
import type { ParameterBreakdown, AnalogMode } from "../types";
import { PLANETARY_MODELS } from "../data/planetaryModels";

interface WeightsConsoleProps {
  mode: AnalogMode;
  weights: ParameterBreakdown;
  onChangeWeight: (key: keyof ParameterBreakdown, val: number) => void;
  onResetWeights: () => void;
}

export default function WeightsConsole({
  mode,
  weights,
  onChangeWeight,
  onResetWeights,
}: WeightsConsoleProps) {
  const model = PLANETARY_MODELS[mode];
  const defaults = model.defaultWeights;

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;

  const params: {
    key: keyof ParameterBreakdown;
    name: string;
    description: string;
    target: number;
    tolerance: number;
    unit: string;
  }[] = [
    {
      key: "temp",
      name: "Ambient Temperature (T2M)",
      description: "Thermal boundary matching planetary diurnal equilibrium",
      target: model.targets.temp,
      tolerance: model.tolerances.temp,
      unit: "°C",
    },
    {
      key: "rain",
      name: "Aridity (Zero Precipitation)",
      description: "Deficit of liquid rainfall replicating desiccated planetary vacuum/regolith",
      target: model.targets.rain,
      tolerance: model.tolerances.rain,
      unit: "mm/day",
    },
    {
      key: "humidity",
      name: "Atmospheric Moisture Deficit",
      description: "Low relative humidity representing absence of atmospheric water vapor",
      target: model.targets.humidity,
      tolerance: model.tolerances.humidity,
      unit: "%",
    },
    {
      key: "sun",
      name: "Solar Insolation Incident",
      description: "All-sky horizontal surface irradiance accounting for orbital distance",
      target: model.targets.sun,
      tolerance: model.tolerances.sun,
      unit: "kWh/m²/d",
    },
    {
      key: "slope",
      name: "Terrain Slope (ASTER DEM)",
      description: "Surface grade determining rover chassis mobility & stability",
      target: model.targets.slope,
      tolerance: model.tolerances.slope,
      unit: "degrees",
    },
    {
      key: "relief",
      name: "Local Topographical Relief",
      description: "1-km elevation roughness modeling crater and plain undulations",
      target: model.targets.relief,
      tolerance: model.tolerances.relief,
      unit: "meters",
    },
  ];

  return (
    <section id="weights-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-mono mb-1 text-purple-400 font-bold">
            <Sliders className="w-4 h-4" />
            PASM Model Calibration Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Scientific Weight Tuning & Tolerances
          </h2>
          <p className="text-sm text-white/65 mt-1 max-w-2xl leading-relaxed">
            Customize the relative importance of environmental parameters in real time.
            All 35 analog scores across the 3D globe and tables recalculate dynamically.
          </p>
        </div>

        {/* Reset Button */}
        <button
          onClick={onResetWeights}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Model Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Grid */}
        <div className="lg:col-span-7 space-y-4">
          {params.map((p) => {
            const w = weights[p.key];
            const pct = Math.round((w / totalWeight) * 100);
            return (
              <div
                key={p.key}
                className="rounded-2xl p-4 backdrop-blur-xl transition-all"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {p.name}
                      <span className="text-[10px] font-mono font-normal text-white/40">
                        (Target: {p.target} {p.unit}, σ: {p.tolerance})
                      </span>
                    </div>
                    <div className="text-xs text-white/50 leading-relaxed">
                      {p.description}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold" style={{ color: "var(--color-accent)" }}>
                      {w.toFixed(2)}
                    </span>
                    <div className="text-[10px] font-mono text-white/40">
                      ({pct}% weight)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={w}
                    onChange={(e) => onChangeWeight(p.key, parseFloat(e.target.value))}
                    className="flex-1 accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-white/10"
                  />
                  <span className="text-[11px] font-mono text-white/30 min-w-[36px]">
                    Def: {defaults[p.key].toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Mathematical Explanation HUD */}
        <div className="lg:col-span-5 space-y-5">
          <div
            className="rounded-3xl p-6 backdrop-blur-xl"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-3">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Gaussian Tolerance Envelopes (PASM)</span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Unlike MinMax normalization that distorts scores whenever candidate sites
              are added or removed, PASM evaluates each terrestrial site against
              absolute physical planetary envelopes:
            </p>

            {/* Formula Block */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-cyan-300 leading-relaxed mb-4">
              <div className="text-white/40 text-[10px] uppercase mb-1">
                Single-Parameter Similarity:
              </div>
              s_k(x_k) = exp( - 0.5 * ((x_k - T_k) / σ_k)² )
              <div className="text-white/40 text-[10px] uppercase mt-3 mb-1">
                Composite Score:
              </div>
              S(x) = 100 * ( Σ w_k · s_k(x_k) ) / ( Σ w_k )
            </div>

            <div className="space-y-2 text-xs text-white/75">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Perfect Match Guarantee:</strong> If an Earth site exactly
                  matches target planetary conditions, its score equals 100.0%.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Sample Invariance:</strong> Adding 100 new candidate sites causes
                  0.00% change in existing analog scores.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Tolerance Envelopes (σ):</strong> A deviation of 1σ yields
                  60.6% similarity; a deviation of 2σ yields 13.5%.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
