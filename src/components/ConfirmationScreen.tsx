"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Payload } from "../lib/types";
import { computeRealitySignal } from "../lib/heuristic";

interface ConfirmationScreenProps {
  payload: Payload;
  attestationUID: string;
  nonce: string;
  commitment: string;
}

export function ConfirmationScreen({
  payload,
  attestationUID,
  nonce,
  commitment,
}: ConfirmationScreenProps) {
  const [copied, setCopied] = useState(false);
  const { signal } = computeRealitySignal(payload);

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "LOW":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commitment);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDownload = () => {
    const receiptData = {
      nonce,
      payload,
      commitment,
      attestationUid: attestationUID,
      network: "sepolia",
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reality-signal-receipt-${Math.floor(Date.now() / 1000)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const truncatedCommitment =
    commitment.slice(0, 6) + "..." + commitment.slice(-4);
  const easScanUrl = `https://sepolia.easscan.org/attestation/${attestationUID}`;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 border border-gray-200 rounded-lg shadow-sm text-center mt-12">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Submission Confirmed
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your Reality Signal has been successfully attested on the Sepolia
        blockchain.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-500">
            Reality Signal
          </span>
          <span
            className={`mt-1 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(
              signal
            )}`}
          >
            {signal}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-500">Commitment</span>
          <div className="mt-1 sm:mt-0 flex items-center space-x-2">
            <span className="text-sm font-mono text-gray-800 bg-gray-200 px-2 py-1 rounded">
              {truncatedCommitment}
            </span>
            <button
              onClick={handleCopy}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
          <span className="text-sm font-medium text-gray-500">
            Attestation
          </span>
          <a
            href={easScanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 sm:mt-0 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
          >
            View on EASscan
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Download Receipt (JSON)
        </button>
        <Link
          href="/observatory"
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          See your signal in the Observatory
        </Link>
      </div>
    </div>
  );
}
