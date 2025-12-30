import { useSolana } from '@phantom/react-sdk'
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { Buffer } from 'buffer'

const SOLANA_RPC_ENDPOINT = import.meta.env.VITE_SOLANA_RPC_ENDPOINT!
const TREASURY_WALLET_ADDRESS = import.meta.env.VITE_TREASURY_WALLET_ADDRESS!

export const useSendTransaction = (tokenMint: string) => {
  const { solana } = useSolana()

  const sendTransaction = async (amount: number): Promise<string> => {
    const connection = new Connection(SOLANA_RPC_ENDPOINT)
    const { blockhash } = await connection.getLatestBlockhash()
    const fromAddress = (await solana.getPublicKey())!
    const fromPubkey = new PublicKey(fromAddress)
    const toPubkey = new PublicKey(TREASURY_WALLET_ADDRESS)

    // Convert to lamports (smallest unit)
    const lamports = Math.floor(amount * 1_000_000)

    let instructions

    // Native SOL transfer
    if (tokenMint === 'SOL' || tokenMint === PublicKey.default.toBase58()) {
      instructions = [
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        }),
      ]
    } else {
      // SPL Token transfer (UTCC or USDC)
      const mintPubkey = new PublicKey(tokenMint)

      // Get or create associated token accounts
      const fromTokenAccount = await connection.getParsedTokenAccountsByOwner(
        fromPubkey,
        { mint: mintPubkey }
      )

      if (fromTokenAccount.value.length === 0) {
        throw new Error('No token account found for mint: ' + tokenMint)
      }

      const toTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        toPubkey,
        { mint: mintPubkey }
      )

      console.log('Looking for mint:', mintPubkey.toBase58())
      console.log('Treasury wallet:', toPubkey.toBase58())

      // Create SPL token transfer instruction manually (without @solana/spl-token)
      const TOKEN_PROGRAM_ID = new PublicKey(
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      )

      const keys = [
        {
          pubkey: fromTokenAccount.value[0].pubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: toTokenAccounts.value[0].pubkey,
          isSigner: false,
          isWritable: true,
        },
        { pubkey: fromPubkey, isSigner: true, isWritable: false },
      ]

      const data = Buffer.alloc(9)
      data.writeUInt8(3, 0) // Transfer instruction discriminator
      data.writeBigUInt64LE(BigInt(lamports) as unknown as number, 1)

      instructions = [
        new TransactionInstruction({
          keys,
          programId: TOKEN_PROGRAM_ID,
          data,
        }),
      ]
    }

    const messageV0 = new TransactionMessage({
      payerKey: fromPubkey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message()

    const transaction = new VersionedTransaction(messageV0)
    const result = await solana.signAndSendTransaction(transaction)
    return result.signature
  }

  return { sendTransaction }
}
