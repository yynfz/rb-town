"use client";

import React, { useState } from "react";
import { WorldIdGate } from "./WorldIdGate";
import { SubmissionForm } from "./SubmissionForm";
import { ConfirmationScreen } from "./ConfirmationScreen";
import { useSubmitAttestation } from "../hooks/useSubmitAttestation";
import type { Payload } from "../lib/types";

type FlowStatus = "FORM" | "SUBMITTING" | "CONFIRMED";

export function SubmissionFlow() {
  const [status, setStatus] = useState<FlowStatus>("FORM");
  const [submissionResult, setSubmissionResult] = useState<{
    payload: Payload;
    attestationUID: string;
    nonce: string;
    commitment: string;
  } | null>(null);

  const { submitAttestation, error } = useSubmitAttestation();

  const handleSubmit = async (payload: Payload, regionCode: number) => {
    setStatus("SUBMITTING");
    const result = await submitAttestation(payload, regionCode);

    if (result) {
      setSubmissionResult({
        payload,
        ...result,
      });
      setStatus("CONFIRMED");
    } else {
      // Revert to form to allow retry
      setStatus("FORM");
    }
  };

  if (status === "CONFIRMED" && submissionResult) {
    return <ConfirmationScreen {...submissionResult} />;
  }

  return (
    <WorldIdGate>
      <div className="w-full">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 text-red-800 rounded-md shadow-sm border border-red-200">
            <h3 className="font-bold mb-1">Submission Failed</h3>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2 font-medium">Please try again. A new cryptographic nonce will be generated.</p>
          </div>
        )}

        {status === "SUBMITTING" ? (
          <div className="max-w-2xl mx-auto p-12 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Anchoring to Sepolia...</h2>
            <p className="text-gray-600">Please confirm the transaction in your wallet.</p>
          </div>
        ) : (
          <SubmissionForm onSubmit={handleSubmit} />
        )}
      </div>
    </WorldIdGate>
  );
}
