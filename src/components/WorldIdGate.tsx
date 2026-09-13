"use client";

import React, { useState } from "react";
import { IDKitRequestWidget, proofOfHuman, IDKitResult } from "@worldcoin/idkit";
import { usePublicClient } from "wagmi";
import { decodeAbiParameters, encodePacked, keccak256 } from "viem";
import { WORLD_ID_ACTION, WORLD_ID_APP_ID, WORLD_ID_ROUTER_ADDRESS, WORLD_ID_ROUTER_ABI } from "@/lib/config";

// Web3 utilities for World ID verification
function hashToField(input: string): bigint {
  const hashBytes = keccak256(encodePacked(["string"], [input]));
  return BigInt(hashBytes) >> BigInt(8);
}

function computeExternalNullifierHash(appId: string, action: string): bigint {
  const appIdHash = hashToField(appId);
  const packed = encodePacked(["uint256", "string"], [appIdHash, action]);
  return BigInt(keccak256(packed)) >> BigInt(8);
}

export function WorldIdGate({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [nullifierHash, setNullifierHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const publicClient = usePublicClient();

  const handleVerify = async (result: IDKitResult) => {
    setIsVerifying(true);
    setError(null);
    try {
      if (!publicClient) {
        throw new Error("Wagmi public client not initialized.");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyResult = result as any;

      // Decode the uint256[8] proof array from the hex string
      const unpackedProof = decodeAbiParameters(
        [{ type: "uint256[8]" }],
        anyResult.proof as `0x${string}`
      )[0];

      // Parse other parameters
      const root = BigInt(anyResult.merkle_root);
      const groupId = BigInt(1); // 1 = Orb
      const signalHash = hashToField(""); // Empty signal used for this action
      const parsedNullifierHash = BigInt(anyResult.nullifier_hash);
      const externalNullifierHash = computeExternalNullifierHash(
        WORLD_ID_APP_ID,
        WORLD_ID_ACTION
      );

      // Verify mathematically against the Sepolia World ID Router
      await publicClient.readContract({
        address: WORLD_ID_ROUTER_ADDRESS,
        abi: WORLD_ID_ROUTER_ABI,
        functionName: "verifyProof",
        args: [
          root,
          groupId,
          signalHash,
          parsedNullifierHash,
          externalNullifierHash,
          unpackedProof,
        ],
      });

      // If it doesn't throw, the proof is mathematically valid!
    } catch (err: unknown) {
      console.error("Proof verification failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Verification failed: ${msg.split("\n")[0]}`);
      throw new Error("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const onSuccess = (result: IDKitResult) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setNullifierHash((result as any).nullifier_hash);
    setIsVerified(true);
  };

  if (isVerified && nullifierHash) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Verify I&apos;m Human</h2>
      <p className="text-gray-600 text-center mb-6">
        To submit your Reality Signal, please verify your humanity with World ID.
        This ensures each citizen&apos;s voice is counted exactly once. Your data
        remains anonymous.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded w-full text-sm">
          {error}
        </div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        disabled={isVerifying}
        className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {isVerifying ? "Verifying..." : "Verify with World ID"}
      </button>
      
      <IDKitRequestWidget
        open={isOpen}
        onOpenChange={setIsOpen}
        app_id={WORLD_ID_APP_ID as `app_${string}`}
        action={WORLD_ID_ACTION}
        preset={proofOfHuman()}
        allow_legacy_proofs={false}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rp_context={"rb-town" as any}
        handleVerify={handleVerify}
        onSuccess={onSuccess}
      />

      <p className="text-xs text-gray-400 mt-4 text-center">
        Note: Each World ID can verify only once for this action (1-person-1-response).
        If you have already verified, World App will notify you that you cannot verify again.
      </p>
    </div>
  );
}
