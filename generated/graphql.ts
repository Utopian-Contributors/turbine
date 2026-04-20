import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AgentMessage = {
  __typename?: 'AgentMessage';
  content: Scalars['String']['output'];
  cost: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  inputTokens: Scalars['Int']['output'];
  outputTokens: Scalars['Int']['output'];
  role: AgentRole;
  sessionId: Scalars['String']['output'];
};

export enum AgentRole {
  Assistant = 'ASSISTANT',
  User = 'USER'
}

export type AgentSession = {
  __typename?: 'AgentSession';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  jobIds: Array<Scalars['String']['output']>;
  jobs: Array<OptimizationJob>;
  messages: Array<AgentMessage>;
  model?: Maybe<Scalars['String']['output']>;
  /** SHA-256 hex hash of the system prompt (for identicon and lookup) */
  promptHash?: Maybe<Scalars['String']['output']>;
  systemPrompt?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  totalCost: Scalars['Int']['output'];
  totalInputTokens: Scalars['Int']['output'];
  totalOutputTokens: Scalars['Int']['output'];
  userId: Scalars['String']['output'];
  walletAddress: Scalars['String']['output'];
};

/** A reader view that a user has paid to access */
export type ArchivedView = {
  __typename?: 'ArchivedView';
  amount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  hosted?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  job?: Maybe<OptimizationJob>;
  jobId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  walletAddress: Scalars['String']['output'];
};

export type BatchTrackInput = {
  contentHash: Scalars['String']['input'];
  jobId: Scalars['String']['input'];
};

/** A user-created collection of URLs */
export type Collection = {
  __typename?: 'Collection';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  /** Number of URLs in this collection */
  itemCount: Scalars['Int']['output'];
  items: Array<CollectionItem>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
  walletAddress: Scalars['String']['output'];
};

