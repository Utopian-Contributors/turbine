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

export type AccessibilityViolation = {
  __typename?: 'AccessibilityViolation';
  description: Scalars['String']['output'];
  help: Scalars['String']['output'];
  helpUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  impact: Scalars['String']['output'];
  screenshots: Array<Scalars['String']['output']>;
  violationId: Scalars['String']['output'];
};

export type BundledFile = {
  __typename?: 'BundledFile';
  cacheControl?: Maybe<Scalars['String']['output']>;
  clientHeight?: Maybe<Scalars['Int']['output']>;
  clientWidth?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  elapsed: Scalars['Int']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  size?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type BundledImages = {
  __typename?: 'BundledImages';
  desktop?: Maybe<Array<BundledFile>>;
  mobile?: Maybe<Array<BundledFile>>;
  tablet?: Maybe<Array<BundledFile>>;
};

export enum ConnectionType {
  Fast_3G = 'FAST_3G',
  Fast_4G = 'FAST_4G',
  Offline = 'OFFLINE',
  Slow_3G = 'SLOW_3G',
  Slow_4G = 'SLOW_4G',
  Wifi = 'WIFI'
}

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum DeviceType {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE',
  Tablet = 'TABLET'
}

/** A library with high week-over-week growth */
export type FastestGrowingLibrary = {
  __typename?: 'FastestGrowingLibrary';
  /** Current week downloads */
  currentDownloads: Scalars['String']['output'];
  /** Week-over-week growth rate as percentage */
  growthRate: Scalars['Float']['output'];
  /** The library */
  library: Library;
  /** Previous week downloads */
  previousDownloads: Scalars['String']['output'];
};

export type Font = {
  __typename?: 'Font';
  category: FontCategory;
  files: Array<FontFile>;
  id: Scalars['ID']['output'];
  integrated: Scalars['Boolean']['output'];
  menu: Scalars['String']['output'];
  name: Scalars['String']['output'];
  publishedAt: Scalars['DateTime']['output'];
  tags: Array<Scalars['String']['output']>;
  variants: Array<Scalars['String']['output']>;
};

export enum FontCategory {
  Display = 'DISPLAY',
  Handwriting = 'HANDWRITING',
  Monospace = 'MONOSPACE',
  SansSerif = 'SANS_SERIF',
  Serif = 'SERIF'
}

export type FontFile = {
  __typename?: 'FontFile';
  id: Scalars['ID']['output'];
  url: Scalars['String']['output'];
  variant: Scalars['String']['output'];
};

export type Library = {
  __typename?: 'Library';
  category?: Maybe<LibraryCategory>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  integrated?: Maybe<Scalars['Boolean']['output']>;
  isStarred?: Maybe<Scalars['Boolean']['output']>;
  lastVersion?: Maybe<Version>;
  name: Scalars['String']['output'];
  newVersions?: Maybe<Array<Version>>;
  recentBandwidth?: Maybe<LibraryBandwidth>;
  recentDownloads?: Maybe<LibraryDownloads>;
  releasedVersions?: Maybe<Array<Version>>;
  repository?: Maybe<Scalars['String']['output']>;
  sameVersionRequirement?: Maybe<SameVersionRequirement>;
  subpaths: Array<LibrarySubpath>;
  updatedAt: Scalars['DateTime']['output'];
  versions: Array<Version>;
};

/** Bandwidth statistics for a library */
export type LibraryBandwidth = {
  __typename?: 'LibraryBandwidth';
  /** Rank of this library by bandwidth usage */
  rank: Scalars['String']['output'];
  /** Bandwidth used by this library in bytes */
  total: Scalars['String']['output'];
};

export enum LibraryCategory {
  Animation = 'ANIMATION',
  Data = 'DATA',
  Forms = 'FORMS',
  Networking = 'NETWORKING',
  Other = 'OTHER',
  StateManagement = 'STATE_MANAGEMENT',
  Ui = 'UI',
  Utilities = 'UTILITIES'
}

/** Download statistics for a library */
export type LibraryDownloads = {
  __typename?: 'LibraryDownloads';
  /** Rank of the library by downloads */
  rank: Scalars['String']['output'];
  /** Total downloads of the library */
  total: Scalars['String']['output'];
};

/** Result of a searching for a library */
export type LibrarySearchResult = {
  __typename?: 'LibrarySearchResult';
  /** Description of the library */
  description: Scalars['String']['output'];
  /** Number of weekly downloads */
  downloads: Scalars['Int']['output'];
  /** Homepage URL of the library */
  homepage?: Maybe<Scalars['String']['output']>;
  /** Whether the library is integrated */
  integrated: Scalars['Boolean']['output'];
  /** Latest version of the library */
  latestVersion: Scalars['String']['output'];
  /** Name of the library */
  name: Scalars['String']['output'];
  /** Repository URL of the library */
  repository?: Maybe<Scalars['String']['output']>;
  /** Last updated date of the library */
  updated: Scalars['String']['output'];
};

export type LibrarySubpath = {
  __typename?: 'LibrarySubpath';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  path: Scalars['String']['output'];
  since: Version;
};

/** Usage statistics for a library */
export type LibraryUsage = {
  __typename?: 'LibraryUsage';
  /** Bandwidth stats by this library */
  bandwidth: LibraryBandwidth;
  /** The number of downloads */
  downloads: Scalars['String']['output'];
  /** Usage statistics for the previous equivalent timespan (e.g., previous week/month) */
  prev: LibraryUsage;
};

export type Measurement = {
  __typename?: 'Measurement';
  bundledFiles: Array<BundledFile>;
  connectionType: ConnectionType;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  device: MeasurementDevice;
  elapsed?: Maybe<Scalars['Int']['output']>;
  host?: Maybe<WebsiteHost>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  largestContentfulPaint?: Maybe<Scalars['Int']['output']>;
  links: Array<Scalars['String']['output']>;
  meta?: Maybe<Scalars['String']['output']>;
  redirect?: Maybe<Scalars['String']['output']>;
  screenshots: Array<Scalars['String']['output']>;
  status: MeasurementStatus;
  thumbnail?: Maybe<Scalars['String']['output']>;
  timeToInteractive?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
};

export type MeasurementDevice = {
  __typename?: 'MeasurementDevice';
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  type: DeviceType;
  width: Scalars['Int']['output'];
};

export type MeasurementPrice = {
  __typename?: 'MeasurementPrice';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  tokenMint: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MeasurementStats = {
  __typename?: 'MeasurementStats';
  totalAccessibilityViolations?: Maybe<Scalars['Int']['output']>;
  totalBundledFiles?: Maybe<Scalars['Int']['output']>;
  totalMeasurements?: Maybe<Scalars['Int']['output']>;
  totalWebsiteHosts?: Maybe<Scalars['Int']['output']>;
};

export enum MeasurementStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export type Mutation = {
  __typename?: 'Mutation';
  addSubpath?: Maybe<Scalars['Boolean']['output']>;
  buildRelease?: Maybe<NativeSupplyChainRelease>;
  createMeasurement?: Maybe<Measurement>;
  createRelease?: Maybe<NativeSupplyChainRelease>;
  deleteRelease?: Maybe<NativeSupplyChainRelease>;
  deleteSubpath?: Maybe<Scalars['Boolean']['output']>;
  editSameVersionRequirement?: Maybe<Scalars['Boolean']['output']>;
  editSubpath?: Maybe<Scalars['Boolean']['output']>;
  login?: Maybe<User>;
  logout?: Maybe<User>;
  publishRelease?: Maybe<NativeSupplyChainRelease>;
  refreshToken?: Maybe<User>;
  register?: Maybe<User>;
  resendVerificationCode?: Maybe<Scalars['Boolean']['output']>;
  resetPassword?: Maybe<Scalars['Boolean']['output']>;
  sendResetLink?: Maybe<Scalars['Boolean']['output']>;
  toggleFontIntegration?: Maybe<Font>;
  toggleIntegrateVersion?: Maybe<Version>;
  toggleIntegrateVersionFile?: Maybe<VersionFile>;
  toggleStarLibrary?: Maybe<Library>;
  updateReleaseChangelog?: Maybe<NativeSupplyChainRelease>;
  verify?: Maybe<User>;
};


export type MutationAddSubpathArgs = {
  library?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['String']['input']>;
};


export type MutationBuildReleaseArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateMeasurementArgs = {
  connection?: InputMaybe<ConnectionType>;
  device?: InputMaybe<DeviceType>;
  tokenMint?: InputMaybe<Scalars['String']['input']>;
  txSignature?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateReleaseArgs = {
  versionType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteReleaseArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSubpathArgs = {
  subpath?: InputMaybe<Scalars['String']['input']>;
};


export type MutationEditSameVersionRequirementArgs = {
  dependingOn?: InputMaybe<Scalars['String']['input']>;
  library?: InputMaybe<Scalars['String']['input']>;
};


export type MutationEditSubpathArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['String']['input']>;
  subpath?: InputMaybe<Scalars['String']['input']>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationPublishReleaseArgs = {
  id: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  data: CreateUserInput;
};


export type MutationResetPasswordArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationSendResetLinkArgs = {
  email: Scalars['String']['input'];
};


export type MutationToggleFontIntegrationArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationToggleIntegrateVersionArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationToggleIntegrateVersionFileArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationToggleStarLibraryArgs = {
  libraryId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateReleaseChangelogArgs = {
  changelog: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationVerifyArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};

/** A native (integrated) package */
export type NativePackage = {
  __typename?: 'NativePackage';
  /** The library */
  library: Library;
  /** Date when this package was released (null if upcoming) */
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  /** Version of the release */
  releaseVersion?: Maybe<Scalars['String']['output']>;
  /** Whether this package is published or upcoming */
  status: NativePackageStatus;
};

/** A group of native packages released in a specific period */
export type NativePackagePeriod = {
  __typename?: 'NativePackagePeriod';
  /** Packages released in this period */
  packages: Array<NativePackage>;
  /** Period label (e.g., 'January 2026', 'December 2025') */
  period: Scalars['String']['output'];
};

/** Status of a native package release */
export enum NativePackageStatus {
  Published = 'PUBLISHED',
  Upcoming = 'UPCOMING'
}

/** Result of fetching native packages */
export type NativePackagesResult = {
  __typename?: 'NativePackagesResult';
  /** Published packages grouped by release period */
  publishedByPeriod: Array<NativePackagePeriod>;
  /** Total count of native packages */
  totalCount: Scalars['Int']['output'];
  /** Upcoming native packages (not yet published) */
  upcoming: Array<NativePackage>;
};

export type NativeSupplyChainRelease = {
  __typename?: 'NativeSupplyChainRelease';
  buildError?: Maybe<Scalars['String']['output']>;
  changelog?: Maybe<Scalars['String']['output']>;
  checksum?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  downloadUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  integrated: Array<Library>;
  integratedFiles: Array<VersionFile>;
  integratedFonts: Array<Font>;
  integratedLibraries: Array<Version>;
  potentialSavings?: Maybe<Scalars['String']['output']>;
  previousRelease?: Maybe<NativeSupplyChainRelease>;
  status: NativeSupplyChainReleaseStatus;
  version: Scalars['String']['output'];
};

export enum NativeSupplyChainReleaseStatus {
  Development = 'DEVELOPMENT',
  Pending = 'PENDING',
  Published = 'PUBLISHED'
}

export type NewNativeRelease = {
  __typename?: 'NewNativeRelease';
  files: Array<VersionFile>;
  fonts: Array<Font>;
  libraries: Array<Library>;
  newFiles: Array<VersionFile>;
  newFonts: Array<Font>;
  newLibraries: Array<Library>;
};

/** A library that has been in the top 100 for a long time */
export type OldtimerLibrary = {
  __typename?: 'OldtimerLibrary';
  /** The library */
  library: Library;
  /** Number of weeks this library has been in the top 100 */
  weeksInTop100: Scalars['Int']['output'];
};

/** Input type for pagination */
export type PaginationInput = {
  /** Number of items to skip */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to take */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  tokenMint: Scalars['String']['output'];
  txSignature: Scalars['String']['output'];
  walletAddress: Scalars['String']['output'];
};

export type PotentialSavings = {
  __typename?: 'PotentialSavings';
  totalFileSavings: Scalars['String']['output'];
  totalFontSavings: Scalars['String']['output'];
  totalVersionSavings: Scalars['String']['output'];
};

/** An image fetched through the proxy to avoid CORS issues */
export type ProxiedImage = {
  __typename?: 'ProxiedImage';
  /** The MIME type of the image (e.g., image/png, image/jpeg) */
  contentType: Scalars['String']['output'];
  /** Base64-encoded image data */
  data: Scalars['String']['output'];
  /** Size of the image in bytes */
  size: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  bigLibraries?: Maybe<Array<Library>>;
  fastestGrowingLibraries?: Maybe<Array<FastestGrowingLibrary>>;
  font?: Maybe<Font>;
  imagesToConvert: BundledImages;
  latestMeasurements?: Maybe<Array<Measurement>>;
  latestRelease?: Maybe<NativeSupplyChainRelease>;
  library?: Maybe<Library>;
  libraryUsage?: Maybe<LibraryUsage>;
  loggedIn: User;
  measurement?: Maybe<Measurement>;
  measurementDevices?: Maybe<Array<MeasurementDevice>>;
  measurementPrices?: Maybe<Array<MeasurementPrice>>;
  measurementStats?: Maybe<MeasurementStats>;
  measurements?: Maybe<Array<Measurement>>;
  nativePackages?: Maybe<NativePackagesResult>;
  newRelease?: Maybe<NewNativeRelease>;
  oldtimerLibraries?: Maybe<Array<OldtimerLibrary>>;
  paymentInfo?: Maybe<SolanaPaymentInfo>;
  payments?: Maybe<Array<Payment>>;
  popularFonts?: Maybe<Array<Font>>;
  potentialSavings?: Maybe<PotentialSavings>;
  proxyImage?: Maybe<ProxiedImage>;
  release?: Maybe<NativeSupplyChainRelease>;
  releases: Array<NativeSupplyChainRelease>;
  searchFonts?: Maybe<Array<Font>>;
  searchLibrary?: Maybe<Array<LibrarySearchResult>>;
  searchStats?: Maybe<SearchStats>;
  starredLibraries?: Maybe<Array<Library>>;
  topLibraries?: Maybe<TopLibrariesResult>;
  users?: Maybe<Array<Maybe<User>>>;
  versionFileIntegrations: VersionFileIntegrations;
  versionIntegrations: VersionIntegrations;
  versionUsage?: Maybe<Array<VersionUsage>>;
  website?: Maybe<WebsiteHost>;
  websites?: Maybe<Array<WebsiteHost>>;
};


export type QueryBigLibrariesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFontArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryImagesToConvertArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLatestMeasurementsArgs = {
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLibraryArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLibraryUsageArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeasurementArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeasurementsArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNativePackagesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryPaymentInfoArgs = {
  publicKey?: InputMaybe<Scalars['String']['input']>;
  tokenMint?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPopularFontsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProxyImageArgs = {
  url: Scalars['String']['input'];
};


export type QueryReleaseArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchFontsArgs = {
  term?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchLibraryArgs = {
  term?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTopLibrariesArgs = {
  orderBy?: InputMaybe<TopLibrariesOrderBy>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryVersionFileIntegrationsArgs = {
  library?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVersionIntegrationsArgs = {
  library?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVersionUsageArgs = {
  library?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWebsiteArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWebsitesArgs = {
  filter?: InputMaybe<WebsiteHostFilter>;
  order?: InputMaybe<WebsiteHostQueryOrder>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type Rating = {
  __typename?: 'Rating';
  accessibility: Array<AccessibilityViolation>;
  avifUsage: Array<Scalars['String']['output']>;
  cacheControlUsage: Array<Scalars['String']['output']>;
  compressionUsage: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  fast3GLoadTime?: Maybe<Scalars['Int']['output']>;
  firstContentfulPaint?: Maybe<Scalars['Int']['output']>;
  hasDescription: Scalars['Boolean']['output'];
  hasFavicon: Scalars['Boolean']['output'];
  hasOgImage: Scalars['Boolean']['output'];
  httpsSupport: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  largestContentfulPaint?: Maybe<Scalars['Int']['output']>;
  measurement?: Maybe<Measurement>;
  noMixedContent: Scalars['Boolean']['output'];
  overallScore: Scalars['Int']['output'];
  slow3GLoadTime?: Maybe<Scalars['Int']['output']>;
  stableLoadTime?: Maybe<Scalars['Int']['output']>;
  url: Scalars['String']['output'];
  webpUsage: Array<Scalars['String']['output']>;
};

export enum ReleaseVersionType {
  Major = 'MAJOR',
  Minor = 'MINOR',
  Patch = 'PATCH'
}

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SameVersionRequirement = {
  __typename?: 'SameVersionRequirement';
  createdAt: Scalars['DateTime']['output'];
  dependingOn: Library;
  id: Scalars['ID']['output'];
};

/** Statistics for the search page empty state */
export type SearchStats = {
  __typename?: 'SearchStats';
  /** Total number of fonts available */
  totalFonts: Scalars['Int']['output'];
  /** Total number of integrated library versions */
  totalIntegratedLibraries: Scalars['Int']['output'];
  /** Total number of libraries tracked */
  totalLibraries: Scalars['Int']['output'];
};

/** Information needed for making Solana payments */
export type SolanaPaymentInfo = {
  __typename?: 'SolanaPaymentInfo';
  /** Recent blockhash for transaction */
  blockhash?: Maybe<Scalars['String']['output']>;
  /** Sender's public key */
  fromPubKey?: Maybe<Scalars['String']['output']>;
  /** SOL token balance */
  solBalance: TokenBalance;
  /** Treasury public key */
  treasuryPubKey?: Maybe<Scalars['String']['output']>;
  /** USDC token balance */
  usdcBalance: TokenBalance;
  /** UTCC token balance */
  utccBalance: TokenBalance;
};

/** Represents a token balance in a Solana wallet */
export type TokenBalance = {
  __typename?: 'TokenBalance';
  /** The amount of tokens held */
  amount: Scalars['Float']['output'];
  /** The mint address of the token */
  mint: Scalars['String']['output'];
};

/** Order top libraries by downloads or bandwidth */
export enum TopLibrariesOrderBy {
  Bandwidth = 'BANDWIDTH',
  Downloads = 'DOWNLOADS'
}

/** Result of fetching top libraries */
export type TopLibrariesResult = {
  __typename?: 'TopLibrariesResult';
  /** Top libraries */
  libraries: Array<Library>;
  /** Aggregate statistics */
  stats: TopLibrariesStats;
};

/** Aggregate statistics for top libraries */
export type TopLibrariesStats = {
  __typename?: 'TopLibrariesStats';
  /** Total bandwidth of top 100 libraries */
  totalBandwidth: Scalars['String']['output'];
  /** Total downloads of top 100 libraries */
  totalDownloads: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  accessToken?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
  verified: Scalars['Boolean']['output'];
};

export type VerificationCode = {
  __typename?: 'VerificationCode';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  user: User;
};

export type Version = {
  __typename?: 'Version';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  integrated: Scalars['Boolean']['output'];
  library: Library;
  publishedAt: Scalars['DateTime']['output'];
  size?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['String']['output'];
};

export type VersionFile = {
  __typename?: 'VersionFile';
  id: Scalars['ID']['output'];
  integrated: Scalars['Boolean']['output'];
  path: Scalars['String']['output'];
  version: Version;
};

/** Version files to integrate into the system */
export type VersionFileIntegrations = {
  __typename?: 'VersionFileIntegrations';
  /** List of integrated version files */
  integrated: Array<VersionFileUsage>;
  /** List of popular version files to integrate */
  popular: Array<VersionFileUsage>;
};

/** Version files to integrate into the system */
export type VersionFileUsage = {
  __typename?: 'VersionFileUsage';
  /** Bandwidth used by this file in bytes */
  bandwidth: Scalars['String']['output'];
  file: VersionFile;
};

/** Versions to integrate into the system */
export type VersionIntegrations = {
  __typename?: 'VersionIntegrations';
  /** List of integrated versions */
  integrated: Array<Version>;
  /** List of all other versions to integrate */
  other: Array<Version>;
  /** List of popular versions to integrate */
  popular: Array<Version>;
};

/** Usage statistics for most used versions of a library */
export type VersionUsage = {
  __typename?: 'VersionUsage';
  /** Npm downloads of this version */
  downloads: Scalars['String']['output'];
  /** Whether the version is integrated */
  integrated: Scalars['Boolean']['output'];
  /** The version string */
  version: Scalars['String']['output'];
};

export type WebsiteHost = {
  __typename?: 'WebsiteHost';
  description?: Maybe<Scalars['String']['output']>;
  host: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ratings?: Maybe<Array<Rating>>;
  rootMeasurement?: Maybe<Measurement>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export enum WebsiteHostFilter {
  MeasuredByMe = 'MEASURED_BY_ME'
}

export enum WebsiteHostQueryOrder {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  HostAsc = 'HOST_ASC',
  HostDesc = 'HOST_DESC'
}

export type LoggedInQueryVariables = Exact<{ [key: string]: never; }>;


export type LoggedInQuery = { __typename?: 'Query', loggedIn: { __typename?: 'User', id: string, email: string, name: string, role: Role, verified: boolean } };

export type PaymentInfoQueryVariables = Exact<{
  publicKey: Scalars['String']['input'];
  tokenMint?: InputMaybe<Scalars['String']['input']>;
}>;


export type PaymentInfoQuery = { __typename?: 'Query', paymentInfo?: { __typename?: 'SolanaPaymentInfo', blockhash?: string | null, fromPubKey?: string | null, treasuryPubKey?: string | null, utccBalance: { __typename?: 'TokenBalance', mint: string, amount: number }, usdcBalance: { __typename?: 'TokenBalance', mint: string, amount: number }, solBalance: { __typename?: 'TokenBalance', mint: string, amount: number } } | null };

export type SendResetLinkMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendResetLinkMutation = { __typename?: 'Mutation', sendResetLink?: boolean | null };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: boolean | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id: string, verified: boolean, accessToken?: string | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: { __typename?: 'User', id: string } | null };

export type RegisterMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'User', id: string, email: string, accessToken?: string | null } | null };

export type VerifyMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type VerifyMutation = { __typename?: 'Mutation', verify?: { __typename?: 'User', id: string, email: string, verified: boolean } | null };

export type ResendCodeMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendCodeMutation = { __typename?: 'Mutation', resendVerificationCode?: boolean | null };

export type ImagesToConvertQueryVariables = Exact<{
  host: Scalars['String']['input'];
  path?: InputMaybe<Scalars['String']['input']>;
}>;


export type ImagesToConvertQuery = { __typename?: 'Query', imagesToConvert: { __typename?: 'BundledImages', desktop?: Array<{ __typename?: 'BundledFile', id: string, url: string, type: string, size?: string | null, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> | null, tablet?: Array<{ __typename?: 'BundledFile', id: string, url: string, type: string, size?: string | null, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> | null, mobile?: Array<{ __typename?: 'BundledFile', id: string, url: string, type: string, size?: string | null, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> | null } };

export type BundledImageFragment = { __typename?: 'BundledFile', id: string, url: string, type: string, size?: string | null, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null };

export type LatestMeasurementsQueryVariables = Exact<{ [key: string]: never; }>;


export type LatestMeasurementsQuery = { __typename?: 'Query', latestMeasurements?: Array<{ __typename?: 'Measurement', id: string, url: string, title?: string | null, elapsed?: number | null, icon?: string | null, createdAt: any, connectionType: ConnectionType, host?: { __typename?: 'WebsiteHost', id: string, host: string } | null, bundledFiles: Array<{ __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, elapsed: number }> }> | null };

export type MeasurementStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type MeasurementStatsQuery = { __typename?: 'Query', measurementStats?: { __typename?: 'MeasurementStats', totalMeasurements?: number | null, totalWebsiteHosts?: number | null, totalAccessibilityViolations?: number | null } | null };

export type MeasurementStatusQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MeasurementStatusQuery = { __typename?: 'Query', measurement?: { __typename?: 'Measurement', id: string, status: MeasurementStatus, url: string, host?: { __typename?: 'WebsiteHost', host: string } | null } | null };

export type MeasurementsQueryVariables = Exact<{
  host: Scalars['String']['input'];
  path?: InputMaybe<Scalars['String']['input']>;
}>;


export type MeasurementsQuery = { __typename?: 'Query', measurements?: Array<{ __typename?: 'Measurement', id: string, url: string, redirect?: string | null, title?: string | null, description?: string | null, status: MeasurementStatus, elapsed?: number | null, screenshots: Array<string>, connectionType: ConnectionType, links: Array<string>, icon?: string | null, thumbnail?: string | null, host?: { __typename?: 'WebsiteHost', id: string, host: string } | null, device: { __typename?: 'MeasurementDevice', id: string, type: DeviceType, width: number, height: number }, bundledFiles: Array<{ __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, cacheControl?: string | null, elapsed: number, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> }> | null };

export type MeasurementDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type MeasurementDevicesQuery = { __typename?: 'Query', measurementDevices?: Array<{ __typename?: 'MeasurementDevice', id: string, type: DeviceType, width: number, height: number }> | null };

export type CreateMeasurementMutationVariables = Exact<{
  url: Scalars['String']['input'];
  device?: InputMaybe<DeviceType>;
  connection?: InputMaybe<ConnectionType>;
  txSignature?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
  tokenMint?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateMeasurementMutation = { __typename?: 'Mutation', createMeasurement?: { __typename?: 'Measurement', id: string, url: string, redirect?: string | null, title?: string | null, description?: string | null, status: MeasurementStatus, elapsed?: number | null, icon?: string | null, thumbnail?: string | null, bundledFiles: Array<{ __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, cacheControl?: string | null, elapsed: number, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> } | null };

export type MeasuredFileFragment = { __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, cacheControl?: string | null, elapsed: number, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null };

export type MeasurementPricesQueryVariables = Exact<{ [key: string]: never; }>;


export type MeasurementPricesQuery = { __typename?: 'Query', measurementPrices?: Array<{ __typename?: 'MeasurementPrice', tokenMint: string, amount: number }> | null };

export type WebsiteQueryVariables = Exact<{
  host: Scalars['String']['input'];
}>;


export type WebsiteQuery = { __typename?: 'Query', website?: { __typename?: 'WebsiteHost', id: string, host: string, ratings?: Array<{ __typename?: 'Rating', url: string, overallScore: number, createdAt: any }> | null } | null };

export type MeasurementHistoryQueryVariables = Exact<{
  host: Scalars['String']['input'];
  path: Scalars['String']['input'];
}>;


export type MeasurementHistoryQuery = { __typename?: 'Query', measurements?: Array<{ __typename?: 'Measurement', id: string, url: string, redirect?: string | null, createdAt: any, status: MeasurementStatus, elapsed?: number | null, connectionType: ConnectionType, screenshots: Array<string>, largestContentfulPaint?: number | null, timeToInteractive?: number | null, device: { __typename?: 'MeasurementDevice', id: string, type: DeviceType }, bundledFiles: Array<{ __typename?: 'BundledFile', id: string, url: string, type: string, elapsed: number, size?: string | null }> }> | null };

export type PaymentsQueryVariables = Exact<{ [key: string]: never; }>;


export type PaymentsQuery = { __typename?: 'Query', payments?: Array<{ __typename?: 'Payment', id: string, amount: number, txSignature: string, tokenMint: string, createdAt: any }> | null };

export type WebsiteRatingQueryVariables = Exact<{
  host: Scalars['String']['input'];
}>;


export type WebsiteRatingQuery = { __typename?: 'Query', website?: { __typename?: 'WebsiteHost', id: string, host: string, ratings?: Array<{ __typename?: 'Rating', url: string, httpsSupport: boolean, noMixedContent: boolean, hasDescription: boolean, hasFavicon: boolean, hasOgImage: boolean, firstContentfulPaint?: number | null, largestContentfulPaint?: number | null, stableLoadTime?: number | null, fast3GLoadTime?: number | null, slow3GLoadTime?: number | null, webpUsage: Array<string>, avifUsage: Array<string>, cacheControlUsage: Array<string>, compressionUsage: Array<string>, overallScore: number, createdAt: any, accessibility: Array<{ __typename?: 'AccessibilityViolation', violationId: string, impact: string, description: string, helpUrl: string, help: string, screenshots: Array<string> }>, measurement?: { __typename?: 'Measurement', id: string, meta?: string | null } | null }> | null } | null };

export type WebsitesQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<WebsiteHostQueryOrder>;
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<WebsiteHostFilter>;
}>;


export type WebsitesQuery = { __typename?: 'Query', websites?: Array<{ __typename?: 'WebsiteHost', id: string, host: string, icon?: string | null, thumbnail?: string | null, title?: string | null, description?: string | null, ratings?: Array<{ __typename?: 'Rating', overallScore: number, createdAt: any }> | null, rootMeasurement?: { __typename?: 'Measurement', id: string, url: string, redirect?: string | null } | null }> | null };

export const BundledImageFragmentDoc = gql`
    fragment BundledImage on BundledFile {
  id
  url
  type
  size
  width
  height
  clientWidth
  clientHeight
}
    `;
export const MeasuredFileFragmentDoc = gql`
    fragment MeasuredFile on BundledFile {
  id
  url
  size
  type
  cacheControl
  elapsed
  width
  height
  clientWidth
  clientHeight
}
    `;
export const LoggedInDocument = gql`
    query loggedIn {
  loggedIn {
    id
    email
    name
    role
    verified
  }
}
    `;

/**
 * __useLoggedInQuery__
 *
 * To run a query within a React component, call `useLoggedInQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoggedInQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoggedInQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoggedInQuery(baseOptions?: Apollo.QueryHookOptions<LoggedInQuery, LoggedInQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoggedInQuery, LoggedInQueryVariables>(LoggedInDocument, options);
      }
export function useLoggedInLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoggedInQuery, LoggedInQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoggedInQuery, LoggedInQueryVariables>(LoggedInDocument, options);
        }
export function useLoggedInSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LoggedInQuery, LoggedInQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LoggedInQuery, LoggedInQueryVariables>(LoggedInDocument, options);
        }
export type LoggedInQueryHookResult = ReturnType<typeof useLoggedInQuery>;
export type LoggedInLazyQueryHookResult = ReturnType<typeof useLoggedInLazyQuery>;
export type LoggedInSuspenseQueryHookResult = ReturnType<typeof useLoggedInSuspenseQuery>;
export type LoggedInQueryResult = Apollo.QueryResult<LoggedInQuery, LoggedInQueryVariables>;
export const PaymentInfoDocument = gql`
    query paymentInfo($publicKey: String!, $tokenMint: String) {
  paymentInfo(publicKey: $publicKey, tokenMint: $tokenMint) {
    utccBalance {
      mint
      amount
    }
    usdcBalance {
      mint
      amount
    }
    solBalance {
      mint
      amount
    }
    blockhash
    fromPubKey
    treasuryPubKey
  }
}
    `;

/**
 * __usePaymentInfoQuery__
 *
 * To run a query within a React component, call `usePaymentInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentInfoQuery({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *      tokenMint: // value for 'tokenMint'
 *   },
 * });
 */
export function usePaymentInfoQuery(baseOptions: Apollo.QueryHookOptions<PaymentInfoQuery, PaymentInfoQueryVariables> & ({ variables: PaymentInfoQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaymentInfoQuery, PaymentInfoQueryVariables>(PaymentInfoDocument, options);
      }
export function usePaymentInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaymentInfoQuery, PaymentInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaymentInfoQuery, PaymentInfoQueryVariables>(PaymentInfoDocument, options);
        }
export function usePaymentInfoSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PaymentInfoQuery, PaymentInfoQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PaymentInfoQuery, PaymentInfoQueryVariables>(PaymentInfoDocument, options);
        }
export type PaymentInfoQueryHookResult = ReturnType<typeof usePaymentInfoQuery>;
export type PaymentInfoLazyQueryHookResult = ReturnType<typeof usePaymentInfoLazyQuery>;
export type PaymentInfoSuspenseQueryHookResult = ReturnType<typeof usePaymentInfoSuspenseQuery>;
export type PaymentInfoQueryResult = Apollo.QueryResult<PaymentInfoQuery, PaymentInfoQueryVariables>;
export const SendResetLinkDocument = gql`
    mutation sendResetLink($email: String!) {
  sendResetLink(email: $email)
}
    `;
export type SendResetLinkMutationFn = Apollo.MutationFunction<SendResetLinkMutation, SendResetLinkMutationVariables>;

/**
 * __useSendResetLinkMutation__
 *
 * To run a mutation, you first call `useSendResetLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendResetLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendResetLinkMutation, { data, loading, error }] = useSendResetLinkMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSendResetLinkMutation(baseOptions?: Apollo.MutationHookOptions<SendResetLinkMutation, SendResetLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendResetLinkMutation, SendResetLinkMutationVariables>(SendResetLinkDocument, options);
      }
export type SendResetLinkMutationHookResult = ReturnType<typeof useSendResetLinkMutation>;
export type SendResetLinkMutationResult = Apollo.MutationResult<SendResetLinkMutation>;
export type SendResetLinkMutationOptions = Apollo.BaseMutationOptions<SendResetLinkMutation, SendResetLinkMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation resetPassword($token: String!, $password: String!) {
  resetPassword(token: $token, password: $password)
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    verified
    accessToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout {
    id
  }
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation register($data: CreateUserInput!) {
  register(data: $data) {
    id
    email
    accessToken
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const VerifyDocument = gql`
    mutation verify($code: String!) {
  verify(code: $code) {
    id
    email
    verified
  }
}
    `;
export type VerifyMutationFn = Apollo.MutationFunction<VerifyMutation, VerifyMutationVariables>;

/**
 * __useVerifyMutation__
 *
 * To run a mutation, you first call `useVerifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyMutation, { data, loading, error }] = useVerifyMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useVerifyMutation(baseOptions?: Apollo.MutationHookOptions<VerifyMutation, VerifyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyMutation, VerifyMutationVariables>(VerifyDocument, options);
      }
export type VerifyMutationHookResult = ReturnType<typeof useVerifyMutation>;
export type VerifyMutationResult = Apollo.MutationResult<VerifyMutation>;
export type VerifyMutationOptions = Apollo.BaseMutationOptions<VerifyMutation, VerifyMutationVariables>;
export const ResendCodeDocument = gql`
    mutation resendCode {
  resendVerificationCode
}
    `;
export type ResendCodeMutationFn = Apollo.MutationFunction<ResendCodeMutation, ResendCodeMutationVariables>;

/**
 * __useResendCodeMutation__
 *
 * To run a mutation, you first call `useResendCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendCodeMutation, { data, loading, error }] = useResendCodeMutation({
 *   variables: {
 *   },
 * });
 */
export function useResendCodeMutation(baseOptions?: Apollo.MutationHookOptions<ResendCodeMutation, ResendCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendCodeMutation, ResendCodeMutationVariables>(ResendCodeDocument, options);
      }
export type ResendCodeMutationHookResult = ReturnType<typeof useResendCodeMutation>;
export type ResendCodeMutationResult = Apollo.MutationResult<ResendCodeMutation>;
export type ResendCodeMutationOptions = Apollo.BaseMutationOptions<ResendCodeMutation, ResendCodeMutationVariables>;
export const ImagesToConvertDocument = gql`
    query imagesToConvert($host: String!, $path: String) {
  imagesToConvert(host: $host, path: $path) {
    desktop {
      ...BundledImage
    }
    tablet {
      ...BundledImage
    }
    mobile {
      ...BundledImage
    }
  }
}
    ${BundledImageFragmentDoc}`;

/**
 * __useImagesToConvertQuery__
 *
 * To run a query within a React component, call `useImagesToConvertQuery` and pass it any options that fit your needs.
 * When your component renders, `useImagesToConvertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useImagesToConvertQuery({
 *   variables: {
 *      host: // value for 'host'
 *      path: // value for 'path'
 *   },
 * });
 */
export function useImagesToConvertQuery(baseOptions: Apollo.QueryHookOptions<ImagesToConvertQuery, ImagesToConvertQueryVariables> & ({ variables: ImagesToConvertQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ImagesToConvertQuery, ImagesToConvertQueryVariables>(ImagesToConvertDocument, options);
      }
export function useImagesToConvertLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ImagesToConvertQuery, ImagesToConvertQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ImagesToConvertQuery, ImagesToConvertQueryVariables>(ImagesToConvertDocument, options);
        }
export function useImagesToConvertSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ImagesToConvertQuery, ImagesToConvertQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ImagesToConvertQuery, ImagesToConvertQueryVariables>(ImagesToConvertDocument, options);
        }
export type ImagesToConvertQueryHookResult = ReturnType<typeof useImagesToConvertQuery>;
export type ImagesToConvertLazyQueryHookResult = ReturnType<typeof useImagesToConvertLazyQuery>;
export type ImagesToConvertSuspenseQueryHookResult = ReturnType<typeof useImagesToConvertSuspenseQuery>;
export type ImagesToConvertQueryResult = Apollo.QueryResult<ImagesToConvertQuery, ImagesToConvertQueryVariables>;
export const LatestMeasurementsDocument = gql`
    query latestMeasurements {
  latestMeasurements(take: 3) {
    id
    url
    host {
      id
      host
    }
    title
    elapsed
    icon
    createdAt
    connectionType
    bundledFiles {
      id
      url
      size
      type
      elapsed
    }
  }
}
    `;

/**
 * __useLatestMeasurementsQuery__
 *
 * To run a query within a React component, call `useLatestMeasurementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLatestMeasurementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLatestMeasurementsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLatestMeasurementsQuery(baseOptions?: Apollo.QueryHookOptions<LatestMeasurementsQuery, LatestMeasurementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LatestMeasurementsQuery, LatestMeasurementsQueryVariables>(LatestMeasurementsDocument, options);
      }
export function useLatestMeasurementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LatestMeasurementsQuery, LatestMeasurementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LatestMeasurementsQuery, LatestMeasurementsQueryVariables>(LatestMeasurementsDocument, options);
        }
export function useLatestMeasurementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LatestMeasurementsQuery, LatestMeasurementsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LatestMeasurementsQuery, LatestMeasurementsQueryVariables>(LatestMeasurementsDocument, options);
        }
export type LatestMeasurementsQueryHookResult = ReturnType<typeof useLatestMeasurementsQuery>;
export type LatestMeasurementsLazyQueryHookResult = ReturnType<typeof useLatestMeasurementsLazyQuery>;
export type LatestMeasurementsSuspenseQueryHookResult = ReturnType<typeof useLatestMeasurementsSuspenseQuery>;
export type LatestMeasurementsQueryResult = Apollo.QueryResult<LatestMeasurementsQuery, LatestMeasurementsQueryVariables>;
export const MeasurementStatsDocument = gql`
    query measurementStats {
  measurementStats {
    totalMeasurements
    totalWebsiteHosts
    totalAccessibilityViolations
  }
}
    `;

/**
 * __useMeasurementStatsQuery__
 *
 * To run a query within a React component, call `useMeasurementStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeasurementStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeasurementStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeasurementStatsQuery(baseOptions?: Apollo.QueryHookOptions<MeasurementStatsQuery, MeasurementStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeasurementStatsQuery, MeasurementStatsQueryVariables>(MeasurementStatsDocument, options);
      }
export function useMeasurementStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeasurementStatsQuery, MeasurementStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeasurementStatsQuery, MeasurementStatsQueryVariables>(MeasurementStatsDocument, options);
        }
export function useMeasurementStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeasurementStatsQuery, MeasurementStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeasurementStatsQuery, MeasurementStatsQueryVariables>(MeasurementStatsDocument, options);
        }
export type MeasurementStatsQueryHookResult = ReturnType<typeof useMeasurementStatsQuery>;
export type MeasurementStatsLazyQueryHookResult = ReturnType<typeof useMeasurementStatsLazyQuery>;
export type MeasurementStatsSuspenseQueryHookResult = ReturnType<typeof useMeasurementStatsSuspenseQuery>;
export type MeasurementStatsQueryResult = Apollo.QueryResult<MeasurementStatsQuery, MeasurementStatsQueryVariables>;
export const MeasurementStatusDocument = gql`
    query measurementStatus($id: String!) {
  measurement(id: $id) {
    id
    status
    url
    host {
      host
    }
  }
}
    `;

/**
 * __useMeasurementStatusQuery__
 *
 * To run a query within a React component, call `useMeasurementStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeasurementStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeasurementStatusQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMeasurementStatusQuery(baseOptions: Apollo.QueryHookOptions<MeasurementStatusQuery, MeasurementStatusQueryVariables> & ({ variables: MeasurementStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeasurementStatusQuery, MeasurementStatusQueryVariables>(MeasurementStatusDocument, options);
      }
export function useMeasurementStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeasurementStatusQuery, MeasurementStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeasurementStatusQuery, MeasurementStatusQueryVariables>(MeasurementStatusDocument, options);
        }
export function useMeasurementStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeasurementStatusQuery, MeasurementStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeasurementStatusQuery, MeasurementStatusQueryVariables>(MeasurementStatusDocument, options);
        }
export type MeasurementStatusQueryHookResult = ReturnType<typeof useMeasurementStatusQuery>;
export type MeasurementStatusLazyQueryHookResult = ReturnType<typeof useMeasurementStatusLazyQuery>;
export type MeasurementStatusSuspenseQueryHookResult = ReturnType<typeof useMeasurementStatusSuspenseQuery>;
export type MeasurementStatusQueryResult = Apollo.QueryResult<MeasurementStatusQuery, MeasurementStatusQueryVariables>;
export const MeasurementsDocument = gql`
    query measurements($host: String!, $path: String) {
  measurements(host: $host, path: $path) {
    id
    url
    host {
      id
      host
    }
    redirect
    title
    description
    status
    elapsed
    device {
      id
      type
      width
      height
    }
    screenshots
    connectionType
    bundledFiles {
      ...MeasuredFile
    }
    links
    icon
    thumbnail
  }
}
    ${MeasuredFileFragmentDoc}`;

/**
 * __useMeasurementsQuery__
 *
 * To run a query within a React component, call `useMeasurementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeasurementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeasurementsQuery({
 *   variables: {
 *      host: // value for 'host'
 *      path: // value for 'path'
 *   },
 * });
 */
export function useMeasurementsQuery(baseOptions: Apollo.QueryHookOptions<MeasurementsQuery, MeasurementsQueryVariables> & ({ variables: MeasurementsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeasurementsQuery, MeasurementsQueryVariables>(MeasurementsDocument, options);
      }
export function useMeasurementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeasurementsQuery, MeasurementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeasurementsQuery, MeasurementsQueryVariables>(MeasurementsDocument, options);
        }
export function useMeasurementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeasurementsQuery, MeasurementsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeasurementsQuery, MeasurementsQueryVariables>(MeasurementsDocument, options);
        }
export type MeasurementsQueryHookResult = ReturnType<typeof useMeasurementsQuery>;
export type MeasurementsLazyQueryHookResult = ReturnType<typeof useMeasurementsLazyQuery>;
export type MeasurementsSuspenseQueryHookResult = ReturnType<typeof useMeasurementsSuspenseQuery>;
export type MeasurementsQueryResult = Apollo.QueryResult<MeasurementsQuery, MeasurementsQueryVariables>;
export const MeasurementDevicesDocument = gql`
    query measurementDevices {
  measurementDevices {
    id
    type
    width
    height
  }
}
    `;

/**
 * __useMeasurementDevicesQuery__
 *
 * To run a query within a React component, call `useMeasurementDevicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeasurementDevicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeasurementDevicesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeasurementDevicesQuery(baseOptions?: Apollo.QueryHookOptions<MeasurementDevicesQuery, MeasurementDevicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeasurementDevicesQuery, MeasurementDevicesQueryVariables>(MeasurementDevicesDocument, options);
      }
export function useMeasurementDevicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeasurementDevicesQuery, MeasurementDevicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeasurementDevicesQuery, MeasurementDevicesQueryVariables>(MeasurementDevicesDocument, options);
        }
export function useMeasurementDevicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeasurementDevicesQuery, MeasurementDevicesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeasurementDevicesQuery, MeasurementDevicesQueryVariables>(MeasurementDevicesDocument, options);
        }
export type MeasurementDevicesQueryHookResult = ReturnType<typeof useMeasurementDevicesQuery>;
export type MeasurementDevicesLazyQueryHookResult = ReturnType<typeof useMeasurementDevicesLazyQuery>;
export type MeasurementDevicesSuspenseQueryHookResult = ReturnType<typeof useMeasurementDevicesSuspenseQuery>;
export type MeasurementDevicesQueryResult = Apollo.QueryResult<MeasurementDevicesQuery, MeasurementDevicesQueryVariables>;
export const CreateMeasurementDocument = gql`
    mutation createMeasurement($url: String!, $device: DeviceType, $connection: ConnectionType, $txSignature: String, $walletAddress: String, $tokenMint: String) {
  createMeasurement(
    url: $url
    device: $device
    connection: $connection
    txSignature: $txSignature
    walletAddress: $walletAddress
    tokenMint: $tokenMint
  ) {
    id
    url
    redirect
    title
    description
    status
    elapsed
    bundledFiles {
      ...MeasuredFile
    }
    icon
    thumbnail
  }
}
    ${MeasuredFileFragmentDoc}`;
export type CreateMeasurementMutationFn = Apollo.MutationFunction<CreateMeasurementMutation, CreateMeasurementMutationVariables>;

/**
 * __useCreateMeasurementMutation__
 *
 * To run a mutation, you first call `useCreateMeasurementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMeasurementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMeasurementMutation, { data, loading, error }] = useCreateMeasurementMutation({
 *   variables: {
 *      url: // value for 'url'
 *      device: // value for 'device'
 *      connection: // value for 'connection'
 *      txSignature: // value for 'txSignature'
 *      walletAddress: // value for 'walletAddress'
 *      tokenMint: // value for 'tokenMint'
 *   },
 * });
 */
export function useCreateMeasurementMutation(baseOptions?: Apollo.MutationHookOptions<CreateMeasurementMutation, CreateMeasurementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMeasurementMutation, CreateMeasurementMutationVariables>(CreateMeasurementDocument, options);
      }
export type CreateMeasurementMutationHookResult = ReturnType<typeof useCreateMeasurementMutation>;
export type CreateMeasurementMutationResult = Apollo.MutationResult<CreateMeasurementMutation>;
export type CreateMeasurementMutationOptions = Apollo.BaseMutationOptions<CreateMeasurementMutation, CreateMeasurementMutationVariables>;
export const MeasurementPricesDocument = gql`
    query measurementPrices {
  measurementPrices {
    tokenMint
    amount
  }
}
    `;

/**
 * __useMeasurementPricesQuery__
 *
 * To run a query within a React component, call `useMeasurementPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeasurementPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeasurementPricesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeasurementPricesQuery(baseOptions?: Apollo.QueryHookOptions<MeasurementPricesQuery, MeasurementPricesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeasurementPricesQuery, MeasurementPricesQueryVariables>(MeasurementPricesDocument, options);
      }
export function useMeasurementPricesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeasurementPricesQuery, MeasurementPricesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeasurementPricesQuery, MeasurementPricesQueryVariables>(MeasurementPricesDocument, options);
        }
export function useMeasurementPricesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeasurementPricesQuery, MeasurementPricesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeasurementPricesQuery, MeasurementPricesQueryVariables>(MeasurementPricesDocument, options);
        }
export type MeasurementPricesQueryHookResult = ReturnType<typeof useMeasurementPricesQuery>;
export type MeasurementPricesLazyQueryHookResult = ReturnType<typeof useMeasurementPricesLazyQuery>;
export type MeasurementPricesSuspenseQueryHookResult = ReturnType<typeof useMeasurementPricesSuspenseQuery>;
export type MeasurementPricesQueryResult = Apollo.QueryResult<MeasurementPricesQuery, MeasurementPricesQueryVariables>;
export const WebsiteDocument = gql`
    query website($host: String!) {
  website(host: $host) {
    id
    host
    ratings {
      url
      overallScore
      createdAt
    }
  }
}
    `;

/**
 * __useWebsiteQuery__
 *
 * To run a query within a React component, call `useWebsiteQuery` and pass it any options that fit your needs.
 * When your component renders, `useWebsiteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWebsiteQuery({
 *   variables: {
 *      host: // value for 'host'
 *   },
 * });
 */
export function useWebsiteQuery(baseOptions: Apollo.QueryHookOptions<WebsiteQuery, WebsiteQueryVariables> & ({ variables: WebsiteQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WebsiteQuery, WebsiteQueryVariables>(WebsiteDocument, options);
      }
export function useWebsiteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WebsiteQuery, WebsiteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WebsiteQuery, WebsiteQueryVariables>(WebsiteDocument, options);
        }
export function useWebsiteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WebsiteQuery, WebsiteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WebsiteQuery, WebsiteQueryVariables>(WebsiteDocument, options);
        }
export type WebsiteQueryHookResult = ReturnType<typeof useWebsiteQuery>;
export type WebsiteLazyQueryHookResult = ReturnType<typeof useWebsiteLazyQuery>;
export type WebsiteSuspenseQueryHookResult = ReturnType<typeof useWebsiteSuspenseQuery>;
export type WebsiteQueryResult = Apollo.QueryResult<WebsiteQuery, WebsiteQueryVariables>;
export const MeasurementHistoryDocument = gql`
    query measurementHistory($host: String!, $path: String!) {
  measurements(host: $host, path: $path) {
    id
    url
    redirect
    createdAt
    status
    elapsed
    device {
      id
      type
    }
    connectionType
    bundledFiles {
      id
      url
      type
      elapsed
      size
    }
    screenshots
    largestContentfulPaint
    timeToInteractive
  }
}
    `;

/**
 * __useMeasurementHistoryQuery__
 *
 * To run a query within a React component, call `useMeasurementHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeasurementHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeasurementHistoryQuery({
 *   variables: {
 *      host: // value for 'host'
 *      path: // value for 'path'
 *   },
 * });
 */
export function useMeasurementHistoryQuery(baseOptions: Apollo.QueryHookOptions<MeasurementHistoryQuery, MeasurementHistoryQueryVariables> & ({ variables: MeasurementHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeasurementHistoryQuery, MeasurementHistoryQueryVariables>(MeasurementHistoryDocument, options);
      }
export function useMeasurementHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeasurementHistoryQuery, MeasurementHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeasurementHistoryQuery, MeasurementHistoryQueryVariables>(MeasurementHistoryDocument, options);
        }
export function useMeasurementHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeasurementHistoryQuery, MeasurementHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeasurementHistoryQuery, MeasurementHistoryQueryVariables>(MeasurementHistoryDocument, options);
        }
export type MeasurementHistoryQueryHookResult = ReturnType<typeof useMeasurementHistoryQuery>;
export type MeasurementHistoryLazyQueryHookResult = ReturnType<typeof useMeasurementHistoryLazyQuery>;
export type MeasurementHistorySuspenseQueryHookResult = ReturnType<typeof useMeasurementHistorySuspenseQuery>;
export type MeasurementHistoryQueryResult = Apollo.QueryResult<MeasurementHistoryQuery, MeasurementHistoryQueryVariables>;
export const PaymentsDocument = gql`
    query payments {
  payments {
    id
    amount
    txSignature
    tokenMint
    createdAt
  }
}
    `;

/**
 * __usePaymentsQuery__
 *
 * To run a query within a React component, call `usePaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePaymentsQuery(baseOptions?: Apollo.QueryHookOptions<PaymentsQuery, PaymentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaymentsQuery, PaymentsQueryVariables>(PaymentsDocument, options);
      }
export function usePaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaymentsQuery, PaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaymentsQuery, PaymentsQueryVariables>(PaymentsDocument, options);
        }
export function usePaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PaymentsQuery, PaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PaymentsQuery, PaymentsQueryVariables>(PaymentsDocument, options);
        }
export type PaymentsQueryHookResult = ReturnType<typeof usePaymentsQuery>;
export type PaymentsLazyQueryHookResult = ReturnType<typeof usePaymentsLazyQuery>;
export type PaymentsSuspenseQueryHookResult = ReturnType<typeof usePaymentsSuspenseQuery>;
export type PaymentsQueryResult = Apollo.QueryResult<PaymentsQuery, PaymentsQueryVariables>;
export const WebsiteRatingDocument = gql`
    query websiteRating($host: String!) {
  website(host: $host) {
    id
    host
    ratings {
      url
      httpsSupport
      noMixedContent
      hasDescription
      hasFavicon
      hasOgImage
      firstContentfulPaint
      largestContentfulPaint
      stableLoadTime
      fast3GLoadTime
      slow3GLoadTime
      webpUsage
      avifUsage
      cacheControlUsage
      compressionUsage
      accessibility {
        violationId
        impact
        description
        helpUrl
        help
        screenshots
      }
      overallScore
      createdAt
      measurement {
        id
        meta
      }
    }
  }
}
    `;

/**
 * __useWebsiteRatingQuery__
 *
 * To run a query within a React component, call `useWebsiteRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useWebsiteRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWebsiteRatingQuery({
 *   variables: {
 *      host: // value for 'host'
 *   },
 * });
 */
export function useWebsiteRatingQuery(baseOptions: Apollo.QueryHookOptions<WebsiteRatingQuery, WebsiteRatingQueryVariables> & ({ variables: WebsiteRatingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WebsiteRatingQuery, WebsiteRatingQueryVariables>(WebsiteRatingDocument, options);
      }
export function useWebsiteRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WebsiteRatingQuery, WebsiteRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WebsiteRatingQuery, WebsiteRatingQueryVariables>(WebsiteRatingDocument, options);
        }
export function useWebsiteRatingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WebsiteRatingQuery, WebsiteRatingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WebsiteRatingQuery, WebsiteRatingQueryVariables>(WebsiteRatingDocument, options);
        }
export type WebsiteRatingQueryHookResult = ReturnType<typeof useWebsiteRatingQuery>;
export type WebsiteRatingLazyQueryHookResult = ReturnType<typeof useWebsiteRatingLazyQuery>;
export type WebsiteRatingSuspenseQueryHookResult = ReturnType<typeof useWebsiteRatingSuspenseQuery>;
export type WebsiteRatingQueryResult = Apollo.QueryResult<WebsiteRatingQuery, WebsiteRatingQueryVariables>;
export const WebsitesDocument = gql`
    query websites($query: String, $order: WebsiteHostQueryOrder, $pagination: PaginationInput, $filter: WebsiteHostFilter) {
  websites(query: $query, order: $order, pagination: $pagination, filter: $filter) {
    id
    host
    ratings {
      overallScore
      createdAt
    }
    icon
    thumbnail
    title
    description
    rootMeasurement {
      id
      url
      redirect
    }
  }
}
    `;

/**
 * __useWebsitesQuery__
 *
 * To run a query within a React component, call `useWebsitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useWebsitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWebsitesQuery({
 *   variables: {
 *      query: // value for 'query'
 *      order: // value for 'order'
 *      pagination: // value for 'pagination'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useWebsitesQuery(baseOptions?: Apollo.QueryHookOptions<WebsitesQuery, WebsitesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WebsitesQuery, WebsitesQueryVariables>(WebsitesDocument, options);
      }
export function useWebsitesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WebsitesQuery, WebsitesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WebsitesQuery, WebsitesQueryVariables>(WebsitesDocument, options);
        }
export function useWebsitesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WebsitesQuery, WebsitesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WebsitesQuery, WebsitesQueryVariables>(WebsitesDocument, options);
        }
export type WebsitesQueryHookResult = ReturnType<typeof useWebsitesQuery>;
export type WebsitesLazyQueryHookResult = ReturnType<typeof useWebsitesLazyQuery>;
export type WebsitesSuspenseQueryHookResult = ReturnType<typeof useWebsitesSuspenseQuery>;
export type WebsitesQueryResult = Apollo.QueryResult<WebsitesQuery, WebsitesQueryVariables>;