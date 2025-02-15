import { createPublicClient } from "viem";

//new rainbow setup
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

//SETUP NEW DESIRED CHAINS
const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: "Nft Minting App",
  projectId: "YOUR_PROJECT_ID",
  chains: [sepolia],
  transports: { [sepolia.id]: http(import.meta.env.VITE_MY_RPC_URL) },
  ssr: false,
});

// // Define the RPC client using Viem
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(import.meta.env.VITE_MY_RPC_URL), // Place your RPC URL here
});

// WalletProvider component
const WalletProvider = ({ children }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default WalletProvider;
