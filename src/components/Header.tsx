import React from "react";
import { Orbit, Moon, Compass, Globe2, GitCompare, Sliders, Table2, BookOpen } from "lucide-react";
import type { AnalogMode } from "../types";

interface HeaderProps {
  mode: AnalogMode;
  onModeChange: (mode: AnalogMode) => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  pakistanCount: number;
  intlCount: number;
}

export default function Header({
  mode,
  onModeChange,
  activeSection,
  onNavigate,
  pakistanCount,
  intlCount,
}: HeaderProps) {
  const isMars = mode === "mars";

  const navItems = [
    { id: "overview", label: "Overview", icon: Orbit },
    { id: "globe", label: "3D Globe", icon: Globe2 },
    { id: "pakistan", label: `Pakistan (${pakistanCount})`, icon: Compass },
    { id: "global", label: `Global (${intlCount})`, icon: Globe2 },
    { id: "compare", label: "Compare", icon: GitCompare },
    { id: "weights", label: "Weights & PASM", icon: Sliders },
    { id: "data", label: "Telemetry & CSV", icon: Table2 },
    { id: "science", label: "Methodology", icon: BookOpen },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      <div
        className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 backdrop-blur-xl"
        style={{
          background: "var(--color-surface-strong)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Branding & Logo */}
        <div
          onClick={() => onNavigate("overview")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div
            className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-transform duration-500 group-hover:scale-105"
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-accent-soft)",
            }}
          >
            <Orbit
              className="w-5 h-5 transition-transform duration-700 group-hover:rotate-180"
              style={{ color: "var(--color-accent)" }}
            />
            <span
              className="absolute inset-0 rounded-xl blur-md -z-10 transition-opacity duration-500"
              style={{ background: "var(--color-accent-glow)", opacity: 0.6 }}
            />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold tracking-wide text-white flex items-center gap-2">
              Earth Analog Finder
              <span
                className="text-[9px] uppercase px-2 py-0.5 rounded-full font-mono tracking-wider font-semibold"
                style={{
                  background: isMars ? "rgba(255,71,50,0.18)" : "rgba(127,223,255,0.18)",
                  color: "var(--color-accent)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {isMars ? "Mars Surface" : "Artemis Moon"}
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              NASA Space Apps Challenge 2026
            </div>
          </div>
        </div>

        {/* Center Navigation Links (Hidden on small screens) */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
                style={{
                  color: active ? "#FFFFFF" : "rgba(255,255,255,0.65)",
                  background: active ? "var(--color-accent-soft)" : "transparent",
                  border: active ? "1px solid var(--color-border)" : "1px solid transparent",
                  boxShadow: active ? "0 0 16px -2px var(--color-accent-glow)" : "none",
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: active ? "var(--color-accent)" : undefined }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Planetary Mode Selector */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{
            border: "1px solid var(--color-border)",
            background: "rgba(0,0,0,0.35)",
          }}
        >
          <button
            onClick={() => onModeChange("moon")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300"
            style={{
              background: !isMars ? "var(--color-accent-soft)" : "transparent",
              color: !isMars ? "var(--color-accent)" : "rgba(255,255,255,0.5)",
              boxShadow: !isMars ? "0 0 16px -2px var(--color-accent-glow)" : "none",
            }}
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Moon (Artemis)</span>
            <span className="sm:hidden">Moon</span>
          </button>
          <button
            onClick={() => onModeChange("mars")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300"
            style={{
              background: isMars ? "var(--color-accent-soft)" : "transparent",
              color: isMars ? "var(--color-accent)" : "rgba(255,255,255,0.5)",
              boxShadow: isMars ? "0 0 16px -2px var(--color-accent-glow)" : "none",
            }}
          >
            <span className="text-[12px]">🔴</span>
            <span className="hidden sm:inline">Mars (Global)</span>
            <span className="sm:hidden">Mars</span>
          </button>
        </div>
      </div>

      {/* Subnav for mobile / tablet devices */}
      <div
        className="flex xl:hidden items-center gap-1 px-4 py-2 overflow-x-auto no-scrollbar backdrop-blur-md"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium transition-all"
              style={{
                color: active ? "var(--color-accent)" : "rgba(255,255,255,0.65)",
                background: active ? "var(--color-accent-soft)" : "transparent",
              }}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
