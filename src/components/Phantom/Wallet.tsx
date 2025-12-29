import { useBalance } from '@/hooks/useBalance'
import { cn } from '@/lib/utils'
import {
  useDisconnect,
  useModal,
  usePhantom,
  useSolana,
} from '@phantom/react-sdk'
import { abbreviateNumber } from 'js-abbreviation-number'
import React from 'react'
import { Button } from '../ui/button'

interface WalletProps {
  className?: string
}

const Wallet: React.FC<WalletProps> = ({className}) => {
  const { open } = useModal()
  const { disconnect, isDisconnecting } = useDisconnect()
  const { solana } = useSolana()
  const { balance, preferedPayment, setPreferedPayment } = useBalance(
    solana.publicKey
  )
  const { isConnected, isConnecting } = usePhantom()

  if (isConnected) {
    return (
      <div>
        <div className="mb-4">
          <div className="font-light mb-2 text-gray-400">Balance</div>
          <div className="flex flex-col gap-2">
            <div
              className={cn(
                'w-fit border border-green-500 bg-gradient-to-b from-white to-green-500/10 rounded-full text-md text-green-500 px-2',
                preferedPayment === balance?.utcc?.mint
                  ? 'opacity-100 shadow-sm'
                  : 'opacity-30 hover:opacity-100 transition-opacity duration-300 cursor-pointer'
              )}
              onClick={() => {
                if (balance?.utcc?.mint) setPreferedPayment(balance?.utcc?.mint)
              }}
            >
              {abbreviateNumber(balance?.utcc?.amount ?? 0, 4)} UTCC
            </div>
            <div
              className={cn(
                'w-fit border border-blue-500 bg-gradient-to-b from-white to-blue-500/10 rounded-full text-md text-blue-500 px-2',
                preferedPayment === balance?.usdc?.mint
                  ? 'opacity-100 shadow-sm'
                  : 'opacity-30 hover:opacity-100 transition-opacity duration-300 cursor-pointer'
              )}
              onClick={() => {
                if (balance?.usdc?.mint) setPreferedPayment(balance?.usdc?.mint)
              }}
            >
              {abbreviateNumber(balance?.usdc?.amount ?? 0)} USDC
            </div>
            <div
              className={cn(
                'w-fit border border-purple-500 bg-gradient-to-b from-white to-purple-500/10 rounded-full text-md text-purple-500 px-2',
                preferedPayment === balance?.sol?.mint
                  ? 'opacity-100 shadow-sm'
                  : 'opacity-30 hover:opacity-100 transition-opacity duration-300 cursor-pointer'
              )}
              onClick={() => {
                if (balance?.sol?.mint) setPreferedPayment(balance?.sol?.mint)
              }}
            >
              {abbreviateNumber(balance?.sol?.amount ?? 0)} SOL
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="w-full"
            variant="outline"
            onClick={disconnect}
            disabled={isDisconnecting}
          >
            Disconnect Wallet
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button onClick={open} disabled={isConnecting} className={className}>
      Connect Wallet
    </Button>
  )
}

export default Wallet
