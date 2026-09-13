import { useState, useCallback } from "react";
import { useWalletClient, useAccount } from "wagmi";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { walletClientToSigner } from "../lib/ethers";
import {
  EAS_CONTRACT_ADDRESS,
  EAS_SCHEMA_UID,
  EAS_SCHEMA_STRING,
  SCHEMA_VERSION,
} from "../lib/config";
import { BPS_PROVINCES, SignalLevel } from "../lib/constants";
import { computeRealitySignal } from "../lib/heuristic";
import { generateNonce, computeCommitment } from "../lib/crypto";
import type { Payload } from "../lib/types";

export interface AttestationResult {
  attestationUID: string;
  nonce: string;
  commitment: string;
}

const SIGNAL_LEVEL_MAPPING: Record<SignalLevel, number> = {
  none: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

export function useSubmitAttestation() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAttestation = useCallback(
    async (payload: Payload, regionCode: number): Promise<AttestationResult | null> => {
      if (!walletClient) {
        setError("Wallet not connected");
        return null;
      }
      if (!address) {
        setError("No active account found");
        return null;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        // 1. Generate Nonce
        const nonceBytes = generateNonce();

        // 2 & 3. Compute Commitment (canonicalizes payload internally)
        const commitment = await computeCommitment(payload, nonceBytes);
        const nonceHex = `0x${Buffer.from(nonceBytes).toString("hex")}`;

        // 4. Initialize EAS
        const signer = walletClientToSigner(walletClient);
        const eas = new EAS(EAS_CONTRACT_ADDRESS);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        eas.connect(signer as any); // Ethers v6 signer

        // 5. Prepare Schema Encoder
        const schemaEncoder = new SchemaEncoder(EAS_SCHEMA_STRING);
        
        // 6. Look up region code bytes4
        const province = BPS_PROVINCES.find((p) => p.code === regionCode);
        if (!province) {
          throw new Error(`Invalid region code: ${regionCode}`);
        }

        const { signal } = computeRealitySignal(payload);

        const encodedData = schemaEncoder.encodeData([
          { name: "commitment", value: commitment, type: "bytes32" },
          { name: "signalLevel", value: SIGNAL_LEVEL_MAPPING[signal], type: "uint8" },
          { name: "schemaVersion", value: SCHEMA_VERSION, type: "uint8" },
          { name: "regionCode", value: province.bytes4, type: "bytes4" },
          { name: "submittedAt", value: Math.floor(Date.now() / 1000), type: "uint64" },
        ]);

        // 7. Submit to Sepolia EAS Contract
        const tx = await eas.attest({
          schema: EAS_SCHEMA_UID,
          data: {
            recipient: address,
            expirationTime: BigInt(0),
            revocable: false, // The attestation is non-revocable
            data: encodedData,
          },
        });

        // 8. Wait for confirmation
        const newAttestationUID = await tx.wait();

        setIsSubmitting(false);
        return {
          attestationUID: newAttestationUID,
          nonce: nonceHex,
          commitment,
        };
      } catch (err: unknown) {
        console.error("Attestation failed:", err);
        setError(err instanceof Error ? err.message : "Failed to submit attestation");
        setIsSubmitting(false);
        return null;
      }
    },
    [walletClient, address]
  );

  return { submitAttestation, isSubmitting, error };
}
