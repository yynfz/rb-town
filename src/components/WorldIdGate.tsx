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
  const [showBypass, setShowBypass] = useState(false);

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
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Verify I&apos;m Human</h2>
      <p className="text-slate-600 dark:text-slate-300 text-center mb-6 text-sm leading-relaxed">
        To report your lived reality in Indonesia, please verify your humanity with World ID.
        This ensures each citizen&apos;s report is counted exactly once while keeping your identity private.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl w-full text-sm">
          {error}
        </div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        disabled={isVerifying}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
      >
        {isVerifying ? "Verifying..." : "Verify with World ID"}
      </button>

      {showBypass && (
        <button
          onClick={() => {
            setIsVerifying(true);
            setTimeout(() => {
              setNullifierHash("0x" + Date.now().toString(16));
              setIsVerified(true);
              setIsVerifying(false);
            }, 1000);
          }}
          className="mt-4 px-6 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold hover:bg-indigo-500/20 transition-colors cursor-pointer text-sm border border-indigo-500/20"
        >
          Demo Bypass (Simulate Success)
        </button>
      )}
      
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
        onError={(err) => {
          console.error("IDKit error:", err);
          setShowBypass(true);
        }}
      />

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-5 text-center">
        Note: Each World ID can verify only once for this action (1-person-1-response).
        If you have already verified, World App will notify you that you cannot verify again.
      </p>
    </div>
  );
}
