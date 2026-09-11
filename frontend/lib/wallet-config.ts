import { createConfig, http, injected } from "@wagmi/core";
import { DEFAULT_NETWORK_CONFIG } from "@tikka/core";

const chain = DEFAULT_NETWORK_CONFIG.chain;

export const wagmiConfig = createConfig({
  chains: [chain],
  connectors: [injected()],
  transports: {
    [chain.id]: http(),
  },
});
