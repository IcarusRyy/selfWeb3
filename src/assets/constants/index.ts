import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { goerli, mainnet, arbitrum, arbitrumGoerli, localhost } from 'wagmi/chains'
export const WALLETCONNECTPROJECTID = '2aca272d18deb10ff748260da5f78bfd'

export const chains = [mainnet, localhost, goerli, arbitrum, arbitrumGoerli]

const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId: WALLETCONNECTPROJECTID }),
  jsonRpcProvider({
    rpc: chain => ({
      http: `https://fork.refitor.com`,
    }),
  }),
])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId: WALLETCONNECTPROJECTID, chains: chains }),
  publicClient,
})
export const ethereumClient = new EthereumClient(wagmiConfig, chains)
