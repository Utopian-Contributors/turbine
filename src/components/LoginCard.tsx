import { useWallet } from '@/contexts/WalletContext'
import { Loader2, Wallet } from 'lucide-react'
import React, { useCallback, useState } from 'react'

interface LoginCardProps {
  message?: string
}

const LoginCard: React.FC<LoginCardProps> = ({ message }) => {
  const wallet = useWallet()
  const [error, setError] = useState<string | null>(null)

  const handleConnect = useCallback(async () => {
    setError(null)
    try {
      await wallet.connect()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wallet connection failed')
    }
  }, [wallet])

  return (
    <div
      className="rounded-xl px-6 py-8 flex flex-col items-center gap-4 text-center"
      style={{ background: '#faf8f5', border: '1px solid #e8e4de', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <Wallet className="w-10 h-10" style={{ color: '#c0bbb2' }} />
      {message && (
        <p className="text-[14px] font-medium" style={{ color: '#3a3632' }}>
          {message}
        </p>
      )}
      <p className="text-[12px]" style={{ color: '#a8a49c' }}>
        Connect your Phantom wallet to sign in.
      </p>

      <div className="flex flex-col gap-2 w-full max-w-[260px] mt-1">
        <button
          onClick={handleConnect}
          disabled={wallet.connecting}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold transition-colors disabled:opacity-60"
          style={{ background: '#3a3632', color: '#f5f2ed' }}
        >
          {wallet.connecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          {wallet.connecting ? 'Connecting...' : 'Connect Phantom'}
        </button>
      </div>

      {error && (
        <p className="text-[11px] font-medium" style={{ color: '#ff453a' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default LoginCard