/** A URL entry within a collection */
export type CollectionItem = {
  __typename?: 'CollectionItem';
  createdAt: Scalars['DateTime']['output'];
  /** SEO description from the linked optimization job */
  description?: Maybe<Scalars['String']['output']>;
  /** Favicon from the linked optimization job */
  faviconPath?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  jobId?: Maybe<Scalars['String']['output']>;
  position: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  /** Number of active tracks for the linked optimization job */
  trackCount: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

/** A unique content hash with its first appearance timestamp for a domain */
export type DomainHashEntry = {
  __typename?: 'DomainHashEntry';
  createdAt: Scalars['String']['output'];
  hash: Scalars['String']['output'];
};

export type DomainMention = {
  __typename?: 'DomainMention';
  createdAt: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  id: Scalars['String']['output'];
  job?: Maybe<OptimizationJob>;
  jobId: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
};

/** An item from an RSS feed or sitemap */
export type FeedItem = {
  __typename?: 'FeedItem';
  /** Description/summary from feed metadata (optional) */
  description?: Maybe<Scalars['String']['output']>;
  /** Image URL from feed metadata (optional) */
  image?: Maybe<Scalars['String']['output']>;
  /** Title from feed metadata (optional) */
  title?: Maybe<Scalars['String']['output']>;
  /** The URL of the page */
  url?: Maybe<Scalars['String']['output']>;
};

/** A UTCC bid on a keyword for ad placement */
export type KeywordBid = {
  __typename?: 'KeywordBid';
  active: Scalars['Boolean']['output'];
  adUrl?: Maybe<Scalars['String']['output']>;
  amount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  jobId: Scalars['String']['output'];
  keyword?: Maybe<PageKeyword>;
  keywordId: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  txSignature: Scalars['String']['output'];
};

/** A recent blockhash for constructing Solana transactions */
export type LatestBlockhash = {
  __typename?: 'LatestBlockhash';
  blockhash: Scalars['String']['output'];
  lastValidBlockHeight: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCollectionItems?: Maybe<Collection>;
  addJobToAgentSession: AgentSession;
  archiveBatchViews: Array<ArchivedView>;
  archiveView?: Maybe<ArchivedView>;
  createAgentSession: AgentSession;
  createBatchJobs?: Maybe<Array<OptimizationJob>>;
  /** Track multiple pages in a single on-chain transaction */
  createBatchTrack: Array<Track>;
  createCollection?: Maybe<Collection>;
  createOptimizationJob?: Maybe<OptimizationJob>;
  createTrack: Track;
  deleteAgentSession: Scalars['Boolean']['output'];
  deleteCollection: Scalars['Boolean']['output'];
  downloadFile?: Maybe<OptimizedFile>;
  /** Extract keywords from a page's reader content (opt-in) */
  extractKeywords: Array<PageKeyword>;
  generatePreview?: Maybe<PreviewSession>;
  hostArchivedView?: Maybe<ArchivedView>;
  parseFeed?: Maybe<Array<FeedItem>>;
  /** Transfer a track from an old job to a new one after content changed */
  reTrack: Track;
  recordView?: Maybe<OptimizationJob>;
  removeCollectionItem?: Maybe<Collection>;
  /** Configure crawl frequency for a domain */
  setDomainMaxAge: TrackSchedule;
  startHosting?: Maybe<OptimizedFile>;
  stopHosting?: Maybe<OptimizedFile>;
  updateCollection?: Maybe<Collection>;
  /** Scan treasury wallet and validate all unverified tracks on-chain */
  validateTracks: TrackValidationStatus;
};


export type MutationAddCollectionItemsArgs = {
  collectionId: Scalars['String']['input'];
  urls: Array<Scalars['String']['input']>;
};


export type MutationAddJobToAgentSessionArgs = {
  jobId: Scalars['String']['input'];
  sessionId: Scalars['String']['input'];
};


export type MutationArchiveBatchViewsArgs = {
  jobIds: Array<Scalars['String']['input']>;
  txSignature: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};


export type MutationArchiveViewArgs = {
  jobId: Scalars['String']['input'];
  txSignature?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateAgentSessionArgs = {
  jobIds: Array<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  systemPrompt?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};


export type MutationCreateBatchJobsArgs = {
  mode?: InputMaybe<OptimizationMode>;
  urls: Array<Scalars['String']['input']>;
};


export type MutationCreateBatchTrackArgs = {
  tracks: Array<BatchTrackInput>;
  txSignature: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};


export type MutationCreateCollectionArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  jobIds?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  urls: Array<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};


export type MutationCreateOptimizationJobArgs = {
  mode?: InputMaybe<OptimizationMode>;
  url: Scalars['String']['input'];
};


export type MutationCreateTrackArgs = {
  contentHash: Scalars['String']['input'];
  jobId: Scalars['String']['input'];
  txSignature: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};


export type MutationDeleteAgentSessionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDownloadFileArgs = {
  fileId: Scalars['String']['input'];
};


export type MutationExtractKeywordsArgs = {
  jobId: Scalars['String']['input'];
};


export type MutationGeneratePreviewArgs = {
  jobId: Scalars['String']['input'];
};


export type MutationHostArchivedViewArgs = {
  jobId: Scalars['String']['input'];
  txSignature: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationParseFeedArgs = {
  url: Scalars['String']['input'];
};


export type MutationReTrackArgs = {
  newJobId: Scalars['String']['input'];
  oldJobId: Scalars['String']['input'];
  txSignature: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};


export type MutationRecordViewArgs = {
  jobId: Scalars['String']['input'];
};


export type MutationRemoveCollectionItemArgs = {
  collectionId: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
};


export type MutationSetDomainMaxAgeArgs = {
  domain: Scalars['String']['input'];
  maxAgeSeconds: Scalars['Int']['input'];
};


export type MutationStartHostingArgs = {
  fileId: Scalars['String']['input'];
};


export type MutationStopHostingArgs = {
  fileId: Scalars['String']['input'];
};


export type MutationUpdateCollectionArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** A crawl schedule bid discovered from on-chain treasury transactions */
export type OnChainSchedule = {
  __typename?: 'OnChainSchedule';
  active: Scalars['Boolean']['output'];
  amount: Scalars['Int']['output'];
  cadenceSeconds: Scalars['Int']['output'];
  domain: Scalars['String']['output'];
  id: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  txSignature: Scalars['String']['output'];
};

/** A job that fetches and optimizes website assets for bandwidth */
export type OptimizationJob = {
  __typename?: 'OptimizationJob';
  /** Hosted URL of a compressed image from optimized files for preview cards */
  compressedPreviewImage?: Maybe<Scalars['String']['output']>;
  contentHashSum?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  faviconPath?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isPublic?: Maybe<Scalars['Boolean']['output']>;
  mode: OptimizationMode;
  optimizedFiles: Array<OptimizedFile>;
  optimizedPageSize?: Maybe<Scalars['String']['output']>;
  originalPageSize?: Maybe<Scalars['String']['output']>;
  /** Latest unlocked phone number for this URL, or null */
  phoneNumber?: Maybe<Scalars['String']['output']>;
  previewPath?: Maybe<Scalars['String']['output']>;
  readerContentHash?: Maybe<Scalars['String']['output']>;
  readerPath?: Maybe<Scalars['String']['output']>;
  seoDescription?: Maybe<Scalars['String']['output']>;
  seoMetadata?: Maybe<Scalars['String']['output']>;
  seoOgImage?: Maybe<Scalars['String']['output']>;
  seoTitle?: Maybe<Scalars['String']['output']>;
  simpleReaderCost?: Maybe<Scalars['Int']['output']>;
  simpleReaderPath?: Maybe<Scalars['String']['output']>;
  simpleReaderSize?: Maybe<Scalars['String']['output']>;
  status: OptimizationStatus;
  trackCount?: Maybe<Scalars['Int']['output']>;
  ultraReaderCost?: Maybe<Scalars['Int']['output']>;
  ultraReaderPath?: Maybe<Scalars['String']['output']>;
  ultraReaderSize?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
};


/** A job that fetches and optimizes website assets for bandwidth */
export type OptimizationJobCompressedPreviewImageArgs = {
  mode?: InputMaybe<OptimizationMode>;
};

/** SIMPLE compresses media. ULTRA adds reader view + AI metadata. */
export enum OptimizationMode {
  Simple = 'SIMPLE',
  Ultra = 'ULTRA'
}

export type OptimizationStats = {
  __typename?: 'OptimizationStats';
  totalBandwidthSaved?: Maybe<Scalars['String']['output']>;
  totalFilesOptimized?: Maybe<Scalars['Int']['output']>;
  totalJobs?: Maybe<Scalars['Int']['output']>;
};

export enum OptimizationStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

/** An optimized version of a website asset */
export type OptimizedFile = {
  __typename?: 'OptimizedFile';
  aiAnalyzed?: Maybe<Scalars['Boolean']['output']>;
  aiCost?: Maybe<Scalars['Int']['output']>;
  aiDescription?: Maybe<Scalars['String']['output']>;
  aiTags: Array<Scalars['String']['output']>;
  algorithm: Scalars['String']['output'];
  bandwidthCost?: Maybe<Scalars['Int']['output']>;
  contentHash: Scalars['String']['output'];
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  downloadCost: Scalars['Int']['output'];
  family?: Maybe<Scalars['String']['output']>;
  format: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  hostedUrl?: Maybe<Scalars['String']['output']>;
  hostingActive: Scalars['Boolean']['output'];
  hostingCost: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isBestVariant?: Maybe<Scalars['Boolean']['output']>;
  job: OptimizationJob;
  optimizedSize?: Maybe<Scalars['String']['output']>;
  originalSize?: Maybe<Scalars['String']['output']>;
  originalUrl: Scalars['String']['output'];
  savings: Scalars['Float']['output'];
  storagePath: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

/** A keyword extracted from a page's content with frequency data */
export type PageKeyword = {
  __typename?: 'PageKeyword';
  bids: Array<KeywordBid>;
  cluster?: Maybe<Scalars['String']['output']>;
  extractedAt: Scalars['DateTime']['output'];
  frequency: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  job?: Maybe<OptimizationJob>;
  jobId: Scalars['String']['output'];
  keyword: Scalars['String']['output'];
  /** Highest active bid amount, or null if no bids */
  topBid?: Maybe<Scalars['Int']['output']>;
  /** Wallet address of the highest active bidder */
  topBidder?: Maybe<Scalars['String']['output']>;
};

/** Input type for pagination */
export type PaginationInput = {
  /** Number of items to skip */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to take */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type PopularDomain = {
  __typename?: 'PopularDomain';
  domain: Scalars['String']['output'];
  faviconPath?: Maybe<Scalars['String']['output']>;
  jobCount: Scalars['Int']['output'];
  totalViews: Scalars['Int']['output'];
};

export type PopularUser = {
  __typename?: 'PopularUser';
  archiveCount: Scalars['Int']['output'];
  totalViews: Scalars['Int']['output'];
  walletAddress: Scalars['String']['output'];
};

export type PreviewSession = {
  __typename?: 'PreviewSession';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  jobId?: Maybe<Scalars['String']['output']>;
  previewHtml?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  activeOptimizationJobsByDomain: Array<OptimizationJob>;
  /** Active on-chain schedule bids for a domain */
  activeSchedules: Array<OnChainSchedule>;
  agentSession?: Maybe<AgentSession>;
  agentSessions: Array<AgentSession>;
  agentSessionsByPromptHash: Array<AgentSession>;
  /** All active on-chain schedule bids across all domains */
  allActiveSchedules: Array<OnChainSchedule>;
  archivedView?: Maybe<ArchivedView>;
  collection?: Maybe<Collection>;
  collectionBySlug?: Maybe<Collection>;
  domainHashTimeline: Array<DomainHashEntry>;
  domainMentions: Array<DomainMention>;
  hostedFiles?: Maybe<Array<OptimizedFile>>;
  /** All keyword bids placed by a wallet */
  keywordBidsForWallet: Array<KeywordBid>;
  /** The single winning keyword bid for a search term. Returns the highest active bid whose keyword matches the query, or null. */
  keywordPromotion?: Maybe<KeywordBid>;
  /** All extracted keywords for a page, with bid data */
  keywordsForJob: Array<PageKeyword>;
  latestBlockhash: LatestBlockhash;
  /** The most recent contentHashSum for a given URL (computed from optimized files) */
  latestContentHash?: Maybe<Scalars['String']['output']>;
  myArchive?: Maybe<Array<ArchivedView>>;
  myCollections?: Maybe<Array<Collection>>;
  optimizationJob?: Maybe<OptimizationJob>;
  optimizationJobs?: Maybe<Array<OptimizationJob>>;
  optimizationJobsByDomain: Array<OptimizationJob>;
  optimizedFiles?: Maybe<Array<OptimizedFile>>;
  popularArticles: Array<OptimizationJob>;
  popularDomains: Array<PopularDomain>;
  popularUsers: Array<PopularUser>;
  readerIndex?: Maybe<Array<OptimizationJob>>;
  readerIndexCount: Scalars['Int']['output'];
  /** Recently placed keyword bids (for Terminal feed) */
  recentKeywordBids: Array<KeywordBid>;
  /** Recently extracted keywords (for Terminal feed) */
  recentKeywordExtractions: Array<PageKeyword>;
  /** Slot availability and suggested price for a cadence tier */
  scheduleSlotInfo: SlotInfo;
  searchImages: Array<OptimizedFile>;
  searchImagesCount: Scalars['Int']['output'];
  stats?: Maybe<OptimizationStats>;
  /** Highest active keyword bids across all pages (for Discovery) */
  topKeywordBids: Array<KeywordBid>;
  trackSchedule?: Maybe<TrackSchedule>;
  /** All active track schedules */
  trackSchedules: Array<TrackSchedule>;
  trackValidationStatus: TrackValidationStatus;
  tracksForDomain: Array<Track>;
  tracksForJob: Array<Track>;
  tracksForWallet: Array<Track>;
  walletBalances: Array<WalletTokenBalance>;
};


export type QueryActiveOptimizationJobsByDomainArgs = {
  domain: Scalars['String']['input'];
};


export type QueryActiveSchedulesArgs = {
  domain: Scalars['String']['input'];
};


export type QueryAgentSessionArgs = {
  id: Scalars['String']['input'];
};


export type QueryAgentSessionsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  userId: Scalars['String']['input'];
};


export type QueryAgentSessionsByPromptHashArgs = {
  hash: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type QueryAllActiveSchedulesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryArchivedViewArgs = {
  jobId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type QueryCollectionArgs = {
  id: Scalars['String']['input'];
};


export type QueryCollectionBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryDomainHashTimelineArgs = {
  domain: Scalars['String']['input'];
};


export type QueryDomainMentionsArgs = {
  domain: Scalars['String']['input'];
};


export type QueryHostedFilesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryKeywordBidsForWalletArgs = {
  walletAddress: Scalars['String']['input'];
};


export type QueryKeywordPromotionArgs = {
  query: Scalars['String']['input'];
};


export type QueryKeywordsForJobArgs = {
  jobId: Scalars['String']['input'];
};


export type QueryLatestContentHashArgs = {
  url: Scalars['String']['input'];
};


export type QueryMyArchiveArgs = {
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryMyCollectionsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  userId: Scalars['String']['input'];
};


export type QueryOptimizationJobArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOptimizationJobsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryOptimizationJobsByDomainArgs = {
  domain: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryOptimizedFilesArgs = {
  jobId?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryPopularArticlesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularDomainsArgs = {
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularUsersArgs = {
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryReaderIndexArgs = {
  mode?: InputMaybe<OptimizationMode>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
};


export type QueryReaderIndexCountArgs = {
  mode?: InputMaybe<OptimizationMode>;
  query?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRecentKeywordBidsArgs = {
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRecentKeywordExtractionsArgs = {
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryScheduleSlotInfoArgs = {
  cadenceSeconds: Scalars['Int']['input'];
};


export type QuerySearchImagesArgs = {
  family?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchImagesCountArgs = {
  family?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTopKeywordBidsArgs = {
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTrackScheduleArgs = {
  domain: Scalars['String']['input'];
};


export type QueryTrackSchedulesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryTracksForDomainArgs = {
  domain: Scalars['String']['input'];
};


export type QueryTracksForJobArgs = {
  jobId: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryTracksForWalletArgs = {
  pagination?: InputMaybe<PaginationInput>;
  walletAddress: Scalars['String']['input'];
};


export type QueryWalletBalancesArgs = {
  walletAddress: Scalars['String']['input'];
};

/** Slot availability and pricing for a given cadence tier */
export type SlotInfo = {
  __typename?: 'SlotInfo';
  suggestedPrice: Scalars['Int']['output'];
  totalSlots: Scalars['Int']['output'];
  usedSlots: Scalars['Int']['output'];
};

/** A track subscription for keeping an archived page's URL fresh */
export type Track = {
  __typename?: 'Track';
  amount: Scalars['Int']['output'];
  contentHash: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  job?: Maybe<OptimizationJob>;
  jobId: Scalars['String']['output'];
  supersededById?: Maybe<Scalars['String']['output']>;
  txSignature: Scalars['String']['output'];
  verified: Scalars['Boolean']['output'];
  walletAddress: Scalars['String']['output'];
};

/** Crawl schedule for a domain based on active tracks */
export type TrackSchedule = {
  __typename?: 'TrackSchedule';
  activeTracks: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  domain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastCrawledAt?: Maybe<Scalars['DateTime']['output']>;
  maxAge: Scalars['Int']['output'];
  nextCrawlAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** Progress of on-chain track validation */
export type TrackValidationStatus = {
  __typename?: 'TrackValidationStatus';
  remaining: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  verified: Scalars['Int']['output'];
};

/** A token balance resolved by the backend from Solana RPC */
export type WalletTokenBalance = {
  __typename?: 'WalletTokenBalance';
  amount: Scalars['Float']['output'];
  decimals: Scalars['Int']['output'];
  mint: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type LatestBlockhashQueryVariables = Exact<{ [key: string]: never; }>;


export type LatestBlockhashQuery = { __typename?: 'Query', latestBlockhash: { __typename?: 'LatestBlockhash', blockhash: string, lastValidBlockHeight: string } };

export type WalletBalancesQueryVariables = Exact<{
  walletAddress: Scalars['String']['input'];
}>;


export type WalletBalancesQuery = { __typename?: 'Query', walletBalances: Array<{ __typename?: 'WalletTokenBalance', mint: string, symbol: string, name: string, decimals: number, amount: number }> };

export type CollectionsForAgentQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type CollectionsForAgentQuery = { __typename?: 'Query', myCollections?: Array<{ __typename?: 'Collection', id: string, name: string, itemCount: number, items: Array<{ __typename?: 'CollectionItem', id: string, url: string, title?: string | null, jobId?: string | null, faviconPath?: string | null }> }> | null };

export type AgentCreateSearchPagesQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type AgentCreateSearchPagesQuery = { __typename?: 'Query', readerIndex?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, faviconPath?: string | null }> | null };

export type AgentCreateDomainJobsQueryVariables = Exact<{
  domain: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type AgentCreateDomainJobsQuery = { __typename?: 'Query', completed: Array<{ __typename?: 'OptimizationJob', id: string, url: string, faviconPath?: string | null, seoTitle?: string | null }> };

export type AgentSessionsQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type AgentSessionsQuery = { __typename?: 'Query', agentSessions: Array<{ __typename?: 'AgentSession', id: string, title?: string | null, promptHash?: string | null, jobIds: Array<string>, totalCost: number, createdAt: any }> };

export type AgentSessionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type AgentSessionQuery = { __typename?: 'Query', agentSession?: { __typename?: 'AgentSession', id: string, title?: string | null, systemPrompt?: string | null, model?: string | null, promptHash?: string | null, jobIds: Array<string>, totalInputTokens: number, totalOutputTokens: number, totalCost: number, messages: Array<{ __typename?: 'AgentMessage', id: string, role: AgentRole, content: string, cost: number, createdAt: any }>, jobs: Array<{ __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, seoDescription?: string | null, faviconPath?: string | null, compressedPreviewImage?: string | null, simpleReaderPath?: string | null, ultraReaderPath?: string | null }> } | null };

export type CreateAgentSessionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
  jobIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  systemPrompt?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateAgentSessionMutation = { __typename?: 'Mutation', createAgentSession: { __typename?: 'AgentSession', id: string, title?: string | null, promptHash?: string | null, jobIds: Array<string> } };

export type AgentSessionsByPromptHashQueryVariables = Exact<{
  hash: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type AgentSessionsByPromptHashQuery = { __typename?: 'Query', agentSessionsByPromptHash: Array<{ __typename?: 'AgentSession', id: string, title?: string | null, promptHash?: string | null, totalCost: number, createdAt: any }> };

export type DeleteAgentSessionMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteAgentSessionMutation = { __typename?: 'Mutation', deleteAgentSession: boolean };

export type AddJobToAgentSessionMutationVariables = Exact<{
  sessionId: Scalars['String']['input'];
  jobId: Scalars['String']['input'];
}>;


export type AddJobToAgentSessionMutation = { __typename?: 'Mutation', addJobToAgentSession: { __typename?: 'AgentSession', id: string, jobIds: Array<string>, jobs: Array<{ __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, seoDescription?: string | null, faviconPath?: string | null, compressedPreviewImage?: string | null, simpleReaderPath?: string | null, ultraReaderPath?: string | null }> } };

export type ReaderIndexForSessionQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type ReaderIndexForSessionQuery = { __typename?: 'Query', readerIndex?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, seoDescription?: string | null, faviconPath?: string | null, compressedPreviewImage?: string | null }> | null };

export type AgentMentionLookupQueryVariables = Exact<{
  query: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type AgentMentionLookupQuery = { __typename?: 'Query', readerIndex?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, faviconPath?: string | null }> | null };

export type ReaderIndexForLinksQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type ReaderIndexForLinksQuery = { __typename?: 'Query', readerIndex?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, faviconPath?: string | null, simpleReaderPath?: string | null, ultraReaderPath?: string | null }> | null };

export type ArchivedViewQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  jobId: Scalars['String']['input'];
}>;


export type ArchivedViewQuery = { __typename?: 'Query', archivedView?: { __typename?: 'ArchivedView', id: string, userId: string, jobId: string, hosted?: boolean | null, createdAt: any } | null };

export type MyArchiveQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type MyArchiveQuery = { __typename?: 'Query', myArchive?: Array<{ __typename?: 'ArchivedView', id: string, userId: string, jobId: string, amount: number, hosted?: boolean | null, createdAt: any, job?: { __typename?: 'OptimizationJob', id: string, url: string, status: OptimizationStatus, simpleReaderPath?: string | null, ultraReaderPath?: string | null, faviconPath?: string | null, seoTitle?: string | null, seoDescription?: string | null, compressedPreviewImage?: string | null, contentHashSum?: string | null, createdAt: any, optimizedFiles: Array<{ __typename?: 'OptimizedFile', id: string, originalUrl: string, originalSize?: string | null, optimizedSize?: string | null, savings: number, isBestVariant?: boolean | null, hostingActive: boolean, hostedUrl?: string | null, hostingCost: number }> } | null }> | null };

export type ArchiveViewMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  walletAddress?: InputMaybe<Scalars['String']['input']>;
  jobId: Scalars['String']['input'];
  txSignature?: InputMaybe<Scalars['String']['input']>;
}>;


export type ArchiveViewMutation = { __typename?: 'Mutation', archiveView?: { __typename?: 'ArchivedView', id: string, userId: string, jobId: string, hosted?: boolean | null, createdAt: any } | null };

export type ArchiveBatchViewsMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
  jobIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  txSignature: Scalars['String']['input'];
}>;


export type ArchiveBatchViewsMutation = { __typename?: 'Mutation', archiveBatchViews: Array<{ __typename?: 'ArchivedView', id: string, userId: string, jobId: string, hosted?: boolean | null, createdAt: any }> };

export type HostArchivedViewMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  jobId: Scalars['String']['input'];
  txSignature: Scalars['String']['input'];
}>;


export type HostArchivedViewMutation = { __typename?: 'Mutation', hostArchivedView?: { __typename?: 'ArchivedView', id: string, hosted?: boolean | null } | null };

export type ParseFeedMutationVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type ParseFeedMutation = { __typename?: 'Mutation', parseFeed?: Array<{ __typename?: 'FeedItem', url?: string | null, title?: string | null, description?: string | null }> | null };

export type CreateBatchJobsMutationVariables = Exact<{
  urls: Array<Scalars['String']['input']> | Scalars['String']['input'];
  mode?: InputMaybe<OptimizationMode>;
}>;


export type CreateBatchJobsMutation = { __typename?: 'Mutation', createBatchJobs?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, status: OptimizationStatus }> | null };

export type SearchImagesCountQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  family?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchImagesCountQuery = { __typename?: 'Query', searchImagesCount: number };

export type SearchImagesQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  family?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type SearchImagesQuery = { __typename?: 'Query', searchImages: Array<{ __typename?: 'OptimizedFile', id: string, originalUrl: string, originalSize?: string | null, optimizedSize?: string | null, savings: number, contentType?: string | null, format: string, family?: string | null, isBestVariant?: boolean | null, storagePath: string, hostedUrl?: string | null, width?: number | null, height?: number | null, aiDescription?: string | null, aiTags: Array<string>, createdAt: any, job: { __typename?: 'OptimizationJob', id: string, url: string, faviconPath?: string | null, seoTitle?: string | null } }> };

export type KeywordPromotionQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type KeywordPromotionQuery = { __typename?: 'Query', keywordPromotion?: { __typename?: 'KeywordBid', id: string, amount: number, sender: string, active: boolean, keyword?: { __typename?: 'PageKeyword', keyword: string, frequency: number, job?: { __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, faviconPath?: string | null, compressedPreviewImage?: string | null } | null } | null } | null };

export type ReaderIndexCountQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<OptimizationMode>;
}>;


export type ReaderIndexCountQuery = { __typename?: 'Query', readerIndexCount: number };

export type ReaderIndexQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  mode?: InputMaybe<OptimizationMode>;
}>;


export type ReaderIndexQuery = { __typename?: 'Query', readerIndex?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, originalPageSize?: string | null, optimizedPageSize?: string | null, simpleReaderSize?: string | null, ultraReaderSize?: string | null, contentHashSum?: string | null, faviconPath?: string | null, phoneNumber?: string | null, seoTitle?: string | null, seoDescription?: string | null, compressedPreviewImage?: string | null, simpleReaderPath?: string | null, ultraReaderPath?: string | null, createdAt: any, optimizedFiles: Array<{ __typename?: 'OptimizedFile', id: string, originalUrl: string, originalSize?: string | null, optimizedSize?: string | null, savings: number, isBestVariant?: boolean | null }> }> | null };

export type CollectionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: string, name: string, slug: string, description?: string | null, isPublic: boolean, createdAt: any, updatedAt: any, items: Array<{ __typename?: 'CollectionItem', id: string, url: string, title?: string | null, description?: string | null, jobId?: string | null, faviconPath?: string | null, position: number }> } | null };

export type UpdateCollectionMutationVariables = Exact<{
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', updateCollection?: { __typename?: 'Collection', id: string, name: string, slug: string, description?: string | null, isPublic: boolean } | null };

export type AddCollectionItemsMutationVariables = Exact<{
  collectionId: Scalars['String']['input'];
  urls: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddCollectionItemsMutation = { __typename?: 'Mutation', addCollectionItems?: { __typename?: 'Collection', id: string, items: Array<{ __typename?: 'CollectionItem', id: string, url: string, title?: string | null, description?: string | null, jobId?: string | null, faviconPath?: string | null, position: number }> } | null };

export type RemoveCollectionItemMutationVariables = Exact<{
  collectionId: Scalars['String']['input'];
  itemId: Scalars['String']['input'];
}>;


export type RemoveCollectionItemMutation = { __typename?: 'Mutation', removeCollectionItem?: { __typename?: 'Collection', id: string, items: Array<{ __typename?: 'CollectionItem', id: string, url: string, title?: string | null, description?: string | null, jobId?: string | null, faviconPath?: string | null, position: number }> } | null };

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection: boolean };

export type CollectionBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type CollectionBySlugQuery = { __typename?: 'Query', collectionBySlug?: { __typename?: 'Collection', id: string, name: string, description?: string | null, items: Array<{ __typename?: 'CollectionItem', id: string, url: string, title?: string | null, jobId?: string | null, position: number }> } | null };

export type MyCollectionsQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type MyCollectionsQuery = { __typename?: 'Query', myCollections?: Array<{ __typename?: 'Collection', id: string, name: string, slug: string, description?: string | null, isPublic: boolean, itemCount: number, createdAt: any, updatedAt: any }> | null };

export type CreateCollectionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  urls: Array<Scalars['String']['input']> | Scalars['String']['input'];
  jobIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection?: { __typename?: 'Collection', id: string, name: string, slug: string, itemCount: number } | null };

export type StatsQueryVariables = Exact<{ [key: string]: never; }>;


export type StatsQuery = { __typename?: 'Query', stats?: { __typename?: 'OptimizationStats', totalJobs?: number | null, totalFilesOptimized?: number | null, totalBandwidthSaved?: string | null } | null };

export type LatestJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type LatestJobsQuery = { __typename?: 'Query', optimizationJobs?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, status: OptimizationStatus, createdAt: any, optimizedFiles: Array<{ __typename?: 'OptimizedFile', id: string, savings: number, format: string }> }> | null };

export type CreateOptimizationJobMutationVariables = Exact<{
  url: Scalars['String']['input'];
  mode?: InputMaybe<OptimizationMode>;
}>;


export type CreateOptimizationJobMutation = { __typename?: 'Mutation', createOptimizationJob?: { __typename?: 'OptimizationJob', id: string, url: string, status: OptimizationStatus, mode: OptimizationMode } | null };

export type DashboardParseFeedMutationVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type DashboardParseFeedMutation = { __typename?: 'Mutation', parseFeed?: Array<{ __typename?: 'FeedItem', url?: string | null }> | null };

export type DashboardReaderIndexQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardReaderIndexQuery = { __typename?: 'Query', readerIndex?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, createdAt: any }> | null };

export type HomePagesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type HomePagesQuery = { __typename?: 'Query', readerIndex?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, faviconPath?: string | null, seoTitle?: string | null, seoDescription?: string | null, compressedPreviewImage?: string | null, createdAt: any }> | null };

export type PopularDomainsQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PopularDomainsQuery = { __typename?: 'Query', popularDomains: Array<{ __typename?: 'PopularDomain', domain: string, totalViews: number, faviconPath?: string | null, jobCount: number }> };

export type PopularUsersQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PopularUsersQuery = { __typename?: 'Query', popularUsers: Array<{ __typename?: 'PopularUser', walletAddress: string, archiveCount: number, totalViews: number }> };

export type PopularArticlesQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PopularArticlesQuery = { __typename?: 'Query', popularArticles: Array<{ __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, seoDescription?: string | null, seoOgImage?: string | null, compressedPreviewImage?: string | null, faviconPath?: string | null }> };

export type DomainJobsQueryVariables = Exact<{
  domain: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type DomainJobsQuery = { __typename?: 'Query', completed: Array<{ __typename?: 'OptimizationJob', id: string, url: string, status: OptimizationStatus, mode: OptimizationMode, faviconPath?: string | null, simpleReaderPath?: string | null, ultraReaderPath?: string | null, seoTitle?: string | null, seoDescription?: string | null, compressedPreviewImage?: string | null, readerContentHash?: string | null, createdAt: any }>, active: Array<{ __typename?: 'OptimizationJob', id: string, url: string, status: OptimizationStatus, mode: OptimizationMode, faviconPath?: string | null, seoTitle?: string | null, seoDescription?: string | null, createdAt: any }> };

export type DomainMentionsQueryVariables = Exact<{
  domain: Scalars['String']['input'];
}>;


export type DomainMentionsQuery = { __typename?: 'Query', domainMentions: Array<{ __typename?: 'DomainMention', id: string, sessionId: string, createdAt: string, job?: { __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, faviconPath?: string | null } | null }> };

export type DomainHashTimelineQueryVariables = Exact<{
  domain: Scalars['String']['input'];
}>;


export type DomainHashTimelineQuery = { __typename?: 'Query', timeline: Array<{ __typename?: 'DomainHashEntry', hash: string, createdAt: string }> };

export type DomainTrackScheduleQueryVariables = Exact<{
  domain: Scalars['String']['input'];
}>;


export type DomainTrackScheduleQuery = { __typename?: 'Query', trackSchedule?: { __typename?: 'TrackSchedule', id: string, domain: string, maxAge: number, lastCrawledAt?: any | null, nextCrawlAt?: any | null, activeTracks: number } | null, tracksForDomain: Array<{ __typename?: 'Track', id: string, contentHash: string, verified: boolean, amount: number, supersededById?: string | null, createdAt: any, job?: { __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, faviconPath?: string | null, contentHashSum?: string | null, createdAt: any } | null }> };

export type OptimizationJobsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type OptimizationJobsQuery = { __typename?: 'Query', optimizationJobs?: Array<{ __typename?: 'OptimizationJob', id: string, url: string, mode: OptimizationMode, status: OptimizationStatus, faviconPath?: string | null, createdAt: any, optimizedFiles: Array<{ __typename?: 'OptimizedFile', id: string, originalSize?: string | null, optimizedSize?: string | null, savings: number, isBestVariant?: boolean | null }> }> | null };

export type KeywordsForJobQueryVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;


export type KeywordsForJobQuery = { __typename?: 'Query', keywordsForJob: Array<{ __typename?: 'PageKeyword', id: string, keyword: string, frequency: number, cluster?: string | null, topBid?: number | null, topBidder?: string | null, extractedAt: any, bids: Array<{ __typename?: 'KeywordBid', id: string, sender: string, amount: number, active: boolean, txSignature: string, timestamp: any, adUrl?: string | null }> }> };

export type KeywordBidsForWalletQueryVariables = Exact<{
  walletAddress: Scalars['String']['input'];
}>;


export type KeywordBidsForWalletQuery = { __typename?: 'Query', keywordBidsForWallet: Array<{ __typename?: 'KeywordBid', id: string, keywordId: string, jobId: string, amount: number, active: boolean, txSignature: string, timestamp: any, keyword?: { __typename?: 'PageKeyword', keyword: string, frequency: number, job?: { __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, faviconPath?: string | null, compressedPreviewImage?: string | null } | null } | null }> };

export type ExtractKeywordsMutationVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;


export type ExtractKeywordsMutation = { __typename?: 'Mutation', extractKeywords: Array<{ __typename?: 'PageKeyword', id: string, keyword: string, frequency: number }> };

export type TopKeywordBidsQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TopKeywordBidsQuery = { __typename?: 'Query', topKeywordBids: Array<{ __typename?: 'KeywordBid', id: string, amount: number, active: boolean, sender: string, keyword?: { __typename?: 'PageKeyword', keyword: string, frequency: number, jobId: string, job?: { __typename?: 'OptimizationJob', id: string, url: string, seoTitle?: string | null, faviconPath?: string | null, compressedPreviewImage?: string | null } | null } | null }> };

export type RecentKeywordExtractionsQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecentKeywordExtractionsQuery = { __typename?: 'Query', recentKeywordExtractions: Array<{ __typename?: 'PageKeyword', id: string, jobId: string, keyword: string, frequency: number, extractedAt: any, job?: { __typename?: 'OptimizationJob', url: string, seoTitle?: string | null, faviconPath?: string | null } | null }> };

export type RecentKeywordBidsQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecentKeywordBidsQuery = { __typename?: 'Query', recentKeywordBids: Array<{ __typename?: 'KeywordBid', id: string, sender: string, amount: number, timestamp: any, jobId: string, keyword?: { __typename?: 'PageKeyword', keyword: string, frequency: number, job?: { __typename?: 'OptimizationJob', url: string, seoTitle?: string | null, faviconPath?: string | null } | null } | null }> };

export type OptimizationJobQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type OptimizationJobQuery = { __typename?: 'Query', optimizationJob?: { __typename?: 'OptimizationJob', id: string, url: string, status: OptimizationStatus, mode: OptimizationMode, originalPageSize?: string | null, optimizedPageSize?: string | null, contentHashSum?: string | null, faviconPath?: string | null, seoTitle?: string | null, seoDescription?: string | null, seoOgImage?: string | null, compressedPreviewImage?: string | null, readerPath?: string | null, simpleReaderPath?: string | null, ultraReaderPath?: string | null, simpleReaderSize?: string | null, ultraReaderSize?: string | null, simpleReaderCost?: number | null, ultraReaderCost?: number | null, createdAt: any, updatedAt: any, optimizedFiles: Array<{ __typename?: 'OptimizedFile', id: string, originalUrl: string, originalSize?: string | null, optimizedSize?: string | null, savings: number, contentType?: string | null, format: string, contentHash: string, algorithm: string, family?: string | null, isBestVariant?: boolean | null, storagePath: string, hostingActive: boolean, hostedUrl?: string | null, downloadCost: number, hostingCost: number, width?: number | null, height?: number | null }> } | null };

export type DownloadFileMutationVariables = Exact<{
  fileId: Scalars['String']['input'];
}>;


export type DownloadFileMutation = { __typename?: 'Mutation', downloadFile?: { __typename?: 'OptimizedFile', id: string, storagePath: string } | null };

export type StartHostingMutationVariables = Exact<{
  fileId: Scalars['String']['input'];
}>;


export type StartHostingMutation = { __typename?: 'Mutation', startHosting?: { __typename?: 'OptimizedFile', id: string, hostingActive: boolean, hostedUrl?: string | null } | null };

export type StopHostingMutationVariables = Exact<{
  fileId: Scalars['String']['input'];
}>;


export type StopHostingMutation = { __typename?: 'Mutation', stopHosting?: { __typename?: 'OptimizedFile', id: string, hostingActive: boolean, hostedUrl?: string | null } | null };

export type GeneratePreviewMutationVariables = Exact<{
  jobId: Scalars['String']['input'];
}>;


export type GeneratePreviewMutation = { __typename?: 'Mutation', generatePreview?: { __typename?: 'PreviewSession', id?: string | null, jobId?: string | null, previewHtml?: string | null, expiresAt?: any | null, createdAt?: any | null } | null };


export const LatestBlockhashDocument = gql`
    query LatestBlockhash {
  latestBlockhash {
    blockhash
    lastValidBlockHeight
  }
}
    `;

/**
 * __useLatestBlockhashQuery__
 *
 * To run a query within a React component, call `useLatestBlockhashQuery` and pass it any options that fit your needs.
 * When your component renders, `useLatestBlockhashQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLatestBlockhashQuery({
 *   variables: {
 *   },
 * });
 */
export function useLatestBlockhashQuery(baseOptions?: Apollo.QueryHookOptions<LatestBlockhashQuery, LatestBlockhashQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LatestBlockhashQuery, LatestBlockhashQueryVariables>(LatestBlockhashDocument, options);
      }
export function useLatestBlockhashLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LatestBlockhashQuery, LatestBlockhashQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LatestBlockhashQuery, LatestBlockhashQueryVariables>(LatestBlockhashDocument, options);
        }
// @ts-ignore
export function useLatestBlockhashSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LatestBlockhashQuery, LatestBlockhashQueryVariables>): Apollo.UseSuspenseQueryResult<LatestBlockhashQuery, LatestBlockhashQueryVariables>;
export function useLatestBlockhashSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LatestBlockhashQuery, LatestBlockhashQueryVariables>): Apollo.UseSuspenseQueryResult<LatestBlockhashQuery | undefined, LatestBlockhashQueryVariables>;
export function useLatestBlockhashSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LatestBlockhashQuery, LatestBlockhashQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LatestBlockhashQuery, LatestBlockhashQueryVariables>(LatestBlockhashDocument, options);
        }
export type LatestBlockhashQueryHookResult = ReturnType<typeof useLatestBlockhashQuery>;
export type LatestBlockhashLazyQueryHookResult = ReturnType<typeof useLatestBlockhashLazyQuery>;
export type LatestBlockhashSuspenseQueryHookResult = ReturnType<typeof useLatestBlockhashSuspenseQuery>;
export type LatestBlockhashQueryResult = Apollo.QueryResult<LatestBlockhashQuery, LatestBlockhashQueryVariables>;
export const WalletBalancesDocument = gql`
    query WalletBalances($walletAddress: String!) {
  walletBalances(walletAddress: $walletAddress) {
    mint
    symbol
    name
    decimals
    amount
  }
}
    `;

/**
 * __useWalletBalancesQuery__
 *
 * To run a query within a React component, call `useWalletBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useWalletBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWalletBalancesQuery({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useWalletBalancesQuery(baseOptions: Apollo.QueryHookOptions<WalletBalancesQuery, WalletBalancesQueryVariables> & ({ variables: WalletBalancesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WalletBalancesQuery, WalletBalancesQueryVariables>(WalletBalancesDocument, options);
      }
export function useWalletBalancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WalletBalancesQuery, WalletBalancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WalletBalancesQuery, WalletBalancesQueryVariables>(WalletBalancesDocument, options);
        }
// @ts-ignore
export function useWalletBalancesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<WalletBalancesQuery, WalletBalancesQueryVariables>): Apollo.UseSuspenseQueryResult<WalletBalancesQuery, WalletBalancesQueryVariables>;
export function useWalletBalancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WalletBalancesQuery, WalletBalancesQueryVariables>): Apollo.UseSuspenseQueryResult<WalletBalancesQuery | undefined, WalletBalancesQueryVariables>;
export function useWalletBalancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WalletBalancesQuery, WalletBalancesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WalletBalancesQuery, WalletBalancesQueryVariables>(WalletBalancesDocument, options);
        }
export type WalletBalancesQueryHookResult = ReturnType<typeof useWalletBalancesQuery>;
export type WalletBalancesLazyQueryHookResult = ReturnType<typeof useWalletBalancesLazyQuery>;
export type WalletBalancesSuspenseQueryHookResult = ReturnType<typeof useWalletBalancesSuspenseQuery>;
export type WalletBalancesQueryResult = Apollo.QueryResult<WalletBalancesQuery, WalletBalancesQueryVariables>;
export const CollectionsForAgentDocument = gql`
    query collectionsForAgent($userId: String!) {
  myCollections(userId: $userId) {
    id
    name
    itemCount
    items {
      id
      url
      title
      jobId
      faviconPath
    }
  }
}
    `;

/**
 * __useCollectionsForAgentQuery__
 *
 * To run a query within a React component, call `useCollectionsForAgentQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionsForAgentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionsForAgentQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCollectionsForAgentQuery(baseOptions: Apollo.QueryHookOptions<CollectionsForAgentQuery, CollectionsForAgentQueryVariables> & ({ variables: CollectionsForAgentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionsForAgentQuery, CollectionsForAgentQueryVariables>(CollectionsForAgentDocument, options);
      }
export function useCollectionsForAgentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionsForAgentQuery, CollectionsForAgentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionsForAgentQuery, CollectionsForAgentQueryVariables>(CollectionsForAgentDocument, options);
        }
// @ts-ignore
export function useCollectionsForAgentSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CollectionsForAgentQuery, CollectionsForAgentQueryVariables>): Apollo.UseSuspenseQueryResult<CollectionsForAgentQuery, CollectionsForAgentQueryVariables>;
export function useCollectionsForAgentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionsForAgentQuery, CollectionsForAgentQueryVariables>): Apollo.UseSuspenseQueryResult<CollectionsForAgentQuery | undefined, CollectionsForAgentQueryVariables>;
export function useCollectionsForAgentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionsForAgentQuery, CollectionsForAgentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CollectionsForAgentQuery, CollectionsForAgentQueryVariables>(CollectionsForAgentDocument, options);
        }
export type CollectionsForAgentQueryHookResult = ReturnType<typeof useCollectionsForAgentQuery>;
export type CollectionsForAgentLazyQueryHookResult = ReturnType<typeof useCollectionsForAgentLazyQuery>;
export type CollectionsForAgentSuspenseQueryHookResult = ReturnType<typeof useCollectionsForAgentSuspenseQuery>;
export type CollectionsForAgentQueryResult = Apollo.QueryResult<CollectionsForAgentQuery, CollectionsForAgentQueryVariables>;
export const AgentCreateSearchPagesDocument = gql`
    query agentCreateSearchPages($query: String, $pagination: PaginationInput) {
  readerIndex(query: $query, pagination: $pagination) {
    id
    url
    seoTitle
    faviconPath
  }
}
    `;

/**
 * __useAgentCreateSearchPagesQuery__
 *
 * To run a query within a React component, call `useAgentCreateSearchPagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentCreateSearchPagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentCreateSearchPagesQuery({
 *   variables: {
 *      query: // value for 'query'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useAgentCreateSearchPagesQuery(baseOptions?: Apollo.QueryHookOptions<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>(AgentCreateSearchPagesDocument, options);
      }
export function useAgentCreateSearchPagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>(AgentCreateSearchPagesDocument, options);
        }
// @ts-ignore
export function useAgentCreateSearchPagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>): Apollo.UseSuspenseQueryResult<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>;
export function useAgentCreateSearchPagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>): Apollo.UseSuspenseQueryResult<AgentCreateSearchPagesQuery | undefined, AgentCreateSearchPagesQueryVariables>;
export function useAgentCreateSearchPagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>(AgentCreateSearchPagesDocument, options);
        }
export type AgentCreateSearchPagesQueryHookResult = ReturnType<typeof useAgentCreateSearchPagesQuery>;
export type AgentCreateSearchPagesLazyQueryHookResult = ReturnType<typeof useAgentCreateSearchPagesLazyQuery>;
export type AgentCreateSearchPagesSuspenseQueryHookResult = ReturnType<typeof useAgentCreateSearchPagesSuspenseQuery>;
export type AgentCreateSearchPagesQueryResult = Apollo.QueryResult<AgentCreateSearchPagesQuery, AgentCreateSearchPagesQueryVariables>;
export const AgentCreateDomainJobsDocument = gql`
    query agentCreateDomainJobs($domain: String!, $pagination: PaginationInput) {
  completed: optimizationJobsByDomain(domain: $domain, pagination: $pagination) {
    id
    url
    faviconPath
    seoTitle
  }
}
    `;

/**
 * __useAgentCreateDomainJobsQuery__
 *
 * To run a query within a React component, call `useAgentCreateDomainJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentCreateDomainJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentCreateDomainJobsQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useAgentCreateDomainJobsQuery(baseOptions: Apollo.QueryHookOptions<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables> & ({ variables: AgentCreateDomainJobsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables>(AgentCreateDomainJobsDocument, options);
      }
export function useAgentCreateDomainJobsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables>(AgentCreateDomainJobsDocument, options);
        }
// @ts-ignore
export function useAgentCreateDomainJobsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables>): Apollo.UseSuspenseQueryResult<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables>;
export function useAgentCreateDomainJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables>): Apollo.UseSuspenseQueryResult<AgentCreateDomainJobsQuery | undefined, AgentCreateDomainJobsQueryVariables>;
export function useAgentCreateDomainJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables>(AgentCreateDomainJobsDocument, options);
        }
export type AgentCreateDomainJobsQueryHookResult = ReturnType<typeof useAgentCreateDomainJobsQuery>;
export type AgentCreateDomainJobsLazyQueryHookResult = ReturnType<typeof useAgentCreateDomainJobsLazyQuery>;
export type AgentCreateDomainJobsSuspenseQueryHookResult = ReturnType<typeof useAgentCreateDomainJobsSuspenseQuery>;
export type AgentCreateDomainJobsQueryResult = Apollo.QueryResult<AgentCreateDomainJobsQuery, AgentCreateDomainJobsQueryVariables>;
export const AgentSessionsDocument = gql`
    query agentSessions($userId: String!, $pagination: PaginationInput) {
  agentSessions(userId: $userId, pagination: $pagination) {
    id
    title
    promptHash
    jobIds
    totalCost
    createdAt
  }
}
    `;

/**
 * __useAgentSessionsQuery__
 *
 * To run a query within a React component, call `useAgentSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentSessionsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useAgentSessionsQuery(baseOptions: Apollo.QueryHookOptions<AgentSessionsQuery, AgentSessionsQueryVariables> & ({ variables: AgentSessionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AgentSessionsQuery, AgentSessionsQueryVariables>(AgentSessionsDocument, options);
      }
export function useAgentSessionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AgentSessionsQuery, AgentSessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AgentSessionsQuery, AgentSessionsQueryVariables>(AgentSessionsDocument, options);
        }
// @ts-ignore
export function useAgentSessionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AgentSessionsQuery, AgentSessionsQueryVariables>): Apollo.UseSuspenseQueryResult<AgentSessionsQuery, AgentSessionsQueryVariables>;
export function useAgentSessionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentSessionsQuery, AgentSessionsQueryVariables>): Apollo.UseSuspenseQueryResult<AgentSessionsQuery | undefined, AgentSessionsQueryVariables>;
export function useAgentSessionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentSessionsQuery, AgentSessionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AgentSessionsQuery, AgentSessionsQueryVariables>(AgentSessionsDocument, options);
        }
export type AgentSessionsQueryHookResult = ReturnType<typeof useAgentSessionsQuery>;
export type AgentSessionsLazyQueryHookResult = ReturnType<typeof useAgentSessionsLazyQuery>;
export type AgentSessionsSuspenseQueryHookResult = ReturnType<typeof useAgentSessionsSuspenseQuery>;
export type AgentSessionsQueryResult = Apollo.QueryResult<AgentSessionsQuery, AgentSessionsQueryVariables>;
export const AgentSessionDocument = gql`
    query agentSession($id: String!) {
  agentSession(id: $id) {
    id
    title
    systemPrompt
    model
    promptHash
    jobIds
    totalInputTokens
    totalOutputTokens
    totalCost
    messages {
      id
      role
      content
      cost
      createdAt
    }
    jobs {
      id
      url
      seoTitle
      seoDescription
      faviconPath
      compressedPreviewImage
      simpleReaderPath
      ultraReaderPath
    }
  }
}
    `;

/**
 * __useAgentSessionQuery__
 *
 * To run a query within a React component, call `useAgentSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentSessionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAgentSessionQuery(baseOptions: Apollo.QueryHookOptions<AgentSessionQuery, AgentSessionQueryVariables> & ({ variables: AgentSessionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AgentSessionQuery, AgentSessionQueryVariables>(AgentSessionDocument, options);
      }
export function useAgentSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AgentSessionQuery, AgentSessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AgentSessionQuery, AgentSessionQueryVariables>(AgentSessionDocument, options);
        }
// @ts-ignore
export function useAgentSessionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AgentSessionQuery, AgentSessionQueryVariables>): Apollo.UseSuspenseQueryResult<AgentSessionQuery, AgentSessionQueryVariables>;
export function useAgentSessionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentSessionQuery, AgentSessionQueryVariables>): Apollo.UseSuspenseQueryResult<AgentSessionQuery | undefined, AgentSessionQueryVariables>;
export function useAgentSessionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentSessionQuery, AgentSessionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AgentSessionQuery, AgentSessionQueryVariables>(AgentSessionDocument, options);
        }
export type AgentSessionQueryHookResult = ReturnType<typeof useAgentSessionQuery>;
export type AgentSessionLazyQueryHookResult = ReturnType<typeof useAgentSessionLazyQuery>;
export type AgentSessionSuspenseQueryHookResult = ReturnType<typeof useAgentSessionSuspenseQuery>;
export type AgentSessionQueryResult = Apollo.QueryResult<AgentSessionQuery, AgentSessionQueryVariables>;
export const CreateAgentSessionDocument = gql`
    mutation createAgentSession($userId: String!, $walletAddress: String!, $jobIds: [String!]!, $title: String, $systemPrompt: String, $model: String) {
  createAgentSession(
    userId: $userId
    walletAddress: $walletAddress
    jobIds: $jobIds
    title: $title
    systemPrompt: $systemPrompt
    model: $model
  ) {
    id
    title
    promptHash
    jobIds
  }
}
    `;
export type CreateAgentSessionMutationFn = Apollo.MutationFunction<CreateAgentSessionMutation, CreateAgentSessionMutationVariables>;

/**
 * __useCreateAgentSessionMutation__
 *
 * To run a mutation, you first call `useCreateAgentSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAgentSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAgentSessionMutation, { data, loading, error }] = useCreateAgentSessionMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      walletAddress: // value for 'walletAddress'
 *      jobIds: // value for 'jobIds'
 *      title: // value for 'title'
 *      systemPrompt: // value for 'systemPrompt'
 *      model: // value for 'model'
 *   },
 * });
 */
export function useCreateAgentSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateAgentSessionMutation, CreateAgentSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAgentSessionMutation, CreateAgentSessionMutationVariables>(CreateAgentSessionDocument, options);
      }
