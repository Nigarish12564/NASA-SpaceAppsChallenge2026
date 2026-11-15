import { useState, useMemo } from "react";
import { GitCompare, Plus, X, Layers } from "lucide-react";
import type { AnalogSite, AnalogMode } from "../types";
import { PLANETARY_MODELS } from "../data/planetaryModels";

interface CompareSitesProps {
  mode: AnalogMode;
  sites: AnalogSite[];
  onSelectSite: (site: AnalogSite) => void;
}

const PALETTE_MOON = ["#7FDFFF", "#38BDF8", "#34D399", "#A78BFA"];
const PALETTE_MARS = ["#FF4732", "#F59E0B", "#FB7185", "#34D399"];

export default function CompareSites({
  mode,
  sites,
  onSelectSite,
}: CompareSitesProps) {
  const PALETTE = mode === "mars" ? PALETTE_MARS : PALETTE_MOON;
  const model = PLANETARY_MODELS[mode];
  const target = model.targets;

  // Defaults: 2 Pakistan sites + 2 International sites
  const defaultSelection = useMemo(() => {
    const pk = sites.filter((s) => s.region === "Pakistan").slice(0, 2);
    const intl = sites.filter((s) => s.region === "International").slice(0, 2);
    return [...pk, ...intl].map((s) => s.id);
  }, [sites]);

  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelection);

  const selectedSites = useMemo(() => {
    return sites.filter((s) => selectedIds.includes(s.id)).slice(0, 4);
  }, [sites, selectedIds]);

  const toggleSite = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((x) => x !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  // Dimensions for radar chart
  const feats: { key: keyof typeof target; label: string }[] = [
    { key: "temp", label: "Temperature" },
    { key: "rain", label: "Aridity" },
    { key: "humidity", label: "Dry Air" },
    { key: "sun", label: "Solar" },
    { key: "slope", label: "Slope" },
    { key: "relief", label: "Relief" },
  ];

  const radarRadius = 110;
  const radarCenter = 140;

  // Radar points helper
  const getCoords = (val: number, index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const r = (val / 100) * radarRadius;
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return { x, y };
  };

  return (
    <section id="compare-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-mono mb-1 text-amber-400 font-bold">
            <GitCompare className="w-4 h-4" />
            Planetary Target vs Candidate Analogs
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Multi-Site Comparative Radar Analysis
          </h2>
          <p className="text-sm text-white/65 mt-1 max-w-2xl leading-relaxed">
            Select up to 4 analog locations to benchmark simultaneously against the{" "}
            <strong className="text-white">{model.name}</strong> baseline.
          </p>
        </div>

        {/* Selected Counter */}
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70">
          Comparing <strong className="text-white">{selectedSites.length}</strong> / 4 Sites
        </div>
      </div>

      {/* Site Selector Pills */}
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.2em] font-mono text-white/40 mb-2">
          Select sites to compare (max 4):
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto no-scrollbar p-1">
          {sites.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            const isPk = s.region === "Pakistan";
            return (
              <button
                key={s.id}
                onClick={() => toggleSite(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 text-white border border-cyan-400 font-semibold"
                    : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: isPk ? "#34D399" : "#60A5FA" }}
                />
                <span>{s.name}</span>
                {isSelected ? (
                  <X className="w-3 h-3 text-cyan-400 ml-1" />
                ) : (
                  <Plus className="w-3 h-3 text-white/30 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Comparison Display: Left Radar Chart, Right Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Radar Chart (SVG) */}
        <div
          className="lg:col-span-6 rounded-3xl p-6 backdrop-blur-xl flex flex-col items-center justify-center"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              6-Axis PASM Similarity Radar
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              Target Envelope: 100% Boundary
            </span>
          </div>

          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            <svg
              viewBox={`0 0 ${radarCenter * 2} ${radarCenter * 2}`}
              className="w-full h-full block"
            >
              {/* Concentric Grid Rings */}
              {[25, 50, 75, 100].map((ring) => {
                const pts = feats
                  .map((_, i) => {
                    const c = getCoords(ring, i, feats.length);
                    return `${c.x},${c.y}`;
                  })
                  .join(" ");
                return (
                  <polygon
                    key={ring}
                    points={pts}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Axis Spoke Lines */}
              {feats.map((_, i) => {
                const c = getCoords(100, i, feats.length);
                return (
                  <line
                    key={i}
                    x1={radarCenter}
                    y1={radarCenter}
                    x2={c.x}
                    y2={c.y}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* 100% Target Boundary Line (White Dashed) */}
              <polygon
                points={feats
                  .map((_, i) => {
                    const c = getCoords(100, i, feats.length);
                    return `${c.x},${c.y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.8"
              />

              {/* Candidate Site Polygons */}
              {selectedSites.map((site, sIdx) => {
                const color = PALETTE[sIdx % PALETTE.length];
                const pts = feats
                  .map((f, i) => {
                    const val = site.featureScores?.[f.key] || 0;
                    const c = getCoords(val, i, feats.length);
                    return `${c.x},${c.y}`;
                  })
                  .join(" ");

                return (
                  <g key={site.id}>
                    <polygon
                      points={pts}
                      fill={color}
                      fillOpacity="0.18"
                      stroke={color}
                      strokeWidth="2"
                    />
                    {feats.map((f, i) => {
                      const val = site.featureScores?.[f.key] || 0;
                      const c = getCoords(val, i, feats.length);
                      return (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          r="3"
                          fill={color}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Axis Labels */}
              {feats.map((f, i) => {
                const c = getCoords(118, i, feats.length);
                return (
                  <text
                    key={i}
                    x={c.x}
                    y={c.y + 4}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.6)"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {f.label}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Radar Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10 w-full text-xs">
            <div className="flex items-center gap-1.5 text-white/80">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-white" />
              <span>Target Baseline</span>
            </div>
            {selectedSites.map((site, idx) => (
              <div key={site.id} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: PALETTE[idx % PALETTE.length] }}
                />
                <span className="text-white font-medium">{site.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Comparative Composite Match Bars */}
        <div
          className="lg:col-span-6 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Composite PASM Similarity
              </span>
              <span className="text-[10px] text-white/40 font-mono">
                Physical Tolerance Score
              </span>
            </div>

            <div className="space-y-4">
              {selectedSites.map((site, idx) => {
                const color = PALETTE[idx % PALETTE.length];
                const score = site.score || 0;
                return (
                  <div key={site.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: color }}
                        />
                        {site.name} ({site.region})
                      </span>
                      <span className="font-mono font-bold" style={{ color }}>
                        {score.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${score}%`,
                          background: color,
                          boxShadow: `0 0 10px ${color}66`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick takeaway note */}
          <div className="mt-6 p-4 rounded-2xl bg-black/30 border border-white/5 text-xs text-white/70 leading-relaxed">
            <strong className="text-white block mb-1">
              Diagnostic Multi-Dimensionality:
            </strong>
            No single Earth location perfectly mirrors Moon or Mars in all 6 dimensions.
            Sites that score extremely high in hyper-aridity (e.g. Atacama, Chagai) differ
            in ambient surface temperature, while high-altitude periglacial sites (e.g. Deosai,
            Dry Valleys) offer the closest thermal analogs.
          </div>
        </div>
      </div>

      {/* Telemetry Delta Matrix Table */}
      <div
        className="rounded-3xl p-6 backdrop-blur-xl overflow-x-auto"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Telemetry Delta Matrix (Site Values vs Planetary Target)
          </h4>
        </div>

        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 font-mono text-[11px]">
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Region</th>
              <th className="py-2.5 px-3">Match</th>
              <th className="py-2.5 px-3">Temp (T: {target.temp}°C)</th>
              <th className="py-2.5 px-3">Rain (T: {target.rain}mm)</th>
              <th className="py-2.5 px-3">Humidity (T: {target.humidity}%)</th>
              <th className="py-2.5 px-3">Solar (T: {target.sun}kWh)</th>
              <th className="py-2.5 px-3">Slope (T: {target.slope}°)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {selectedSites.map((s, idx) => {
              const color = PALETTE[idx % PALETTE.length];
              return (
                <tr key={s.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: color }}
                    />
                    {s.name}
                  </td>
                  <td className="py-3 px-3 text-white/60">{s.region}</td>
                  <td className="py-3 px-3 font-mono font-bold" style={{ color }}>
                    {s.score?.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono text-white/80">
                    {s.temp.toFixed(1)}°C{" "}
                    <span className="text-[10px] text-white/40">
                      (Δ {(s.temp - target.temp).toFixed(1)})
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-white/80">
                    {s.rain.toFixed(2)} mm{" "}
                    <span className="text-[10px] text-white/40">
                      (Δ {(s.rain - target.rain).toFixed(2)})
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-white/80">
                    {s.humidity.toFixed(0)}%
                  </td>
                  <td className="py-3 px-3 font-mono text-white/80">
                    {s.sun.toFixed(2)} kWh
                  </td>
                  <td className="py-3 px-3 font-mono text-white/80">
                    {s.slope.toFixed(1)}°
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
