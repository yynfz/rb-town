import { describe, it, expect } from "vitest";
import { Payload } from "../types";
import {
  computeCommitment,
  generateNonce,
  canonicalisePayload,
} from "../crypto";

describe("generateNonce", () => {
  it("returns a Uint8Array of exactly 32 bytes", () => {
    const nonce = generateNonce();
    expect(nonce).toBeInstanceOf(Uint8Array);
    expect(nonce.length).toBe(32);
  });

  it("produces different values on subsequent calls", () => {
    const nonce1 = generateNonce();
    const nonce2 = generateNonce();
    expect(nonce1).not.toEqual(nonce2);
  });
});

describe("canonicalisePayload", () => {
  it("produces a JSON string without whitespace", () => {
    const payload: Payload = {
      schema_version: "1.0",
      timestamp: 123456789,
      categories: {
        assets_utilities: 0,
        education: 0,
        employment_income: -1,
        health: 0,
        household_composition: 1,
        housing_conditions: 0,
      },
    };
    const str = canonicalisePayload(payload);
    expect(str).not.toMatch(/\s/);
  });

  it("sorts keys alphabetically at all levels", () => {
    const payload = {
      z: 1,
      a: { c: 2, b: 3 },
      m: [1, 2, 3],
    } as unknown as Payload;
    const str = canonicalisePayload(payload);
    expect(str).toBe('{"a":{"b":3,"c":2},"m":[1,2,3],"z":1}');
  });
});

describe("computeCommitment", () => {
  const payload1: Payload = {
    schema_version: "1.0",
    timestamp: 123456789,
    categories: {
      assets_utilities: 0,
      education: 0,
      employment_income: -1,
      health: 0,
      household_composition: 1,
      housing_conditions: 0,
    },
  };

  const payload2: Payload = {
    ...payload1,
    timestamp: 999999999,
  };

  it("returns a lowercase hex string starting with 0x and 64 hex chars (66 total)", async () => {
    const nonce = new Uint8Array(32).fill(0);
    const commitment = await computeCommitment(payload1, nonce);
    expect(typeof commitment).toBe("string");
    expect(commitment).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it("is deterministic (same payload and nonce -> same commitment)", async () => {
    const nonce = new Uint8Array(32).fill(1);
    const commitment1 = await computeCommitment(payload1, nonce);
    const commitment2 = await computeCommitment(payload1, nonce);
    expect(commitment1).toEqual(commitment2);
  });

  it("changes if the payload changes", async () => {
    const nonce = new Uint8Array(32).fill(1);
    const commitment1 = await computeCommitment(payload1, nonce);
    const commitment2 = await computeCommitment(payload2, nonce);
    expect(commitment1).not.toEqual(commitment2);
  });

  it("changes if the nonce changes", async () => {
    const nonce1 = new Uint8Array(32).fill(1);
    const nonce2 = new Uint8Array(32).fill(2);
    const commitment1 = await computeCommitment(payload1, nonce1);
    const commitment2 = await computeCommitment(payload1, nonce2);
    expect(commitment1).not.toEqual(commitment2);
  });
});
