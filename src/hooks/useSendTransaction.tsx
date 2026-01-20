import { useSolana } from '@phantom/react-sdk'
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { Buffer } from 'buffer'
import { useCallback } from 'react'

import { usePaymentInfoLazyQuery } from '../../generated/graphql'

export const useSendTransaction = (tokenMint: string) => {
  const { solana } = useSolana()
  const [paymentInfoQuery] = usePaymentInfoLazyQuery({
    fetchPolicy: 'network-only',
  })

  const sendTransaction = useCallback(
    async (amount: number) => {
      const fromAddress = await solana.getPublicKey()

      if (!fromAddress) {
        throw new Error('Wallet not connected')
      }

      const { data: paymentInfoQueryData } = await paymentInfoQuery({
        variables: { publicKey: fromAddress as string, tokenMint },
      })

      if (!paymentInfoQueryData?.paymentInfo) {
        throw new Error('Payment info not found')
      }

      const { blockhash, fromPubKey, treasuryPubKey } =
        paymentInfoQueryData.paymentInfo

      if (!blockhash || !fromPubKey || !treasuryPubKey) {
        throw new Error('Incomplete payment info')
      }

      // Convert to lamports (smallest unit)
      const lamports = Math.floor(amount * 1_000_000)

      let instructions

      // Native SOL transfer
      if (tokenMint === 'SOL' || tokenMint === PublicKey.default.toBase58()) {
        instructions = [
          SystemProgram.transfer({
            fromPubkey: new PublicKey(fromPubKey),
            toPubkey: new PublicKey(treasuryPubKey),
            lamports,
          }),
        ]
      } else {
        // SPL Token transfer (UTCC or USDC)
        const mintPubkey = new PublicKey(tokenMint)

        console.log('Looking for mint:', mintPubkey.toBase58())
        console.log(
          'Treasury wallet:',
          new PublicKey(treasuryPubKey).toBase58()
        )

        // Create SPL token transfer instruction manually (without @solana/spl-token)
        const TOKEN_PROGRAM_ID = new PublicKey(
          'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        )

        const keys = [
          {
            pubkey: new PublicKey(fromPubKey),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: new PublicKey(treasuryPubKey),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: new PublicKey(fromAddress),
            isSigner: true,
            isWritable: false,
          },
        ]

        const data = Buffer.alloc(9)
        data.writeUInt8(3, 0) // Transfer instruction discriminator
        data.writeBigUInt64LE(BigInt(lamports), 1)

        instructions = [
          new TransactionInstruction({
            keys,
            programId: TOKEN_PROGRAM_ID,
            data,
          }),
        ]
      }

      const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(fromAddress),
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message()

      const transaction = new VersionedTransaction(messageV0)
      const result = await solana.signAndSendTransaction(transaction)
      return result.signature
    },
    [paymentInfoQuery, solana, tokenMint]
  )

  return { sendTransaction }
}
