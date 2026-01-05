import { cn } from '@/lib/utils'
import {
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  WifiHigh,
  WifiLow,
  WifiOff,
} from 'lucide-react'
import { ConnectionType, DeviceType } from '../../generated/graphql'

export const getDeviceIcon = (type: DeviceType, className?: string, size?: number) => {
  switch (type) {
    case DeviceType.Mobile:
      return <Smartphone size={size ?? 28} className={className} />
    case DeviceType.Tablet:
      return <Tablet size={size ?? 28} className={className} />
    default:
      return <Monitor size={size ?? 28} className={className} />
  }
}

export const getConnectionIcon = (type: ConnectionType, className?: string, size?: number) => {
  switch (type) {
    case ConnectionType.Fast_4G:
      return (
        <WifiHigh
          size={size ?? 24}
          className={cn('text-muted-foreground', className)}
        />
      )
    case ConnectionType.Slow_4G:
      return (
        <WifiHigh
          size={size ?? 24}
          className={cn('text-muted-foreground', className)}
        />
      )
    case ConnectionType.Fast_3G:
      return (
        <WifiLow size={size ?? 24} className={cn('text-muted-foreground', className)} />
      )
    case ConnectionType.Slow_3G:
      return (
        <WifiLow size={size ?? 24} className={cn('text-muted-foreground', className)} />
      )
    case ConnectionType.Offline:
      return (
        <WifiOff size={size ?? 24} className={cn('text-muted-foreground', className)} />
      )
    default:
      return (
        <Wifi size={size ?? 24} className={cn('text-muted-foreground', className)} />
      )
  }
}
