# Single-use World ID action for the prototype

The World ID action identifier is the static string `"rb-town-2026"`. Because World ID Incognito Actions issue a per-(action, user) nullifier, this means a citizen can verify and submit exactly once — forever — for this action string. We chose this over a time-windowed action (e.g. `"rb-town-2026-09"` for monthly re-submission) because: (a) rotating action strings requires infrastructure to manage the current window, and (b) the single-use constraint is a feature for the demo story ("your voice is permanently counted"). In production, a periodic action string would allow citizens to update their signal as their circumstances change.

## Consequences

A citizen who submits during the demo period permanently exhausts their nullifier for `"rb-town-2026"`. There is no mechanism to re-submit or update a submission. Switching to a periodic scheme in production requires a new action string, invalidating all existing nullifiers.
