# Reality Bridge — MVP Technical Specification

**Status**: Ready for implementation
**Scope**: ETHOnline 2026 Hackathon Prototype
**Architecture**: 100% client-side, serverless, live Sepolia testnet

---

## 1. User Flow

```
1. Land on app → connect wallet (MetaMask / WalletConnect)
2. Verify humanity → World ID Incognito Action ("rb-town-2026") on Sepolia staging
3. Fill in submission form → select a directional indicator per category
4. App computes Reality Signal locally → shows LOW / MEDIUM / HIGH badge
5. App generates nonce + payload → computes commitment (SHA-256)
6. Citizen signs + submits EAS attestation on Sepolia
7. Confirmation screen → signal badge, commitment hash, EASscan link, receipt download
8. Transition to Observatory → citizen sees their signal in the aggregate
```

Uniqueness is enforced by World ID: a citizen cannot complete step 2 twice for the same action string. If they try, World ID returns an error ("already verified") before they reach the form.

---

## 2. Submission Payload

The payload is a canonical JSON object. Keys are alphabetically sorted; no extra whitespace.

```json
{
  "schema_version": "1.0",
  "timestamp": 1726123456,
  "categories": {
    "assets_utilities": -1,
    "education": 0,
    "employment_income": -1,
    "health": 0,
    "household_composition": -1,
    "housing_conditions": 0
  }
}
```

- `schema_version`: string literal `"1.0"` for this release
- `timestamp`: Unix epoch seconds, set at form submission time
- `categories`: exactly six keys, each with a directional indicator: `-1` (worsened), `0` (unchanged), `+1` (improved)

The payload **never leaves the browser**. It is used only to compute the commitment and to generate the receipt.

---

## 3. Reality Signal Heuristic

### Weights

| Category | Weight |
|---|---|
| `employment_income` | 3 |
| `household_composition` | 2 |
| `housing_conditions` | 2 |
| `assets_utilities` | 1 |
| `health` | 1 |
| `education` | 1 |
| **Max total** | **10** |

### Formula

```
WeightedSeverityScore = Σ weight(c) for all c where directionalIndicator(c) === -1
```

Only worsened categories contribute. Unchanged and improved categories score 0.

### Thresholds

| Score | Reality Signal |
|---|---|
| 0 | No signal |
| 1–2 | LOW |
| 3–5 | MEDIUM |
| 6–10 | HIGH |

---

## 4. Commitment Scheme

```
nonce       = crypto.getRandomValues(new Uint8Array(32))
canonical   = JSON.stringify(payload, Object.keys(payload).sort())  // alphabetically sorted, no whitespace
commitment  = SHA-256(nonce || canonical)                            // nonce bytes prepended to UTF-8 encoded canonical
```

- `nonce`: 32 random bytes, generated client-side at submission time (Web Crypto API)
- `canonical`: deterministic JSON serialisation with sorted keys at all levels
- `commitment`: 32-byte SHA-256 digest, stored on-chain as `bytes32`

The citizen retains the nonce in their receipt. Anyone who holds both the receipt and the commitment can verify the submission by recomputing the hash. No one who lacks the receipt can recover the payload from the commitment.

**Future path**: replace SHA-256 with Poseidon hash for ZK-proof compatibility (see ADR-0001).

---

## 5. EAS Schema

**Network**: Ethereum Sepolia testnet
**EAS contract**: `0xC2679fBD37d54388Ce493F1DB75320D236e1815e` (Sepolia)

### Schema definition

```solidity
bytes32 commitment,
uint8 signalLevel,
uint8 schemaVersion,
bytes4 regionCode,
uint64 submittedAt
```

### Field values

| Field | Type | Value |
|---|---|---|
| `commitment` | `bytes32` | SHA-256 of `nonce \|\| canonical_json` |
| `signalLevel` | `uint8` | 0 = no signal, 1 = LOW, 2 = MEDIUM, 3 = HIGH |
| `recipient` | `address` | citizen's wallet address |
| `schemaVersion` | `uint8` | 1 |
| `regionCode` | `bytes4` | BPS province code (see §6) |
| `submittedAt` | `uint64` | Unix timestamp in seconds |

The attestation is non-revocable. The citizen is the `recipient`.

---

## 6. Region Code Encoding

The citizen selects their province from a dropdown. Province codes follow the BPS standard (2-digit numeric). Encoded as `bytes4` by zero-left-padding:

```
BPS code 11 (Aceh)       → 0x0000000B
BPS code 31 (DKI Jakarta) → 0x0000001F
BPS code 33 (Jawa Tengah) → 0x00000021
```

Full mapping: 38 Indonesian provinces, BPS codes 11–94.

---

## 7. World ID Integration

**Action**: `"rb-town-2026"` (single global action, never rotates in this prototype)
**Scope**: Incognito Action (per-action nullifier, no persistent identity)
**Network**: World ID Staging (Sepolia-compatible)

### Flow

1. Citizen clicks "Verify I'm Human"
2. App presents World ID QR / modal via `@worldcoin/idkit`
3. Citizen completes verification in World App
4. World ID returns `{ proof, nullifier_hash, merkle_root }`
5. App verifies proof client-side against the Sepolia staging contract before showing the form
6. `nullifier_hash` is stored in component state only; it is **not** sent on-chain or stored

If verification fails or has already been used, the citizen cannot proceed to the form.

---

## 8. Post-Submission UX

After successful attestation:

1. **Confirmation screen**:
   - Reality Signal badge (LOW / MEDIUM / HIGH, or "No Signal")
   - Commitment hash (hex, truncated with copy button)
   - Link to attestation on EASscan Sepolia
   - "Download Receipt" button → downloads `receipt.json`:
     ```json
     {
       "nonce": "<hex>",
       "payload": { ...canonical payload... },
       "commitment": "<hex>",
       "attestationUid": "<hex>",
       "network": "sepolia"
     }
     ```

2. **"See your signal in the Observatory" CTA** → transitions to Observatory view, with the citizen's signal highlighted in the aggregate.

---

## 9. Observatory Architecture

### Data model

The Observatory maintains a single in-memory state object:

```ts
interface ObservatoryState {
  totalSubmissions: number
  bySignal: { none: number; low: number; medium: number; high: number }
  byCategory: Record<Category, { worsened: number; unchanged: number; improved: number }>
  byRegion: Record<string, number>  // BPS province code → count
}
```

### Synthetic seed

A static JSON file (`data/observatory-seed.json`) is bundled with the app. It contains pre-computed `ObservatoryState` representing a plausible synthetic dataset (e.g. ~500 submissions, realistic Indonesian provincial distribution, signal skewed toward MEDIUM/HIGH for demo impact).

### Real-time injection

When a citizen completes a submission in the current browser session, the app adds their result to the in-memory state on top of the seed. The charts re-render immediately. This state is ephemeral — it resets on page reload.

There is no cross-session aggregation and no server. Each browser session starts from the seed.

### Charts

| Chart | Data source |
|---|---|
| Reality Signal distribution (donut) | `bySignal` |
| Changes by category (bar, grouped) | `byCategory` |
| Regional distribution (choropleth or bar) | `byRegion` |
| Total verified participants | `totalSubmissions` |
| Total on-chain attestations | Live EAS query (optional) |

---

## 10. Technology Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router) or Vite + React |
| Wallet | wagmi + viem |
| EAS SDK | `@ethereum-attestation-service/eas-sdk` |
| World ID | `@worldcoin/idkit` |
| Commitment | Web Crypto API (`SubtleCrypto.digest`) |
| Testnet RPC | Infura / Alchemy Sepolia |
| Hosting | Vercel / static export |
