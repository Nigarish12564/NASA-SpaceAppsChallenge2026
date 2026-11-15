import { BookOpen, ShieldCheck, AlertTriangle, Database, CheckCircle2 } from "lucide-react";
import type { AnalogMode } from "../types";

export default function ScientificDocs({ mode }: { mode: AnalogMode }) {
  return (
    <section id="science-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-mono mb-1 text-cyan-400 font-bold">
          <BookOpen className="w-4 h-4" />
          Transparency & Scientific Peer Review
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Planetary Analog Similarity Model (PASM) Methodology
        </h2>
        <p className="text-sm text-white/65 mt-1 max-w-2xl leading-relaxed">
          Rigorous physical envelope modeling ensuring sample invariance and exact mathematical reproducibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* Left Column: Mathematical Principles */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className="rounded-3xl p-6 backdrop-blur-xl"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Official NASA Formula Clarification</span>
            </h3>
            <p className="text-xs text-white/75 leading-relaxed mb-4">
              NASA does <strong>not</strong> mandate or publish a single universal scalar equation to score Earth-to-planetary similarity. While NASA documents qualitative criteria and mission-specific evaluation frameworks, scalar similarity indexes are mathematical modeling choices.
            </p>
            <p className="text-xs text-white/75 leading-relaxed">
              Standard sample-relative min-max scaling suffers from a critical flaw: adding or removing a site shifts every other site's score. To eliminate this distortion, PASM introduces <strong>physically bounded Gaussian tolerance envelopes</strong>.
            </p>
          </div>

          <div
            className="rounded-3xl p-6 backdrop-blur-xl"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <span>The PASM Gaussian Mathematical Formulation</span>
            </h3>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-cyan-300 leading-relaxed mb-4 space-y-2">
              <div>// Single-parameter physical envelope match:</div>
              <div className="text-white text-sm">
                s_k(x_k) = exp( - 0.5 * ((x_k - T_k) / σ_k)² )
              </div>
              <div className="pt-2">// Composite weighted planetary similarity index (0-100%):</div>
              <div className="text-white text-sm">
                S(x) = 100 * ( Σ w_k · s_k(x_k) ) / ( Σ w_k )
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/70">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <strong className="text-white block mb-0.5">x_k:</strong>
                Measured terrestrial parameter at site.
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <strong className="text-white block mb-0.5">T_k:</strong>
                Planetary physical target condition.
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <strong className="text-white block mb-0.5">σ_k:</strong>
                Scientific tolerance deviation envelope.
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <strong className="text-white block mb-0.5">w_k:</strong>
                Normalized parameter weight.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Data Sources & Limitations */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="rounded-3xl p-6 backdrop-blur-xl"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>Verified NASA Data Parameters</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-bold block">NASA POWER Climatology (T2M)</span>
                <span className="text-white/60">Air Temperature at 2m height (°C)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-bold block">NASA POWER Precipitation (PRECTOTCORR)</span>
                <span className="text-white/60">Corrected daily rainfall (mm/day)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-bold block">NASA POWER Relative Humidity (RH2M)</span>
                <span className="text-white/60">Atmospheric water vapor ratio (%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-bold block">NASA POWER Solar Insolation (ALLSKY)</span>
                <span className="text-white/60">Horizontal surface irradiance (kWh/m²/day)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white font-bold block">ASTER 30m Global DEM (Slope & Relief)</span>
                <span className="text-white/60">3x3 finite-difference slope (°) & 1-km relief (m)</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-3xl p-6 backdrop-blur-xl border border-amber-500/30"
            style={{ background: "rgba(30,20,10,0.5)" }}
          >
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Scientific Limitations & Planetary Disclosures</span>
            </h3>
            <ul className="space-y-2 text-xs text-white/70 list-disc list-inside leading-relaxed">
              <li>
                <strong>2m Air Temp vs Surface Skin Temp:</strong> The Moon has no air; on Mars, the 6 mbar atmosphere creates a 20-30°C thermal gradient between the soil and 2m air.
              </li>
              <li>
                <strong>Aridity vs Vacuum:</strong> Terrestrial hyper-aridity cannot replicate the absolute desiccating vacuum of space.
              </li>
              <li>
                <strong>Spatial Resolution:</strong> NASA POWER climatology spans ~50 km cells; microclimatic pockets (craters, caves) are averaged over this grid.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
