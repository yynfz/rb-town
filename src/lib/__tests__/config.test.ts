import { describe, it, expect } from "vitest";
import { EAS_SCHEMA_UID, EAS_CONTRACT_ADDRESS, WORLD_ID_ACTION } from "../config";

describe("EAS_SCHEMA_UID", () => {
  it("is a 0x-prefixed 64-hex-character string (bytes32)", () => {
    expect(EAS_SCHEMA_UID).toMatch(/^0x[0-9a-fA-F]{64}$/);
  });

  it("is not the zero hash", () => {
    expect(EAS_SCHEMA_UID).not.toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });
});

describe("EAS_CONTRACT_ADDRESS", () => {
  it("is a 0x-prefixed 40-hex-character Ethereum address", () => {
    expect(EAS_CONTRACT_ADDRESS).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });

  it("is the known Sepolia EAS contract address", () => {
    expect(EAS_CONTRACT_ADDRESS.toLowerCase()).toBe(
      "0xc2679fbd37d54388ce493f1db75320d236e1815e"
    );
  });
});

describe("WORLD_ID_ACTION", () => {
  it("is the canonical action string", () => {
    expect(WORLD_ID_ACTION).toBe("rb-town-2026");
  });
});