export type CreateAgentSessionMutationHookResult = ReturnType<typeof useCreateAgentSessionMutation>;
export type CreateAgentSessionMutationResult = Apollo.MutationResult<CreateAgentSessionMutation>;
export type CreateAgentSessionMutationOptions = Apollo.BaseMutationOptions<CreateAgentSessionMutation, CreateAgentSessionMutationVariables>;
export const AgentSessionsByPromptHashDocument = gql`
    query agentSessionsByPromptHash($hash: String!, $userId: String!) {
  agentSessionsByPromptHash(hash: $hash, userId: $userId) {
    id
    title
    promptHash
    totalCost
    createdAt
  }
}
    `;

/**
 * __useAgentSessionsByPromptHashQuery__
 *
 * To run a query within a React component, call `useAgentSessionsByPromptHashQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentSessionsByPromptHashQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentSessionsByPromptHashQuery({
 *   variables: {
 *      hash: // value for 'hash'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useAgentSessionsByPromptHashQuery(baseOptions: Apollo.QueryHookOptions<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables> & ({ variables: AgentSessionsByPromptHashQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables>(AgentSessionsByPromptHashDocument, options);
      }
export function useAgentSessionsByPromptHashLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables>(AgentSessionsByPromptHashDocument, options);
        }
// @ts-ignore
export function useAgentSessionsByPromptHashSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables>): Apollo.UseSuspenseQueryResult<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables>;
export function useAgentSessionsByPromptHashSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables>): Apollo.UseSuspenseQueryResult<AgentSessionsByPromptHashQuery | undefined, AgentSessionsByPromptHashQueryVariables>;
export function useAgentSessionsByPromptHashSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables>(AgentSessionsByPromptHashDocument, options);
        }
export type AgentSessionsByPromptHashQueryHookResult = ReturnType<typeof useAgentSessionsByPromptHashQuery>;
export type AgentSessionsByPromptHashLazyQueryHookResult = ReturnType<typeof useAgentSessionsByPromptHashLazyQuery>;
export type AgentSessionsByPromptHashSuspenseQueryHookResult = ReturnType<typeof useAgentSessionsByPromptHashSuspenseQuery>;
export type AgentSessionsByPromptHashQueryResult = Apollo.QueryResult<AgentSessionsByPromptHashQuery, AgentSessionsByPromptHashQueryVariables>;
export const DeleteAgentSessionDocument = gql`
    mutation deleteAgentSession($id: String!) {
  deleteAgentSession(id: $id)
}
    `;
export type DeleteAgentSessionMutationFn = Apollo.MutationFunction<DeleteAgentSessionMutation, DeleteAgentSessionMutationVariables>;

/**
 * __useDeleteAgentSessionMutation__
 *
 * To run a mutation, you first call `useDeleteAgentSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAgentSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAgentSessionMutation, { data, loading, error }] = useDeleteAgentSessionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAgentSessionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAgentSessionMutation, DeleteAgentSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAgentSessionMutation, DeleteAgentSessionMutationVariables>(DeleteAgentSessionDocument, options);
      }
export type DeleteAgentSessionMutationHookResult = ReturnType<typeof useDeleteAgentSessionMutation>;
export type DeleteAgentSessionMutationResult = Apollo.MutationResult<DeleteAgentSessionMutation>;
export type DeleteAgentSessionMutationOptions = Apollo.BaseMutationOptions<DeleteAgentSessionMutation, DeleteAgentSessionMutationVariables>;
export const AddJobToAgentSessionDocument = gql`
    mutation addJobToAgentSession($sessionId: String!, $jobId: String!) {
  addJobToAgentSession(sessionId: $sessionId, jobId: $jobId) {
    id
    jobIds
    jobs {
      id
      url
      seoTitle
      seoDescription
      faviconPath
      compressedPreviewImage
      simpleReaderPath
      ultraReaderPath
    }
  }
}
    `;
export type AddJobToAgentSessionMutationFn = Apollo.MutationFunction<AddJobToAgentSessionMutation, AddJobToAgentSessionMutationVariables>;

/**
 * __useAddJobToAgentSessionMutation__
 *
 * To run a mutation, you first call `useAddJobToAgentSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddJobToAgentSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addJobToAgentSessionMutation, { data, loading, error }] = useAddJobToAgentSessionMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useAddJobToAgentSessionMutation(baseOptions?: Apollo.MutationHookOptions<AddJobToAgentSessionMutation, AddJobToAgentSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddJobToAgentSessionMutation, AddJobToAgentSessionMutationVariables>(AddJobToAgentSessionDocument, options);
      }
export type AddJobToAgentSessionMutationHookResult = ReturnType<typeof useAddJobToAgentSessionMutation>;
export type AddJobToAgentSessionMutationResult = Apollo.MutationResult<AddJobToAgentSessionMutation>;
export type AddJobToAgentSessionMutationOptions = Apollo.BaseMutationOptions<AddJobToAgentSessionMutation, AddJobToAgentSessionMutationVariables>;
export const ReaderIndexForSessionDocument = gql`
    query readerIndexForSession($query: String, $pagination: PaginationInput) {
  readerIndex(query: $query, pagination: $pagination) {
    id
    url
    seoTitle
    seoDescription
    faviconPath
    compressedPreviewImage
  }
}
    `;

/**
 * __useReaderIndexForSessionQuery__
 *
 * To run a query within a React component, call `useReaderIndexForSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useReaderIndexForSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReaderIndexForSessionQuery({
 *   variables: {
 *      query: // value for 'query'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useReaderIndexForSessionQuery(baseOptions?: Apollo.QueryHookOptions<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>(ReaderIndexForSessionDocument, options);
      }
export function useReaderIndexForSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>(ReaderIndexForSessionDocument, options);
        }
// @ts-ignore
export function useReaderIndexForSessionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>): Apollo.UseSuspenseQueryResult<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>;
export function useReaderIndexForSessionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>): Apollo.UseSuspenseQueryResult<ReaderIndexForSessionQuery | undefined, ReaderIndexForSessionQueryVariables>;
export function useReaderIndexForSessionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>(ReaderIndexForSessionDocument, options);
        }
export type ReaderIndexForSessionQueryHookResult = ReturnType<typeof useReaderIndexForSessionQuery>;
export type ReaderIndexForSessionLazyQueryHookResult = ReturnType<typeof useReaderIndexForSessionLazyQuery>;
export type ReaderIndexForSessionSuspenseQueryHookResult = ReturnType<typeof useReaderIndexForSessionSuspenseQuery>;
export type ReaderIndexForSessionQueryResult = Apollo.QueryResult<ReaderIndexForSessionQuery, ReaderIndexForSessionQueryVariables>;
export const AgentMentionLookupDocument = gql`
    query agentMentionLookup($query: String!, $pagination: PaginationInput) {
  readerIndex(query: $query, pagination: $pagination) {
    id
    url
    seoTitle
    faviconPath
  }
}
    `;

/**
 * __useAgentMentionLookupQuery__
 *
 * To run a query within a React component, call `useAgentMentionLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useAgentMentionLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAgentMentionLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useAgentMentionLookupQuery(baseOptions: Apollo.QueryHookOptions<AgentMentionLookupQuery, AgentMentionLookupQueryVariables> & ({ variables: AgentMentionLookupQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AgentMentionLookupQuery, AgentMentionLookupQueryVariables>(AgentMentionLookupDocument, options);
      }
export function useAgentMentionLookupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AgentMentionLookupQuery, AgentMentionLookupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AgentMentionLookupQuery, AgentMentionLookupQueryVariables>(AgentMentionLookupDocument, options);
        }
// @ts-ignore
export function useAgentMentionLookupSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AgentMentionLookupQuery, AgentMentionLookupQueryVariables>): Apollo.UseSuspenseQueryResult<AgentMentionLookupQuery, AgentMentionLookupQueryVariables>;
export function useAgentMentionLookupSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentMentionLookupQuery, AgentMentionLookupQueryVariables>): Apollo.UseSuspenseQueryResult<AgentMentionLookupQuery | undefined, AgentMentionLookupQueryVariables>;
export function useAgentMentionLookupSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AgentMentionLookupQuery, AgentMentionLookupQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AgentMentionLookupQuery, AgentMentionLookupQueryVariables>(AgentMentionLookupDocument, options);
        }
export type AgentMentionLookupQueryHookResult = ReturnType<typeof useAgentMentionLookupQuery>;
export type AgentMentionLookupLazyQueryHookResult = ReturnType<typeof useAgentMentionLookupLazyQuery>;
export type AgentMentionLookupSuspenseQueryHookResult = ReturnType<typeof useAgentMentionLookupSuspenseQuery>;
export type AgentMentionLookupQueryResult = Apollo.QueryResult<AgentMentionLookupQuery, AgentMentionLookupQueryVariables>;
export const ReaderIndexForLinksDocument = gql`
    query readerIndexForLinks($pagination: PaginationInput) {
  readerIndex(pagination: $pagination) {
    id
    url
    seoTitle
    faviconPath
    simpleReaderPath
    ultraReaderPath
  }
}
    `;

/**
 * __useReaderIndexForLinksQuery__
 *
 * To run a query within a React component, call `useReaderIndexForLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useReaderIndexForLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReaderIndexForLinksQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useReaderIndexForLinksQuery(baseOptions?: Apollo.QueryHookOptions<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>(ReaderIndexForLinksDocument, options);
      }
export function useReaderIndexForLinksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>(ReaderIndexForLinksDocument, options);
        }
// @ts-ignore
export function useReaderIndexForLinksSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>): Apollo.UseSuspenseQueryResult<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>;
export function useReaderIndexForLinksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>): Apollo.UseSuspenseQueryResult<ReaderIndexForLinksQuery | undefined, ReaderIndexForLinksQueryVariables>;
export function useReaderIndexForLinksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>(ReaderIndexForLinksDocument, options);
        }
export type ReaderIndexForLinksQueryHookResult = ReturnType<typeof useReaderIndexForLinksQuery>;
export type ReaderIndexForLinksLazyQueryHookResult = ReturnType<typeof useReaderIndexForLinksLazyQuery>;
export type ReaderIndexForLinksSuspenseQueryHookResult = ReturnType<typeof useReaderIndexForLinksSuspenseQuery>;
export type ReaderIndexForLinksQueryResult = Apollo.QueryResult<ReaderIndexForLinksQuery, ReaderIndexForLinksQueryVariables>;
export const ArchivedViewDocument = gql`
    query archivedView($userId: String!, $jobId: String!) {
  archivedView(userId: $userId, jobId: $jobId) {
    id
    userId
    jobId
    hosted
    createdAt
  }
}
    `;

/**
 * __useArchivedViewQuery__
 *
 * To run a query within a React component, call `useArchivedViewQuery` and pass it any options that fit your needs.
 * When your component renders, `useArchivedViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArchivedViewQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useArchivedViewQuery(baseOptions: Apollo.QueryHookOptions<ArchivedViewQuery, ArchivedViewQueryVariables> & ({ variables: ArchivedViewQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArchivedViewQuery, ArchivedViewQueryVariables>(ArchivedViewDocument, options);
      }
export function useArchivedViewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArchivedViewQuery, ArchivedViewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArchivedViewQuery, ArchivedViewQueryVariables>(ArchivedViewDocument, options);
        }
// @ts-ignore
export function useArchivedViewSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ArchivedViewQuery, ArchivedViewQueryVariables>): Apollo.UseSuspenseQueryResult<ArchivedViewQuery, ArchivedViewQueryVariables>;
export function useArchivedViewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ArchivedViewQuery, ArchivedViewQueryVariables>): Apollo.UseSuspenseQueryResult<ArchivedViewQuery | undefined, ArchivedViewQueryVariables>;
export function useArchivedViewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ArchivedViewQuery, ArchivedViewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ArchivedViewQuery, ArchivedViewQueryVariables>(ArchivedViewDocument, options);
        }
export type ArchivedViewQueryHookResult = ReturnType<typeof useArchivedViewQuery>;
export type ArchivedViewLazyQueryHookResult = ReturnType<typeof useArchivedViewLazyQuery>;
export type ArchivedViewSuspenseQueryHookResult = ReturnType<typeof useArchivedViewSuspenseQuery>;
export type ArchivedViewQueryResult = Apollo.QueryResult<ArchivedViewQuery, ArchivedViewQueryVariables>;
export const MyArchiveDocument = gql`
    query myArchive($userId: String!, $pagination: PaginationInput) {
  myArchive(userId: $userId, pagination: $pagination) {
    id
    userId
    jobId
    amount
    hosted
    createdAt
    job {
      id
      url
      status
      simpleReaderPath
      ultraReaderPath
      faviconPath
      seoTitle
      seoDescription
      compressedPreviewImage
      contentHashSum
      createdAt
      optimizedFiles {
        id
        originalUrl
        originalSize
        optimizedSize
        savings
        isBestVariant
        hostingActive
        hostedUrl
        hostingCost
      }
    }
  }
}
    `;

/**
 * __useMyArchiveQuery__
 *
 * To run a query within a React component, call `useMyArchiveQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyArchiveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyArchiveQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useMyArchiveQuery(baseOptions: Apollo.QueryHookOptions<MyArchiveQuery, MyArchiveQueryVariables> & ({ variables: MyArchiveQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyArchiveQuery, MyArchiveQueryVariables>(MyArchiveDocument, options);
      }
export function useMyArchiveLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyArchiveQuery, MyArchiveQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyArchiveQuery, MyArchiveQueryVariables>(MyArchiveDocument, options);
        }
// @ts-ignore
export function useMyArchiveSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyArchiveQuery, MyArchiveQueryVariables>): Apollo.UseSuspenseQueryResult<MyArchiveQuery, MyArchiveQueryVariables>;
export function useMyArchiveSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyArchiveQuery, MyArchiveQueryVariables>): Apollo.UseSuspenseQueryResult<MyArchiveQuery | undefined, MyArchiveQueryVariables>;
export function useMyArchiveSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyArchiveQuery, MyArchiveQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyArchiveQuery, MyArchiveQueryVariables>(MyArchiveDocument, options);
        }
export type MyArchiveQueryHookResult = ReturnType<typeof useMyArchiveQuery>;
export type MyArchiveLazyQueryHookResult = ReturnType<typeof useMyArchiveLazyQuery>;
export type MyArchiveSuspenseQueryHookResult = ReturnType<typeof useMyArchiveSuspenseQuery>;
export type MyArchiveQueryResult = Apollo.QueryResult<MyArchiveQuery, MyArchiveQueryVariables>;
export const ArchiveViewDocument = gql`
    mutation archiveView($userId: String!, $walletAddress: String, $jobId: String!, $txSignature: String) {
  archiveView(
    userId: $userId
    walletAddress: $walletAddress
    jobId: $jobId
    txSignature: $txSignature
  ) {
    id
    userId
    jobId
    hosted
    createdAt
  }
}
    `;
export type ArchiveViewMutationFn = Apollo.MutationFunction<ArchiveViewMutation, ArchiveViewMutationVariables>;

/**
 * __useArchiveViewMutation__
 *
 * To run a mutation, you first call `useArchiveViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveViewMutation, { data, loading, error }] = useArchiveViewMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      walletAddress: // value for 'walletAddress'
 *      jobId: // value for 'jobId'
 *      txSignature: // value for 'txSignature'
 *   },
 * });
 */
