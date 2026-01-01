import type { FetchResult } from '@apollo/client'
import { useModal, usePhantom, useSolana } from '@phantom/react-sdk'
import { PublicKey } from '@solana/web3.js'
import { useState } from 'react'
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
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { solana } = useSolana()
  const { isConnected } = usePhantom()
  const { open, isOpened } = useModal()
  const { balance, preferedPayment: tokenMint } = useBalance()

  const { sendTransaction } = useSendTransaction(tokenMint)
  let signature: string | null = null

  const createMeasure = async (
    options: CreateMeasureArgs
  ): Promise<FetchResult<CreateMeasurementMutation>> => {
    const { remeasure, device, connection } = options
    if (options.url) {
      url = options.url
    }

    try {
      setError(null)
      if (!isConnected && !isOpened) {
        await open()
      } else if (isConnected) {
        const walletAddress = await solana.getPublicKey()
        if (!walletAddress) {
          throw new Error('Wallet not connected')
        }

        setIsPaying(true)

        // 1. Send tokens to treasury address
        if (tokenMint === UTCC_MINT_ADDRESS.toBase58()) {
          const measurementPrice =
            measurementPricesData?.measurementPrices?.find(
              (price) => price.tokenMint === tokenMint
            )?.amount
          if (!measurementPrice) {
            setIsPaying(false)
            throw new Error('Measurement price not found for ' + tokenMint)
          }
          if ((balance?.utcc?.amount ?? 0) < measurementPrice) {
            setIsPaying(false)
            throw new Error('Insufficient UTCC balance')
          }

          signature = await sendTransaction(measurementPrice).catch((error) => {
            setIsPaying(false)
            throw error
          })
        }

        if (tokenMint === PublicKey.default.toBase58()) {
          const measurementPrice =
            measurementPricesData?.measurementPrices?.find(
              (price) => price.tokenMint === tokenMint
            )?.amount
          if (!measurementPrice) {
            setIsPaying(false)
            throw new Error('Measurement price not found for ' + tokenMint)
          }
          if ((balance?.sol?.amount ?? 0) < measurementPrice) {
            setIsPaying(false)
            throw new Error('Insufficient SOL balance')
          }

          signature = await sendTransaction(measurementPrice).catch((error) => {
            setIsPaying(false)
            throw error
          })
        }

        if (tokenMint === USDC_MINT_ADDRESS.toBase58()) {
          const measurementPrice =
            measurementPricesData?.measurementPrices?.find(
              (price) => price.tokenMint === tokenMint
            )?.amount
          if (!measurementPrice) {
            setIsPaying(false)
            throw new Error('Measurement price not found for ' + tokenMint)
          }
          if ((balance?.usdc?.amount ?? 0) < measurementPrice) {
            setIsPaying(false)
            throw new Error('Insufficient USDC balance')
          }

          signature = await sendTransaction(measurementPrice).catch((error) => {
            setIsPaying(false)
            throw error
          })
        }

        if (!signature) {
          setIsPaying(false)
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
          onCompleted: () => {
            setIsPaying(false)
          },
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      return Promise.reject(e)
    }

    return Promise.reject(new Error('Wallet not connected'))
  }

  return { createMeasure, error, setError, isPaying, ...response }
}
