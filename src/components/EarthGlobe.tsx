import { useMemo, useRef, useState, useEffect, useCallback, forwardRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Globe2 } from "lucide-react";
import type { AnalogSite, AnalogMode, RegionFilter } from "../types";

const EARTH_DAY_TEX =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_BUMP_TEX =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg";
const EARTH_SPEC_TEX =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg";
const CLOUDS_TEX =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png";

function useTexture(url: string): THREE.Texture | null {
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

// Convert lat/lng to 3D Cartesian coordinates on sphere radius r
function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ---- Earth 3D Mesh with day/bump/roughness and cloud layer ----
function EarthMesh({
  selectedSite,
  zoomTargetRef,
}: {
  selectedSite?: AnalogSite | null;
  zoomTargetRef: React.MutableRefObject<{ lat: number; lng: number } | null>;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const day = useTexture(EARTH_DAY_TEX);
  const bump = useTexture(EARTH_BUMP_TEX);
  const spec = useTexture(EARTH_SPEC_TEX);
  const clouds = useTexture(CLOUDS_TEX);

  useFrame((_, dt) => {
    // gentle ambient rotation when modal is closed
    if (!selectedSite && !zoomTargetRef.current) {
      if (earthRef.current) earthRef.current.rotation.y += dt * 0.04;
      if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.055;
    }
  });

  return (
    <group>
      {/* Base Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial
          map={day ?? undefined}
          bumpMap={bump ?? undefined}
          bumpScale={0.04}
          roughnessMap={spec ?? undefined}
          roughness={0.78}
          metalness={0.05}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef} scale={1.015}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={clouds ?? undefined}
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric Backside Blue Halo */}
      <mesh scale={1.18}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
          color="#5aa9ff"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
        />
      </mesh>

      <CameraZoomController selectedSite={selectedSite} zoomTargetRef={zoomTargetRef} />
    </group>
  );
}

const DEFAULT_CAM_POS = new THREE.Vector3(0, 0.6, 2.85);

// Smooth camera zoom controller: zooms in on pin click, zooms out to full globe on modal close
function CameraZoomController({
  selectedSite,
  zoomTargetRef,
}: {
  selectedSite?: AnalogSite | null;
  zoomTargetRef: React.MutableRefObject<{ lat: number; lng: number } | null>;
}) {
  const { camera } = useThree();
  const zooming = useRef(false);
  const zoomProgress = useRef(0);
  const startCam = useRef(new THREE.Vector3());
  const targetCam = useRef(new THREE.Vector3());
  const prevSiteRef = useRef<AnalogSite | null | undefined>(undefined);

  useEffect(() => {
    if (selectedSite) {
      // Zoom in to site coordinates
      const target = latLngToVec3(selectedSite.lat, selectedSite.lng, 1);
      const dir = target.clone().normalize();
      startCam.current.copy(camera.position);
      targetCam.current.copy(dir.multiplyScalar(1.85)); // zoom in close
      zooming.current = true;
      zoomProgress.current = 0;
    } else if (prevSiteRef.current !== undefined && prevSiteRef.current !== null && !selectedSite) {
      // Modal closed: zoom back out to original full globe perspective
      zoomTargetRef.current = null;
      startCam.current.copy(camera.position);
      targetCam.current.copy(DEFAULT_CAM_POS);
      zooming.current = true;
      zoomProgress.current = 0;
    }
    prevSiteRef.current = selectedSite;
  }, [selectedSite, camera, zoomTargetRef]);

  useFrame(() => {
    if (zooming.current) {
      zoomProgress.current = Math.min(1, zoomProgress.current + 0.016);
      const p = easeInOutCubic(zoomProgress.current);
      camera.position.lerpVectors(startCam.current, targetCam.current, p);
      camera.lookAt(0, 0, 0);
      if (zoomProgress.current >= 1) {
        zooming.current = false;
      }
    }
  });

  return null;
}

// ---- Glowing 3D Location Pin on the Globe ----
function GlobePin({
  site,
  onClick,
  accentColor,
}: {
  site: AnalogSite;
  onClick: (s: AnalogSite) => void;
  accentColor: string;
}) {
  const pos = useMemo(() => latLngToVec3(site.lat, site.lng, 1.018), [site.lat, site.lng]);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const isPakistan = site.region === "Pakistan";
  const pinColor = isPakistan ? "#34D399" : accentColor;

  useFrame((state) => {
    if (ringRef.current) {
      const s = 1 + 0.45 * Math.sin(state.clock.elapsedTime * 3.5 + site.lat);
      ringRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={pos}>
      {/* Central Solid Pin Sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(site);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[hovered ? 0.022 : 0.016, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#FFFFFF" : pinColor} />
      </mesh>

      {/* Pulsing Outer Halo Ring */}
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial
          color={pinColor}
          transparent
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Soft Glow Shell */}
      <mesh scale={1.5}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial
          color={pinColor}
          transparent
          opacity={hovered ? 0.25 : 0.12}
        />
      </mesh>
    </group>
  );
}

interface EarthGlobeProps {
  mode: AnalogMode;
  sites: AnalogSite[];
  selectedSite?: AnalogSite | null;
  onSiteClick: (site: AnalogSite) => void;
  onExplorePakistan?: () => void;
}

const EarthGlobe = forwardRef<HTMLElement, EarthGlobeProps>(function EarthGlobe(
  { mode, sites, selectedSite, onSiteClick },
  ref
) {
  const zoomTargetRef = useRef<{ lat: number; lng: number } | null>(null);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");

  const isMars = mode === "mars";
  const accentColor = isMars ? "#ff4732" : "#7fdfff";

  // Filtered sites based on region tabs
  const filteredSites = useMemo(() => {
    return sites.filter((s) => {
      if (regionFilter === "pakistan" && s.region !== "Pakistan") return false;
      if (regionFilter === "international" && s.region !== "International") return false;
      return true;
    });
  }, [sites, regionFilter]);

  const handlePinClick = useCallback(
    (site: AnalogSite) => {
      zoomTargetRef.current = { lat: site.lat, lng: site.lng };
      onSiteClick(site);
    },
    [onSiteClick]
  );

  return (
    <section
      ref={ref}
      id="globe-section"
      className="relative w-full min-h-screen overflow-hidden py-16 flex flex-col items-center justify-center"
      style={{
        backgroundImage: isMars
          ? "radial-gradient(ellipse at 50% 50%, rgba(65, 22, 14, 0.6), #090405 82%)"
          : "radial-gradient(ellipse at 50% 50%, rgba(15,25,50,0.5), #05070D 80%)",
      }}
    >
      {/* Floating Header & Scope Controls */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-4">
        <div
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-mono font-bold mb-2"
          style={{ color: "var(--color-accent)" }}
        >
          <Globe2 className="w-3.5 h-3.5" />
          3D Planetary Analog Globe Explorer
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Global Planetary Analog Globe
        </h2>
        <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto mb-6">
          Rotate the floating Earth sphere. Click any pulsing location pin to zoom in and inspect its complete planetary analog dossier.
        </p>

        {/* Floating Scope Tabs */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-xs shadow-2xl">
          <button
            onClick={() => setRegionFilter("all")}
            className={`px-4 py-2 rounded-xl transition-all ${
              regionFilter === "all"
                ? "font-bold bg-white/15 text-white"
                : "font-medium text-white/60 hover:text-white"
            }`}
          >
            All 35 Sites
          </button>
          <button
            onClick={() => setRegionFilter("pakistan")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              regionFilter === "pakistan"
                ? "font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "font-medium text-white/60 hover:text-emerald-400"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Pakistan (15)
          </button>
          <button
            onClick={() => setRegionFilter("international")}
            className={`px-4 py-2 rounded-xl transition-all ${
              regionFilter === "international"
                ? "font-bold bg-white/15 text-white"
                : "font-medium text-white/60 hover:text-white"
            }`}
          >
            International (20)
          </button>
        </div>
      </div>

      {/* Completely Unconfined, Floating 3D Earth Globe Container */}
      <div className="relative z-10 w-full max-w-5xl h-[620px] sm:h-[720px] mx-auto flex items-center justify-center">
        {/* Soft atmospheric cosmic background glow */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: isMars
              ? "radial-gradient(circle, rgba(255,71,50,0.15) 0%, rgba(245,158,11,0.04) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(90,169,255,0.12) 0%, rgba(90,169,255,0.03) 50%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Floating canvas without confining borders, frames, or boxes */}
        <Canvas
          camera={{ position: [0, 0.6, 2.85], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 2, 4]} intensity={2.2} color="#fff6e8" />
          <directionalLight position={[-4, -1, -2]} intensity={0.4} color="#3a6aff" />

          <EarthMesh selectedSite={selectedSite} zoomTargetRef={zoomTargetRef} />

          {filteredSites.map((site) => (
            <GlobePin
              key={site.id}
              site={site}
              onClick={handlePinClick}
              accentColor={accentColor}
            />
          ))}
        </Canvas>

        {/* Subtle Floating Bottom Hint */}
        <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
          <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-white/40 bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            Drag to rotate sphere &bull; Click pin to zoom in
          </span>
        </div>
      </div>
    </section>
  );
});

export default EarthGlobe;