export function useArchiveViewMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveViewMutation, ArchiveViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveViewMutation, ArchiveViewMutationVariables>(ArchiveViewDocument, options);
      }
export type ArchiveViewMutationHookResult = ReturnType<typeof useArchiveViewMutation>;
export type ArchiveViewMutationResult = Apollo.MutationResult<ArchiveViewMutation>;
export type ArchiveViewMutationOptions = Apollo.BaseMutationOptions<ArchiveViewMutation, ArchiveViewMutationVariables>;
export const ArchiveBatchViewsDocument = gql`
    mutation archiveBatchViews($userId: String!, $walletAddress: String!, $jobIds: [String!]!, $txSignature: String!) {
  archiveBatchViews(
    userId: $userId
    walletAddress: $walletAddress
    jobIds: $jobIds
    txSignature: $txSignature
  ) {
    id
    userId
    jobId
    hosted
    createdAt
  }
}
    `;
export type ArchiveBatchViewsMutationFn = Apollo.MutationFunction<ArchiveBatchViewsMutation, ArchiveBatchViewsMutationVariables>;

/**
 * __useArchiveBatchViewsMutation__
 *
 * To run a mutation, you first call `useArchiveBatchViewsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveBatchViewsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveBatchViewsMutation, { data, loading, error }] = useArchiveBatchViewsMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      walletAddress: // value for 'walletAddress'
 *      jobIds: // value for 'jobIds'
 *      txSignature: // value for 'txSignature'
 *   },
 * });
 */
