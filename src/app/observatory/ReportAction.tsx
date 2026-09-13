"use client";

import { WalletConnect } from "@/components/WalletConnect";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ReportAction() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [isAttemptingConnect, setIsAttemptingConnect] = useState(false);

  useEffect(() => {
    // If the user successfully connects via this action, route to home
    if (isConnected && isAttemptingConnect) {
      router.push("/");
    }
  }, [isConnected, isAttemptingConnect, router]);

  return (
    <WalletConnect
      customTrigger={(onClick) => (
        <button
          onClick={() => {
            if (isConnected) {
              // Already connected, just route directly
              router.push("/");
            } else {
              setIsAttemptingConnect(true);
              onClick();
            }
          }}
          className="group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all shadow-sm bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-600/20"
        >
          Report Lived Reality &rarr;
        </button>
      )}
    />
  );
}
