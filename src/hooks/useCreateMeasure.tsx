import type { FetchResult } from '@apollo/client'
import { useModal, usePhantom, useSolana } from '@phantom/react-sdk'
import { PublicKey } from '@solana/web3.js'
import {
  DeviceType,
  MeasurementsDocument,
  useCreateMeasurementMutation,
  useMeasurementPricesQuery,
  type ConnectionType,
  type CreateMeasurementMutation,
} from '../../generated/graphql'
import { USDC_MINT_ADDRESS, useBalance, UTCC_MINT_ADDRESS } from './useBalance'
import { useSendTransaction } from './useSendTransaction'

interface CreateMeasureArgs {
  url?: string
  remeasure?: boolean
  device: DeviceType
  connection: ConnectionType
}

export const useCreateMeasure = ({ url }: { url: string }) => {
  const { data: measurementPricesData } = useMeasurementPricesQuery()
  const [createMeasurement, response] = useCreateMeasurementMutation({
    refetchQueries: [
      {
        query: MeasurementsDocument,
        variables: {
          url,
        },
      },
    ],
  })
  const { solana } = useSolana()
  const { isConnected } = usePhantom()
  const { open } = useModal()
  const { balance, preferedPayment: tokenMint } = useBalance(solana.publicKey)

  const { sendTransaction } = useSendTransaction(tokenMint)
  let signature: string | null = null

  const createMeasure = async (
    options: CreateMeasureArgs
  ): Promise<FetchResult<CreateMeasurementMutation>> => {
    const { remeasure, device, connection } = options
    if (options.url) {
      url = options.url
    }

    if (!isConnected) {
      await open()
    }

    const walletAddress = await solana.getPublicKey()
    if (!walletAddress) {
      throw new Error('Wallet not connected')
    }

    // 1. Send tokens to treasury address
    if (tokenMint === UTCC_MINT_ADDRESS.toBase58()) {
      const measurementPrice = measurementPricesData?.measurementPrices?.find(
        (price) => price.tokenMint === tokenMint
      )?.amount
      if (!measurementPrice) {
        throw new Error('Measurement price not found for ' + tokenMint)
      }
      if ((balance?.utcc?.amount ?? 0) < measurementPrice) {
        throw new Error('Insufficient UTCC balance')
      }

      signature = await sendTransaction(measurementPrice)
    }

    if (tokenMint === PublicKey.default.toBase58()) {
      const measurementPrice = measurementPricesData?.measurementPrices?.find(
        (price) => price.tokenMint === tokenMint
      )?.amount
      if (!measurementPrice) {
        throw new Error('Measurement price not found for ' + tokenMint)
      }
      if ((balance?.sol?.amount ?? 0) < measurementPrice) {
        throw new Error('Insufficient SOL balance')
      }

      signature = await sendTransaction(measurementPrice)
    }

    if (tokenMint === USDC_MINT_ADDRESS.toBase58()) {
      const measurementPrice = measurementPricesData?.measurementPrices?.find(
        (price) => price.tokenMint === tokenMint
      )?.amount
      if (!measurementPrice) {
        throw new Error('Measurement price not found for ' + tokenMint)
      }
      if ((balance?.usdc?.amount ?? 0) < measurementPrice) {
        throw new Error('Insufficient USDC balance')
      }

      signature = await sendTransaction(measurementPrice)
    }

    if (!signature) {
      throw new Error('Transaction failed, no signature obtained')
    }

    // 2. Create measurement record in backend using transaction signature
    return await createMeasurement({
      variables: {
        url,
        remeasure: remeasure ?? false,
        device,
        connection,
        tokenMint,
        walletAddress: walletAddress,
        txSignature: signature,
      },
    })
  }

  return { createMeasure, ...response }
}
