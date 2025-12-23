import { PublicKey } from '@solana/web3.js'
import { atom } from 'recoil'
import { localStorageEffect } from './effects/localStorage'

const UTCC_MINT_ADDRESS = new PublicKey(
  'HGTXnhgyast5fJKhMcE4VgyeEVWhYKEsHxpZtpjhrYqA'
)

export const preferedPaymentState = atom<string>({
  key: 'preferedPaymentState',
  default: UTCC_MINT_ADDRESS.toBase58(),
  effects: [localStorageEffect('preferedPayment')],
})
