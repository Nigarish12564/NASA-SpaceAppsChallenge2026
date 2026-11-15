import type { PlanetaryTargetModel } from "../types";

export const PLANETARY_MODELS: Record<"mars" | "moon", PlanetaryTargetModel> = {
  mars: {
    name: "Mars (Global Average Surface)",
    shortName: "Mars Global Surface",
    description: "Represents mean Martian surface conditions across global volcanic and desert plains (Viking, Curiosity, Perseverance datasets).",
    referenceSource: "NASA Mars Fact Sheet & Mars Climate Database v6.1",
    targets: {
      temp: -59.0,      // Mean Martian surface air temperature (~214 K)
      rain: 0.0,        // Zero liquid precipitation (hyper-arid sublimation only)
      humidity: 0.0,    // Virtually dry atmosphere (~10 precipitable microns column water)
      sun: 3.5,         // Mean daily solar insolation at surface (accounting for 1.52 AU and dust optical depth)
      slope: 4.0,       // Traversable rover terrain (Jezero crater floor / Gale plains)
      relief: 50.0      // Local 1 km topographical relief (m)
    },
    tolerances: {
      temp: 35.0,       // Celsius deviation envelope (diurnal swing +20C noon to -125C night)
      rain: 1.2,        // mm/day: strict aridity envelope
      humidity: 25.0,   // %: dry air constraint
      sun: 2.5,         // kWh/m2/day: insolation envelope
      slope: 8.0,       // degrees: traversable terrain slope tolerance
      relief: 150.0     // meters: local relief envelope
    },
    defaultWeights: {
      temp: 0.22,
      rain: 0.23,
      humidity: 0.15,
      sun: 0.15,
      slope: 0.13,
      relief: 0.12
    }
  },
  moon: {
    name: "Moon (Sunlit South Pole - Artemis Zone)",
    shortName: "Lunar South Pole (Artemis)",
    description: "Represents sunlit crater rims near the Lunar South Pole (e.g., Shackleton crater rim, Malapert Mountain) targeted by NASA Artemis missions.",
    referenceSource: "LRO Diviner Lunar Radiometer Experiment (Mazarico et al. 2011, Paige et al. 2010)",
    targets: {
      temp: -53.0,      // Sunlit south polar rim equilibrium temperature (~220 K)
      rain: 0.0,        // Absolute vacuum (no liquid precipitation)
      humidity: 0.0,    // Zero atmospheric moisture
      sun: 0.9,         // Grazing polar solar irradiance (solar elevation angle < 1.5 degrees)
      slope: 5.0,       // Traversable lunar highland / polar crater rim slope
      relief: 60.0      // Local 1 km undulating regolith relief (m)
    },
    tolerances: {
      temp: 35.0,       // Celsius: polar thermal envelope
      rain: 1.0,        // mm/day: vacuum zero-precipitation constraint
      humidity: 20.0,   // %: vacuum zero-humidity constraint
      sun: 2.0,         // kWh/m2/day: grazing illumination envelope
      slope: 8.0,       // degrees: lunar regolith mobility tolerance
      relief: 150.0     // meters: local crater relief envelope
    },
    defaultWeights: {
      temp: 0.20,
      rain: 0.25,
      humidity: 0.15,
      sun: 0.20,
      slope: 0.10,
      relief: 0.10
    }
  }
};