export function useArchiveBatchViewsMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveBatchViewsMutation, ArchiveBatchViewsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveBatchViewsMutation, ArchiveBatchViewsMutationVariables>(ArchiveBatchViewsDocument, options);
      }
export type ArchiveBatchViewsMutationHookResult = ReturnType<typeof useArchiveBatchViewsMutation>;
export type ArchiveBatchViewsMutationResult = Apollo.MutationResult<ArchiveBatchViewsMutation>;
export type ArchiveBatchViewsMutationOptions = Apollo.BaseMutationOptions<ArchiveBatchViewsMutation, ArchiveBatchViewsMutationVariables>;
export const HostArchivedViewDocument = gql`
    mutation hostArchivedView($userId: String!, $jobId: String!, $txSignature: String!) {
  hostArchivedView(userId: $userId, jobId: $jobId, txSignature: $txSignature) {
    id
    hosted
  }
}
    `;
export type HostArchivedViewMutationFn = Apollo.MutationFunction<HostArchivedViewMutation, HostArchivedViewMutationVariables>;

/**
 * __useHostArchivedViewMutation__
 *
 * To run a mutation, you first call `useHostArchivedViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHostArchivedViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hostArchivedViewMutation, { data, loading, error }] = useHostArchivedViewMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      jobId: // value for 'jobId'
 *      txSignature: // value for 'txSignature'
 *   },
 * });
 */
export function useHostArchivedViewMutation(baseOptions?: Apollo.MutationHookOptions<HostArchivedViewMutation, HostArchivedViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HostArchivedViewMutation, HostArchivedViewMutationVariables>(HostArchivedViewDocument, options);
      }
export type HostArchivedViewMutationHookResult = ReturnType<typeof useHostArchivedViewMutation>;
export type HostArchivedViewMutationResult = Apollo.MutationResult<HostArchivedViewMutation>;
export type HostArchivedViewMutationOptions = Apollo.BaseMutationOptions<HostArchivedViewMutation, HostArchivedViewMutationVariables>;
export const ParseFeedDocument = gql`
    mutation parseFeed($url: String!) {
  parseFeed(url: $url) {
    url
    title
    description
  }
}
    `;
export type ParseFeedMutationFn = Apollo.MutationFunction<ParseFeedMutation, ParseFeedMutationVariables>;

/**
 * __useParseFeedMutation__
 *
 * To run a mutation, you first call `useParseFeedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useParseFeedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [parseFeedMutation, { data, loading, error }] = useParseFeedMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useParseFeedMutation(baseOptions?: Apollo.MutationHookOptions<ParseFeedMutation, ParseFeedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ParseFeedMutation, ParseFeedMutationVariables>(ParseFeedDocument, options);
      }
export type ParseFeedMutationHookResult = ReturnType<typeof useParseFeedMutation>;
export type ParseFeedMutationResult = Apollo.MutationResult<ParseFeedMutation>;
export type ParseFeedMutationOptions = Apollo.BaseMutationOptions<ParseFeedMutation, ParseFeedMutationVariables>;
export const CreateBatchJobsDocument = gql`
    mutation createBatchJobs($urls: [String!]!, $mode: OptimizationMode) {
  createBatchJobs(urls: $urls, mode: $mode) {
    id
    url
    status
  }
}
    `;
export type CreateBatchJobsMutationFn = Apollo.MutationFunction<CreateBatchJobsMutation, CreateBatchJobsMutationVariables>;

/**
 * __useCreateBatchJobsMutation__
 *
 * To run a mutation, you first call `useCreateBatchJobsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBatchJobsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBatchJobsMutation, { data, loading, error }] = useCreateBatchJobsMutation({
 *   variables: {
 *      urls: // value for 'urls'
 *      mode: // value for 'mode'
 *   },
 * });
 */
export function useCreateBatchJobsMutation(baseOptions?: Apollo.MutationHookOptions<CreateBatchJobsMutation, CreateBatchJobsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBatchJobsMutation, CreateBatchJobsMutationVariables>(CreateBatchJobsDocument, options);
      }
export type CreateBatchJobsMutationHookResult = ReturnType<typeof useCreateBatchJobsMutation>;
export type CreateBatchJobsMutationResult = Apollo.MutationResult<CreateBatchJobsMutation>;
export type CreateBatchJobsMutationOptions = Apollo.BaseMutationOptions<CreateBatchJobsMutation, CreateBatchJobsMutationVariables>;
export const SearchImagesCountDocument = gql`
    query searchImagesCount($query: String, $family: String) {
  searchImagesCount(query: $query, family: $family)
}
    `;

/**
 * __useSearchImagesCountQuery__
 *
 * To run a query within a React component, call `useSearchImagesCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchImagesCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchImagesCountQuery({
 *   variables: {
 *      query: // value for 'query'
 *      family: // value for 'family'
 *   },
 * });
 */
export function useSearchImagesCountQuery(baseOptions?: Apollo.QueryHookOptions<SearchImagesCountQuery, SearchImagesCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchImagesCountQuery, SearchImagesCountQueryVariables>(SearchImagesCountDocument, options);
      }
export function useSearchImagesCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchImagesCountQuery, SearchImagesCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchImagesCountQuery, SearchImagesCountQueryVariables>(SearchImagesCountDocument, options);
        }
// @ts-ignore
export function useSearchImagesCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchImagesCountQuery, SearchImagesCountQueryVariables>): Apollo.UseSuspenseQueryResult<SearchImagesCountQuery, SearchImagesCountQueryVariables>;
export function useSearchImagesCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchImagesCountQuery, SearchImagesCountQueryVariables>): Apollo.UseSuspenseQueryResult<SearchImagesCountQuery | undefined, SearchImagesCountQueryVariables>;
export function useSearchImagesCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchImagesCountQuery, SearchImagesCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchImagesCountQuery, SearchImagesCountQueryVariables>(SearchImagesCountDocument, options);
        }
export type SearchImagesCountQueryHookResult = ReturnType<typeof useSearchImagesCountQuery>;
export type SearchImagesCountLazyQueryHookResult = ReturnType<typeof useSearchImagesCountLazyQuery>;
export type SearchImagesCountSuspenseQueryHookResult = ReturnType<typeof useSearchImagesCountSuspenseQuery>;
export type SearchImagesCountQueryResult = Apollo.QueryResult<SearchImagesCountQuery, SearchImagesCountQueryVariables>;
export const SearchImagesDocument = gql`
    query searchImages($query: String, $family: String, $pagination: PaginationInput) {
  searchImages(query: $query, family: $family, pagination: $pagination) {
    id
    originalUrl
    originalSize
    optimizedSize
    savings
    contentType
    format
    family
    isBestVariant
    storagePath
    hostedUrl
    width
    height
    aiDescription
    aiTags
    createdAt
    job {
      id
      url
      faviconPath
      seoTitle
    }
  }
}
    `;

/**
 * __useSearchImagesQuery__
 *
 * To run a query within a React component, call `useSearchImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchImagesQuery({
 *   variables: {
 *      query: // value for 'query'
 *      family: // value for 'family'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchImagesQuery(baseOptions?: Apollo.QueryHookOptions<SearchImagesQuery, SearchImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchImagesQuery, SearchImagesQueryVariables>(SearchImagesDocument, options);
      }
export function useSearchImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchImagesQuery, SearchImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchImagesQuery, SearchImagesQueryVariables>(SearchImagesDocument, options);
        }
// @ts-ignore
export function useSearchImagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchImagesQuery, SearchImagesQueryVariables>): Apollo.UseSuspenseQueryResult<SearchImagesQuery, SearchImagesQueryVariables>;
export function useSearchImagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchImagesQuery, SearchImagesQueryVariables>): Apollo.UseSuspenseQueryResult<SearchImagesQuery | undefined, SearchImagesQueryVariables>;
export function useSearchImagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchImagesQuery, SearchImagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchImagesQuery, SearchImagesQueryVariables>(SearchImagesDocument, options);
        }
export type SearchImagesQueryHookResult = ReturnType<typeof useSearchImagesQuery>;
export type SearchImagesLazyQueryHookResult = ReturnType<typeof useSearchImagesLazyQuery>;
export type SearchImagesSuspenseQueryHookResult = ReturnType<typeof useSearchImagesSuspenseQuery>;
export type SearchImagesQueryResult = Apollo.QueryResult<SearchImagesQuery, SearchImagesQueryVariables>;
export const KeywordPromotionDocument = gql`
    query keywordPromotion($query: String!) {
  keywordPromotion(query: $query) {
    id
    amount
    sender
    active
    keyword {
      keyword
      frequency
      job {
        id
        url
        seoTitle
        faviconPath
        compressedPreviewImage
      }
    }
  }
}
    `;

/**
 * __useKeywordPromotionQuery__
 *
 * To run a query within a React component, call `useKeywordPromotionQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordPromotionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordPromotionQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useKeywordPromotionQuery(baseOptions: Apollo.QueryHookOptions<KeywordPromotionQuery, KeywordPromotionQueryVariables> & ({ variables: KeywordPromotionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordPromotionQuery, KeywordPromotionQueryVariables>(KeywordPromotionDocument, options);
      }
export function useKeywordPromotionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordPromotionQuery, KeywordPromotionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordPromotionQuery, KeywordPromotionQueryVariables>(KeywordPromotionDocument, options);
        }
// @ts-ignore
export function useKeywordPromotionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<KeywordPromotionQuery, KeywordPromotionQueryVariables>): Apollo.UseSuspenseQueryResult<KeywordPromotionQuery, KeywordPromotionQueryVariables>;
export function useKeywordPromotionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<KeywordPromotionQuery, KeywordPromotionQueryVariables>): Apollo.UseSuspenseQueryResult<KeywordPromotionQuery | undefined, KeywordPromotionQueryVariables>;
export function useKeywordPromotionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<KeywordPromotionQuery, KeywordPromotionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<KeywordPromotionQuery, KeywordPromotionQueryVariables>(KeywordPromotionDocument, options);
        }
export type KeywordPromotionQueryHookResult = ReturnType<typeof useKeywordPromotionQuery>;
export type KeywordPromotionLazyQueryHookResult = ReturnType<typeof useKeywordPromotionLazyQuery>;
export type KeywordPromotionSuspenseQueryHookResult = ReturnType<typeof useKeywordPromotionSuspenseQuery>;
export type KeywordPromotionQueryResult = Apollo.QueryResult<KeywordPromotionQuery, KeywordPromotionQueryVariables>;
export const ReaderIndexCountDocument = gql`
    query readerIndexCount($query: String, $mode: OptimizationMode) {
  readerIndexCount(query: $query, mode: $mode)
}
    `;

/**
 * __useReaderIndexCountQuery__
 *
 * To run a query within a React component, call `useReaderIndexCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useReaderIndexCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReaderIndexCountQuery({
 *   variables: {
 *      query: // value for 'query'
 *      mode: // value for 'mode'
 *   },
 * });
 */
export function useReaderIndexCountQuery(baseOptions?: Apollo.QueryHookOptions<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>(ReaderIndexCountDocument, options);
      }
export function useReaderIndexCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>(ReaderIndexCountDocument, options);
        }
// @ts-ignore
export function useReaderIndexCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>): Apollo.UseSuspenseQueryResult<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>;
export function useReaderIndexCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>): Apollo.UseSuspenseQueryResult<ReaderIndexCountQuery | undefined, ReaderIndexCountQueryVariables>;
export function useReaderIndexCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>(ReaderIndexCountDocument, options);
        }
export type ReaderIndexCountQueryHookResult = ReturnType<typeof useReaderIndexCountQuery>;
export type ReaderIndexCountLazyQueryHookResult = ReturnType<typeof useReaderIndexCountLazyQuery>;
export type ReaderIndexCountSuspenseQueryHookResult = ReturnType<typeof useReaderIndexCountSuspenseQuery>;
export type ReaderIndexCountQueryResult = Apollo.QueryResult<ReaderIndexCountQuery, ReaderIndexCountQueryVariables>;
export const ReaderIndexDocument = gql`
    query readerIndex($query: String, $pagination: PaginationInput, $mode: OptimizationMode) {
  readerIndex(query: $query, pagination: $pagination, mode: $mode) {
    id
    url
    originalPageSize
    optimizedPageSize
    simpleReaderSize
    ultraReaderSize
    optimizedFiles {
      id
      originalUrl
      originalSize
      optimizedSize
      savings
      isBestVariant
    }
    contentHashSum
    faviconPath
    phoneNumber
    seoTitle
    seoDescription
    compressedPreviewImage(mode: $mode)
    simpleReaderPath
    ultraReaderPath
    createdAt
  }
}
    `;

/**
 * __useReaderIndexQuery__
 *
 * To run a query within a React component, call `useReaderIndexQuery` and pass it any options that fit your needs.
 * When your component renders, `useReaderIndexQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReaderIndexQuery({
 *   variables: {
 *      query: // value for 'query'
 *      pagination: // value for 'pagination'
 *      mode: // value for 'mode'
 *   },
 * });
 */
export function useReaderIndexQuery(baseOptions?: Apollo.QueryHookOptions<ReaderIndexQuery, ReaderIndexQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReaderIndexQuery, ReaderIndexQueryVariables>(ReaderIndexDocument, options);
      }
export function useReaderIndexLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReaderIndexQuery, ReaderIndexQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReaderIndexQuery, ReaderIndexQueryVariables>(ReaderIndexDocument, options);
        }
// @ts-ignore
export function useReaderIndexSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ReaderIndexQuery, ReaderIndexQueryVariables>): Apollo.UseSuspenseQueryResult<ReaderIndexQuery, ReaderIndexQueryVariables>;
export function useReaderIndexSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ReaderIndexQuery, ReaderIndexQueryVariables>): Apollo.UseSuspenseQueryResult<ReaderIndexQuery | undefined, ReaderIndexQueryVariables>;
export function useReaderIndexSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ReaderIndexQuery, ReaderIndexQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ReaderIndexQuery, ReaderIndexQueryVariables>(ReaderIndexDocument, options);
        }
export type ReaderIndexQueryHookResult = ReturnType<typeof useReaderIndexQuery>;
export type ReaderIndexLazyQueryHookResult = ReturnType<typeof useReaderIndexLazyQuery>;
export type ReaderIndexSuspenseQueryHookResult = ReturnType<typeof useReaderIndexSuspenseQuery>;
export type ReaderIndexQueryResult = Apollo.QueryResult<ReaderIndexQuery, ReaderIndexQueryVariables>;
export const CollectionDocument = gql`
    query collection($id: String!) {
  collection(id: $id) {
    id
    name
    slug
    description
    isPublic
    createdAt
    updatedAt
    items {
      id
      url
      title
      description
      jobId
      faviconPath
      position
    }
  }
}
    `;

