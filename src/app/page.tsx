import { WalletConnect } from "@/components/WalletConnect";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Reality Bridge</h1>
          <p className="text-xs text-white/40">Bridging data with lived reality</p>
        </div>
        <WalletConnect />
      </header>

      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
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
        <WalletConnect />
      </div>
    </main>
  );
}
