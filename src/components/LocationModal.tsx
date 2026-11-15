import { useEffect, useMemo, useRef } from "react";
import {
  X,
  Mountain,
  Thermometer,
  Sun,
  Droplets,
  Wind,
  Layers,
  MapPin,
  ExternalLink,
  Download,
  Share2,
} from "lucide-react";
import type { AnalogSite, AnalogMode } from "../types";
import { PLANETARY_MODELS } from "../data/planetaryModels";

interface LocationModalProps {
  site: AnalogSite | null;
  mode: AnalogMode;
  onClose: () => void;
}

function MetricBar({
  label,
  value,
  measuredValue,
  targetValue,
  unit,
  icon,
}: {
  label: string;
  value: number;
  measuredValue: number;
  targetValue: number;
  unit: string;
  icon: React.ReactNode;
}) {
  const delta = measuredValue - targetValue;
  const deltaFormatted = delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);

  return (
    <div className="rounded-xl p-3 bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-white/70">
          <span style={{ color: "var(--color-accent)" }}>{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-white/40">
            {measuredValue} {unit} (Δ {deltaFormatted})
          </span>
          <span
            className="text-xs font-bold font-mono"
            style={{ color: "var(--color-accent)" }}
          >
            {value.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.max(2, Math.min(100, value))}%`,
            background: "var(--color-accent)",
            boxShadow: "0 0 10px var(--color-accent-glow)",
          }}
        />
      </div>
    </div>
  );
}

// Topographic Relief Map with contour lines and crosshairs
function TopoMap({ site }: { site: AnalogSite }) {
  const grid = site.topography;
  const rows = grid.length;
  const cols = grid[0].length;
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  const colorForHeight = (h: number) => {
    const t = Math.max(0, Math.min(1, h));
    // smooth shade from deep obsidian to accent color
    const r = Math.round(8 + t * 40);
    const g = Math.round(14 + t * 90);
    const b = Math.round(28 + t * 140);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden aspect-square border border-white/10"
      style={{ background: "#060A14" }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full block">
        {/* Heightmap matrix */}
        {grid.map((row, i) =>
          row.map((h, j) => (
            <rect
              key={`${i}-${j}`}
              x={j * cellW}
              y={i * cellH}
              width={cellW + 0.4}
              height={cellH + 0.4}
              fill={colorForHeight(h)}
            />
          ))
        )}

        {/* Contour lines overlay */}
        {[0.2, 0.4, 0.6, 0.8].map((lvl, li) => (
          <g key={li} stroke="rgba(255,255,255,0.2)" strokeWidth={0.3} fill="none">
            {grid.map((row, i) =>
              row.map((h, j) => {
                if (Math.abs(h - lvl) > 0.045) return null;
                return (
                  <rect
                    key={`c-${li}-${i}-${j}`}
                    x={j * cellW}
                    y={i * cellH}
                    width={cellW}
                    height={cellH}
                  />
                );
              })
            )}
          </g>
        ))}

        {/* Center Target Marker */}
        <circle cx="50" cy="50" r="1.5" fill="var(--color-accent)" />
        <circle
          cx="50"
          cy="50"
          r="3.5"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="0.4"
          opacity="0.8"
        />
      </svg>

      {/* Crosshair telemetry lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/15" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/15" />
        <div className="absolute top-2 left-2 text-[9px] font-mono uppercase text-white/50 bg-black/60 px-1.5 py-0.5 rounded">
          ASTER DEM 30m • Slope {site.slope.toFixed(1)}°
        </div>
      </div>
    </div>
  );
}

// Elevation Profile (center transect across topography)
function ElevationProfile({ site }: { site: AnalogSite }) {
  const midRow = Math.floor(site.topography.length / 2);
  const data = site.topography[midRow];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const path = useMemo(() => {
    const w = 100;
    const h = 100;
    const step = w / (data.length - 1);
    return data
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * h * 0.75 - 12;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [data, min, range]);

  const areaPath = `${path} L100,100 L0,100 Z`;

  return (
    <div className="w-full aspect-[3/1] relative">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#elevGrad)" />
        <path
          d={path}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute top-1 left-2 text-[9px] font-mono text-white/40">
        Relief: {site.relief.toFixed(0)}m
      </div>
      <div className="absolute bottom-1 right-2 text-[9px] font-mono text-white/40">
        Transect: 1.1 km
      </div>
    </div>
  );
}

// Composite Circular Score Gauge
function CompositeScoreRing({ score }: { score: number }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <div className="flex items-center gap-4 rounded-xl p-3 bg-white/[0.03] border border-white/10">
      <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90">
        <circle
          cx="38"
          cy="38"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="5"
        />
        <circle
          cx="38"
          cy="38"
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            filter: "drop-shadow(0 0 6px var(--color-accent-glow))",
            transition: "stroke-dashoffset 0.8s ease",
          }}
        />
      </svg>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-mono">
          Composite PASM Score
        </div>
        <div
          className="text-2xl font-black font-mono"
          style={{ color: "var(--color-accent)" }}
        >
          {score.toFixed(1)}
          <span className="text-sm font-normal text-white/50"> / 100%</span>
        </div>
        <div className="text-[11px] text-white/60">
          Gaussian Envelope Physical Match
        </div>
      </div>
    </div>
  );
}

export default function LocationModal({ site, mode, onClose }: LocationModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const activeModel = PLANETARY_MODELS[mode];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (site) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [site, onClose]);

  if (!site) return null;

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(site, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `${site.id}_planetary_analog_dossier.json`);
    dl.click();
  };

  const isPakistan = site.region === "Pakistan";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{
        background: "rgba(2,4,10,0.85)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="animate-modal-in relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl my-auto"
        style={{
          background: "var(--color-surface-strong)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 0 80px -15px var(--color-accent-glow)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Header */}
        <div
          className="sticky top-0 z-20 flex items-start justify-between p-5 sm:p-7 pb-4 backdrop-blur-xl"
          style={{
            background: "linear-gradient(180deg, var(--color-surface-strong) 80%, transparent)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: isPakistan
                    ? "rgba(16,185,129,0.2)"
                    : "rgba(59,130,246,0.2)",
                  color: isPakistan ? "#34D399" : "#60A5FA",
                  border: isPakistan
                    ? "1px solid rgba(52,211,153,0.4)"
                    : "1px solid rgba(96,165,250,0.4)",
                }}
              >
                <MapPin className="w-3 h-3" />
                {site.region === "Pakistan" ? "Pakistan Candidate Site" : site.country}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white/70 bg-white/5 border border-white/10 uppercase">
                {site.category}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white/70 bg-white/5 border border-white/10 uppercase">
                {site.targetAffinity} Analog
              </span>

              {site.rank && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30">
                  Global Rank #{site.rank}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {site.name}
            </h2>
            <div className="text-xs text-white/50 mt-1 flex items-center gap-3">
              <span>Coordinates: {site.lat.toFixed(2)}°N, {site.lng.toFixed(2)}°E</span>
              <span>•</span>
              <span>Elevation: {site.elevation.toFixed(0)} m</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              title="Download Site Dossier JSON"
              className="p-2 rounded-xl text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Topographic DEM map & transect */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-2">
                ASTER 30m Global DEM Relief
              </div>
              <TopoMap site={site} />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-2">
                Center Transect Elevation Profile
              </div>
              <div className="rounded-xl p-3 bg-white/[0.02] border border-white/10">
                <ElevationProfile site={site} />
              </div>
            </div>

            {/* Quick Telemetry Metric Tiles */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl p-2.5 bg-white/[0.03] border border-white/10">
                <div className="text-[9px] uppercase tracking-wider text-white/40">Air Temp</div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">
                  {site.temp.toFixed(1)}°C
                </div>
              </div>
              <div className="rounded-xl p-2.5 bg-white/[0.03] border border-white/10">
                <div className="text-[9px] uppercase tracking-wider text-white/40">Rain</div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">
                  {site.rain.toFixed(2)} mm
                </div>
              </div>
              <div className="rounded-xl p-2.5 bg-white/[0.03] border border-white/10">
                <div className="text-[9px] uppercase tracking-wider text-white/40">Slope</div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">
                  {site.slope.toFixed(1)}°
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Planetary Match Breakdown & NASA Scientific Rationale */}
          <div className="lg:col-span-7 space-y-5">
            {/* Composite Score Progress */}
            <CompositeScoreRing score={site.score || 0} />

            {/* Scientific Planetary Rationale Box */}
            <div
              className="rounded-2xl p-4 text-xs leading-relaxed"
              style={{
                background: "rgba(14,22,38,0.7)",
                borderLeft: "4px solid var(--color-accent)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="font-bold text-white mb-1 uppercase tracking-wide text-[10px]">
                Planetary Analog Scientific Rationale
              </div>
              <p className="text-white/85 mb-3 leading-relaxed">
                {site.scientificReason}
              </p>
              <div className="font-bold text-white/70 mb-1 uppercase tracking-wide text-[10px]">
                Geological Summary
              </div>
              <p className="text-white/70 mb-3 leading-relaxed">
                {site.geologicalSummary}
              </p>
              <div className="text-[11px] text-white/40 border-t border-white/10 pt-2 flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3 text-cyan-400" />
                <span>Reference: {site.citation}</span>
              </div>
            </div>

            {/* Primary Features Tags */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-2">
                Key Geomorphological Features
              </div>
              <div className="flex flex-wrap gap-1.5">
                {site.primaryFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-white/80"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* 6-Parameter PASM Gaussian Breakdown */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40 mb-2.5">
                PASM Parameter Match Decomposition
              </div>
              <div className="space-y-2">
                <MetricBar
                  label="Surface Temperature (T2M)"
                  value={site.featureScores?.temp || 0}
                  measuredValue={site.temp}
                  targetValue={activeModel.targets.temp}
                  unit="°C"
                  icon={<Thermometer className="w-3.5 h-3.5" />}
                />
                <MetricBar
                  label="Liquid Precipitation (Aridity)"
                  value={site.featureScores?.rain || 0}
                  measuredValue={site.rain}
                  targetValue={activeModel.targets.rain}
                  unit="mm/d"
                  icon={<Droplets className="w-3.5 h-3.5" />}
                />
                <MetricBar
                  label="Relative Humidity (Dry Air)"
                  value={site.featureScores?.humidity || 0}
                  measuredValue={site.humidity}
                  targetValue={activeModel.targets.humidity}
                  unit="%"
                  icon={<Wind className="w-3.5 h-3.5" />}
                />
                <MetricBar
                  label="Solar Insolation Incident (ALLSKY)"
                  value={site.featureScores?.sun || 0}
                  measuredValue={site.sun}
                  targetValue={activeModel.targets.sun}
                  unit="kWh/m²"
                  icon={<Sun className="w-3.5 h-3.5" />}
                />
                <MetricBar
                  label="Terrain Slope (ASTER DEM)"
                  value={site.featureScores?.slope || 0}
                  measuredValue={site.slope}
                  targetValue={activeModel.targets.slope}
                  unit="°"
                  icon={<Mountain className="w-3.5 h-3.5" />}
                />
                <MetricBar
                  label="Local Relief / Roughness (ASTER DEM)"
                  value={site.featureScores?.relief || 0}
                  measuredValue={site.relief}
                  targetValue={activeModel.targets.relief}
                  unit="m"
                  icon={<Layers className="w-3.5 h-3.5" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="px-5 sm:px-7 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/40 border-t border-white/10"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <span>NASA Space Apps Challenge 2026 • Earth Analog Finder</span>
          <span>Source: NASA POWER 30-Yr Climatology & ASTER GDEM 30m</span>
        </div>
      </div>
    </div>
  );
}
