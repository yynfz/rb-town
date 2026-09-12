# Reality Bridge

A privacy-preserving citizen data-quality layer that lets citizens report changes in their socioeconomic circumstances and produce a verifiable, on-chain signal — without putting their personal data on-chain.

## Language

**Citizen**:
The individual who submits a change report. The primary actor in the system.
_Avoid_: User, participant, household

**Household context**:
The BPS/statistical framing in which a citizen's submission is understood — a citizen submits data that relates to their household circumstances. Not a data entity; no household identifier exists in the system.
_Avoid_: Household (as a data entity), household ID

**Recorded Reality**:
The official socioeconomic profile of a citizen as held by BPS or other government agencies. The baseline the citizen's submission is implicitly compared against.
_Avoid_: Official data, government data

**Lived Reality**:
The actual current circumstances of a citizen, which may have diverged from the Recorded Reality.
_Avoid_: Actual circumstances, real situation

**Reality Gap**:
The discrepancy between a citizen's Recorded Reality and their Lived Reality.

**Submission**:
The act of a citizen completing and committing a change report — selecting directional indicators across all six categories and triggering the commitment and attestation flow.
_Avoid_: Form submission, transaction, report

**Payload**:
The canonical JSON document produced by a submission. Contains `schema_version`, `timestamp`, and `categories` (six directional indicators). This is the sensitive data that remains off-chain.
_Avoid_: Form data, response, record

**Directional Indicator**:
A numeric value assigned to a category in the payload: -1 = worsened, 0 = unchanged, +1 = improved. The atomic unit of citizen-reported change.
_Avoid_: Score, value, rating

**Category**:
One of six fixed socioeconomic domains a citizen rates: `employment_income`, `household_composition`, `housing_conditions`, `assets_utilities`, `health`, `education`.

**Weighted Severity Score**:
The sum of category weights for all categories where the directional indicator is -1 (worsened). Weights: `employment_income`=3, `household_composition`=2, `housing_conditions`=2, `assets_utilities`=1, `health`=1, `education`=1. Maximum possible score = 10.
_Avoid_: Score (alone)

**Reality Signal**:
The severity classification derived from the Weighted Severity Score: no signal (score 0), LOW (1–2), MEDIUM (3–5), HIGH (6–10). The only submission-derived information published on-chain.
_Avoid_: Signal level, signal score

**Commitment**:
The salted SHA-256 hash of the canonical payload: `SHA-256(nonce || canonical_json)`. Binds the submission cryptographically without revealing its contents.
_Avoid_: Hash, fingerprint

**Nonce**:
A random 32-byte value generated client-side at submission time. Combined with the payload to produce the commitment. The citizen retains this in their receipt.
_Avoid_: Salt, random value

**Receipt**:
A JSON artifact downloaded by the citizen after a successful submission. Contains the nonce, the payload, and the commitment. Enables the citizen to later prove the contents of their submission.
_Avoid_: Certificate, proof, confirmation

**Attestation**:
The on-chain EAS record created by the citizen's wallet upon submission. Contains: `commitment`, `signalLevel`, `schemaVersion`, `regionCode`, `submittedAt`. The recipient is the citizen's wallet address.
_Avoid_: Transaction, on-chain record

**Observatory**:
The public, aggregate view of Reality Signals. Displays signal distribution, category patterns, and regional distributions. Pre-seeded with synthetic data; real attestations are injected client-side as they arrive.
_Avoid_: Dashboard, analytics, public view