/**
 * __useCollectionQuery__
 *
 * To run a query within a React component, call `useCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionQuery(baseOptions: Apollo.QueryHookOptions<CollectionQuery, CollectionQueryVariables> & ({ variables: CollectionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
      }
export function useCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
        }
// @ts-ignore
export function useCollectionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CollectionQuery, CollectionQueryVariables>): Apollo.UseSuspenseQueryResult<CollectionQuery, CollectionQueryVariables>;
export function useCollectionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionQuery, CollectionQueryVariables>): Apollo.UseSuspenseQueryResult<CollectionQuery | undefined, CollectionQueryVariables>;
export function useCollectionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
        }
export type CollectionQueryHookResult = ReturnType<typeof useCollectionQuery>;
export type CollectionLazyQueryHookResult = ReturnType<typeof useCollectionLazyQuery>;
export type CollectionSuspenseQueryHookResult = ReturnType<typeof useCollectionSuspenseQuery>;
export type CollectionQueryResult = Apollo.QueryResult<CollectionQuery, CollectionQueryVariables>;
export const UpdateCollectionDocument = gql`
    mutation updateCollection($id: String!, $name: String, $description: String, $isPublic: Boolean) {
  updateCollection(
    id: $id
    name: $name
    description: $description
    isPublic: $isPublic
  ) {
    id
    name
    slug
    description
    isPublic
  }
}
    `;
export type UpdateCollectionMutationFn = Apollo.MutationFunction<UpdateCollectionMutation, UpdateCollectionMutationVariables>;

/**
 * __useUpdateCollectionMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionMutation, { data, loading, error }] = useUpdateCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      isPublic: // value for 'isPublic'
 *   },
 * });
 */
export function useUpdateCollectionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCollectionMutation, UpdateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCollectionMutation, UpdateCollectionMutationVariables>(UpdateCollectionDocument, options);
      }
export type UpdateCollectionMutationHookResult = ReturnType<typeof useUpdateCollectionMutation>;
export type UpdateCollectionMutationResult = Apollo.MutationResult<UpdateCollectionMutation>;
export type UpdateCollectionMutationOptions = Apollo.BaseMutationOptions<UpdateCollectionMutation, UpdateCollectionMutationVariables>;
export const AddCollectionItemsDocument = gql`
    mutation addCollectionItems($collectionId: String!, $urls: [String!]!) {
  addCollectionItems(collectionId: $collectionId, urls: $urls) {
    id
    items {
      id
      url
      title
      description
      jobId
      faviconPath
      position
    }
  }
}
    `;
export type AddCollectionItemsMutationFn = Apollo.MutationFunction<AddCollectionItemsMutation, AddCollectionItemsMutationVariables>;

/**
 * __useAddCollectionItemsMutation__
 *
 * To run a mutation, you first call `useAddCollectionItemsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCollectionItemsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCollectionItemsMutation, { data, loading, error }] = useAddCollectionItemsMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      urls: // value for 'urls'
 *   },
 * });
 */
export function useAddCollectionItemsMutation(baseOptions?: Apollo.MutationHookOptions<AddCollectionItemsMutation, AddCollectionItemsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCollectionItemsMutation, AddCollectionItemsMutationVariables>(AddCollectionItemsDocument, options);
      }
export type AddCollectionItemsMutationHookResult = ReturnType<typeof useAddCollectionItemsMutation>;
export type AddCollectionItemsMutationResult = Apollo.MutationResult<AddCollectionItemsMutation>;
export type AddCollectionItemsMutationOptions = Apollo.BaseMutationOptions<AddCollectionItemsMutation, AddCollectionItemsMutationVariables>;
export const RemoveCollectionItemDocument = gql`
    mutation removeCollectionItem($collectionId: String!, $itemId: String!) {
  removeCollectionItem(collectionId: $collectionId, itemId: $itemId) {
    id
    items {
      id
      url
      title
      description
      jobId
      faviconPath
      position
    }
  }
}
    `;
export type RemoveCollectionItemMutationFn = Apollo.MutationFunction<RemoveCollectionItemMutation, RemoveCollectionItemMutationVariables>;

/**
 * __useRemoveCollectionItemMutation__
 *
 * To run a mutation, you first call `useRemoveCollectionItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCollectionItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCollectionItemMutation, { data, loading, error }] = useRemoveCollectionItemMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      itemId: // value for 'itemId'
 *   },
 * });
 */
export function useRemoveCollectionItemMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCollectionItemMutation, RemoveCollectionItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveCollectionItemMutation, RemoveCollectionItemMutationVariables>(RemoveCollectionItemDocument, options);
      }
export type RemoveCollectionItemMutationHookResult = ReturnType<typeof useRemoveCollectionItemMutation>;
export type RemoveCollectionItemMutationResult = Apollo.MutationResult<RemoveCollectionItemMutation>;
export type RemoveCollectionItemMutationOptions = Apollo.BaseMutationOptions<RemoveCollectionItemMutation, RemoveCollectionItemMutationVariables>;
export const DeleteCollectionDocument = gql`
    mutation deleteCollection($id: String!) {
  deleteCollection(id: $id)
}
    `;
export type DeleteCollectionMutationFn = Apollo.MutationFunction<DeleteCollectionMutation, DeleteCollectionMutationVariables>;

/**
 * __useDeleteCollectionMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionMutation, { data, loading, error }] = useDeleteCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCollectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCollectionMutation, DeleteCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCollectionMutation, DeleteCollectionMutationVariables>(DeleteCollectionDocument, options);
      }
export type DeleteCollectionMutationHookResult = ReturnType<typeof useDeleteCollectionMutation>;
export type DeleteCollectionMutationResult = Apollo.MutationResult<DeleteCollectionMutation>;
export type DeleteCollectionMutationOptions = Apollo.BaseMutationOptions<DeleteCollectionMutation, DeleteCollectionMutationVariables>;
export const CollectionBySlugDocument = gql`
    query collectionBySlug($slug: String!) {
  collectionBySlug(slug: $slug) {
    id
    name
    description
    items {
      id
      url
      title
      jobId
      position
    }
  }
}
    `;

/**
 * __useCollectionBySlugQuery__
 *
 * To run a query within a React component, call `useCollectionBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useCollectionBySlugQuery(baseOptions: Apollo.QueryHookOptions<CollectionBySlugQuery, CollectionBySlugQueryVariables> & ({ variables: CollectionBySlugQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionBySlugQuery, CollectionBySlugQueryVariables>(CollectionBySlugDocument, options);
      }
export function useCollectionBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionBySlugQuery, CollectionBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionBySlugQuery, CollectionBySlugQueryVariables>(CollectionBySlugDocument, options);
        }
// @ts-ignore
export function useCollectionBySlugSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CollectionBySlugQuery, CollectionBySlugQueryVariables>): Apollo.UseSuspenseQueryResult<CollectionBySlugQuery, CollectionBySlugQueryVariables>;
export function useCollectionBySlugSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionBySlugQuery, CollectionBySlugQueryVariables>): Apollo.UseSuspenseQueryResult<CollectionBySlugQuery | undefined, CollectionBySlugQueryVariables>;
export function useCollectionBySlugSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CollectionBySlugQuery, CollectionBySlugQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CollectionBySlugQuery, CollectionBySlugQueryVariables>(CollectionBySlugDocument, options);
        }
export type CollectionBySlugQueryHookResult = ReturnType<typeof useCollectionBySlugQuery>;
export type CollectionBySlugLazyQueryHookResult = ReturnType<typeof useCollectionBySlugLazyQuery>;
export type CollectionBySlugSuspenseQueryHookResult = ReturnType<typeof useCollectionBySlugSuspenseQuery>;
export type CollectionBySlugQueryResult = Apollo.QueryResult<CollectionBySlugQuery, CollectionBySlugQueryVariables>;
export const MyCollectionsDocument = gql`
    query myCollections($userId: String!, $pagination: PaginationInput) {
  myCollections(userId: $userId, pagination: $pagination) {
    id
    name
    slug
    description
    isPublic
    itemCount
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMyCollectionsQuery__
 *
 * To run a query within a React component, call `useMyCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyCollectionsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useMyCollectionsQuery(baseOptions: Apollo.QueryHookOptions<MyCollectionsQuery, MyCollectionsQueryVariables> & ({ variables: MyCollectionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyCollectionsQuery, MyCollectionsQueryVariables>(MyCollectionsDocument, options);
      }
export function useMyCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyCollectionsQuery, MyCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyCollectionsQuery, MyCollectionsQueryVariables>(MyCollectionsDocument, options);
        }
// @ts-ignore
export function useMyCollectionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyCollectionsQuery, MyCollectionsQueryVariables>): Apollo.UseSuspenseQueryResult<MyCollectionsQuery, MyCollectionsQueryVariables>;
export function useMyCollectionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyCollectionsQuery, MyCollectionsQueryVariables>): Apollo.UseSuspenseQueryResult<MyCollectionsQuery | undefined, MyCollectionsQueryVariables>;
export function useMyCollectionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyCollectionsQuery, MyCollectionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyCollectionsQuery, MyCollectionsQueryVariables>(MyCollectionsDocument, options);
        }
export type MyCollectionsQueryHookResult = ReturnType<typeof useMyCollectionsQuery>;
export type MyCollectionsLazyQueryHookResult = ReturnType<typeof useMyCollectionsLazyQuery>;
export type MyCollectionsSuspenseQueryHookResult = ReturnType<typeof useMyCollectionsSuspenseQuery>;
export type MyCollectionsQueryResult = Apollo.QueryResult<MyCollectionsQuery, MyCollectionsQueryVariables>;
export const CreateCollectionDocument = gql`
    mutation createCollection($userId: String!, $walletAddress: String!, $name: String!, $description: String, $urls: [String!]!, $jobIds: [String!]) {
  createCollection(
    userId: $userId
    walletAddress: $walletAddress
    name: $name
    description: $description
    urls: $urls
    jobIds: $jobIds
  ) {
    id
    name
    slug
    itemCount
  }
}
    `;
export type CreateCollectionMutationFn = Apollo.MutationFunction<CreateCollectionMutation, CreateCollectionMutationVariables>;

/**
 * __useCreateCollectionMutation__
 *
 * To run a mutation, you first call `useCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionMutation, { data, loading, error }] = useCreateCollectionMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      walletAddress: // value for 'walletAddress'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      urls: // value for 'urls'
 *      jobIds: // value for 'jobIds'
 *   },
 * });
 */
export function useCreateCollectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateCollectionMutation, CreateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument, options);
      }
export type CreateCollectionMutationHookResult = ReturnType<typeof useCreateCollectionMutation>;
export type CreateCollectionMutationResult = Apollo.MutationResult<CreateCollectionMutation>;
export type CreateCollectionMutationOptions = Apollo.BaseMutationOptions<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const StatsDocument = gql`
    query stats {
  stats {
    totalJobs
    totalFilesOptimized
    totalBandwidthSaved
  }
}
    `;

/**
 * __useStatsQuery__
 *
 * To run a query within a React component, call `useStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStatsQuery(baseOptions?: Apollo.QueryHookOptions<StatsQuery, StatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StatsQuery, StatsQueryVariables>(StatsDocument, options);
      }
export function useStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StatsQuery, StatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StatsQuery, StatsQueryVariables>(StatsDocument, options);
        }
// @ts-ignore
export function useStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<StatsQuery, StatsQueryVariables>): Apollo.UseSuspenseQueryResult<StatsQuery, StatsQueryVariables>;
export function useStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StatsQuery, StatsQueryVariables>): Apollo.UseSuspenseQueryResult<StatsQuery | undefined, StatsQueryVariables>;
export function useStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StatsQuery, StatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StatsQuery, StatsQueryVariables>(StatsDocument, options);
        }
export type StatsQueryHookResult = ReturnType<typeof useStatsQuery>;
export type StatsLazyQueryHookResult = ReturnType<typeof useStatsLazyQuery>;
export type StatsSuspenseQueryHookResult = ReturnType<typeof useStatsSuspenseQuery>;
export type StatsQueryResult = Apollo.QueryResult<StatsQuery, StatsQueryVariables>;
export const LatestJobsDocument = gql`
    query latestJobs {
  optimizationJobs(pagination: {take: 5}) {
    id
    url
    status
    createdAt
    optimizedFiles {
      id
      savings
      format
    }
  }
}
    `;

/**
 * __useLatestJobsQuery__
 *
 * To run a query within a React component, call `useLatestJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLatestJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLatestJobsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLatestJobsQuery(baseOptions?: Apollo.QueryHookOptions<LatestJobsQuery, LatestJobsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LatestJobsQuery, LatestJobsQueryVariables>(LatestJobsDocument, options);
      }
export function useLatestJobsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LatestJobsQuery, LatestJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LatestJobsQuery, LatestJobsQueryVariables>(LatestJobsDocument, options);
        }
// @ts-ignore
export function useLatestJobsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LatestJobsQuery, LatestJobsQueryVariables>): Apollo.UseSuspenseQueryResult<LatestJobsQuery, LatestJobsQueryVariables>;
export function useLatestJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LatestJobsQuery, LatestJobsQueryVariables>): Apollo.UseSuspenseQueryResult<LatestJobsQuery | undefined, LatestJobsQueryVariables>;
export function useLatestJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LatestJobsQuery, LatestJobsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LatestJobsQuery, LatestJobsQueryVariables>(LatestJobsDocument, options);
        }
export type LatestJobsQueryHookResult = ReturnType<typeof useLatestJobsQuery>;
export type LatestJobsLazyQueryHookResult = ReturnType<typeof useLatestJobsLazyQuery>;
export type LatestJobsSuspenseQueryHookResult = ReturnType<typeof useLatestJobsSuspenseQuery>;
export type LatestJobsQueryResult = Apollo.QueryResult<LatestJobsQuery, LatestJobsQueryVariables>;
export const CreateOptimizationJobDocument = gql`
    mutation createOptimizationJob($url: String!, $mode: OptimizationMode) {
  createOptimizationJob(url: $url, mode: $mode) {
    id
    url
    status
    mode
  }
}
    `;
export type CreateOptimizationJobMutationFn = Apollo.MutationFunction<CreateOptimizationJobMutation, CreateOptimizationJobMutationVariables>;

/**
 * __useCreateOptimizationJobMutation__
 *
 * To run a mutation, you first call `useCreateOptimizationJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOptimizationJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOptimizationJobMutation, { data, loading, error }] = useCreateOptimizationJobMutation({
 *   variables: {
 *      url: // value for 'url'
 *      mode: // value for 'mode'
 *   },
 * });
 */
export function useCreateOptimizationJobMutation(baseOptions?: Apollo.MutationHookOptions<CreateOptimizationJobMutation, CreateOptimizationJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOptimizationJobMutation, CreateOptimizationJobMutationVariables>(CreateOptimizationJobDocument, options);
      }
export type CreateOptimizationJobMutationHookResult = ReturnType<typeof useCreateOptimizationJobMutation>;
export type CreateOptimizationJobMutationResult = Apollo.MutationResult<CreateOptimizationJobMutation>;
export type CreateOptimizationJobMutationOptions = Apollo.BaseMutationOptions<CreateOptimizationJobMutation, CreateOptimizationJobMutationVariables>;
export const DashboardParseFeedDocument = gql`
    mutation dashboardParseFeed($url: String!) {
  parseFeed(url: $url) {
    url
  }
}
    `;
export type DashboardParseFeedMutationFn = Apollo.MutationFunction<DashboardParseFeedMutation, DashboardParseFeedMutationVariables>;

/**
 * __useDashboardParseFeedMutation__
 *
 * To run a mutation, you first call `useDashboardParseFeedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDashboardParseFeedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dashboardParseFeedMutation, { data, loading, error }] = useDashboardParseFeedMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useDashboardParseFeedMutation(baseOptions?: Apollo.MutationHookOptions<DashboardParseFeedMutation, DashboardParseFeedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DashboardParseFeedMutation, DashboardParseFeedMutationVariables>(DashboardParseFeedDocument, options);
      }
export type DashboardParseFeedMutationHookResult = ReturnType<typeof useDashboardParseFeedMutation>;
export type DashboardParseFeedMutationResult = Apollo.MutationResult<DashboardParseFeedMutation>;
export type DashboardParseFeedMutationOptions = Apollo.BaseMutationOptions<DashboardParseFeedMutation, DashboardParseFeedMutationVariables>;
export const DashboardReaderIndexDocument = gql`
    query dashboardReaderIndex {
  readerIndex(pagination: {take: 200}) {
    id
    url
    createdAt
  }
}
    `;

/**
 * __useDashboardReaderIndexQuery__
 *
 * To run a query within a React component, call `useDashboardReaderIndexQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardReaderIndexQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardReaderIndexQuery({
 *   variables: {
 *   },
 * });
 */
export function useDashboardReaderIndexQuery(baseOptions?: Apollo.QueryHookOptions<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>(DashboardReaderIndexDocument, options);
      }
export function useDashboardReaderIndexLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>(DashboardReaderIndexDocument, options);
        }
// @ts-ignore
export function useDashboardReaderIndexSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>): Apollo.UseSuspenseQueryResult<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>;
export function useDashboardReaderIndexSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>): Apollo.UseSuspenseQueryResult<DashboardReaderIndexQuery | undefined, DashboardReaderIndexQueryVariables>;
export function useDashboardReaderIndexSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>(DashboardReaderIndexDocument, options);
        }
export type DashboardReaderIndexQueryHookResult = ReturnType<typeof useDashboardReaderIndexQuery>;
export type DashboardReaderIndexLazyQueryHookResult = ReturnType<typeof useDashboardReaderIndexLazyQuery>;
export type DashboardReaderIndexSuspenseQueryHookResult = ReturnType<typeof useDashboardReaderIndexSuspenseQuery>;
export type DashboardReaderIndexQueryResult = Apollo.QueryResult<DashboardReaderIndexQuery, DashboardReaderIndexQueryVariables>;
export const HomePagesDocument = gql`
    query homePages($pagination: PaginationInput) {
  readerIndex(pagination: $pagination) {
    id
    url
    faviconPath
    seoTitle
    seoDescription
    compressedPreviewImage(mode: SIMPLE)
    createdAt
  }
}
    `;

