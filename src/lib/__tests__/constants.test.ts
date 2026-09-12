import { describe, it, expect } from "vitest";
import {
  CATEGORY_WEIGHTS,
  SIGNAL_THRESHOLDS,
  BPS_PROVINCES,
  CATEGORIES,
} from "../constants";

describe("CATEGORY_WEIGHTS", () => {
  it("has the six defined categories", () => {
    expect(Object.keys(CATEGORY_WEIGHTS).sort()).toEqual([
      "assets_utilities",
      "education",
      "employment_income",
      "health",
      "household_composition",
      "housing_conditions",
    ]);
  });

  it("assigns weight 3 to employment_income", () => {
    expect(CATEGORY_WEIGHTS.employment_income).toBe(3);
  });

  it("assigns weight 2 to household_composition", () => {
    expect(CATEGORY_WEIGHTS.household_composition).toBe(2);
  });

  it("assigns weight 2 to housing_conditions", () => {
    expect(CATEGORY_WEIGHTS.housing_conditions).toBe(2);
  });

  it("assigns weight 1 to assets_utilities", () => {
    expect(CATEGORY_WEIGHTS.assets_utilities).toBe(1);
  });

  it("assigns weight 1 to health", () => {
    expect(CATEGORY_WEIGHTS.health).toBe(1);
  });

  it("assigns weight 1 to education", () => {
    expect(CATEGORY_WEIGHTS.education).toBe(1);
  });

  it("has a maximum possible score of 10", () => {
    const max = Object.values(CATEGORY_WEIGHTS).reduce((s, w) => s + w, 0);
    expect(max).toBe(10);
  });
});

describe("SIGNAL_THRESHOLDS", () => {
  it("defines the none boundary at 0", () => {
    expect(SIGNAL_THRESHOLDS.none).toBe(0);
  });

  it("defines the LOW boundary at 1", () => {
    expect(SIGNAL_THRESHOLDS.LOW).toBe(1);
  });

  it("defines the MEDIUM boundary at 3", () => {
    expect(SIGNAL_THRESHOLDS.MEDIUM).toBe(3);
  });

  it("defines the HIGH boundary at 6", () => {
    expect(SIGNAL_THRESHOLDS.HIGH).toBe(6);
  });
});

describe("CATEGORIES", () => {
  it("lists all six category keys in alphabetical order", () => {
    expect(CATEGORIES).toEqual([
      "assets_utilities",
      "education",
      "employment_income",
      "health",
      "household_composition",
      "housing_conditions",
    ]);
  });
});

describe("BPS_PROVINCES", () => {
  it("contains exactly 38 provinces", () => {
    expect(BPS_PROVINCES).toHaveLength(38);
  });

  it("includes DKI Jakarta with code 31", () => {
    const jakarta = BPS_PROVINCES.find((p) => p.code === 31);
    expect(jakarta).toBeDefined();
    expect(jakarta?.name).toBe("DKI Jakarta");
  });

  it("includes Aceh with code 11", () => {
    const aceh = BPS_PROVINCES.find((p) => p.code === 11);
    expect(aceh).toBeDefined();
    expect(aceh?.name).toBe("Aceh");
  });

  it("encodes each province as a 0x-prefixed 8-hex-character bytes4 string", () => {
    for (const province of BPS_PROVINCES) {
      expect(province.bytes4).toMatch(/^0x[0-9a-f]{8}$/);
    }
  });

  it("encodes DKI Jakarta (code 31 = 0x1F) as 0x0000001f", () => {
    const jakarta = BPS_PROVINCES.find((p) => p.code === 31)!;
    expect(jakarta.bytes4).toBe("0x0000001f");
  });

  it("encodes Aceh (code 11 = 0x0B) as 0x0000000b", () => {
    const aceh = BPS_PROVINCES.find((p) => p.code === 11)!;
    expect(aceh.bytes4).toBe("0x0000000b");
  });

  it("has unique codes across all provinces", () => {
    const codes = BPS_PROVINCES.map((p) => p.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("has unique bytes4 values across all provinces", () => {
    const bytes4s = BPS_PROVINCES.map((p) => p.bytes4);
    expect(new Set(bytes4s).size).toBe(bytes4s.length);
  });
});
