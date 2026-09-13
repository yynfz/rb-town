# Reality Bridge

### Bridging data with lived reality.

Reality Bridge is a privacy-preserving citizen data-quality layer that helps bridge the gap between recorded socioeconomic data and what people are actually experiencing.

## The Problem

Socioeconomic circumstances can change quickly—such as employment, income, household composition, housing conditions, assets, utilities, health, and education—but the data representing a household may not always change at the same time.

This creates a **Reality Gap** between:
**Recorded Reality** (official socioeconomic profile)  
and  
**Lived Reality** (actual current circumstances).

Reality Bridge explores how citizens can provide a verifiable signal when they believe their recorded socioeconomic profile may no longer reflect their current circumstances, without exposing their private data.

## The Idea

A citizen can:
1. **Verify** that they are a unique human (using World ID).
2. **Privately report** changes in their circumstances across six fixed socioeconomic domains.
3. **Generate** a Reality Signal (LOW, MEDIUM, HIGH) based on those changes.
4. **Create** a cryptographic commitment to the submission (Salted SHA-256 hash of the payload).
5. **Record** a verifiable blockchain attestation (via EAS).
6. **Contribute** to an aggregated public data-quality view (the Observatory).

> **We don't put citizens' data on-chain. We put proof that their voice was counted.**

## Technology Stack

The project is built with a modern web and Web3 stack:
- **Framework:** [Next.js](https://nextjs.org/) (App Router) with React 19 and TypeScript.
- **Styling:** Tailwind CSS v4, shadcn, Framer Motion (`motion`), and Base UI.
- **Charts:** [Recharts](https://recharts.org/) for the Observatory dashboard.
- **Web3 Integration:** 
  - [World ID (IDKit)](https://worldcoin.org/world-id) for Sybil resistance and unique human verification.
  - [Viem](https://viem.sh/) & [Wagmi](https://wagmi.sh/) for Ethereum wallet interactions.
  - [Ethereum Attestation Service (EAS)](https://attest.sh/) SDK for on-chain verifiable attestations.
- **Testing:** Vitest

## Key Components

### Privacy by Design
Reality Bridge separates sensitive information from the public verification layer. Sensitive household information (the **Payload**) remains off-chain. The blockchain layer contains only a cryptographic commitment, a signal level, and attestation metadata.

### Reality Signal
The prototype uses a Weighted Severity Score to classify a reported change as **LOW**, **MEDIUM**, or **HIGH**. This Reality Signal is an illustrative heuristic and does not reproduce or predict the official proxy means test methodology.

### Public Observatory
An aggregated dashboard displaying:
- Reported changes by category.
- Reality Signal severity distribution.
- Regional (Provincial) distributions.
- Total number of verified submissions.

The observatory updates dynamically as attestations are created, while keeping all individual responses completely private.

## Project Structure

```text
rb-town/
├── scripts/             # Scripts for generating synthetic seed data
├── src/
│   ├── app/             # Next.js App Router pages and layouts
│   ├── components/      # React components (Dashboard, Form, UI elements)
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities, constants, EAS/Web3 logic
├── docs/                # Project documentation and ADRs
└── package.json         # Project dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v22+)
- npm or yarn

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file based on the `.env` template to configure your EAS, Wagmi, and World ID credentials.

3. **Generate Synthetic Seed Data (Optional):**
   ```bash
   npm run generate-seed
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing & Linting

- Run tests using Vitest: `npm run test`
- Type checking: `npm run typecheck`
- Linting: `npm run lint`

## Disclaimer

Reality Bridge is an independent prototype created for ETHOnline 2026. It is **not an official BPS or Indonesian government service**. All household-level data used in the demonstration is **synthetic** and does not represent real individuals, official statistics, or official records.