/**
 * __useHomePagesQuery__
 *
 * To run a query within a React component, call `useHomePagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePagesQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useHomePagesQuery(baseOptions?: Apollo.QueryHookOptions<HomePagesQuery, HomePagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HomePagesQuery, HomePagesQueryVariables>(HomePagesDocument, options);
      }
export function useHomePagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomePagesQuery, HomePagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HomePagesQuery, HomePagesQueryVariables>(HomePagesDocument, options);
        }
// @ts-ignore
export function useHomePagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<HomePagesQuery, HomePagesQueryVariables>): Apollo.UseSuspenseQueryResult<HomePagesQuery, HomePagesQueryVariables>;
export function useHomePagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HomePagesQuery, HomePagesQueryVariables>): Apollo.UseSuspenseQueryResult<HomePagesQuery | undefined, HomePagesQueryVariables>;
export function useHomePagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HomePagesQuery, HomePagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HomePagesQuery, HomePagesQueryVariables>(HomePagesDocument, options);
        }
export type HomePagesQueryHookResult = ReturnType<typeof useHomePagesQuery>;
export type HomePagesLazyQueryHookResult = ReturnType<typeof useHomePagesLazyQuery>;
export type HomePagesSuspenseQueryHookResult = ReturnType<typeof useHomePagesSuspenseQuery>;
export type HomePagesQueryResult = Apollo.QueryResult<HomePagesQuery, HomePagesQueryVariables>;
export const PopularDomainsDocument = gql`
    query popularDomains($take: Int) {
  popularDomains(take: $take) {
    domain
    totalViews
    faviconPath
    jobCount
  }
}
    `;

/**
 * __usePopularDomainsQuery__
 *
 * To run a query within a React component, call `usePopularDomainsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePopularDomainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePopularDomainsQuery({
 *   variables: {
 *      take: // value for 'take'
 *   },
 * });
 */
export function usePopularDomainsQuery(baseOptions?: Apollo.QueryHookOptions<PopularDomainsQuery, PopularDomainsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PopularDomainsQuery, PopularDomainsQueryVariables>(PopularDomainsDocument, options);
      }
export function usePopularDomainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PopularDomainsQuery, PopularDomainsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PopularDomainsQuery, PopularDomainsQueryVariables>(PopularDomainsDocument, options);
        }
// @ts-ignore
export function usePopularDomainsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PopularDomainsQuery, PopularDomainsQueryVariables>): Apollo.UseSuspenseQueryResult<PopularDomainsQuery, PopularDomainsQueryVariables>;
export function usePopularDomainsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PopularDomainsQuery, PopularDomainsQueryVariables>): Apollo.UseSuspenseQueryResult<PopularDomainsQuery | undefined, PopularDomainsQueryVariables>;
export function usePopularDomainsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PopularDomainsQuery, PopularDomainsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PopularDomainsQuery, PopularDomainsQueryVariables>(PopularDomainsDocument, options);
        }
export type PopularDomainsQueryHookResult = ReturnType<typeof usePopularDomainsQuery>;
export type PopularDomainsLazyQueryHookResult = ReturnType<typeof usePopularDomainsLazyQuery>;
export type PopularDomainsSuspenseQueryHookResult = ReturnType<typeof usePopularDomainsSuspenseQuery>;
export type PopularDomainsQueryResult = Apollo.QueryResult<PopularDomainsQuery, PopularDomainsQueryVariables>;
export const PopularUsersDocument = gql`
    query popularUsers($take: Int) {
  popularUsers(take: $take) {
    walletAddress
    archiveCount
    totalViews
  }
}
    `;

/**
 * __usePopularUsersQuery__
 *
 * To run a query within a React component, call `usePopularUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `usePopularUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePopularUsersQuery({
 *   variables: {
 *      take: // value for 'take'
 *   },
 * });
 */
export function usePopularUsersQuery(baseOptions?: Apollo.QueryHookOptions<PopularUsersQuery, PopularUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PopularUsersQuery, PopularUsersQueryVariables>(PopularUsersDocument, options);
      }
export function usePopularUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PopularUsersQuery, PopularUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PopularUsersQuery, PopularUsersQueryVariables>(PopularUsersDocument, options);
        }
// @ts-ignore
export function usePopularUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PopularUsersQuery, PopularUsersQueryVariables>): Apollo.UseSuspenseQueryResult<PopularUsersQuery, PopularUsersQueryVariables>;
export function usePopularUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PopularUsersQuery, PopularUsersQueryVariables>): Apollo.UseSuspenseQueryResult<PopularUsersQuery | undefined, PopularUsersQueryVariables>;
export function usePopularUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PopularUsersQuery, PopularUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PopularUsersQuery, PopularUsersQueryVariables>(PopularUsersDocument, options);
        }
export type PopularUsersQueryHookResult = ReturnType<typeof usePopularUsersQuery>;
export type PopularUsersLazyQueryHookResult = ReturnType<typeof usePopularUsersLazyQuery>;
export type PopularUsersSuspenseQueryHookResult = ReturnType<typeof usePopularUsersSuspenseQuery>;
export type PopularUsersQueryResult = Apollo.QueryResult<PopularUsersQuery, PopularUsersQueryVariables>;
export const PopularArticlesDocument = gql`
    query popularArticles($take: Int, $skip: Int) {
  popularArticles(take: $take, skip: $skip) {
    id
    url
    seoTitle
    seoDescription
    seoOgImage
    compressedPreviewImage(mode: ULTRA)
    faviconPath
  }
}
    `;

/**
 * __usePopularArticlesQuery__
 *
 * To run a query within a React component, call `usePopularArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePopularArticlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePopularArticlesQuery({
 *   variables: {
 *      take: // value for 'take'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function usePopularArticlesQuery(baseOptions?: Apollo.QueryHookOptions<PopularArticlesQuery, PopularArticlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PopularArticlesQuery, PopularArticlesQueryVariables>(PopularArticlesDocument, options);
      }
export function usePopularArticlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PopularArticlesQuery, PopularArticlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PopularArticlesQuery, PopularArticlesQueryVariables>(PopularArticlesDocument, options);
        }
// @ts-ignore
export function usePopularArticlesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PopularArticlesQuery, PopularArticlesQueryVariables>): Apollo.UseSuspenseQueryResult<PopularArticlesQuery, PopularArticlesQueryVariables>;
export function usePopularArticlesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PopularArticlesQuery, PopularArticlesQueryVariables>): Apollo.UseSuspenseQueryResult<PopularArticlesQuery | undefined, PopularArticlesQueryVariables>;
export function usePopularArticlesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PopularArticlesQuery, PopularArticlesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PopularArticlesQuery, PopularArticlesQueryVariables>(PopularArticlesDocument, options);
        }
export type PopularArticlesQueryHookResult = ReturnType<typeof usePopularArticlesQuery>;
export type PopularArticlesLazyQueryHookResult = ReturnType<typeof usePopularArticlesLazyQuery>;
export type PopularArticlesSuspenseQueryHookResult = ReturnType<typeof usePopularArticlesSuspenseQuery>;
export type PopularArticlesQueryResult = Apollo.QueryResult<PopularArticlesQuery, PopularArticlesQueryVariables>;
export const DomainJobsDocument = gql`
    query domainJobs($domain: String!, $pagination: PaginationInput) {
  completed: optimizationJobsByDomain(domain: $domain, pagination: $pagination) {
    id
    url
    status
    mode
    faviconPath
    simpleReaderPath
    ultraReaderPath
    seoTitle
    seoDescription
    compressedPreviewImage
    readerContentHash
    createdAt
  }
  active: activeOptimizationJobsByDomain(domain: $domain) {
    id
    url
    status
    mode
    faviconPath
    seoTitle
    seoDescription
    createdAt
  }
}
    `;

/**
 * __useDomainJobsQuery__
 *
 * To run a query within a React component, call `useDomainJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDomainJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDomainJobsQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useDomainJobsQuery(baseOptions: Apollo.QueryHookOptions<DomainJobsQuery, DomainJobsQueryVariables> & ({ variables: DomainJobsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DomainJobsQuery, DomainJobsQueryVariables>(DomainJobsDocument, options);
      }
export function useDomainJobsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DomainJobsQuery, DomainJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DomainJobsQuery, DomainJobsQueryVariables>(DomainJobsDocument, options);
        }
// @ts-ignore
export function useDomainJobsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DomainJobsQuery, DomainJobsQueryVariables>): Apollo.UseSuspenseQueryResult<DomainJobsQuery, DomainJobsQueryVariables>;
export function useDomainJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DomainJobsQuery, DomainJobsQueryVariables>): Apollo.UseSuspenseQueryResult<DomainJobsQuery | undefined, DomainJobsQueryVariables>;
export function useDomainJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DomainJobsQuery, DomainJobsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DomainJobsQuery, DomainJobsQueryVariables>(DomainJobsDocument, options);
        }
export type DomainJobsQueryHookResult = ReturnType<typeof useDomainJobsQuery>;
export type DomainJobsLazyQueryHookResult = ReturnType<typeof useDomainJobsLazyQuery>;
export type DomainJobsSuspenseQueryHookResult = ReturnType<typeof useDomainJobsSuspenseQuery>;
export type DomainJobsQueryResult = Apollo.QueryResult<DomainJobsQuery, DomainJobsQueryVariables>;
export const DomainMentionsDocument = gql`
    query domainMentions($domain: String!) {
  domainMentions(domain: $domain) {
    id
    sessionId
    createdAt
    job {
      id
      url
      seoTitle
      faviconPath
    }
  }
}
    `;

/**
 * __useDomainMentionsQuery__
 *
 * To run a query within a React component, call `useDomainMentionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDomainMentionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDomainMentionsQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useDomainMentionsQuery(baseOptions: Apollo.QueryHookOptions<DomainMentionsQuery, DomainMentionsQueryVariables> & ({ variables: DomainMentionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DomainMentionsQuery, DomainMentionsQueryVariables>(DomainMentionsDocument, options);
      }
export function useDomainMentionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DomainMentionsQuery, DomainMentionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DomainMentionsQuery, DomainMentionsQueryVariables>(DomainMentionsDocument, options);
        }
// @ts-ignore
export function useDomainMentionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DomainMentionsQuery, DomainMentionsQueryVariables>): Apollo.UseSuspenseQueryResult<DomainMentionsQuery, DomainMentionsQueryVariables>;
export function useDomainMentionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DomainMentionsQuery, DomainMentionsQueryVariables>): Apollo.UseSuspenseQueryResult<DomainMentionsQuery | undefined, DomainMentionsQueryVariables>;
export function useDomainMentionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DomainMentionsQuery, DomainMentionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DomainMentionsQuery, DomainMentionsQueryVariables>(DomainMentionsDocument, options);
        }
export type DomainMentionsQueryHookResult = ReturnType<typeof useDomainMentionsQuery>;
export type DomainMentionsLazyQueryHookResult = ReturnType<typeof useDomainMentionsLazyQuery>;
export type DomainMentionsSuspenseQueryHookResult = ReturnType<typeof useDomainMentionsSuspenseQuery>;
export type DomainMentionsQueryResult = Apollo.QueryResult<DomainMentionsQuery, DomainMentionsQueryVariables>;
export const DomainHashTimelineDocument = gql`
    query domainHashTimeline($domain: String!) {
  timeline: domainHashTimeline(domain: $domain) {
    hash
    createdAt
  }
}
    `;

/**
 * __useDomainHashTimelineQuery__
 *
 * To run a query within a React component, call `useDomainHashTimelineQuery` and pass it any options that fit your needs.
 * When your component renders, `useDomainHashTimelineQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDomainHashTimelineQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useDomainHashTimelineQuery(baseOptions: Apollo.QueryHookOptions<DomainHashTimelineQuery, DomainHashTimelineQueryVariables> & ({ variables: DomainHashTimelineQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DomainHashTimelineQuery, DomainHashTimelineQueryVariables>(DomainHashTimelineDocument, options);
      }
export function useDomainHashTimelineLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DomainHashTimelineQuery, DomainHashTimelineQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DomainHashTimelineQuery, DomainHashTimelineQueryVariables>(DomainHashTimelineDocument, options);
        }
// @ts-ignore
export function useDomainHashTimelineSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DomainHashTimelineQuery, DomainHashTimelineQueryVariables>): Apollo.UseSuspenseQueryResult<DomainHashTimelineQuery, DomainHashTimelineQueryVariables>;
export function useDomainHashTimelineSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DomainHashTimelineQuery, DomainHashTimelineQueryVariables>): Apollo.UseSuspenseQueryResult<DomainHashTimelineQuery | undefined, DomainHashTimelineQueryVariables>;
export function useDomainHashTimelineSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DomainHashTimelineQuery, DomainHashTimelineQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DomainHashTimelineQuery, DomainHashTimelineQueryVariables>(DomainHashTimelineDocument, options);
        }
export type DomainHashTimelineQueryHookResult = ReturnType<typeof useDomainHashTimelineQuery>;
export type DomainHashTimelineLazyQueryHookResult = ReturnType<typeof useDomainHashTimelineLazyQuery>;
export type DomainHashTimelineSuspenseQueryHookResult = ReturnType<typeof useDomainHashTimelineSuspenseQuery>;
export type DomainHashTimelineQueryResult = Apollo.QueryResult<DomainHashTimelineQuery, DomainHashTimelineQueryVariables>;
export const DomainTrackScheduleDocument = gql`
    query domainTrackSchedule($domain: String!) {
  trackSchedule(domain: $domain) {
    id
    domain
    maxAge
    lastCrawledAt
    nextCrawlAt
    activeTracks
  }
  tracksForDomain(domain: $domain) {
    id
    contentHash
    verified
    amount
    supersededById
    createdAt
    job {
      id
      url
      seoTitle
      faviconPath
      contentHashSum
      createdAt
    }
  }
}
    `;

/**
 * __useDomainTrackScheduleQuery__
 *
 * To run a query within a React component, call `useDomainTrackScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useDomainTrackScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDomainTrackScheduleQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useDomainTrackScheduleQuery(baseOptions: Apollo.QueryHookOptions<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables> & ({ variables: DomainTrackScheduleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables>(DomainTrackScheduleDocument, options);
      }
export function useDomainTrackScheduleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables>(DomainTrackScheduleDocument, options);
        }
// @ts-ignore
export function useDomainTrackScheduleSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables>): Apollo.UseSuspenseQueryResult<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables>;
export function useDomainTrackScheduleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables>): Apollo.UseSuspenseQueryResult<DomainTrackScheduleQuery | undefined, DomainTrackScheduleQueryVariables>;
export function useDomainTrackScheduleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables>(DomainTrackScheduleDocument, options);
        }
export type DomainTrackScheduleQueryHookResult = ReturnType<typeof useDomainTrackScheduleQuery>;
export type DomainTrackScheduleLazyQueryHookResult = ReturnType<typeof useDomainTrackScheduleLazyQuery>;
export type DomainTrackScheduleSuspenseQueryHookResult = ReturnType<typeof useDomainTrackScheduleSuspenseQuery>;
export type DomainTrackScheduleQueryResult = Apollo.QueryResult<DomainTrackScheduleQuery, DomainTrackScheduleQueryVariables>;
export const OptimizationJobsDocument = gql`
    query optimizationJobs($pagination: PaginationInput) {
  optimizationJobs(pagination: $pagination) {
    id
    url
    mode
    status
    faviconPath
    createdAt
    optimizedFiles {
      id
      originalSize
      optimizedSize
      savings
      isBestVariant
    }
  }
}
    `;

/**
 * __useOptimizationJobsQuery__
 *
 * To run a query within a React component, call `useOptimizationJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOptimizationJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOptimizationJobsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useOptimizationJobsQuery(baseOptions?: Apollo.QueryHookOptions<OptimizationJobsQuery, OptimizationJobsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OptimizationJobsQuery, OptimizationJobsQueryVariables>(OptimizationJobsDocument, options);
      }
export function useOptimizationJobsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OptimizationJobsQuery, OptimizationJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OptimizationJobsQuery, OptimizationJobsQueryVariables>(OptimizationJobsDocument, options);
        }
// @ts-ignore
export function useOptimizationJobsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OptimizationJobsQuery, OptimizationJobsQueryVariables>): Apollo.UseSuspenseQueryResult<OptimizationJobsQuery, OptimizationJobsQueryVariables>;
export function useOptimizationJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OptimizationJobsQuery, OptimizationJobsQueryVariables>): Apollo.UseSuspenseQueryResult<OptimizationJobsQuery | undefined, OptimizationJobsQueryVariables>;
export function useOptimizationJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OptimizationJobsQuery, OptimizationJobsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OptimizationJobsQuery, OptimizationJobsQueryVariables>(OptimizationJobsDocument, options);
        }
export type OptimizationJobsQueryHookResult = ReturnType<typeof useOptimizationJobsQuery>;
export type OptimizationJobsLazyQueryHookResult = ReturnType<typeof useOptimizationJobsLazyQuery>;
export type OptimizationJobsSuspenseQueryHookResult = ReturnType<typeof useOptimizationJobsSuspenseQuery>;
export type OptimizationJobsQueryResult = Apollo.QueryResult<OptimizationJobsQuery, OptimizationJobsQueryVariables>;
export const KeywordsForJobDocument = gql`
    query keywordsForJob($jobId: String!) {
  keywordsForJob(jobId: $jobId) {
    id
    keyword
    frequency
    cluster
    topBid
    topBidder
    extractedAt
    bids {
      id
      sender
      amount
      active
      txSignature
      timestamp
      adUrl
    }
  }
}
    `;

/**
 * __useKeywordsForJobQuery__
 *
 * To run a query within a React component, call `useKeywordsForJobQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordsForJobQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordsForJobQuery({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useKeywordsForJobQuery(baseOptions: Apollo.QueryHookOptions<KeywordsForJobQuery, KeywordsForJobQueryVariables> & ({ variables: KeywordsForJobQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordsForJobQuery, KeywordsForJobQueryVariables>(KeywordsForJobDocument, options);
      }
export function useKeywordsForJobLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordsForJobQuery, KeywordsForJobQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordsForJobQuery, KeywordsForJobQueryVariables>(KeywordsForJobDocument, options);
        }
// @ts-ignore
export function useKeywordsForJobSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<KeywordsForJobQuery, KeywordsForJobQueryVariables>): Apollo.UseSuspenseQueryResult<KeywordsForJobQuery, KeywordsForJobQueryVariables>;
export function useKeywordsForJobSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<KeywordsForJobQuery, KeywordsForJobQueryVariables>): Apollo.UseSuspenseQueryResult<KeywordsForJobQuery | undefined, KeywordsForJobQueryVariables>;
export function useKeywordsForJobSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<KeywordsForJobQuery, KeywordsForJobQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<KeywordsForJobQuery, KeywordsForJobQueryVariables>(KeywordsForJobDocument, options);
        }
export type KeywordsForJobQueryHookResult = ReturnType<typeof useKeywordsForJobQuery>;
export type KeywordsForJobLazyQueryHookResult = ReturnType<typeof useKeywordsForJobLazyQuery>;
export type KeywordsForJobSuspenseQueryHookResult = ReturnType<typeof useKeywordsForJobSuspenseQuery>;
export type KeywordsForJobQueryResult = Apollo.QueryResult<KeywordsForJobQuery, KeywordsForJobQueryVariables>;
export const KeywordBidsForWalletDocument = gql`
    query keywordBidsForWallet($walletAddress: String!) {
  keywordBidsForWallet(walletAddress: $walletAddress) {
    id
    keywordId
    jobId
    amount
    active
    txSignature
    timestamp
    keyword {
      keyword
      frequency
      job {
        id
        url
        seoTitle
        faviconPath
        compressedPreviewImage
      }
    }
  }
}
    `;

/**
 * __useKeywordBidsForWalletQuery__
 *
 * To run a query within a React component, call `useKeywordBidsForWalletQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeywordBidsForWalletQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeywordBidsForWalletQuery({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useKeywordBidsForWalletQuery(baseOptions: Apollo.QueryHookOptions<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables> & ({ variables: KeywordBidsForWalletQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables>(KeywordBidsForWalletDocument, options);
      }
export function useKeywordBidsForWalletLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables>(KeywordBidsForWalletDocument, options);
        }
// @ts-ignore
export function useKeywordBidsForWalletSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables>): Apollo.UseSuspenseQueryResult<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables>;
export function useKeywordBidsForWalletSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables>): Apollo.UseSuspenseQueryResult<KeywordBidsForWalletQuery | undefined, KeywordBidsForWalletQueryVariables>;
export function useKeywordBidsForWalletSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables>(KeywordBidsForWalletDocument, options);
        }
export type KeywordBidsForWalletQueryHookResult = ReturnType<typeof useKeywordBidsForWalletQuery>;
export type KeywordBidsForWalletLazyQueryHookResult = ReturnType<typeof useKeywordBidsForWalletLazyQuery>;
export type KeywordBidsForWalletSuspenseQueryHookResult = ReturnType<typeof useKeywordBidsForWalletSuspenseQuery>;
export type KeywordBidsForWalletQueryResult = Apollo.QueryResult<KeywordBidsForWalletQuery, KeywordBidsForWalletQueryVariables>;
export const ExtractKeywordsDocument = gql`
    mutation extractKeywords($jobId: String!) {
  extractKeywords(jobId: $jobId) {
    id
    keyword
    frequency
  }
}
    `;
export type ExtractKeywordsMutationFn = Apollo.MutationFunction<ExtractKeywordsMutation, ExtractKeywordsMutationVariables>;

/**
 * __useExtractKeywordsMutation__
 *
 * To run a mutation, you first call `useExtractKeywordsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExtractKeywordsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [extractKeywordsMutation, { data, loading, error }] = useExtractKeywordsMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useExtractKeywordsMutation(baseOptions?: Apollo.MutationHookOptions<ExtractKeywordsMutation, ExtractKeywordsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExtractKeywordsMutation, ExtractKeywordsMutationVariables>(ExtractKeywordsDocument, options);
      }
export type ExtractKeywordsMutationHookResult = ReturnType<typeof useExtractKeywordsMutation>;
export type ExtractKeywordsMutationResult = Apollo.MutationResult<ExtractKeywordsMutation>;
export type ExtractKeywordsMutationOptions = Apollo.BaseMutationOptions<ExtractKeywordsMutation, ExtractKeywordsMutationVariables>;
export const TopKeywordBidsDocument = gql`
    query topKeywordBids($take: Int) {
  topKeywordBids(take: $take) {
    id
    amount
    active
    sender
    keyword {
      keyword
      frequency
      jobId
      job {
        id
        url
        seoTitle
        faviconPath
        compressedPreviewImage
      }
    }
  }
}
    `;

/**
 * __useTopKeywordBidsQuery__
 *
 * To run a query within a React component, call `useTopKeywordBidsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopKeywordBidsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopKeywordBidsQuery({
 *   variables: {
 *      take: // value for 'take'
 *   },
 * });
 */
