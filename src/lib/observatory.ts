import { ObservatoryState, CompletedSubmission } from "./types";
import { CATEGORIES } from "./constants";

export function emptyObservatoryState(): ObservatoryState {
  const byCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = { worsened: 0, unchanged: 0, improved: 0 };
    return acc;
  }, {} as ObservatoryState["byCategory"]);

  return {
    totalSubmissions: 0,
    bySignal: { none: 0, LOW: 0, MEDIUM: 0, HIGH: 0 },
    byCategory,
    byRegion: {},
  };
}

export function applySubmission(
  state: ObservatoryState,
  submission: CompletedSubmission
): ObservatoryState {
  const nextState: ObservatoryState = {
    totalSubmissions: state.totalSubmissions + 1,
    bySignal: { ...state.bySignal },
    byCategory: { ...state.byCategory },
    byRegion: { ...state.byRegion },
  };

  // Clone nested category objects to ensure strict immutability
  for (const cat of CATEGORIES) {
    nextState.byCategory[cat] = { ...state.byCategory[cat] };
  }

  // 1. Update signal bucket
  nextState.bySignal[submission.signal] += 1;

  // 2. Update region bucket
  const region = submission.regionCode;
  nextState.byRegion[region] = (nextState.byRegion[region] || 0) + 1;

  // 3. Update category buckets based on payload directional indicators
  for (const cat of CATEGORIES) {
    const indicator = submission.payload.categories[cat];
    if (indicator === -1) {
      nextState.byCategory[cat].worsened += 1;
    } else if (indicator === 0) {
      nextState.byCategory[cat].unchanged += 1;
    } else if (indicator === 1) {
      nextState.byCategory[cat].improved += 1;
    }
  }

  return nextState;
}
