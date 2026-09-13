"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance } from "wagmi";
import { sepolia } from "wagmi/chains";
import { formatUnits } from "viem";
import { getWalletIcon } from "./WalletIcons";
import { LegalModal, LegalTab } from "./LegalModal";

const Icons = {
  X: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  ArrowLeft: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Settings: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Power: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.36 5.64a9 9 0 11-12.72 0M12 3v9" /></svg>,
  Send: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" /></svg>,
  Receive: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12l7 7 7-7" /></svg>,
  User: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  QrCode: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>,
  Copy: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Check: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  ExternalLink: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  RBLogo: (props: any) => (
    <svg {...props} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="24" fill="white"/>
      <path d="M70 30L30 50L70 70V30Z" fill="#E81CFF"/>
      <path d="M40 30L60 50L40 70V30Z" fill="#FF1C85"/>
    </svg>
  ),
  Wallet: (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5m-4 0h4m-4 0a2 2 0 100-4 2 2 0 000 4z" /></svg>
};

export function WalletConnect() {
  const { address, isConnected, chain, connector: activeConnector } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({ address, chainId: sepolia.id });
  
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>("tos");
  const [copied, setCopied] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== sepolia.id;
  
  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrimaryClick = () => {
    if (isConnected) {
      if (isWrongNetwork) {
        switchChain({ chainId: sepolia.id });
      } else {
        setIsAccountModalOpen(true);
      }
    } else {
      setIsConnectModalOpen(true);
    }
  };

  const openLegalModal = (tab: LegalTab) => {
    setLegalTab(tab);
    setIsLegalModalOpen(true);
  };

  const ConnectModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#191C20] shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-white/5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <button 
            onClick={() => setIsConnectModalOpen(false)} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Connect wallet</h2>
          <button 
            onClick={() => setIsConnectModalOpen(false)} 
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 pt-2 flex flex-col gap-1 max-h-72 overflow-y-auto custom-scrollbar">
          {connectors.map(connector => {
            const IconComponent = getWalletIcon(connector.name);
            return (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setIsConnectModalOpen(false);
                }}
                className="w-full rounded-2xl p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-10 h-10 rounded-xl" />
                  <span className="text-gray-900 dark:text-white font-semibold text-[15px] group-hover:text-indigo-500 transition-colors">{connector.name}</span>
                </div>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Detected</span>
              </button>
            );
          })}
        </div>

        <div className="p-5 text-center bg-gray-50/50 dark:bg-white/[0.02] mt-2">
          <p className="text-[12px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
            By connecting a wallet, you agree to Reality Bridge&apos;s{" "}
            <button
              type="button"
              onClick={() => openLegalModal("tos")}
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2 hover:text-indigo-500 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>{" "}
            and consent to its{" "}
            <button
              type="button"
              onClick={() => openLegalModal("privacy")}
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2 hover:text-indigo-500 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>.
          </p>
        </div>
      </div>
    </div>
  );

  const AccountModal = () => {
    const ActiveIcon = activeConnector ? getWalletIcon(activeConnector.name) : getWalletIcon('default');
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div 
          className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#191C20] shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-white/5"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 pb-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white dark:border-[#191C20] shrink-0" />
                <ActiveIcon className="w-4 h-4 absolute -bottom-1 -right-1 rounded-full border border-white dark:border-[#191C20]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Connected</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activeConnector?.name || 'Wallet'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <button 
                onClick={() => {
                  disconnect();
                  setIsAccountModalOpen(false);
                }} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-red-500 hover:text-red-600"
              >
                <Icons.Power className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 group cursor-pointer w-max" onClick={handleCopy}>
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {address ? formatAddress(address) : ''}
              </span>
              {copied ? <Icons.Check className="w-5 h-5 text-green-500" /> : <Icons.Copy className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {balanceData ? parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4) : "0.00"}
              </span>
              <span className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-1">SEP ETH</span>
            </div>
            <span className="text-sm font-medium text-green-500 flex items-center gap-1 mt-1">
              Testnet Balance
            </span>
          </div>

          <div className="px-4 pb-4 mt-2">
            <a 
              href={`https://sepolia.etherscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
            >
              View on Explorer <Icons.ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  const TriggerIcon = isConnected && activeConnector ? getWalletIcon(activeConnector.name) : Icons.Wallet;

  return (
    <>
      <button
        onClick={handlePrimaryClick}
        disabled={isPending}
        className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all shadow-sm
          ${isConnected 
            ? isWrongNetwork
              ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            : "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-600/20"}
        `}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Connecting...
          </span>
        ) : isConnected && address ? (
          isWrongNetwork ? (
            <span className="flex items-center gap-2">Wrong Network</span>
          ) : (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mr-1" />
              {formatAddress(address)}
            </span>
          )
        ) : (
          <span className="flex items-center gap-2">
            Connect Wallet
          </span>
        )}
      </button>

      {isConnectModalOpen && (
        <div className="fixed inset-0 z-[100]" onClick={() => setIsConnectModalOpen(false)}>
           <ConnectModal />
        </div>
      )}

      {isAccountModalOpen && (
        <div className="fixed inset-0 z-[100]" onClick={() => setIsAccountModalOpen(false)}>
           <AccountModal />
        </div>
      )}

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </>
  );
}
