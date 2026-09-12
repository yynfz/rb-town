#!/usr/bin/env node
/**
 * register-eas-schema.mjs
 *
 * Registers the Reality Bridge EAS schema on Sepolia and prints the schema UID.
 * Run once, then commit the UID to src/lib/config.ts.
 *
 * Usage:
 *   PRIVATE_KEY=0x... SEPOLIA_RPC_URL=https://... node scripts/register-eas-schema.mjs
 */

import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const SCHEMA_REGISTRY_ADDRESS = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const SCHEMA_STRING =
  "bytes32 commitment,uint8 signalLevel,uint8 schemaVersion,bytes4 regionCode,uint64 submittedAt";

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.SEPOLIA_RPC_URL ?? "https://rpc.sepolia.org";

if (!privateKey) {
  console.error("Error: PRIVATE_KEY environment variable is required.");
  console.error("  PRIVATE_KEY=0x... SEPOLIA_RPC_URL=https://... node scripts/register-eas-schema.mjs");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);

console.log(`Registering schema on Sepolia...`);
console.log(`  Schema: ${SCHEMA_STRING}`);
console.log(`  Signer: ${signer.address}`);
console.log(`  Registry: ${SCHEMA_REGISTRY_ADDRESS}`);
console.log();

const registry = new SchemaRegistry(SCHEMA_REGISTRY_ADDRESS);
registry.connect(signer);

try {
  const tx = await registry.register({
    schema: SCHEMA_STRING,
    resolverAddress: ethers.ZeroAddress,
    revocable: false,
  });

  console.log(`Transaction submitted: ${tx.tx.hash}`);
  console.log("Waiting for confirmation...");

  const schemaUid = await tx.wait();
  console.log();
  console.log("✅ Schema registered successfully!");
  console.log(`Schema UID: ${schemaUid}`);
  console.log();
  console.log("Next step: update EAS_SCHEMA_UID in src/lib/config.ts:");
  console.log(`  export const EAS_SCHEMA_UID = "${schemaUid}" as const;`);
} catch (err) {
  console.error("Registration failed:", err.message);
  process.exit(1);
}
