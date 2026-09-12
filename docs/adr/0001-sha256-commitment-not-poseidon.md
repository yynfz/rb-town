# SHA-256 over Poseidon for the commitment scheme

The commitment that goes on-chain is `SHA-256(nonce || canonical_json)`, not a Poseidon hash. Poseidon is ZK-friendly and would allow a citizen to produce a zero-knowledge proof that they know the pre-image without revealing it — a natural next step for this system. We chose SHA-256 because it is available natively in the browser (Web Crypto API), requires no additional dependencies. The Poseidon path is the production upgrade: when ZK proofs become a priority, replace the hash function and regenerate the EAS schema.

## Considered Options

- **Poseidon hash**: ZK-friendly, enables future ZK proofs of payload contents. Requires a JS library (e.g. `circomlibjs`), adds bundle weight, and is unnecessary for a demo that does not yet verify ZK proofs on-chain.
- **SHA-256** (chosen): native, zero-dependency, auditable. Sufficient for binding a payload to an on-chain commitment.

## Consequences

Existing commitments cannot be "upgraded" to Poseidon without re-submission. Any future ZK integration will need to either accept a mixed commitment history or treat pre-Poseidon submissions as a separate cohort.
