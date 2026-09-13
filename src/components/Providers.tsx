"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { ReactNode, useState } from "react";

import { SubmissionProvider } from "./SubmissionContext";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SubmissionProvider>{children}</SubmissionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
