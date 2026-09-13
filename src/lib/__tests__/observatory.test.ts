import { describe, it, expect } from "vitest";
import { applySubmission, emptyObservatoryState } from "../observatory";
import { CompletedSubmission } from "../types";

describe("emptyObservatoryState", () => {
  it("returns a valid zero state", () => {
    const state = emptyObservatoryState();
    expect(state.totalSubmissions).toBe(0);
    expect(state.bySignal).toEqual({ none: 0, LOW: 0, MEDIUM: 0, HIGH: 0 });
    expect(state.byRegion).toEqual({});

    const categories = [
      "assets_utilities",
      "education",
      "employment_income",
      "health",
      "household_composition",
      "housing_conditions",
    ] as const;

    categories.forEach((cat) => {
      expect(state.byCategory[cat]).toEqual({
        worsened: 0,
        unchanged: 0,
        improved: 0,
      });
    });
  });
});

describe("applySubmission", () => {
  const baseState = emptyObservatoryState();

  const submission1: CompletedSubmission = {
    regionCode: "31", // DKI Jakarta
    signal: "MEDIUM",
    payload: {
      schema_version: "1.0",
      timestamp: 123456789,
      categories: {
        assets_utilities: 0,
        education: 1, // improved
        employment_income: -1, // worsened
        health: 0,
        household_composition: -1, // worsened
        housing_conditions: 0,
      },
    },
  };

  const submission2: CompletedSubmission = {
    regionCode: "31", // DKI Jakarta again
    signal: "LOW",
    payload: {
      schema_version: "1.0",
      timestamp: 999999999,
      categories: {
        assets_utilities: 0,
        education: 0,
        employment_income: 0,
        health: -1, // worsened
        household_composition: 1, // improved
        housing_conditions: 0,
      },
    },
  };

  it("increments totalSubmissions by 1", () => {
    const nextState = applySubmission(baseState, submission1);
    expect(nextState.totalSubmissions).toBe(1);
  });

  it("increments the correct bySignal bucket", () => {
    const nextState = applySubmission(baseState, submission1);
    expect(nextState.bySignal.MEDIUM).toBe(1);
    expect(nextState.bySignal.none).toBe(0);
  });

  it("increments each category's worsened / unchanged / improved bucket correctly based on the payload", () => {
    const nextState = applySubmission(baseState, submission1);

    expect(nextState.byCategory.employment_income.worsened).toBe(1);
    expect(nextState.byCategory.household_composition.worsened).toBe(1);

    expect(nextState.byCategory.education.improved).toBe(1);

    expect(nextState.byCategory.assets_utilities.unchanged).toBe(1);
    expect(nextState.byCategory.health.unchanged).toBe(1);
    expect(nextState.byCategory.housing_conditions.unchanged).toBe(1);

    // Unaffected values should remain 0
    expect(nextState.byCategory.employment_income.improved).toBe(0);
    expect(nextState.byCategory.employment_income.unchanged).toBe(0);
  });

  it("increments or initializes the correct byRegion entry", () => {
    const state1 = applySubmission(baseState, submission1);
    expect(state1.byRegion["31"]).toBe(1);

    // Apply another submission in the same region
    const state2 = applySubmission(state1, submission2);
    expect(state2.byRegion["31"]).toBe(2);
    expect(Object.keys(state2.byRegion).length).toBe(1);
  });

  it("does not mutate the input state (immutability test)", () => {
    const originalState = emptyObservatoryState();
    // Deep clone to safely compare after the function call
    const clonedOriginal = JSON.parse(JSON.stringify(originalState));

    applySubmission(originalState, submission1);

    expect(originalState).toEqual(clonedOriginal);
  });

  it("accumulates state correctly across multiple submissions", () => {
    let state = baseState;
    state = applySubmission(state, submission1);
    state = applySubmission(state, submission2);

    expect(state.totalSubmissions).toBe(2);
    expect(state.bySignal.MEDIUM).toBe(1);
    expect(state.bySignal.LOW).toBe(1);

    expect(state.byCategory.employment_income.worsened).toBe(1);
    expect(state.byCategory.health.worsened).toBe(1);
    expect(state.byCategory.household_composition.worsened).toBe(1);
    expect(state.byCategory.household_composition.improved).toBe(1);

    expect(state.byRegion["31"]).toBe(2);
  });
});
