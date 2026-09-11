# Reality Bridge

### Bridging data with lived reality.

Reality Bridge is a privacy-preserving citizen data-quality layer that helps bridge the gap between recorded socioeconomic data and what people are actually experiencing.

## The Problem

Socioeconomic circumstances can change quickly:

- employment or income can change
- household composition can change
- housing conditions can change
- assets and utilities can change
- health and education circumstances can change

But the data representing a household may not always change at the same time.

This creates a gap between:

**Recorded Reality**  
and  
**Lived Reality**

Reality Bridge explores how citizens can provide a verifiable signal when they believe their recorded socioeconomic profile may no longer reflect their current circumstances.

## The Idea

A citizen can:

1. Verify that they are a unique human.
2. Privately report changes in their circumstances.
3. Generate a Reality Signal based on those changes.
4. Create a cryptographic commitment to the submission.
5. Record a verifiable blockchain attestation.
6. Contribute to an aggregated public data-quality view.

The key principle is:

> **We don't put citizens' data on-chain. We put proof that their voice was counted.**

## Privacy by Design

Reality Bridge separates sensitive information from the public verification layer.

Sensitive household information remains off-chain.

The blockchain layer contains only the minimum information required to verify that a submission was made, such as:

- a cryptographic commitment
- signal level
- schema version
- timestamp
- attestation metadata

Individual household responses are not published on-chain.

## Web3 Components

The prototype explores three important primitives:

### Unique Human Verification

World ID is used to help prevent duplicate submissions while keeping the participant's public identity private.

### Cryptographic Commitments

A commitment binds a private submission to an immutable cryptographic representation without revealing the underlying response.

### Ethereum Attestations

Ethereum Attestation Service (EAS) is used to create independently verifiable attestations for Reality Signals.

## Reality Signal

Reality Bridge does **not** calculate or reproduce the official DTSEN/BPS welfare methodology.

Instead, the prototype uses an illustrative heuristic to classify a reported change as:

- **LOW**
- **MEDIUM**
- **HIGH**

The Reality Signal is a demonstration of how citizen-reported changes could be aggregated into a privacy-preserving data-quality signal.

It is **not** an official welfare classification or prediction.

## Public Observatory

The prototype includes an aggregated observatory showing patterns such as:

- reported changes by category
- Reality Signal distribution
- synthetic regional distributions
- number of verified participants
- number of attestations

The observatory is designed to show patterns without exposing individual households.

## Data Disclaimer

Reality Bridge is an independent prototype created for ETHOnline 2026.

It is **not an official BPS or Indonesian government service**.

All household-level data used in the demonstration is **synthetic** and does not represent real individuals, official statistics, or official DTSEN records.

The Reality Signal is an illustrative prototype heuristic and does not reproduce or predict the official DTSEN / Proxy Means Test methodology.

## Vision

Reality Bridge is an experiment in citizen-controlled data verification.

The long-term idea is to create a privacy-preserving bridge between people and the systems that rely on socioeconomic data:

**Citizen → Private Signal → Verifiable Proof → Aggregated Insight**

while keeping sensitive personal information under the citizen's control.

---

## Status

🚧 ETHOnline 2026 Hackathon Prototype
