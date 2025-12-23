import {
  USDC_MINT_ADDRESS,
  useBalance,
  UTCC_MINT_ADDRESS,
} from '@/hooks/useBalance'
import { cn } from '@/lib/utils'
import { useSolana } from '@phantom/react-sdk'
import { PublicKey } from '@solana/web3.js'
import React, { useMemo } from 'react'

interface PricetagProps {
  className?: string
  price?: number
  tokenMint?: string
}

const Pricetag: React.FC<PricetagProps> = ({ className, price, tokenMint }) => {
  const { solana } = useSolana()
  const { preferedPayment } = useBalance(solana.publicKey)

  const defaultPrice = useMemo(() => {
    if (preferedPayment === UTCC_MINT_ADDRESS.toBase58()) {
      return '1000'
    } else if (preferedPayment === USDC_MINT_ADDRESS.toBase58()) {
      return '1'
    } else {
      return '0.01'
    }
  }, [preferedPayment])

  const method = useMemo(() => {
    if (tokenMint) {
      return tokenMint
    }
    return preferedPayment
  }, [tokenMint, preferedPayment])

  return (
    <div
      className={cn(
        'w-fit h-fit border rounded-full text-md px-2',
        method === UTCC_MINT_ADDRESS.toBase58()
          ? 'border-green-500 bg-gradient-to-b from-white to-green-100 text-green-500'
          : '',
        method === USDC_MINT_ADDRESS.toBase58()
          ? 'border-blue-500 bg-gradient-to-b from-white to-blue-100 text-blue-500'
          : '',
        method === PublicKey.default.toBase58()
          ? 'border-purple-500 bg-gradient-to-b from-white to-purple-100 text-purple-500'
          : '',
        className
      )}
    >
      {price || defaultPrice}{' '}
      {method === UTCC_MINT_ADDRESS.toBase58()
        ? 'UTCC'
        : method === USDC_MINT_ADDRESS.toBase58()
        ? 'USDC'
        : 'SOL'}
    </div>
  )
}

export default Pricetag
