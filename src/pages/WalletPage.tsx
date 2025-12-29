import React, { useState } from 'react'

import Wallet from '@/components/Phantom/Wallet'
import { Button } from '@/components/ui/button'
import { useWalletOrAccLogin } from '@/hooks/useWalletOrAccLogin'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WalletPageProps {}

const WalletPage: React.FC<WalletPageProps> = () => {
  const navigate = useNavigate()
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const { isLoggedIn, isConnected, addresses, user, loginRedirect } =
    useWalletOrAccLogin()

  return (
    <div className="p-4">
      {isLoggedIn ? (
        <div className="w-full flex justify-between">
          <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
          <Button
            size="icon"
            variant="outline"
            onClick={() => navigate('/auth/logout', { replace: true })}
          >
            <LogOut className="text-red-500" />
          </Button>
        </div>
      ) : (
        <div className="w-full mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            Please log in to view your wallet.
          </h1>
          <div className="w-full flex gap-2 mt-4">
            <Button
              className="flex-1"
              onClick={() => {
                loginRedirect()
              }}
            >
              Log in
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                navigate('/auth/signup')
              }}
            >
              Sign up
            </Button>
          </div>
        </div>
      )}
      {isLoggedIn && <Wallet className="mt-4" />}
      {isLoggedIn && isConnected && (
        <div className="flex flex-col gap-2 my-4">
          <h3>
            You can add funds to this wallet by sending them your embedded
            wallet address:
          </h3>
          <h3
            className="break-all font-mono bg-gray-100 p-2 rounded"
            onClick={() => {
              if (addresses[0].address) {
                navigator.clipboard.writeText(addresses[0].address)
                setCopiedAddress(addresses[0].address)
                setTimeout(() => {
                  setCopiedAddress(null)
                }, 2000)
              }
            }}
          >
            {addresses && addresses.length > 0
              ? addresses[0].address
              : 'No address found'}
          </h3>
          {copiedAddress && (
            <span className="text-gray-500 text-sm">Copied to clipboard!</span>
          )}
        </div>
      )}
    </div>
  )
}

export default WalletPage
