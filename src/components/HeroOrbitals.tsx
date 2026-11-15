import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ArrowDown, Compass, Globe2, Sparkles } from "lucide-react";
import type { AnalogMode, AnalogSite } from "../types";

// ---- Lightweight 2D canvas starfield ----
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let h = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const N = 260;
    const stars = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.5 + 0.3,
      tw: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.x += s.z * 0.1;
        if (s.x > w) s.x = 0;
        const tw = 0.55 + 0.45 * Math.sin(t * 2 + s.tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215,235,255,${tw * s.z})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ---- 3D solar system orbital simulation ----
const EARTH_TEX =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg";
const MOON_TEX =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg";
const MARS_TEX =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_color.jpg";

function useTexture(url: string) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let alive = true;
    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (alive) setTex(t);
      },
      undefined,
      () => {}
    );
    return () => {
      alive = false;
    };
  }, [url]);
  return tex;
}

function Earth({ tex }: { tex: THREE.Texture | null }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.16;
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={tex ?? undefined}
          emissive={"#0a1830"}
          emissiveIntensity={0.25}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* atmospheric glow */}
      <mesh scale={1.07}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={"#4a9eff"}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={7} />
    </group>
  );
}

function Orbiter({
  radius,
  speed,
  size,
  tex,
  tilt = 0,
  opacity = 1,
}: {
  radius: number;
  speed: number;
  size: number;
  tex: THREE.Texture | null;
  tilt?: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t) * radius,
        Math.sin(t) * radius * Math.sin(tilt),
        Math.sin(t) * radius * Math.cos(tilt)
      );
      ref.current.rotation.y += 0.02;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 48, 48]} />
      <meshStandardMaterial
        map={tex ?? undefined}
        roughness={0.9}
        metalness={0.05}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function OrbitRing({
  radius,
  color,
  tilt = 0,
}: {
  radius: number;
  color: string;
  tilt?: number;
}) {
  const obj = useMemo(() => {
    const seg = 128;
    const pts: number[] = [];
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pts.push(
        Math.cos(a) * radius,
        Math.sin(a) * radius * Math.sin(tilt),
        Math.sin(a) * radius * Math.cos(tilt)
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const m = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.28,
    });
    return new THREE.LineLoop(g, m);
  }, [radius, color, tilt]);
  return <primitive object={obj} />;
}

function SolarSystemScene() {
  const earthTex = useTexture(EARTH_TEX);
  const moonTex = useTexture(MOON_TEX);
  const marsTex = useTexture(MARS_TEX);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 3, 5]} intensity={1.8} color={"#fff8ea"} />
      <Earth tex={earthTex} />
      {/* Lunar Orbit */}
      <OrbitRing radius={2.2} color="#8cc6ff" tilt={0.08} />
      <Orbiter radius={2.2} speed={0.55} size={0.27} tex={moonTex} tilt={0.08} />
      {/* Martian Orbit */}
      <OrbitRing radius={4.2} color="#ff8a5c" tilt={0.12} />
      <Orbiter
        radius={4.2}
        speed={0.28}
        size={0.52}
        tex={marsTex}
        tilt={0.12}
        opacity={0.92}
      />
    </>
  );
}

interface HeroOrbitalsProps {
  mode: AnalogMode;
  totalSites: number;
  pkSites: AnalogSite[];
  intlSites: AnalogSite[];
  onExploreGlobe: () => void;
  onExplorePakistan: () => void;
  onCompare: () => void;
}

export default function HeroOrbitals({
  mode,
  totalSites,
  pkSites,
  intlSites,
  onExploreGlobe,
  onExplorePakistan,
  onCompare,
}: HeroOrbitalsProps) {
  const isMars = mode === "mars";
  const bestPk = pkSites[0];
  const bestIntl = intlSites[0];

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-cosmic pt-16">
      <Starfield />

      {/* Atmospheric Radial Glow Gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMars
            ? "radial-gradient(ellipse at 75% 45%, rgba(255,71,50,0.22), transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(120,35,18,0.28), transparent 60%)"
            : "radial-gradient(ellipse at 75% 45%, rgba(127,223,255,0.18), transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(20,50,90,0.2), transparent 60%)",
        }}
      />

      {/* 3D WebGL Solar System Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 2.0, 7.2], fov: 46 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SolarSystemScene />
        </Canvas>
      </div>

      {/* Mission Control HUD Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
            style={{
              background: "var(--color-accent-soft)",
              color: "var(--color-accent)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Sparkles className="w-3 h-3" />
            NASA Space Apps Challenge 2026
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-white/70 bg-white/5 border border-white/10">
            NASA POWER 30-Yr Climatology
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-white/70 bg-white/5 border border-white/10">
            ASTER 30m Global DEM
          </span>
        </div>

        {/* Hero Mission Copy & CTA */}
        <div className="max-w-2xl my-auto py-8">
          <div
            className="text-[11px] uppercase tracking-[0.3em] font-mono font-semibold mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            {isMars
              ? "Planetary Analog Similarity Model (PASM) • Martian Surface"
              : "Planetary Analog Similarity Model (PASM) • Lunar Artemis Polar"}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-8">
            Earth's most alien landscapes, mapped for{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: isMars
                  ? "linear-gradient(135deg, #ffffff 30%, #ff8a5c 100%)"
                  : "linear-gradient(135deg, #ffffff 30%, #7fdfff 100%)",
              }}
            >
              off-world science.
            </span>
          </h1>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreGlobe}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "var(--color-accent)",
                color: "#05070D",
                boxShadow: "0 0 24px -4px var(--color-accent-glow)",
              }}
            >
              <Globe2 className="w-4 h-4" />
              <span>Launch 3D Globe Explorer</span>
            </button>

            <button
              onClick={onExplorePakistan}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-white/90 bg-white/10 hover:bg-white/15 border border-white/15 transition-all duration-300"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>15 Pakistan Analogs</span>
            </button>

            <button
              onClick={onCompare}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm text-white/70 hover:text-white transition-colors"
            >
              <span>Multi-Site Compare</span>
              <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
            </button>
          </div>
        </div>

        {/* Live Mission KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
          <div
            className="rounded-xl p-3.5 backdrop-blur-md"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">
              Evaluated Catalog
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {totalSites} Sites
            </div>
            <div className="text-[11px] text-white/40">30-Yr Climatology</div>
          </div>

          <div
            className="rounded-xl p-3.5 backdrop-blur-md"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/80 mb-1">
              Pakistan Focus
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400">
              {pkSites.length} Sites
            </div>
            <div className="text-[11px] text-white/40">Balochistan • GB • Sindh</div>
          </div>

          <div
            className="rounded-xl p-3.5 backdrop-blur-md"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">
              Top Match (Pakistan)
            </div>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              {bestPk ? bestPk.name.split("(")[0].trim() : "—"}
            </div>
            <div className="text-[11px] font-semibold" style={{ color: "var(--color-accent)" }}>
              {bestPk ? `${bestPk.score?.toFixed(1)}% Similarity` : ""}
            </div>
          </div>

          <div
            className="rounded-xl p-3.5 backdrop-blur-md"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">
              Top Global Benchmark
            </div>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              {bestIntl ? bestIntl.name.split("(")[0].trim() : "—"}
            </div>
            <div className="text-[11px] font-semibold" style={{ color: "var(--color-accent)" }}>
              {bestIntl ? `${bestIntl.score?.toFixed(1)}% Similarity` : ""}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
