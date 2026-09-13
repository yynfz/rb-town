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
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Report Lived Reality &rarr;
        </button>
      )}
    />
  );
}
