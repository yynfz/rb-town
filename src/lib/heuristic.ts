import { Payload } from "./types";
import { SignalLevel, CATEGORY_WEIGHTS, CATEGORIES } from "./constants";

export function computeRealitySignal(payload: Payload): {
  score: number;
  signal: SignalLevel;
} {
  let score = 0;

  for (const category of CATEGORIES) {
    const indicator = payload.categories[category];
    if (indicator === -1) {
      score += CATEGORY_WEIGHTS[category];
    }
  }

  let signal: SignalLevel = "none";
  if (score >= 6) {
    signal = "HIGH";
  } else if (score >= 3) {
    signal = "MEDIUM";
  } else if (score >= 1) {
    signal = "LOW";
  }

  return { score, signal };
}
