# No backend server — 100% client-side architecture

The app has no backend server, no database, and no API. All computation (heuristic scoring, commitment, World ID proof verification, EAS attestation) happens in the browser. The citizen's payload never leaves their device. This was a deliberate choice, not a resource constraint: a backend capable of aggregating submissions across sessions would require the payload to leave the browser, which breaks the privacy model. The trade-off is that the Observatory is seeded with synthetic data and cannot aggregate real submissions across different browser sessions. That limitation is acceptable for a prototype where the privacy guarantee is the primary point.

## Consequences

- Observatory cross-session aggregation is not possible without a server. Each session starts from the synthetic seed.
- There is no server-side nullifier check; the uniqueness guarantee comes entirely from World ID's on-chain nullifier.
- Adding a backend later is a significant architectural change, not a minor extension.
