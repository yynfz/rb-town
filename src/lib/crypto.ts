import { Payload } from "./types";

export function generateNonce(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function canonicalisePayload(payload: any): string {
  if (Array.isArray(payload)) {
    return `[${payload.map(canonicalisePayload).join(",")}]`;
  } else if (payload !== null && typeof payload === "object") {
    const keys = Object.keys(payload).sort();
    return `{${keys
      .map((k) => `"${k}":${canonicalisePayload(payload[k])}`)
      .join(",")}}`;
  } else if (typeof payload === "string") {
    return JSON.stringify(payload); // handles escaping quotes correctly
  } else {
    return String(payload);
  }
}

export async function computeCommitment(
  payload: Payload,
  nonce: Uint8Array
): Promise<string> {
  const canonicalJson = canonicalisePayload(payload);
  const encoder = new TextEncoder();
  const jsonBytes = encoder.encode(canonicalJson);

  const combined = new Uint8Array(nonce.length + jsonBytes.length);
  combined.set(nonce);
  combined.set(jsonBytes, nonce.length);

  const hashBuffer = await crypto.subtle.digest("SHA-256", combined);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `0x${hashHex}`;
}
