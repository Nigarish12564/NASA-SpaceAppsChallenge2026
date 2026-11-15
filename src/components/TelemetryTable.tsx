import { useState, useMemo } from "react";
import { Table2, Download, Search, ArrowUpDown, MapPin, Eye } from "lucide-react";
import type { AnalogSite, AnalogMode } from "../types";

interface TelemetryTableProps {
  mode: AnalogMode;
  sites: AnalogSite[];
  onSelectSite: (site: AnalogSite) => void;
}

type SortField =
  | "rank"
  | "name"
  | "country"
  | "region"
  | "score"
  | "elevation"
  | "temp"
  | "rain"
  | "humidity"
  | "sun"
  | "slope"
  | "relief";

export default function TelemetryTable({
  mode,
  sites,
  onSelectSite,
}: TelemetryTableProps) {
  const [query, setQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<"all" | "Pakistan" | "International">("all");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filtered = useMemo(() => {
    return sites.filter((s) => {
      if (regionFilter !== "all" && s.region !== regionFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.primaryFeatures.some((f) => f.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [sites, regionFilter, query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: number | string = a[sortField as keyof AnalogSite] as any;
      let valB: number | string = b[sortField as keyof AnalogSite] as any;

      if (sortField === "rank") {
        valA = a.rank || 999;
        valB = b.rank || 999;
      }

      if (typeof valA === "string") {
        return sortAsc
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [filtered, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === "name" || field === "country" || field === "rank");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Rank",
      "Name",
      "Country",
      "Region",
      "Affinity",
      "Validation_Tier",
      "Similarity_Score_Pct",
      "Latitude",
      "Longitude",
      "Elevation_m",
      "Temp_2m_C",
      "Rain_mm_day",
      "Relative_Humidity_Pct",
      "Solar_Insolation_kWh_m2_day",
      "Slope_deg",
      "Relief_m",
      "Scientific_Rationale",
      "Citation",
    ];

    const rows = sorted.map((s) => [
      s.rank || "",
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.country.replace(/"/g, '""')}"`,
      s.region,
      s.targetAffinity,
      s.category,
      s.score?.toFixed(1) || "",
      s.lat,
      s.lng,
      s.elevation.toFixed(1),
      s.temp.toFixed(2),
      s.rain.toFixed(2),
      s.humidity.toFixed(1),
      s.sun.toFixed(4),
      s.slope.toFixed(2),
      s.relief.toFixed(1),
      `"${s.scientificReason.replace(/"/g, '""')}"`,
      `"${s.citation.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `earth_analog_${mode}_evaluated_dataset.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="data-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-mono mb-1 text-emerald-400 font-bold">
            <Table2 className="w-4 h-4" />
            Verified Scientific Telemetry Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Complete Evaluated Catalog & Dataset
          </h2>
          <p className="text-sm text-white/65 mt-1 max-w-2xl leading-relaxed">
            Examine verified 30-year climatological parameters from NASA POWER and
            ASTER GDEM topographical metrics across all 35 terrestrial analog sites.
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-white/90 shadow-lg transition-all hover:scale-105"
        >
          <Download className="w-4 h-4 text-black" />
          <span>Download Dataset (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="rounded-2xl p-4 mb-6 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          <button
            onClick={() => setRegionFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              regionFilter === "all"
                ? "bg-white/15 text-white font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            All 35 Sites
          </button>
          <button
            onClick={() => setRegionFilter("Pakistan")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              regionFilter === "Pakistan"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40"
                : "text-white/60 hover:text-emerald-400"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Pakistan (15)
          </button>
          <button
            onClick={() => setRegionFilter("International")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              regionFilter === "International"
                ? "bg-white/15 text-white font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            International (20)
          </button>
        </div>

        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search locations, countries, minerals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-black/40 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50"
          />
        </div>
      </div>

      {/* Main Table */}
      <div
        className="rounded-3xl backdrop-blur-xl overflow-hidden border border-white/10 shadow-2xl"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr
                className="border-b border-white/10 text-white/50 font-mono text-[11px] uppercase tracking-wider"
                style={{ background: "rgba(0,0,0,0.3)" }}
              >
                <th
                  onClick={() => handleSort("rank")}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>#</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Location</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("country")}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Country</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("score")}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>PASM Match</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("elevation")}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Elev (m)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("temp")}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Temp (°C)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("rain")}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Rain (mm/d)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("humidity")}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>RH (%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("sun")}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Solar (kWh)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("slope")}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Slope (°)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("relief")}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Relief (m)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {sorted.map((s) => {
                const isPk = s.region === "Pakistan";
                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectSite(s)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-bold text-white/50">
                      {s.rank}
                    </td>
                    <td className="py-3 px-3 font-sans font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: isPk ? "#34D399" : "#60A5FA" }}
                      />
                      <span>{s.name}</span>
                    </td>
                    <td className="py-3 px-3 font-sans text-white/60">
                      {s.country}
                    </td>
                    <td className="py-3 px-3 text-right font-bold" style={{ color: "var(--color-accent)" }}>
                      {s.score?.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-right text-white/75">
                      {s.elevation.toFixed(0)}
                    </td>
                    <td className="py-3 px-3 text-right text-white/75">
                      {s.temp.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right text-white/75">
                      {s.rain.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-white/75">
                      {s.humidity.toFixed(0)}
                    </td>
                    <td className="py-3 px-3 text-right text-white/75">
                      {s.sun.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-white/75">
                      {s.slope.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right text-white/75">
                      {s.relief.toFixed(0)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSite(s);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
