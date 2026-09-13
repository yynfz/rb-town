"use client";

import { useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import Link from "next/link";
import Image from "next/image";
import { WalletConnect } from "./WalletConnect";
import { SubmissionFlow } from "./SubmissionFlow";

export function HomeContent() {
  const { isConnected, chain } = useAccount();

  const isSepolia = chain?.id === sepolia.id;

  if (isConnected && isSepolia) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 py-12">
        <SubmissionFlow />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <div className="relative mb-2 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl" />
        <Image
          src="/rb-logo-hq.png"
          alt="Reality Bridge Logo"
          width={96}
          height={96}
          className="relative rounded-2xl border border-white/10 shadow-2xl object-cover"
        />
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400">
        Ethereum Sepolia Testnet
      </div>
      <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Your voice.{" "}
        <span className="text-indigo-400">Privately counted.</span>
      </h2>
      <p className="max-w-xl text-base text-white/60">
        Connect your wallet to verify your humanity and report changes in your
        socioeconomic circumstances — without putting your personal data on‑chain.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <WalletConnect />
        <Link 
          href="/observatory" 
          className="rounded-lg border border-indigo-500/30 bg-transparent px-4 py-2 text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors"
        >
          View Observatory
        </Link>
      </div>
    </div>
  );
}
