import { DirectionalIndicator } from "./constants";

export interface Payload {
  schema_version: "1.0";
  timestamp: number;
  categories: {
    assets_utilities: DirectionalIndicator;
    education: DirectionalIndicator;
    employment_income: DirectionalIndicator;
    health: DirectionalIndicator;
    household_composition: DirectionalIndicator;
    housing_conditions: DirectionalIndicator;
  };
}

export interface CompletedSubmission {
  payload: Payload;
  signal: import("./constants").SignalLevel;
  regionCode: string;
}

export interface RegionDetail {
  totalSubmissions: number;
  bySignal: {
    none: number;
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
  byCategory: Record<
    import("./constants").Category,
    {
      worsened: number;
      unchanged: number;
      improved: number;
    }
  >;
}

export interface ObservatoryState {
  totalSubmissions: number;
  bySignal: {
    none: number;
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
  byCategory: Record<
    import("./constants").Category,
    {
      worsened: number;
      unchanged: number;
      improved: number;
    }
  >;
  byRegion: Record<string, number>;
  byRegionDetail?: Record<string, RegionDetail>;
}

