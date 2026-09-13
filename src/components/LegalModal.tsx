"use client";

import React, { useState, useEffect } from "react";

const Icons = {
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ShieldCheck: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  FileText: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
};

export type LegalTab = "tos" | "privacy";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export function LegalModal({ isOpen, onClose, initialTab = "tos" }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-[28px] bg-white dark:bg-[#191C20] shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-white/10 max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Icons.ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                Reality Bridge Legal Notice
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Terms of Service & Privacy Policy
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200/60 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 dark:border-white/10 px-6 pt-2 bg-white dark:bg-[#191C20]">
          <button
            onClick={() => setActiveTab("tos")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "tos"
                ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Icons.FileText className="w-4 h-4" />
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "privacy"
                ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Icons.ShieldCheck className="w-4 h-4" />
            Privacy Policy
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-sm text-gray-600 dark:text-gray-300 space-y-5 leading-relaxed">
          {activeTab === "tos" ? (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Terms of Service
              </h3>
              <p className="text-xs text-gray-400">Last updated: September 2026</p>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h4>
                <p>
                  By connecting a Web3 wallet or interacting with the Reality Bridge protocol, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not connect your wallet or use the service.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">2. Protocol Purpose & Decentralization</h4>
                <p>
                  Reality Bridge is a decentralized platform enabling citizens to submit and verify truth signals via World ID zero-knowledge proofs and Ethereum Attestation Service (EAS) on the Sepolia network. The protocol operates in a permissionless and decentralized environment.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">3. User Responsibilities & Wallet Security</h4>
                <p>
                  You are solely responsible for securing your private keys, wallet credentials, and seed phrases. Reality Bridge does not store private keys, manage user accounts, or maintain custody of digital assets.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">4. Single-Use World ID Verification</h4>
                <p>
                  To ensure Sybil resistance and 1-person-1-signal integrity, verification requires World ID. Each World ID credential can complete an action once per period, as governed by the smart contract nullifier rules.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">5. Disclaimers & Limitation of Liability</h4>
                <p>
                  Reality Bridge is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. Reality Bridge contributors and maintainers shall not be liable for smart contract interactions, network delays, or loss of testnet/mainnet funds.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Privacy Policy
              </h3>
              <p className="text-xs text-gray-400">Last updated: September 2026</p>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">1. Decentralization & No Personal Data Collection</h4>
                <p>
                  Reality Bridge does not require or collect personal identifying information such as your name, email address, physical location, or government ID.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">2. World ID & Zero-Knowledge Privacy</h4>
                <p>
                  Humanity verification is performed via World ID using Zero-Knowledge Proofs (zk-SNARKs). Your biometric data and personal identity remain on your personal device (World App). Reality Bridge only receives cryptographic nullifier hashes, ensuring your real-world identity is never disclosed.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">3. Public Blockchain Records</h4>
                <p>
                  When you submit a signal or attestation, data (such as commitment hashes, signal levels, and Sepolia timestamps) is recorded publicly on the Ethereum Attestation Service (EAS) registry. Public blockchain data is immutable and visible to anyone on the network.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">4. RPC Providers & Web3 Analytics</h4>
                <p>
                  Standard Web3 network requests to Ethereum RPC endpoints (e.g. Sepolia nodes) may log network metadata (such as IP address and user agent) strictly for API rate limiting and RPC infrastructure maintenance.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">5. Policy Updates</h4>
                <p>
                  We may update this Privacy Policy periodically to reflect protocol improvements or technological advancements. Continued use of Reality Bridge constitutes acceptance of updated terms.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Reality Bridge • Decentralized Truth Verification
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 active:bg-indigo-700 transition-colors text-sm cursor-pointer shadow-sm shadow-indigo-600/20"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
