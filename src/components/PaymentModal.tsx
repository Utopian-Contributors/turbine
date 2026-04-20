import { TREASURY_ADDRESS, UTCC_MINT } from '@/config/tokens'
import { useWallet } from '@/contexts/WalletContext'
import {
  findAssociatedTokenPda,
  getTransferInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token'
import {
  address,
  isAddress,
  getUtf8Encoder,
  type Instruction,
} from '@solana/kit'
import { ArrowRight, Check, Globe, Lock, Loader2 } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

const MEMO_PROGRAM_ADDRESS = address('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')

function isValidSolanaAddress(value: string): boolean {
  return isAddress(value)
}

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onConfirmed: (txSignature: string) => void
  amount: string
  memo: string
  /** When provided, creates multiple memo instructions (one per entry) instead of a single memo. */
  memos?: string[]
  title: string
  description?: string
  publicDataNotice?: boolean
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onConfirmed,
  amount,
  memo,
  memos,
  title,
  description,
  publicDataNotice,
}) => {
  const wallet = useWallet()
  const [status, setStatus] = useState<
    'idle' | 'building' | 'signing' | 'confirming' | 'confirmed' | 'error'
  >('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setStatus('idle')
      setError(null)
    }
  }, [open])

  const handlePay = useCallback(async () => {
    if (!wallet.publicKey || !wallet.sendTransaction) return

    setStatus('building')
    setError(null)

    try {
      if (!UTCC_MINT || !isValidSolanaAddress(UTCC_MINT)) {
        throw new Error('UTCC mint address is missing or invalid. Check VITE_UTCC_MINT_ADDRESS.')
      }

      if (!TREASURY_ADDRESS || !isValidSolanaAddress(TREASURY_ADDRESS)) {
        throw new Error('Treasury wallet address is missing or invalid. Check VITE_TREASURY_WALLET_ADDRESS.')
      }

      if (!isValidSolanaAddress(wallet.publicKey)) {
        throw new Error('Connected wallet address is invalid. Reconnect your wallet and try again.')
      }

      const mintAddress = address(UTCC_MINT)
      const treasuryAddress = address(TREASURY_ADDRESS)
      const senderAddress = address(wallet.publicKey)

      const [senderAta] = await findAssociatedTokenPda({
        owner: senderAddress,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        mint: mintAddress,
      })
      const [treasuryAta] = await findAssociatedTokenPda({
        owner: treasuryAddress,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        mint: mintAddress,
      })

      // Build SPL token transfer instruction
      // Amount is in whole tokens — multiply by 10^decimals for raw units
      const UTCC_DECIMALS = 6
      const amountLamports = BigInt(Math.round(Number(amount) * 10 ** UTCC_DECIMALS))
      const transferIx = getTransferInstruction({
        source: senderAta,
        destination: treasuryAta,
        authority: senderAddress,
        amount: amountLamports,
      })

      const memoList = memos && memos.length > 0 ? memos : [memo]
      const memoInstructions: Instruction[] = memoList.map((m) => ({
        accounts: [
          {
            address: senderAddress,
            role: 3 as const, // AccountRole.WRITABLE_SIGNER
          },
        ],
        programAddress: MEMO_PROGRAM_ADDRESS,
        data: getUtf8Encoder().encode(m),
      }))

      setStatus('signing')
      const signature = await wallet.sendTransaction([transferIx, ...memoInstructions])

      setStatus('confirmed')
      onConfirmed(signature)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed')
      setStatus('idle')
    }
  }, [wallet, amount, memo, memos, onConfirmed])

  const statusLabel = {
    idle: 'Pay with Wallet',
    building: 'Preparing...',
    signing: 'Sign in Phantom...',
    confirming: 'Confirming...',
    confirmed: 'Confirmed',
    error: 'Pay with Wallet',
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[340px] gap-0 p-0 overflow-hidden border-0 shadow-2xl"
        style={{ background: '#ffffff', borderRadius: 20 }}
      >
        <DialogHeader className="items-center pt-10 pb-2 px-8 gap-1">
          <DialogTitle
            className="text-[13px] font-medium tracking-wide uppercase"
            style={{ color: '#86868b', letterSpacing: '0.08em' }}
          >
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription
              className="text-[12px] font-normal text-center"
              style={{ color: '#aeaeb2' }}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-col items-center px-8 pb-10">
          <div className="pt-2 pb-8">
            <span
              className="text-[42px] font-extralight tracking-tight leading-none"
              style={{ color: '#1d1d1f' }}
            >
              {amount}
            </span>
            <span
              className="text-[14px] font-normal ml-1.5"
              style={{ color: '#86868b' }}
            >
              UTCC
            </span>
          </div>

          {publicDataNotice && (
            <div
              className="w-full rounded-xl px-4 py-3 mb-4"
              style={{ background: '#f5f5f7' }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Lock className="w-3.5 h-3.5" style={{ color: '#86868b' }} />
                <ArrowRight className="w-3 h-3" style={{ color: '#aeaeb2' }} />
                <Globe className="w-3.5 h-3.5" style={{ color: '#30d158' }} />
              </div>
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: '#86868b' }}
              >
                Paying places your bid on-chain. The highest bidder wins ad placement on this keyword.
              </p>
            </div>
          )}

          {status !== 'confirmed' && (
            <button
              onClick={handlePay}
              disabled={
                status !== 'idle' || !wallet.connected || !wallet.publicKey
              }
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13px] font-medium transition-all disabled:opacity-40"
              style={{ background: '#1d1d1f', color: '#ffffff' }}
            >
              {(status === 'building' ||
                status === 'signing' ||
                status === 'confirming') && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              {statusLabel[status]}
            </button>
          )}

          {status === 'confirmed' && (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: '#30d158' }}
              >
                <Check className="w-6 h-6 text-white" />
              </div>
              <p
                className="text-[12px] font-medium"
                style={{ color: '#30d158' }}
              >
                Payment confirmed
              </p>
            </div>
          )}

          {status === 'confirming' && (
            <div className="mt-4 w-full">
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: '#f2f2f7' }}
              >
                <div
                  className="h-full rounded-full animate-pulse"
                  style={{ background: '#30d158', width: '60%' }}
                />
              </div>
              <p
                className="text-[10px] text-center mt-2"
                style={{ color: '#aeaeb2' }}
              >
                Verifying on-chain...
              </p>
            </div>
          )}

          {error && (
            <p
              className="text-[11px] font-medium pt-4 text-center"
              style={{ color: '#ff3b30' }}
            >
              {error}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 text-[13px] font-normal transition-colors"
          style={{
            color: '#007aff',
            borderTop: '1px solid #f2f2f7',
            background: 'transparent',
          }}
        >
          Cancel
        </button>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentModal
