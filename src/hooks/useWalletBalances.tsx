import { useCallback, useMemo } from 'react'
import { useWalletBalancesQuery } from '../../generated/graphql'

interface TokenInfo {
  mint: string
  symbol: string
  name: string
  decimals: number
}

export interface TokenBalance extends TokenInfo {
  amount: number
}

export function useWalletBalances(walletAddress: string | null | undefined) {
  const { data, loading, refetch } = useWalletBalancesQuery({
    variables: { walletAddress: walletAddress ?? '' },
    skip: !walletAddress,
    fetchPolicy: 'network-only',
  })

  const balances = useMemo(
    () => ((data?.walletBalances ?? []) as TokenBalance[]),
    [data?.walletBalances],
  )

  const refresh = useCallback(async () => {
    if (!walletAddress) return
    await refetch({ walletAddress })
  }, [walletAddress, refetch])

  return { balances, loading, refresh }
}
