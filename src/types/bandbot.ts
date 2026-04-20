export enum OptimizationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum OptimizationMode {
  SIMPLE = 'SIMPLE',
  ULTRA = 'ULTRA',
}

export interface OptimizationJob {
  id: string
  url: string
  status: OptimizationStatus
  mode: OptimizationMode
  originalPageSize: string | null
  optimizedPageSize: string | null
  previewPath: string | null
  readerPath: string | null
  simpleReaderPath: string | null
  ultraReaderPath: string | null
  simpleReaderSize: string | null
  ultraReaderSize: string | null
  simpleReaderCost: number
  ultraReaderCost: number
  contentHashSum: string | null
  seoMetadata: string | null
  optimizedFiles: OptimizedFile[]
  createdAt: string
  updatedAt: string
}

export interface OptimizedFile {
  id: string
  originalUrl: string
  originalSize: string
  optimizedSize: string
  savings: number
  contentType: string | null
  format: string
  contentHash: string
  algorithm: string
  family: string
  isBestVariant: boolean
  bandwidthCost: number
  storagePath: string
  hostingActive: boolean
  hostedUrl: string | null
  downloadCost: number
  hostingCost: number
  width: number | null
  height: number | null
  aiDescription: string | null
  aiTags: string[]
  aiAnalyzed: boolean
  aiCost: number
  createdAt: string
  updatedAt: string
}

export interface OptimizationStats {
  totalJobs: number
  totalFilesOptimized: number
  totalBandwidthSaved: string
}

export interface StakedDomain {
  id: string
  domain: string
  totalStakes: number
  crawlInterval: number | null
  crawlIntervalHuman: string | null
  lastCrawledAt: string | null
  nextCrawlAt: string | null
  createdAt: string
}

export interface Stake {
  id: string
  walletAddress: string
  domain: string
  amount: number
  createdAt: string
}

export interface StakingStats {
  totalDomains: number
  totalStakes: number
}
