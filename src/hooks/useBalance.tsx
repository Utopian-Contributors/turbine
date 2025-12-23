import { preferedPaymentState } from '@/state/payment'
import { Connection, PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

interface PlatformBalance {
  sol?: { amount: number; mint: string }
  utcc?: { amount: number; mint: string }
  usdc?: { amount: number; mint: string }
}

interface UseBalanceReturn {
  preferedPayment: string
  setPreferedPayment: (mint: string) => void
  balance: PlatformBalance | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
)
export const UTCC_MINT_ADDRESS = new PublicKey(
  'HGTXnhgyast5fJKhMcE4VgyeEVWhYKEsHxpZtpjhrYqA'
)
export const USDC_MINT_ADDRESS = new PublicKey(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
)

export function useBalance(addressValue: string | null): UseBalanceReturn {
  const [preferedPayment, setPreferedPayment] =
    useRecoilState(preferedPaymentState)
  const [balance, setBalance] = useState<PlatformBalance | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rpcUrl =
    import.meta.env.VITE_SOLANA_RPC_ENDPOINT ||
    'https://api.mainnet-beta.solana.com'

  const fetchBalance = useCallback(async () => {
    if (!addressValue) {
      setBalance(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const connection = new Connection(rpcUrl)
      const publicKey = new PublicKey(addressValue)
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      )
      const utccBalance = tokenAccounts.value.find((accountInfo) => {
        const accountData = accountInfo.account.data
        return accountData.parsed.info.mint === UTCC_MINT_ADDRESS.toBase58()
      })?.account.data.parsed.info.tokenAmount.uiAmount
      const usdcBalance = tokenAccounts.value
        .find((accountInfo) => {
          const accountData = accountInfo.account.data
          return accountData.parsed.info.mint === USDC_MINT_ADDRESS.toBase58()
        })
        ?.account.data.parsed.info.tokenAmount.uiAmount.toFixed(2)
      const solBalanceLamports = await connection.getBalance(publicKey)
      const solBalance = solBalanceLamports / 1e9 // Convert lamports to SOL
      setBalance({
        utcc: {
          amount: Number(utccBalance ?? 0),
          mint: UTCC_MINT_ADDRESS.toBase58(),
        },
        sol: {
          amount: Number(solBalance ?? 0),
          mint: PublicKey.default.toBase58(),
        },
        usdc: {
          amount: Number(usdcBalance ?? 0),
          mint: USDC_MINT_ADDRESS.toBase58(),
        },
      })
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch balance')
      setBalance(null)
    } finally {
      setLoading(false)
    }
  }, [addressValue, rpcUrl])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    preferedPayment,
    setPreferedPayment,
    balance,
    loading,
    error,
    refetch: fetchBalance,
  }
}
