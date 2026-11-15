import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Header from "./components/Header";
import HeroOrbitals from "./components/HeroOrbitals";
import EarthGlobe from "./components/EarthGlobe";
import LocationModal from "./components/LocationModal";
import PakistanExplorer from "./components/PakistanExplorer";
import GlobalExplorer from "./components/GlobalExplorer";
import CompareSites from "./components/CompareSites";
import WeightsConsole from "./components/WeightsConsole";
import TelemetryTable from "./components/TelemetryTable";
import ScientificDocs from "./components/ScientificDocs";

import { rawAnalogSites } from "./data/analogSites";
import { PLANETARY_MODELS } from "./data/planetaryModels";
import { computeAllScores } from "./engine/pasmEngine";
import type { AnalogMode, AnalogSite, ParameterBreakdown } from "./types";

export default function App() {
  const [mode, setMode] = useState<AnalogMode>("moon");
  const [selectedSite, setSelectedSite] = useState<AnalogSite | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");

  // Dynamic weights initialized from model defaults
  const [customWeights, setCustomWeights] = useState<ParameterBreakdown>(
    PLANETARY_MODELS[mode].defaultWeights
  );

  // Globe DOM ref
  const globeRef = useRef<HTMLElement>(null);

  // Sync weights when mode changes
  const handleModeChange = useCallback((newMode: AnalogMode) => {
    setMode(newMode);
    setCustomWeights(PLANETARY_MODELS[newMode].defaultWeights);
  }, []);

  // Set theme class on root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-mars");
    if (mode === "mars") {
      root.classList.add("theme-mars");
    }
  }, [mode]);

  // Compute all scores dynamically with PASM engine
  const scoredSites = useMemo(() => {
    return computeAllScores(rawAnalogSites, mode, customWeights);
  }, [mode, customWeights]);

  const pkSites = useMemo(
    () => scoredSites.filter((s) => s.region === "Pakistan"),
    [scoredSites]
  );

  const intlSites = useMemo(
    () => scoredSites.filter((s) => s.region === "International"),
    [scoredSites]
  );

  // Navigation handler - switches active page and scrolls to top!
  const handleNavigate = useCallback((sectionId: string) => {
    const canonical = sectionId === "hero" ? "overview" : sectionId;
    if (canonical === "globe") {
      setActiveSection("globe");
      setTimeout(() => {
        globeRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 60);
      return;
    }
    setActiveSection(canonical);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fly to location on 3D globe
  const handleFlyToGlobe = useCallback((site: AnalogSite) => {
    setActiveSection("globe");
    setTimeout(() => {
      globeRef.current?.scrollIntoView({ behavior: "smooth" });
      setSelectedSite(site);
    }, 150);
  }, []);

  // Sync active nav item between Overview and 3D Globe based on scroll position
  useEffect(() => {
    if (activeSection !== "overview" && activeSection !== "globe") return;
    const handleScroll = () => {
      if (globeRef.current) {
        const rect = globeRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom > 100) {
          setActiveSection("globe");
        } else {
          setActiveSection("overview");
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const handleChangeWeight = useCallback(
    (key: keyof ParameterBreakdown, val: number) => {
      setCustomWeights((prev) => ({
        ...prev,
        [key]: val,
      }));
    },
    []
  );

  const handleResetWeights = useCallback(() => {
    setCustomWeights(PLANETARY_MODELS[mode].defaultWeights);
  }, [mode]);

  return (
    <div className={`min-h-screen text-slate-100 ${mode === "mars" ? "theme-mars" : ""}`}>
      {/* Top HUD Header */}
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        pakistanCount={pkSites.length}
        intlCount={intlSites.length}
      />

      {/* Main Single Page Tab Views (Uncrowded multi-page view container) */}
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        {(activeSection === "overview" || activeSection === "globe") && (
          <div id="overview-page">
            <HeroOrbitals
              mode={mode}
              totalSites={scoredSites.length}
              pkSites={pkSites}
              intlSites={intlSites}
              onExploreGlobe={() => {
                setActiveSection("globe");
                globeRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              onExplorePakistan={() => handleNavigate("pakistan")}
              onCompare={() => handleNavigate("compare")}
            />
            <EarthGlobe
              ref={globeRef}
              mode={mode}
              sites={scoredSites}
              selectedSite={selectedSite}
              onSiteClick={setSelectedSite}
              onExplorePakistan={() => handleNavigate("pakistan")}
            />
          </div>
        )}

        {activeSection === "pakistan" && (
          <PakistanExplorer
            mode={mode}
            sites={scoredSites}
            onSelectSite={setSelectedSite}
            onFlyToGlobe={handleFlyToGlobe}
          />
        )}

        {activeSection === "global" && (
          <GlobalExplorer
            mode={mode}
            sites={scoredSites}
            onSelectSite={setSelectedSite}
            onFlyToGlobe={handleFlyToGlobe}
          />
        )}

        {activeSection === "compare" && (
          <CompareSites
            mode={mode}
            sites={scoredSites}
            onSelectSite={setSelectedSite}
          />
        )}

        {activeSection === "weights" && (
          <WeightsConsole
            mode={mode}
            weights={customWeights}
            onChangeWeight={handleChangeWeight}
            onResetWeights={handleResetWeights}
          />
        )}

        {(activeSection === "data" || activeSection === "table") && (
          <TelemetryTable
            mode={mode}
            sites={scoredSites}
            onSelectSite={setSelectedSite}
          />
        )}

        {(activeSection === "science" || activeSection === "docs") && (
          <ScientificDocs mode={mode} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 text-center text-xs text-white/40 bg-black/40">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-white/70 font-semibold text-sm">
            <span>Earth Analog Finder</span>
            <span>•</span>
            <span style={{ color: "var(--color-accent)" }}>NASA Space Apps Challenge 2026</span>
          </div>
          <p className="leading-relaxed">
            Integrating 30-Year Climatology from the <strong>NASA POWER API</strong> and
            topographical metrics from the <strong>ASTER 30m Global DEM</strong> with the
            <strong>Planetary Analog Similarity Model (PASM)</strong>.
          </p>
          <div className="pt-3 text-[11px] text-white/30">
            Field sites verified via NASA Astrobiology Institute, Apollo/Artemis exploration training records, and Geological Survey of Pakistan literature.
          </div>
        </div>
      </footer>

      {/* Interactive Location Dossier Modal */}
      <LocationModal
        site={selectedSite}
        mode={mode}
        onClose={() => setSelectedSite(null)}
      />
    </div>
  );
}
