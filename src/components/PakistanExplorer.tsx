import { useState } from "react";
import { Compass, Eye, MapPin, Sparkles, Mountain, Thermometer, Droplets } from "lucide-react";
import type { AnalogSite, AnalogMode } from "../types";

interface PakistanExplorerProps {
  mode: AnalogMode;
  sites: AnalogSite[];
  onSelectSite: (site: AnalogSite) => void;
  onFlyToGlobe: (site: AnalogSite) => void;
}

export default function PakistanExplorer({
  mode,
  sites,
  onSelectSite,
  onFlyToGlobe,
}: PakistanExplorerProps) {
  const isMars = mode === "mars";
  const [provinceFilter, setProvinceFilter] = useState<string>("all");

  const pkSites = sites
    .filter((s) => s.region === "Pakistan")
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const filtered = pkSites.filter((s) => {
    if (provinceFilter === "all") return true;
    const desc = (s.scientificReason + s.geologicalSummary + s.citation).toLowerCase();
    if (provinceFilter === "balochistan") {
      return (
        desc.includes("balochistan") ||
        ["chagai", "kharan", "gwadar", "hingol", "quetta", "nok kundi"].some((k) =>
          s.name.toLowerCase().includes(k)
        )
      );
    }
    if (provinceFilter === "gb") {
      return (
        desc.includes("karakoram") ||
        desc.includes("himalaya") ||
        ["deosai", "skardu", "hunza", "khunjerab"].some((k) =>
          s.name.toLowerCase().includes(k)
        )
      );
    }
    if (provinceFilter === "sindh") {
      return (
        desc.includes("sindh") ||
        ["thar", "nara", "kirthar"].some((k) => s.name.toLowerCase().includes(k))
      );
    }
    if (provinceFilter === "punjab") {
      return (
        desc.includes("punjab") ||
        ["cholistan", "salt range"].some((k) => s.name.toLowerCase().includes(k))
      );
    }
    return true;
  });

  return (
    <section id="pakistan-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-mono mb-1 text-emerald-400 font-bold">
            <Compass className="w-4 h-4" />
            Pakistan Planetary Exploration Zone
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            15 Promising Analog Sites in Pakistan
          </h2>
          <p className="text-sm text-white/65 mt-1 max-w-2xl leading-relaxed">
            From the sub-zero permafrost of Deosai to the active methane-venting mud
            volcanoes of Hingol and hydrothermal solfataras of Chagai, Pakistan hosts
            premier terrestrial environments for off-world scientific preparation.
          </p>
        </div>

        {/* Province Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          {[
            { id: "all", label: "All (15)" },
            { id: "balochistan", label: "Balochistan (6)" },
            { id: "gb", label: "Gilgit-Baltistan (4)" },
            { id: "sindh", label: "Sindh (3)" },
            { id: "punjab", label: "Punjab (2)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProvinceFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                provinceFilter === tab.id
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Pakistan Site Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((site) => {
          return (
            <div
              key={site.id}
              className="group rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
              style={{
                background: "var(--color-surface)",
                border: "1px solid rgba(52,211,153,0.3)",
              }}
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 font-mono">
                    <Sparkles className="w-3 h-3" />
                    PK Rank #{site.regionalRank || site.rank}
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/10">
                      {site.targetAffinity} Analog
                    </span>
                    <span
                      className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full"
                      style={{
                        background: "rgba(52,211,153,0.15)",
                        color: "#34D399",
                        border: "1px solid rgba(52,211,153,0.3)",
                      }}
                    >
                      {site.score?.toFixed(1)}% Match
                    </span>
                  </div>
                </div>

                {/* Location Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {site.name}
                </h3>
                <div className="text-xs text-white/45 flex items-center gap-2 mt-0.5 mb-3 font-mono">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{site.lat.toFixed(2)}°N, {site.lng.toFixed(2)}°E</span>
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
                  className="p-2 rounded-xl text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-all"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
