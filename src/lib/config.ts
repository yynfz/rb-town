// EAS (Ethereum Attestation Service) configuration — Sepolia testnet
// Source: docs/spec/mvp.md §5

// Sepolia EAS contract address (canonical, from EAS docs)
export const EAS_CONTRACT_ADDRESS =
  "0xC2679fBD37d54388Ce493F1DB75320D236e1815e" as const;

// Sepolia SchemaRegistry contract address
export const SCHEMA_REGISTRY_ADDRESS =
  "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0" as const;

// EAS schema definition string
// bytes32 commitment, uint8 signalLevel, uint8 schemaVersion, bytes4 regionCode, uint64 submittedAt
export const EAS_SCHEMA_STRING =
  "bytes32 commitment,uint8 signalLevel,uint8 schemaVersion,bytes4 regionCode,uint64 submittedAt" as const;

// Schema UID — set after running scripts/register-eas-schema.ts on Sepolia.
// This is a bytes32 value committed to the repo once the schema is registered.
// IMPORTANT: Do not change this value without re-registering the schema,
// as all downstream attestations depend on it.
export const EAS_SCHEMA_UID =
  "0xbd8af99e7a0171b7598666eff14745aa05c2c8af7ebf9db012892d9197e1425f" as const;

// World ID Incognito Action — single global action for this prototype.
// A citizen can only complete this action once (permanent nullifier).
// Source: docs/adr/0003-single-use-world-id-action.md
export const WORLD_ID_ACTION = "rb-town-2026" as const;

// World ID App ID (set in World ID Developer Portal for Staging)
export const WORLD_ID_APP_ID =
  (process.env.NEXT_PUBLIC_WORLD_ID_APP_ID as `app_${string}`) ??
  ("app_staging_placeholder" as `app_${string}`);

// Sepolia RPC URL (set via environment variable)
export const SEPOLIA_RPC_URL =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ?? "https://rpc.sepolia.org";

// Schema version — increment if the schema definition changes (requires new registration)
export const SCHEMA_VERSION = 1 as const;

// World ID Router Address (Sepolia Staging)
export const WORLD_ID_ROUTER_ADDRESS =
  "0x11cA3127182f7583EfC416a8771BD4d11Fae4334" as const;

// Minimal ABI for World ID Router to verify proofs client-side
export const WORLD_ID_ROUTER_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "root", type: "uint256" },
      { internalType: "uint256", name: "groupId", type: "uint256" },
      { internalType: "uint256", name: "signalHash", type: "uint256" },
      { internalType: "uint256", name: "nullifierHash", type: "uint256" },
      { internalType: "uint256", name: "externalNullifierHash", type: "uint256" },
      { internalType: "uint256[8]", name: "proof", type: "uint256[8]" },
    ],
    name: "verifyProof",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
] as const;