export function useTopKeywordBidsQuery(baseOptions?: Apollo.QueryHookOptions<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>(TopKeywordBidsDocument, options);
      }
export function useTopKeywordBidsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>(TopKeywordBidsDocument, options);
        }
// @ts-ignore
export function useTopKeywordBidsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>): Apollo.UseSuspenseQueryResult<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>;
export function useTopKeywordBidsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>): Apollo.UseSuspenseQueryResult<TopKeywordBidsQuery | undefined, TopKeywordBidsQueryVariables>;
export function useTopKeywordBidsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>(TopKeywordBidsDocument, options);
        }
export type TopKeywordBidsQueryHookResult = ReturnType<typeof useTopKeywordBidsQuery>;
export type TopKeywordBidsLazyQueryHookResult = ReturnType<typeof useTopKeywordBidsLazyQuery>;
export type TopKeywordBidsSuspenseQueryHookResult = ReturnType<typeof useTopKeywordBidsSuspenseQuery>;
export type TopKeywordBidsQueryResult = Apollo.QueryResult<TopKeywordBidsQuery, TopKeywordBidsQueryVariables>;
export const RecentKeywordExtractionsDocument = gql`
    query recentKeywordExtractions($take: Int) {
  recentKeywordExtractions(take: $take) {
    id
    jobId
    keyword
    frequency
    extractedAt
    job {
      url
      seoTitle
      faviconPath
    }
  }
}
    `;

/**
 * __useRecentKeywordExtractionsQuery__
 *
 * To run a query within a React component, call `useRecentKeywordExtractionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentKeywordExtractionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentKeywordExtractionsQuery({
 *   variables: {
 *      take: // value for 'take'
 *   },
 * });
 */
export function useRecentKeywordExtractionsQuery(baseOptions?: Apollo.QueryHookOptions<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>(RecentKeywordExtractionsDocument, options);
      }
export function useRecentKeywordExtractionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>(RecentKeywordExtractionsDocument, options);
        }
// @ts-ignore
export function useRecentKeywordExtractionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>): Apollo.UseSuspenseQueryResult<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>;
export function useRecentKeywordExtractionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>): Apollo.UseSuspenseQueryResult<RecentKeywordExtractionsQuery | undefined, RecentKeywordExtractionsQueryVariables>;
export function useRecentKeywordExtractionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>(RecentKeywordExtractionsDocument, options);
        }
export type RecentKeywordExtractionsQueryHookResult = ReturnType<typeof useRecentKeywordExtractionsQuery>;
export type RecentKeywordExtractionsLazyQueryHookResult = ReturnType<typeof useRecentKeywordExtractionsLazyQuery>;
export type RecentKeywordExtractionsSuspenseQueryHookResult = ReturnType<typeof useRecentKeywordExtractionsSuspenseQuery>;
export type RecentKeywordExtractionsQueryResult = Apollo.QueryResult<RecentKeywordExtractionsQuery, RecentKeywordExtractionsQueryVariables>;
export const RecentKeywordBidsDocument = gql`
    query recentKeywordBids($take: Int) {
  recentKeywordBids(take: $take) {
    id
    sender
    amount
    timestamp
    jobId
    keyword {
      keyword
      frequency
      job {
        url
        seoTitle
        faviconPath
      }
    }
  }
}
    `;

/**
 * __useRecentKeywordBidsQuery__
 *
 * To run a query within a React component, call `useRecentKeywordBidsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentKeywordBidsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentKeywordBidsQuery({
 *   variables: {
 *      take: // value for 'take'
 *   },
 * });
 */
export function useRecentKeywordBidsQuery(baseOptions?: Apollo.QueryHookOptions<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>(RecentKeywordBidsDocument, options);
      }
export function useRecentKeywordBidsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>(RecentKeywordBidsDocument, options);
        }
// @ts-ignore
export function useRecentKeywordBidsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>): Apollo.UseSuspenseQueryResult<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>;
export function useRecentKeywordBidsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>): Apollo.UseSuspenseQueryResult<RecentKeywordBidsQuery | undefined, RecentKeywordBidsQueryVariables>;
export function useRecentKeywordBidsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>(RecentKeywordBidsDocument, options);
        }
export type RecentKeywordBidsQueryHookResult = ReturnType<typeof useRecentKeywordBidsQuery>;
export type RecentKeywordBidsLazyQueryHookResult = ReturnType<typeof useRecentKeywordBidsLazyQuery>;
export type RecentKeywordBidsSuspenseQueryHookResult = ReturnType<typeof useRecentKeywordBidsSuspenseQuery>;
export type RecentKeywordBidsQueryResult = Apollo.QueryResult<RecentKeywordBidsQuery, RecentKeywordBidsQueryVariables>;
export const OptimizationJobDocument = gql`
    query optimizationJob($id: String!) {
  optimizationJob(id: $id) {
    id
    url
    status
    mode
    originalPageSize
    optimizedPageSize
    contentHashSum
    faviconPath
    seoTitle
    seoDescription
    seoOgImage
    compressedPreviewImage
    readerPath
    simpleReaderPath
    ultraReaderPath
    simpleReaderSize
    ultraReaderSize
    simpleReaderCost
    ultraReaderCost
    createdAt
    updatedAt
    optimizedFiles {
      id
      originalUrl
      originalSize
      optimizedSize
      savings
      contentType
      format
      contentHash
      algorithm
      family
      isBestVariant
      storagePath
      hostingActive
      hostedUrl
      downloadCost
      hostingCost
      width
      height
    }
  }
}
    `;

/**
 * __useOptimizationJobQuery__
 *
 * To run a query within a React component, call `useOptimizationJobQuery` and pass it any options that fit your needs.
 * When your component renders, `useOptimizationJobQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOptimizationJobQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOptimizationJobQuery(baseOptions: Apollo.QueryHookOptions<OptimizationJobQuery, OptimizationJobQueryVariables> & ({ variables: OptimizationJobQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OptimizationJobQuery, OptimizationJobQueryVariables>(OptimizationJobDocument, options);
      }
export function useOptimizationJobLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OptimizationJobQuery, OptimizationJobQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OptimizationJobQuery, OptimizationJobQueryVariables>(OptimizationJobDocument, options);
        }
// @ts-ignore
export function useOptimizationJobSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OptimizationJobQuery, OptimizationJobQueryVariables>): Apollo.UseSuspenseQueryResult<OptimizationJobQuery, OptimizationJobQueryVariables>;
export function useOptimizationJobSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OptimizationJobQuery, OptimizationJobQueryVariables>): Apollo.UseSuspenseQueryResult<OptimizationJobQuery | undefined, OptimizationJobQueryVariables>;
export function useOptimizationJobSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OptimizationJobQuery, OptimizationJobQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OptimizationJobQuery, OptimizationJobQueryVariables>(OptimizationJobDocument, options);
        }
export type OptimizationJobQueryHookResult = ReturnType<typeof useOptimizationJobQuery>;
export type OptimizationJobLazyQueryHookResult = ReturnType<typeof useOptimizationJobLazyQuery>;
export type OptimizationJobSuspenseQueryHookResult = ReturnType<typeof useOptimizationJobSuspenseQuery>;
export type OptimizationJobQueryResult = Apollo.QueryResult<OptimizationJobQuery, OptimizationJobQueryVariables>;
export const DownloadFileDocument = gql`
    mutation downloadFile($fileId: String!) {
  downloadFile(fileId: $fileId) {
    id
    storagePath
  }
}
    `;
export type DownloadFileMutationFn = Apollo.MutationFunction<DownloadFileMutation, DownloadFileMutationVariables>;

/**
 * __useDownloadFileMutation__
 *
 * To run a mutation, you first call `useDownloadFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDownloadFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [downloadFileMutation, { data, loading, error }] = useDownloadFileMutation({
 *   variables: {
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useDownloadFileMutation(baseOptions?: Apollo.MutationHookOptions<DownloadFileMutation, DownloadFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DownloadFileMutation, DownloadFileMutationVariables>(DownloadFileDocument, options);
      }
export type DownloadFileMutationHookResult = ReturnType<typeof useDownloadFileMutation>;
export type DownloadFileMutationResult = Apollo.MutationResult<DownloadFileMutation>;
export type DownloadFileMutationOptions = Apollo.BaseMutationOptions<DownloadFileMutation, DownloadFileMutationVariables>;
export const StartHostingDocument = gql`
    mutation startHosting($fileId: String!) {
  startHosting(fileId: $fileId) {
    id
    hostingActive
    hostedUrl
  }
}
    `;
export type StartHostingMutationFn = Apollo.MutationFunction<StartHostingMutation, StartHostingMutationVariables>;

/**
 * __useStartHostingMutation__
 *
 * To run a mutation, you first call `useStartHostingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartHostingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startHostingMutation, { data, loading, error }] = useStartHostingMutation({
 *   variables: {
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useStartHostingMutation(baseOptions?: Apollo.MutationHookOptions<StartHostingMutation, StartHostingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartHostingMutation, StartHostingMutationVariables>(StartHostingDocument, options);
      }
export type StartHostingMutationHookResult = ReturnType<typeof useStartHostingMutation>;
export type StartHostingMutationResult = Apollo.MutationResult<StartHostingMutation>;
export type StartHostingMutationOptions = Apollo.BaseMutationOptions<StartHostingMutation, StartHostingMutationVariables>;
export const StopHostingDocument = gql`
    mutation stopHosting($fileId: String!) {
  stopHosting(fileId: $fileId) {
    id
    hostingActive
    hostedUrl
  }
}
    `;
export type StopHostingMutationFn = Apollo.MutationFunction<StopHostingMutation, StopHostingMutationVariables>;

/**
 * __useStopHostingMutation__
 *
 * To run a mutation, you first call `useStopHostingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStopHostingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stopHostingMutation, { data, loading, error }] = useStopHostingMutation({
 *   variables: {
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useStopHostingMutation(baseOptions?: Apollo.MutationHookOptions<StopHostingMutation, StopHostingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StopHostingMutation, StopHostingMutationVariables>(StopHostingDocument, options);
      }
export type StopHostingMutationHookResult = ReturnType<typeof useStopHostingMutation>;
export type StopHostingMutationResult = Apollo.MutationResult<StopHostingMutation>;
export type StopHostingMutationOptions = Apollo.BaseMutationOptions<StopHostingMutation, StopHostingMutationVariables>;
export const GeneratePreviewDocument = gql`
    mutation generatePreview($jobId: String!) {
  generatePreview(jobId: $jobId) {
    id
    jobId
    previewHtml
    expiresAt
    createdAt
  }
}
    `;
export type GeneratePreviewMutationFn = Apollo.MutationFunction<GeneratePreviewMutation, GeneratePreviewMutationVariables>;

/**
 * __useGeneratePreviewMutation__
 *
 * To run a mutation, you first call `useGeneratePreviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGeneratePreviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generatePreviewMutation, { data, loading, error }] = useGeneratePreviewMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useGeneratePreviewMutation(baseOptions?: Apollo.MutationHookOptions<GeneratePreviewMutation, GeneratePreviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GeneratePreviewMutation, GeneratePreviewMutationVariables>(GeneratePreviewDocument, options);
      }
export type GeneratePreviewMutationHookResult = ReturnType<typeof useGeneratePreviewMutation>;
export type GeneratePreviewMutationResult = Apollo.MutationResult<GeneratePreviewMutation>;
export type GeneratePreviewMutationOptions = Apollo.BaseMutationOptions<GeneratePreviewMutation, GeneratePreviewMutationVariables>;