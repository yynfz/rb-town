import { WalletConnect } from "@/components/WalletConnect";
import { HomeContent } from "@/components/HomeContent";

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

      {/* Main Content Area */}
      <HomeContent />
    </main>
  );
}
