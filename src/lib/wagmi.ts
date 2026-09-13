import { createConfig, http } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { SEPOLIA_RPC_URL } from "@/lib/config";

// WalletConnect Project ID — set NEXT_PUBLIC_WC_PROJECT_ID in .env.local
const wcProjectId =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "placeholder-wc-project-id";

export const wagmiConfig = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(), // MetaMask and other injected wallets
    walletConnect({ projectId: wcProjectId }),
  ],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC_URL),
    [mainnet.id]: http(), // Fallback public RPC for mainnet ENS resolution
  },
});
