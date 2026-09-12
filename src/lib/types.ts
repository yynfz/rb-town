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
