"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isWrongNetwork = isConnected && chain?.id !== sepolia.id;

  if (isConnected && isWrongNetwork) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-amber-400">Wrong network</span>
        <button
          onClick={() => switchChain({ chainId: sepolia.id })}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors shadow-sm cursor-pointer"
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
          className="group flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3.5 py-1.5 text-xs font-mono text-green-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer shadow-sm"
        >
          <span className="h-2 w-2 rounded-full bg-green-400 group-hover:bg-red-400 transition-colors" />
          <span>{address.slice(0, 6)}…{address.slice(-4)}</span>
          <span className="ml-1 text-[11px] font-sans font-medium text-slate-300 group-hover:text-red-400 transition-colors">
            ✕ Disconnect
          </span>
        </button>
      </div>
    );
  }

  const handlePrimaryClick = () => {
    if (connectors.length === 1) {
      connect({ connector: connectors[0] });
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        disabled={isPending}
        onClick={handlePrimaryClick}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
      >
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
        <span>{isPending ? "Connecting…" : "Connect Wallet"}</span>
      </button>

      {isOpen && connectors.length > 0 && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-white/10 bg-gray-900 p-1.5 shadow-2xl z-50">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5 mb-1">
            Choose Wallet Provider
          </div>
          <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setIsOpen(false);
                }}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-200 hover:bg-indigo-600/30 hover:text-white transition-all text-left cursor-pointer"
              >
                <span>{connector.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">Connect</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
