import { useCallback, useState } from 'react'
import {
  ConnectionType,
  DeviceType,
  MeasurementsDocument,
  useCreateMeasurementMutation,
} from '../../generated/graphql'

interface CreateMeasureArgs {
  url: string
  device: DeviceType
  connection: ConnectionType
}

export const useCreateMeasure = () => {
  const [createMeasurement, response] = useCreateMeasurementMutation()
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (options: CreateMeasureArgs) => {
      const { url, device, connection } = options
      return await createMeasurement({
        variables: {
          url,
          device,
          connection,
        },
        refetchQueries: [
          {
            query: MeasurementsDocument,
            variables: {
              host: url ? new URL(url).host : undefined,
            },
          },
        ],
      })
    },
    [createMeasurement],
  )

  const createMeasure = async (options: CreateMeasureArgs): Promise<void> => {
    try {
      setError(null)
      await create(options)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      return Promise.reject(e)
    }
  }

  return { createMeasure, error, setError, ...response }
}
