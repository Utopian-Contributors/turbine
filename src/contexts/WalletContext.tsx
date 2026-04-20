import {
  AddressType,
  PhantomProvider,
  darkTheme,
  useDisconnect,
  useModal,
  usePhantom,
  useSolana,
} from '@phantom/react-sdk'
import {
  appendTransactionMessageInstructions,
  compileTransaction,
  createTransactionMessage,
  getTransactionEncoder,
  address as kitAddress,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  type Instruction,
} from '@solana/kit'
import { VersionedTransaction } from '@solana/web3.js'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { LatestBlockhashDocument, type LatestBlockhashQuery } from '../../generated/graphql'
import { client as apolloClient } from '../apollo'

const PHANTOM_APP_ID =
  import.meta.env.VITE_PHANTOM_APP_ID ||
  '929ccc32-7429-4797-8b04-513e32f5c017'

const PHANTOM_REDIRECT_URL =
  import.meta.env.VITE_PHANTOM_REDIRECT_URL ||
  `${window.location.origin}/wallet`

type AppWalletContextValue = {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  sendTransaction: (instructions: readonly Instruction[]) => Promise<string>
}

const AppWalletContext = createContext<AppWalletContextValue | null>(null)

function WalletBridgeProvider({ children }: { children: ReactNode }) {
  const { open } = useModal()
  const { isConnected } = usePhantom()
  const { solana } = useSolana()
  const { disconnect: phantomDisconnect } = useDisconnect()
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    if (isConnected) {
      setConnecting(false)
    }
  }, [isConnected])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connect = async () => {
    setConnecting(true)
    try {
      open()
    } finally {
      if (!isConnected) {
        setConnecting(false)
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const disconnect = async () => {
    await phantomDisconnect()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendTransaction = async (instructions: readonly Instruction[]) => {
    if (!solana.publicKey || !solana.isConnected) {
      throw new Error('No wallet connected')
    }

    // Fetch a recent blockhash from the backend
    const { data } = await apolloClient.query<LatestBlockhashQuery>({
      query: LatestBlockhashDocument,
      fetchPolicy: 'no-cache',
    })
    const latestBlockhash = {
      blockhash: data.latestBlockhash.blockhash as import('@solana/kit').Blockhash,
      lastValidBlockHeight: BigInt(data.latestBlockhash.lastValidBlockHeight),
    }

    const payerAddress = kitAddress(solana.publicKey)
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayer(payerAddress, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions(instructions, tx),
    )
    const compiled = compileTransaction(message)
    const serialized = getTransactionEncoder().encode(compiled)

    // Phantom expects a web3.js VersionedTransaction object
    const versionedTx = VersionedTransaction.deserialize(new Uint8Array(serialized))

    const { signature } = await solana.signAndSendTransaction(versionedTx)
    if (!signature) {
      throw new Error('Wallet did not return a transaction signature')
    }

    return signature
  }

  const value = useMemo<AppWalletContextValue>(
    () => ({
      connected: solana.isConnected,
      connecting,
      publicKey: solana.publicKey ?? null,
      connect,
      disconnect,
      sendTransaction,
    }),
    [solana.isConnected, solana.publicKey, connecting, connect, disconnect, sendTransaction],
  )

  return (
    <AppWalletContext.Provider value={value}>{children}</AppWalletContext.Provider>
  )
}

export function WalletContextProvider({ children }: { children: ReactNode }) {
  return (
    <PhantomProvider
      config={{
        providers: ['google', 'apple', 'injected'],
        appId: PHANTOM_APP_ID,
        addressTypes: [AddressType.solana],
        authOptions: {
          redirectUrl: PHANTOM_REDIRECT_URL,
        },
      }}
      theme={darkTheme}
      appIcon="https://phantom-portal20240925173430423400000001.s3.ca-central-1.amazonaws.com/icons/c43a83bb-cc86-4ec7-b9eb-d6cb90a4efcc.png"
      appName="Turbine"
    >
      <WalletBridgeProvider>
        {children}
      </WalletBridgeProvider>
    </PhantomProvider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWallet() {
  const ctx = useContext(AppWalletContext)
  if (!ctx) {
    throw new Error('useWallet must be used within WalletContextProvider')
  }

  return {
    connected: ctx.connected,
    connecting: ctx.connecting,
    publicKey: ctx.publicKey,
    connect: ctx.connect,
    disconnect: ctx.disconnect,
    sendTransaction: ctx.sendTransaction,
  }
}
