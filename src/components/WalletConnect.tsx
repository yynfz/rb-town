"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chain?.id !== sepolia.id;

  if (isConnected && isWrongNetwork) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-amber-400">Wrong network</span>
        <button
          onClick={() => switchChain({ chainId: sepolia.id })}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
        >
          Switch to Sepolia
        </button>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => disconnect()}
          title="Click to disconnect wallet"
          className="group flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-mono text-green-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
        >
          <span className="h-2 w-2 rounded-full bg-green-400 group-hover:bg-red-400 transition-colors" />
          <span>{address.slice(0, 6)}…{address.slice(-4)}</span>
          <span className="ml-1 text-[11px] font-sans font-medium text-white/50 group-hover:text-red-400 transition-colors">
            ✕ Disconnect
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          disabled={isPending}
          onClick={() => connect({ connector })}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Connecting…" : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  );
}
