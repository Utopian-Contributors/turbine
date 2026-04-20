import LoginCard from '@/components/LoginCard'
import { useAuth } from '@/contexts/AuthContext'
import { useWalletBalances } from '@/hooks/useWalletBalances'
import { Loader2, RefreshCw, Wallet } from 'lucide-react'
import React, { useEffect } from 'react'

const WalletPage: React.FC = () => {
  const { user } = useAuth()
  const { balances, loading: balanceLoading, refresh: refreshBalance } = useWalletBalances(user?.walletAddress)
  useEffect(() => { document.title = 'Utopian | Wallet' }, [])

  if (!user) {
    return (
      <div className="w-full min-h-screen apple-page">
        <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
          <LoginCard message="Sign in to access your wallet" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">

        {/* Token balances */}
        <div className="flex flex-col gap-3 mb-4">
          {balanceLoading && balances.length === 0 ? (
            <div
              className="rounded-xl px-6 py-6 flex items-center justify-center apple-panel-soft"
            >
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--apple-text-faint)' }} />
            </div>
          ) : balances.length > 0 ? (
            balances.map((token) => (
              <div
                key={token.mint}
                className="rounded-xl px-6 py-5 flex items-center justify-between apple-panel-soft"
              >
                <div className="flex items-center gap-4">
                  <Wallet className="w-6 h-6" style={{ color: 'var(--apple-green)' }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--apple-text-muted)' }}>
                      {token.name}
                    </p>
                    <p className="text-2xl font-extrabold" style={{ color: 'var(--apple-text-primary)' }}>
                      {token.amount.toLocaleString(undefined, { maximumFractionDigits: token.mint === 'SOL' ? 4 : 2 })}
                      {' '}
                      <span className="text-base font-bold" style={{ color: 'var(--apple-text-secondary)' }}>
                        {token.symbol}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="rounded-xl px-6 py-6 flex items-center gap-4 apple-panel-soft"
            >
              <Wallet className="w-6 h-6" style={{ color: 'var(--apple-text-faint)' }} />
              <p className="text-[13px]" style={{ color: 'var(--apple-text-secondary)' }}>No balances found</p>
            </div>
          )}
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between mb-2">
          {/* Wallet address */}
          {user.walletAddress && (
            <p className="text-[10px] font-mono truncate flex-1 mr-3" style={{ color: 'var(--apple-text-faint)' }}>
              {user.walletAddress}
            </p>
          )}
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#a8a49c' }}
              onClick={refreshBalance}
              disabled={balanceLoading}
              title="Refresh balances"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${balanceLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default WalletPage
