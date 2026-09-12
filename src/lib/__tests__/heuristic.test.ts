import { describe, it, expect } from "vitest";
import { computeRealitySignal } from "../heuristic";
import { Payload } from "../types";

describe("computeRealitySignal", () => {
  const basePayload: Payload = {
    schema_version: "1.0",
    timestamp: 1726123456,
    categories: {
      assets_utilities: 0,
      education: 0,
      employment_income: 0,
      health: 0,
      household_composition: 0,
      housing_conditions: 0,
    },
  };

  it("returns { score: 0, signal: 'none' } when all categories are unchanged", () => {
    const result = computeRealitySignal(basePayload);
    expect(result).toEqual({ score: 0, signal: "none" });
  });

  it("returns { score: 0, signal: 'none' } when all categories are improved", () => {
    const payload: Payload = {
      ...basePayload,
      categories: {
        assets_utilities: 1,
        education: 1,
        employment_income: 1,
        health: 1,
        household_composition: 1,
        housing_conditions: 1,
      },
    };
    const result = computeRealitySignal(payload);
    expect(result).toEqual({ score: 0, signal: "none" });
  });

  it("returns LOW for score 1 (one low-weight category worsened)", () => {
    // health weight is 1
    const payload: Payload = {
      ...basePayload,
      categories: { ...basePayload.categories, health: -1 },
    };
    const result = computeRealitySignal(payload);
    expect(result).toEqual({ score: 1, signal: "LOW" });
  });

  it("returns LOW for score 2", () => {
    // household_composition weight is 2
    const payload: Payload = {
      ...basePayload,
      categories: { ...basePayload.categories, household_composition: -1 },
    };
    const result = computeRealitySignal(payload);
    expect(result).toEqual({ score: 2, signal: "LOW" });
  });

  it("returns MEDIUM for score 3 (boundary)", () => {
    // employment_income weight is 3
    const payload: Payload = {
      ...basePayload,
      categories: { ...basePayload.categories, employment_income: -1 },
    };
    const result = computeRealitySignal(payload);
    expect(result).toEqual({ score: 3, signal: "MEDIUM" });
  });

  it("returns MEDIUM for score 4", () => {
    // employment_income (3) + health (1) = 4
    const payload: Payload = {
      ...basePayload,
      categories: {
        ...basePayload.categories,
        employment_income: -1,
        health: -1,
      },
    };
    const result = computeRealitySignal(payload);
    expect(result).toEqual({ score: 4, signal: "MEDIUM" });
  });

  it("returns MEDIUM for score 5", () => {
    // employment_income (3) + household_composition (2) = 5
    const payload: Payload = {
      ...basePayload,
      categories: {
        ...basePayload.categories,
        employment_income: -1,
        household_composition: -1,
      },
    };
    const result = computeRealitySignal(payload);
    expect(result).toEqual({ score: 5, signal: "MEDIUM" });
  });

  it("returns HIGH for score 6 (boundary)", () => {
    // employment_income (3) + household_composition (2) + health (1) = 6
    const payload: Payload = {
      ...basePayload,
      categories: {
        ...basePayload.categories,
        employment_income: -1,
        household_composition: -1,
        health: -1,
      },
    };
    const result = computeRealitySignal(payload);
    expect(result).toEqual({ score: 6, signal: "HIGH" });
  });

  it("returns HIGH for score 10 (all categories worsened)", () => {
    const payload: Payload = {
      ...basePayload,
      categories: {
        assets_utilities: -1,
        education: -1,
        employment_income: -1,
        health: -1,
        household_composition: -1,
        housing_conditions: -1,
      },
    };
    const result = computeRealitySignal(payload);
    expect(result).toEqual({ score: 10, signal: "HIGH" });
  });

  it("returns correct score for mixed Directional Indicators", () => {
    const payload: Payload = {
      ...basePayload,
      categories: {
        assets_utilities: 1, // improved: +0
        education: 0, // unchanged: +0
        employment_income: -1, // worsened: +3
        health: -1, // worsened: +1
        household_composition: 1, // improved: +0
        housing_conditions: 0, // unchanged: +0
      },
    };
    // Score should be 3 + 1 = 4 -> MEDIUM
    const result = computeRealitySignal(payload);
    expect(result).toEqual({ score: 4, signal: "MEDIUM" });
  });
});
