import { preferedPaymentState } from '@/state/payment'
import { useSolana } from '@phantom/react-sdk'
import { PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { usePaymentInfoLazyQuery } from '../../generated/graphql'

interface PlatformBalance {
  sol?: { amount: number; mint: string }
  utcc?: { amount: number; mint: string }
  usdc?: { amount: number; mint: string }
}

interface UseBalanceReturn {
  preferedPayment: string
  walletAddress: string | null
  setPreferedPayment: (mint: string) => void
  balance: PlatformBalance | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const UTCC_MINT_ADDRESS = new PublicKey(
  'HGTXnhgyast5fJKhMcE4VgyeEVWhYKEsHxpZtpjhrYqA'
)
export const USDC_MINT_ADDRESS = new PublicKey(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
)

export function useBalance(): UseBalanceReturn {
  const [preferedPayment, setPreferedPayment] =
    useRecoilState(preferedPaymentState)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const { solana } = useSolana()
  const [paymentInfoQuery, { data: paymentInfoQueryData, loading, error }] =
    usePaymentInfoLazyQuery()

  const fetchBalance = useCallback(async () => {
    const publicKey = await solana.getPublicKey()
    setWalletAddress(publicKey)
    if (publicKey) {
      await paymentInfoQuery({
        variables: { publicKey },
        fetchPolicy: 'network-only',
      })
    }
  }, [paymentInfoQuery, solana])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    preferedPayment,
    setPreferedPayment,
    walletAddress,
    balance: {
      utcc: paymentInfoQueryData?.paymentInfo?.utccBalance,
      usdc: paymentInfoQueryData?.paymentInfo?.usdcBalance,
      sol: paymentInfoQueryData?.paymentInfo?.solBalance,
    },
    loading,
    error: error ? error.message : null,
    refetch: fetchBalance,
  }
}
