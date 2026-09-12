// Category keys — all six fixed socioeconomic domains (alphabetical)
export const CATEGORIES = [
  "assets_utilities",
  "education",
  "employment_income",
  "health",
  "household_composition",
  "housing_conditions",
] as const;

export type Category = (typeof CATEGORIES)[number];

// Weights used in the Weighted Severity Score.
// Only worsened categories (-1) contribute; max possible score = 10.
// Source: docs/spec/mvp.md §3
export const CATEGORY_WEIGHTS: Record<Category, number> = {
  employment_income: 3,
  household_composition: 2,
  housing_conditions: 2,
  assets_utilities: 1,
  health: 1,
  education: 1,
};

// Minimum Weighted Severity Score to reach each Reality Signal level.
// Score 0 → no signal, 1–2 → LOW, 3–5 → MEDIUM, 6–10 → HIGH.
// Source: docs/spec/mvp.md §3
export const SIGNAL_THRESHOLDS = {
  none: 0,
  LOW: 1,
  MEDIUM: 3,
  HIGH: 6,
} as const;

export type SignalLevel = "none" | "LOW" | "MEDIUM" | "HIGH";

// Directional Indicator values
export const DIRECTIONAL = {
  WORSENED: -1,
  UNCHANGED: 0,
  IMPROVED: 1,
} as const;

export type DirectionalIndicator = -1 | 0 | 1;

// BPS Province codes (2-digit numeric) for all 38 Indonesian provinces.
// Encoded as zero-left-padded bytes4 hex strings for the EAS schema.
// Source: BPS standard codes, docs/spec/mvp.md §6
export const BPS_PROVINCES: { code: number; name: string; bytes4: `0x${string}` }[] = [
  { code: 11, name: "Aceh" },
  { code: 12, name: "Sumatera Utara" },
  { code: 13, name: "Sumatera Barat" },
  { code: 14, name: "Riau" },
  { code: 15, name: "Jambi" },
  { code: 16, name: "Sumatera Selatan" },
  { code: 17, name: "Bengkulu" },
  { code: 18, name: "Lampung" },
  { code: 19, name: "Kepulauan Bangka Belitung" },
  { code: 21, name: "Kepulauan Riau" },
  { code: 31, name: "DKI Jakarta" },
  { code: 32, name: "Jawa Barat" },
  { code: 33, name: "Jawa Tengah" },
  { code: 34, name: "DI Yogyakarta" },
  { code: 35, name: "Jawa Timur" },
  { code: 36, name: "Banten" },
  { code: 51, name: "Bali" },
  { code: 52, name: "Nusa Tenggara Barat" },
  { code: 53, name: "Nusa Tenggara Timur" },
  { code: 61, name: "Kalimantan Barat" },
  { code: 62, name: "Kalimantan Tengah" },
  { code: 63, name: "Kalimantan Selatan" },
  { code: 64, name: "Kalimantan Timur" },
  { code: 65, name: "Kalimantan Utara" },
  { code: 71, name: "Sulawesi Utara" },
  { code: 72, name: "Sulawesi Tengah" },
  { code: 73, name: "Sulawesi Selatan" },
  { code: 74, name: "Sulawesi Tenggara" },
  { code: 75, name: "Gorontalo" },
  { code: 76, name: "Sulawesi Barat" },
  { code: 81, name: "Maluku" },
  { code: 82, name: "Maluku Utara" },
  { code: 91, name: "Papua Barat" },
  { code: 92, name: "Papua Barat Daya" },
  { code: 93, name: "Papua Pegunungan" },
  { code: 94, name: "Papua Selatan" },
  { code: 95, name: "Papua Tengah" },
  { code: 96, name: "Papua" },
].map((p) => ({
  ...p,
  bytes4: `0x${p.code.toString(16).padStart(8, "0")}` as `0x${string}`,
}));
