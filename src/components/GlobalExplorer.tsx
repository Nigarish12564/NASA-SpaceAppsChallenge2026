import { useState } from "react";
import { Globe2, Eye, MapPin, Award, Mountain, Thermometer, Droplets } from "lucide-react";
import type { AnalogSite, AnalogMode } from "../types";

interface GlobalExplorerProps {
  mode: AnalogMode;
  sites: AnalogSite[];
  onSelectSite: (site: AnalogSite) => void;
  onFlyToGlobe: (site: AnalogSite) => void;
}

export default function GlobalExplorer({
  mode,
  sites,
  onSelectSite,
  onFlyToGlobe,
}: GlobalExplorerProps) {
  const [filterTarget, setFilterTarget] = useState<string>("all");

  const intlSites = sites
    .filter((s) => s.region === "International")
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const filtered = intlSites.filter((s) => {
    if (filterTarget === "all") return true;
    if (filterTarget === "mars") return s.targetAffinity === "Mars" || s.targetAffinity === "Both";
    if (filterTarget === "moon") return s.targetAffinity === "Moon" || s.targetAffinity === "Both";
    if (filterTarget === "nasa") return s.category === "NASA Documented";
    return true;
  });

  return (
    <section id="global-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-mono mb-1 text-cyan-400 font-bold">
            <Globe2 className="w-4 h-4" />
            International Planetary Analog Benchmarks
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            20 Canonically Documented Global Analogs
          </h2>
          <p className="text-sm text-white/65 mt-1 max-w-2xl leading-relaxed">
            Historical astronaut geology training sites from the Apollo & Artemis
            programs, peer-reviewed astrobiology field benchmarks, and NASA/ESA rover trials.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          {[
            { id: "all", label: "All 20 Global" },
            { id: "nasa", label: "NASA Documented (13)" },
            { id: "mars", label: "Mars Affinity" },
            { id: "moon", label: "Moon Affinity" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTarget(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterTarget === tab.id
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Global Site Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((site) => {
          const isNasaDoc = site.category === "NASA Documented";
          return (
            <div
              key={site.id}
              className="group rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      isNasaDoc
                        ? "text-blue-300 bg-blue-950/60 border border-blue-500/40"
                        : "text-white/70 bg-white/5 border border-white/10"
                    }`}
                  >
                    <Award className="w-3 h-3" />
                    {isNasaDoc ? "NASA Documented" : "Literature Supported"}
                  </span>

                  <span
                    className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full"
                    style={{
                      background: "var(--color-accent-soft)",
                      color: "var(--color-accent)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {site.score?.toFixed(1)}% Match
                  </span>
                </div>

                {/* Location Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {site.name}
                </h3>
                <div className="text-xs text-white/45 flex items-center gap-2 mt-0.5 mb-3 font-mono">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{site.country}</span>
                  <span>•</span>
                  <span>{site.lat.toFixed(2)}°, {site.lng.toFixed(2)}°</span>
                  <span>•</span>
                  <span>{site.elevation.toFixed(0)}m</span>
                </div>

                {/* Geological Summary */}
                <p className="text-xs text-white/70 leading-relaxed mb-4 line-clamp-3">
                  {site.scientificReason}
                </p>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {site.primaryFeatures.slice(0, 3).map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/5 text-white/60"
                    >
                      {f}
                    </span>
                  ))}
                  {site.primaryFeatures.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded text-white/30">
                      +{site.primaryFeatures.length - 3}
                    </span>
                  )}
                </div>

                {/* Quick Telemetry Bar */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-black/30 border border-white/5 text-[11px] mb-4">
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Thermometer className="w-3 h-3 text-cyan-400" />
                    <span>{site.temp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span>{site.rain.toFixed(2)} mm</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Mountain className="w-3 h-3 text-amber-400" />
                    <span>{site.slope.toFixed(1)}°</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => onSelectSite(site)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Dossier</span>
                </button>
                <button
                  onClick={() => onFlyToGlobe(site)}
                  title="Fly to location on 3D Globe"
                  className="p-2 rounded-xl text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 transition-all"
                >
                  <Globe2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
