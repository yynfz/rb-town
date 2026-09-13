import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { emptyObservatoryState, applySubmission } from "../src/lib/observatory";
import { computeRealitySignal } from "../src/lib/heuristic";
import { BPS_PROVINCES, CATEGORIES } from "../src/lib/constants";
import { CompletedSubmission, Payload } from "../src/lib/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NUM_SUBMISSIONS = 500;
const JAVA_PROVINCES = [31, 32, 33, 34, 35, 36]; // Codes for Java provinces

function getRandomRegionCode(): string {
  // 60% chance of being in Java
  const isJava = Math.random() < 0.6;
  if (isJava) {
    const code =
      JAVA_PROVINCES[Math.floor(Math.random() * JAVA_PROVINCES.length)];
    return String(code);
  } else {
    // Other provinces
    const otherProvinces = BPS_PROVINCES.filter(
      (p) => !JAVA_PROVINCES.includes(p.code)
    );
    const code =
      otherProvinces[Math.floor(Math.random() * otherProvinces.length)].code;
    return String(code);
  }
}

function getRandomDirectionalIndicator(category: string): -1 | 0 | 1 {
  const rand = Math.random();
  // Highly biased towards worsened (-1) for specific categories
  if (category === "employment_income") {
    if (rand < 0.45) return -1;
    if (rand < 0.95) return 0;
    return 1;
  }
  if (category === "household_composition") {
    if (rand < 0.35) return -1;
    if (rand < 0.95) return 0;
    return 1;
  }
  // Baseline for other categories
  if (rand < 0.15) return -1;
  if (rand < 0.9) return 0;
  return 1;
}

function generateSubmission(): CompletedSubmission {
  const payload: Payload = {
    schema_version: "1.0",
    timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // within last 30 days
    categories: {
      assets_utilities: 0,
      education: 0,
      employment_income: 0,
      health: 0,
      household_composition: 0,
      housing_conditions: 0,
    },
  };

  for (const cat of CATEGORIES) {
    payload.categories[cat] = getRandomDirectionalIndicator(cat);
  }

  const { signal } = computeRealitySignal(payload);

  return {
    payload,
    signal,
    regionCode: getRandomRegionCode(),
  };
}

async function run() {
  console.log(`Generating ${NUM_SUBMISSIONS} synthetic submissions...`);

  let state = emptyObservatoryState();

  for (let i = 0; i < NUM_SUBMISSIONS; i++) {
    const submission = generateSubmission();
    state = applySubmission(state, submission);
  }

  const outputPath = path.join(__dirname, "../data/observatory-seed.json");
  fs.writeFileSync(outputPath, JSON.stringify(state, null, 2));

  console.log(`Successfully wrote observatory state to ${outputPath}`);
  console.log("Summary:");
  console.log(`  Total Submissions: ${state.totalSubmissions}`);
  console.log(`  By Signal:`);
  console.log(`    none: ${state.bySignal.none}`);
  console.log(`    LOW: ${state.bySignal.LOW}`);
  console.log(`    MEDIUM: ${state.bySignal.MEDIUM}`);
  console.log(`    HIGH: ${state.bySignal.HIGH}`);
  console.log(
    `  Regions represented: ${Object.keys(state.byRegion).length} / 38`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
