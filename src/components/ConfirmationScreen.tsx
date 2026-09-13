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
  const [showAttestationInfo, setShowAttestationInfo] = useState(false);
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
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
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
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lived-reality-receipt-${Math.floor(Date.now() / 1000)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const truncatedCommitment =
    commitment.slice(0, 6) + "..." + commitment.slice(-4);
  const easScanUrl = `https://sepolia.easscan.org/attestation/${attestationUID}`;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-10 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-center mt-12">
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 dark:border-emerald-800">
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

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Submission Confirmed
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
        Your report of lived reality has been successfully attested on-chain.
      </p>

      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8 text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-slate-200 dark:border-slate-700/60">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Lived Reality Status
          </span>
          <span
            className={`mt-1 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(
              signal
            )}`}
          >
            {signal === "none" ? "Aligned" : signal}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-slate-200 dark:border-slate-700/60">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Commitment
          </span>
          <div className="mt-1 sm:mt-0 flex items-center space-x-2">
            <span className="text-sm font-mono text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
              {truncatedCommitment}
            </span>
            <button
              onClick={handleCopy}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-semibold transition-colors cursor-pointer"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
          <div className="flex items-center gap-1.5 relative">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Attestation
            </span>
            <div className="relative group inline-flex items-center">
              <button
                type="button"
                onClick={() => setShowAttestationInfo(!showAttestationInfo)}
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none cursor-pointer"
                aria-label="What is an Attestation?"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Tooltip Popup */}
              <div
                className={`absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 dark:bg-slate-800 text-slate-100 text-xs rounded-xl shadow-xl border border-slate-700 transition-all z-30 ${
                  showAttestationInfo
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                }`}
              >
                <p className="font-bold mb-1 text-indigo-300 flex items-center justify-between">
                  <span>What is an Attestation?</span>
                </p>
                <p className="leading-relaxed text-slate-300">
                  An on-chain attestation is an immutable cryptographic record registered via Ethereum Attestation Service (EAS). It permanently anchors your ground-truth report on the blockchain while preserving your privacy.
                </p>
              </div>
            </div>
          </div>

          <a
            href={easScanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 sm:mt-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center transition-colors cursor-pointer"
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
          className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
        >
          Download Receipt (JSON)
        </button>
        <Link
          href="/observatory"
          className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 border border-transparent rounded-xl text-sm font-bold text-white hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
        >
          See your report in the Observatory
        </Link>
      </div>
    </div>
  );
}

