import { useBalance } from '@/hooks/useBalance'
import { cn } from '@/lib/utils'
import { useDisconnect, useModal, usePhantom } from '@phantom/react-sdk'
import { abbreviateNumber } from 'js-abbreviation-number'
import { Check, Copy } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Phantom from '../icons/phantom'
import { Button } from '../ui/button'

interface WalletProps {
  className?: string
}

const Wallet: React.FC<WalletProps> = ({ className }) => {
  const { open } = useModal()
  const { disconnect, isDisconnecting } = useDisconnect()
  const { balance, preferedPayment, setPreferedPayment, walletAddress } =
    useBalance()
  const { isConnected, isConnecting } = usePhantom()
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  useEffect(() => {
    if (copiedAddress) {
      navigator.clipboard.writeText(copiedAddress)
      const timeout = setTimeout(() => {
        setCopiedAddress(null)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copiedAddress])

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
          <div
            className={cn(
              'w-fit flex items-center gap-1 bg-gray-200 rounded-md mt-4 px-2 py-1 transition-colors duration-300',
              copiedAddress ? 'bg-green-500 text-white' : 'cursor-pointer'
            )}
            onClick={() => setCopiedAddress(walletAddress)}
          >
            {copiedAddress ? (
              <Check className="flex-1 text-white" size={16} />
            ) : (
              <Copy size={16} />
            )}
            <span className="max-w-[180px] text-sm truncate">
              {walletAddress}
            </span>
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
    <Button
      onClick={open}
      disabled={isConnecting}
      className={className}
      style={{ background: '#7d66d9' }}
    >
      <Phantom />
      Phantom Connect
    </Button>
  )
}

export default Wallet
