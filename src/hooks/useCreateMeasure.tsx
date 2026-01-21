import { useSolana } from '@phantom/react-sdk'
import { PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import {
  ConnectionType,
  DeviceType,
  MeasurementsDocument,
  useCreateMeasurementMutation,
  useMeasurementPricesQuery,
} from '../../generated/graphql'
import { USDC_MINT_ADDRESS, useBalance, UTCC_MINT_ADDRESS } from './useBalance'
import { useSendTransaction } from './useSendTransaction'
import { useWalletOrAccLogin } from './useWalletOrAccLogin'

interface CreateMeasureArgs {
  url: string
  device: DeviceType
  connection: ConnectionType
  signature?: string
  walletAddress?: string
  tokenMint?: string
}

export const useCreateMeasure = ({ url }: { url?: string }) => {
  const { data: measurementPricesData } = useMeasurementPricesQuery()
  const [createMeasurement, response] = useCreateMeasurementMutation()
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { solana } = useSolana()
  const { login, isOpened, isLoggedIn, isConnected } = useWalletOrAccLogin()
  const { balance, preferedPayment: tokenMint } = useBalance()

  const { sendTransaction } = useSendTransaction(tokenMint)

  const [unfinishedRequest, setUnfinishedRequest] =
    useState<CreateMeasureArgs | null>(null)

  const create = useCallback(
    async (options: CreateMeasureArgs) => {
      const { url, device, connection } = options
      return await createMeasurement({
        variables: {
          url,
          device,
          connection,
          txSignature: options.signature,
          walletAddress: options.walletAddress,
          tokenMint: options.tokenMint,
        },
        refetchQueries: [
          {
            query: MeasurementsDocument,
            variables: {
              host: url ? new URL(url).host : undefined,
            },
          },
        ],
        onError: () => {
          setIsPaying(false)
        },
        onCompleted: () => {
          setIsPaying(false)
        },
      })
    },
    [createMeasurement],
  )

  const payAndCreate = useCallback(
    async (options: CreateMeasureArgs) => {
      const walletAddress = await solana.getPublicKey()
      if (!walletAddress) {
        throw new Error('Wallet not connected')
      }
      setIsPaying(true)

      let signature: string | null = null

      if (tokenMint === UTCC_MINT_ADDRESS.toBase58()) {
        const measurementPrice = measurementPricesData?.measurementPrices?.find(
          (price) => price.tokenMint === tokenMint,
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
        const measurementPrice = measurementPricesData?.measurementPrices?.find(
          (price) => price.tokenMint === tokenMint,
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
        const measurementPrice = measurementPricesData?.measurementPrices?.find(
          (price) => price.tokenMint === tokenMint,
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

      if (url) {
        return create({ ...options, signature, walletAddress, tokenMint })
      }
    },
    [
      balance?.sol?.amount,
      balance?.usdc?.amount,
      balance?.utcc?.amount,
      create,
      measurementPricesData?.measurementPrices,
      sendTransaction,
      solana,
      tokenMint,
      url,
    ],
  )

  useEffect(() => {
    if (unfinishedRequest && !isOpened && isConnected) {
      payAndCreate(unfinishedRequest)
      setUnfinishedRequest(null)
    }
  }, [isConnected, isOpened, payAndCreate, unfinishedRequest])

  const createMeasure = async (options: CreateMeasureArgs): Promise<void> => {
    if (options.url) {
      url = options.url
    }

    try {
      setError(null)
      if (
        options.device === DeviceType.Desktop &&
        options.connection === ConnectionType.Wifi &&
        isLoggedIn
      ) {
        await create(options)
      } else if (!isConnected && !isOpened) {
        if (isLoggedIn) {
          setUnfinishedRequest(options)
        }
        console.debug('Opening modal for payment...')
        await login()
      } else if (isConnected) {
        await payAndCreate(options)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      return Promise.reject(e)
    }

    return Promise.reject(new Error('Wallet not connected'))
  }

  return { createMeasure, error, setError, isPaying, ...response }
}
