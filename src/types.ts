export type AnalogMode = "moon" | "mars";

export type RegionFilter = "all" | "pakistan" | "international";

export interface PlanetaryTargetModel {
  name: string;
  shortName: string;
  description: string;
  referenceSource: string;
  targets: {
    temp: number;
    rain: number;
    humidity: number;
    sun: number;
    slope: number;
    relief: number;
  };
  tolerances: {
    temp: number;
    rain: number;
    humidity: number;
    sun: number;
    slope: number;
    relief: number;
  };
  defaultWeights: {
    temp: number;
    rain: number;
    humidity: number;
    sun: number;
    slope: number;
    relief: number;
  };
}

export interface ParameterBreakdown {
  temp: number;
  rain: number;
  humidity: number;
  sun: number;
  slope: number;
  relief: number;
}

export interface AnalogSite {
  id: string;
  name: string;
  place: string;
  country: string;
  region: "Pakistan" | "International";
  lat: number;
  lng: number;
  elevation: number;
  temp: number;
  rain: number;
  humidity: number;
  sun: number;
  slope: number;
  relief: number;
  targetAffinity: "Mars" | "Moon" | "Both";
  category: "NASA Documented" | "Literature Supported";
  primaryFeatures: string[];
  geologicalSummary: string;
  scientificReason: string;
  citation: string;
  topography: number[][];
  // Dynamically computed by PASM engine:
  score?: number;
  featureScores?: ParameterBreakdown;
  rank?: number;
  regionalRank?: number;
}
