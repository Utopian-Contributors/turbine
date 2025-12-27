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
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  help: Scalars['String']['output'];
  helpUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  impact: Scalars['String']['output'];
  screenshots?: Maybe<Array<Scalars['String']['output']>>;
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
  lastVersion?: Maybe<Version>;
  name: Scalars['String']['output'];
  repository?: Maybe<Scalars['String']['output']>;
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
  redirect?: Maybe<Scalars['String']['output']>;
  screenshots?: Maybe<Array<Scalars['String']['output']>>;
  status: MeasurementStatus;
  thumbnail?: Maybe<Scalars['String']['output']>;
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

export enum MeasurementStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export type Mutation = {
  __typename?: 'Mutation';
  createMeasurement?: Maybe<Measurement>;
  login?: Maybe<User>;
  logout?: Maybe<User>;
  refreshToken?: Maybe<User>;
  register?: Maybe<User>;
  resendVerificationCode?: Maybe<Scalars['Boolean']['output']>;
  resetPassword?: Maybe<Scalars['Boolean']['output']>;
  sendResetLink?: Maybe<Scalars['Boolean']['output']>;
  toggleFontIntegration?: Maybe<Font>;
  toggleIntegrateVersion?: Maybe<Version>;
  toggleIntegrateVersionFile?: Maybe<VersionFile>;
  verify?: Maybe<User>;
};


export type MutationCreateMeasurementArgs = {
  connection?: InputMaybe<ConnectionType>;
  device?: InputMaybe<DeviceType>;
  remeasure?: InputMaybe<Scalars['Boolean']['input']>;
  tokenMint?: InputMaybe<Scalars['String']['input']>;
  txSignature?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
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


export type MutationVerifyArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
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

export type Query = {
  __typename?: 'Query';
  bigLibraries?: Maybe<Array<Library>>;
  font?: Maybe<Font>;
  imagesToConvert: BundledImages;
  library?: Maybe<Library>;
  libraryUsage?: Maybe<LibraryUsage>;
  loggedIn: User;
  measurementDevices?: Maybe<Array<MeasurementDevice>>;
  measurementPrices?: Maybe<Array<MeasurementPrice>>;
  measurements?: Maybe<Array<Measurement>>;
  payments?: Maybe<Array<Payment>>;
  popularFonts?: Maybe<Array<Font>>;
  searchFonts?: Maybe<Array<Font>>;
  searchLibrary?: Maybe<Array<LibrarySearchResult>>;
  users?: Maybe<Array<Maybe<User>>>;
  versionFileIntegrations: VersionFileIntegrations;
  versionIntegrations: VersionIntegrations;
  versionUsage?: Maybe<Array<VersionUsage>>;
  website?: Maybe<WebsiteHost>;
  websites?: Maybe<Array<WebsiteHost>>;
};


export type QueryFontArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryImagesToConvertArgs = {
  url?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLibraryArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLibraryUsageArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeasurementsArgs = {
  url?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchFontsArgs = {
  term?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchLibraryArgs = {
  term?: InputMaybe<Scalars['String']['input']>;
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
  noMixedContent: Scalars['Boolean']['output'];
  overallScore: Scalars['Int']['output'];
  slow3GLoadTime?: Maybe<Scalars['Int']['output']>;
  stableLoadTime?: Maybe<Scalars['Int']['output']>;
  webpUsage: Array<Scalars['String']['output']>;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

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
  host: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  latestMeasurement?: Maybe<Measurement>;
  rating?: Maybe<Rating>;
};

export type LoggedInQueryVariables = Exact<{ [key: string]: never; }>;


export type LoggedInQuery = { __typename?: 'Query', loggedIn: { __typename?: 'User', id: string, email: string, name: string, role: Role, verified: boolean } };

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

export type FontQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type FontQuery = { __typename?: 'Query', font?: { __typename?: 'Font', id: string, name: string, category: FontCategory, tags: Array<string>, menu: string, integrated: boolean, variants: Array<string>, files: Array<{ __typename?: 'FontFile', variant: string, url: string }> } | null };

export type ToggleFontIntegrationMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ToggleFontIntegrationMutation = { __typename?: 'Mutation', toggleFontIntegration?: { __typename?: 'Font', id: string, integrated: boolean } | null };

export type PopularFontsQueryVariables = Exact<{ [key: string]: never; }>;


export type PopularFontsQuery = { __typename?: 'Query', popularFonts?: Array<{ __typename?: 'Font', id: string, name: string, menu: string, tags: Array<string>, category: FontCategory, integrated: boolean, publishedAt: any }> | null };

export type ImagesToConvertQueryVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type ImagesToConvertQuery = { __typename?: 'Query', imagesToConvert: { __typename?: 'BundledImages', desktop?: Array<{ __typename?: 'BundledFile', id: string, url: string, type: string, size?: string | null, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> | null, tablet?: Array<{ __typename?: 'BundledFile', id: string, url: string, type: string, size?: string | null, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> | null, mobile?: Array<{ __typename?: 'BundledFile', id: string, url: string, type: string, size?: string | null, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> | null } };

export type BundledImageFragment = { __typename?: 'BundledFile', id: string, url: string, type: string, size?: string | null, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null };

export type BigLibrariesQueryVariables = Exact<{ [key: string]: never; }>;


export type BigLibrariesQuery = { __typename?: 'Query', bigLibraries?: Array<{ __typename?: 'Library', id: string, name: string, description?: string | null, integrated?: boolean | null, homepage?: string | null, repository?: string | null, lastVersion?: { __typename?: 'Version', id: string, version: string } | null, versions: Array<{ __typename?: 'Version', id: string, version: string }> }> | null };

export type LibraryQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type LibraryQuery = { __typename?: 'Query', library?: { __typename?: 'Library', id: string, name: string, description?: string | null, homepage?: string | null, repository?: string | null, integrated?: boolean | null, lastVersion?: { __typename?: 'Version', version: string, size?: number | null, publishedAt: any } | null, versions: Array<{ __typename?: 'Version', version: string, publishedAt: any }> } | null };

export type LibraryUsageQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type LibraryUsageQuery = { __typename?: 'Query', libraryUsage?: { __typename?: 'LibraryUsage', downloads: string, bandwidth: { __typename?: 'LibraryBandwidth', total: string, rank: string }, prev: { __typename?: 'LibraryUsage', downloads: string, bandwidth: { __typename?: 'LibraryBandwidth', total: string, rank: string } } } | null };

export type VersionUsageQueryVariables = Exact<{
  library: Scalars['String']['input'];
}>;


export type VersionUsageQuery = { __typename?: 'Query', versionUsage?: Array<{ __typename?: 'VersionUsage', integrated: boolean, version: string, downloads: string }> | null };

export type VersionIntegrationsQueryVariables = Exact<{
  library: Scalars['String']['input'];
}>;


export type VersionIntegrationsQuery = { __typename?: 'Query', versionIntegrations: { __typename?: 'VersionIntegrations', integrated: Array<{ __typename?: 'Version', id: string, version: string, size?: number | null }>, popular: Array<{ __typename?: 'Version', id: string, version: string, size?: number | null }>, other: Array<{ __typename?: 'Version', id: string, version: string, size?: number | null }> } };

export type ToggleIntegrateVersionMutationVariables = Exact<{
  version: Scalars['String']['input'];
}>;


export type ToggleIntegrateVersionMutation = { __typename?: 'Mutation', toggleIntegrateVersion?: { __typename?: 'Version', id: string } | null };

export type VersionConfigFragment = { __typename?: 'VersionIntegrations', integrated: Array<{ __typename?: 'Version', id: string, version: string, size?: number | null }>, popular: Array<{ __typename?: 'Version', id: string, version: string, size?: number | null }>, other: Array<{ __typename?: 'Version', id: string, version: string, size?: number | null }> };

export type VersionFilesQueryVariables = Exact<{
  library: Scalars['String']['input'];
}>;


export type VersionFilesQuery = { __typename?: 'Query', versionFileIntegrations: { __typename?: 'VersionFileIntegrations', integrated: Array<{ __typename?: 'VersionFileUsage', bandwidth: string, file: { __typename?: 'VersionFile', id: string, path: string, integrated: boolean, version: { __typename?: 'Version', id: string, version: string } } }>, popular: Array<{ __typename?: 'VersionFileUsage', bandwidth: string, file: { __typename?: 'VersionFile', id: string, path: string, integrated: boolean, version: { __typename?: 'Version', id: string, version: string } } }> } };

export type ToggleIntegrateVersionFileMutationVariables = Exact<{
  versionFile: Scalars['String']['input'];
}>;


export type ToggleIntegrateVersionFileMutation = { __typename?: 'Mutation', toggleIntegrateVersionFile?: { __typename?: 'VersionFile', id: string } | null };

export type VersionFileConfigFragment = { __typename?: 'VersionFileIntegrations', integrated: Array<{ __typename?: 'VersionFileUsage', bandwidth: string, file: { __typename?: 'VersionFile', id: string, path: string, integrated: boolean, version: { __typename?: 'Version', id: string, version: string } } }>, popular: Array<{ __typename?: 'VersionFileUsage', bandwidth: string, file: { __typename?: 'VersionFile', id: string, path: string, integrated: boolean, version: { __typename?: 'Version', id: string, version: string } } }> };

export type VersionFileFragment = { __typename?: 'VersionFile', id: string, path: string, integrated: boolean, version: { __typename?: 'Version', id: string, version: string } };

export type MeasurementsQueryVariables = Exact<{
  url?: InputMaybe<Scalars['String']['input']>;
}>;


export type MeasurementsQuery = { __typename?: 'Query', measurements?: Array<{ __typename?: 'Measurement', id: string, url: string, redirect?: string | null, title?: string | null, description?: string | null, status: MeasurementStatus, elapsed?: number | null, screenshots?: Array<string> | null, connectionType: ConnectionType, icon?: string | null, thumbnail?: string | null, device: { __typename?: 'MeasurementDevice', id: string, type: DeviceType, width: number, height: number }, bundledFiles: Array<{ __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, cacheControl?: string | null, elapsed: number, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> }> | null };

export type MeasurementDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type MeasurementDevicesQuery = { __typename?: 'Query', measurementDevices?: Array<{ __typename?: 'MeasurementDevice', id: string, type: DeviceType, width: number, height: number }> | null };

export type CreateMeasurementMutationVariables = Exact<{
  url: Scalars['String']['input'];
  remeasure?: InputMaybe<Scalars['Boolean']['input']>;
  device?: InputMaybe<DeviceType>;
  connection?: InputMaybe<ConnectionType>;
  txSignature: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
  tokenMint: Scalars['String']['input'];
}>;


export type CreateMeasurementMutation = { __typename?: 'Mutation', createMeasurement?: { __typename?: 'Measurement', id: string, url: string, redirect?: string | null, title?: string | null, description?: string | null, status: MeasurementStatus, elapsed?: number | null, icon?: string | null, thumbnail?: string | null, bundledFiles: Array<{ __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, cacheControl?: string | null, elapsed: number, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> } | null };

export type MeasuredFileFragment = { __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, cacheControl?: string | null, elapsed: number, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null };

export type MeasurementPricesQueryVariables = Exact<{ [key: string]: never; }>;


export type MeasurementPricesQuery = { __typename?: 'Query', measurementPrices?: Array<{ __typename?: 'MeasurementPrice', tokenMint: string, amount: number }> | null };

export type WebsiteQueryVariables = Exact<{
  host: Scalars['String']['input'];
}>;


export type WebsiteQuery = { __typename?: 'Query', website?: { __typename?: 'WebsiteHost', id: string, host: string, rating?: { __typename?: 'Rating', overallScore: number, createdAt: any } | null } | null };

export type PaymentsQueryVariables = Exact<{ [key: string]: never; }>;


export type PaymentsQuery = { __typename?: 'Query', payments?: Array<{ __typename?: 'Payment', id: string, amount: number, txSignature: string, tokenMint: string, createdAt: any }> | null };

export type WebsiteRatingQueryVariables = Exact<{
  host: Scalars['String']['input'];
}>;


export type WebsiteRatingQuery = { __typename?: 'Query', website?: { __typename?: 'WebsiteHost', id: string, host: string, rating?: { __typename?: 'Rating', httpsSupport: boolean, noMixedContent: boolean, hasDescription: boolean, hasFavicon: boolean, hasOgImage: boolean, firstContentfulPaint?: number | null, largestContentfulPaint?: number | null, stableLoadTime?: number | null, fast3GLoadTime?: number | null, slow3GLoadTime?: number | null, webpUsage: Array<string>, avifUsage: Array<string>, cacheControlUsage: Array<string>, compressionUsage: Array<string>, overallScore: number, createdAt: any, accessibility: Array<{ __typename?: 'AccessibilityViolation', violationId: string, impact: string, description: string, helpUrl: string, help: string, screenshots?: Array<string> | null }> } | null } | null };

export type SearchLibraryQueryVariables = Exact<{
  term: Scalars['String']['input'];
}>;


export type SearchLibraryQuery = { __typename?: 'Query', searchLibrary?: Array<{ __typename?: 'LibrarySearchResult', name: string, description: string, latestVersion: string, integrated: boolean, homepage?: string | null, downloads: number, updated: string, repository?: string | null }> | null };

export type SearchFontsQueryVariables = Exact<{
  term: Scalars['String']['input'];
}>;


export type SearchFontsQuery = { __typename?: 'Query', searchFonts?: Array<{ __typename?: 'Font', id: string, name: string, menu: string, tags: Array<string>, category: FontCategory, integrated: boolean, publishedAt: any }> | null };

export type FontSearchResultFragment = { __typename?: 'Font', id: string, name: string, menu: string, tags: Array<string>, category: FontCategory, integrated: boolean, publishedAt: any };

export type WebsitesQueryVariables = Exact<{ [key: string]: never; }>;


export type WebsitesQuery = { __typename?: 'Query', websites?: Array<{ __typename?: 'WebsiteHost', id: string, host: string, rating?: { __typename?: 'Rating', overallScore: number, createdAt: any } | null, latestMeasurement?: { __typename?: 'Measurement', icon?: string | null, thumbnail?: string | null, description?: string | null, title?: string | null, url: string, redirect?: string | null } | null }> | null };

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
export const VersionConfigFragmentDoc = gql`
    fragment VersionConfig on VersionIntegrations {
  integrated {
    id
    version
    size
  }
  popular {
    id
    version
    size
  }
  other {
    id
    version
    size
  }
}
    `;
export const VersionFileFragmentDoc = gql`
    fragment VersionFile on VersionFile {
  id
  path
  integrated
  version {
    id
    version
  }
}
    `;
export const VersionFileConfigFragmentDoc = gql`
    fragment VersionFileConfig on VersionFileIntegrations {
  integrated {
    file {
      ...VersionFile
    }
    bandwidth
  }
  popular {
    file {
      ...VersionFile
    }
    bandwidth
  }
}
    ${VersionFileFragmentDoc}`;
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
export const FontSearchResultFragmentDoc = gql`
    fragment FontSearchResult on Font {
  id
  name
  menu
  tags
  category
  integrated
  publishedAt
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
export const FontDocument = gql`
    query font($name: String!) {
  font(name: $name) {
    id
    name
    category
    tags
    menu
    integrated
    variants
    files {
      variant
      url
    }
  }
}
    `;

/**
 * __useFontQuery__
 *
 * To run a query within a React component, call `useFontQuery` and pass it any options that fit your needs.
 * When your component renders, `useFontQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFontQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useFontQuery(baseOptions: Apollo.QueryHookOptions<FontQuery, FontQueryVariables> & ({ variables: FontQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FontQuery, FontQueryVariables>(FontDocument, options);
      }
export function useFontLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FontQuery, FontQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FontQuery, FontQueryVariables>(FontDocument, options);
        }
export function useFontSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FontQuery, FontQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FontQuery, FontQueryVariables>(FontDocument, options);
        }
export type FontQueryHookResult = ReturnType<typeof useFontQuery>;
export type FontLazyQueryHookResult = ReturnType<typeof useFontLazyQuery>;
export type FontSuspenseQueryHookResult = ReturnType<typeof useFontSuspenseQuery>;
export type FontQueryResult = Apollo.QueryResult<FontQuery, FontQueryVariables>;
export const ToggleFontIntegrationDocument = gql`
    mutation toggleFontIntegration($id: String!) {
  toggleFontIntegration(id: $id) {
    id
    integrated
  }
}
    `;
export type ToggleFontIntegrationMutationFn = Apollo.MutationFunction<ToggleFontIntegrationMutation, ToggleFontIntegrationMutationVariables>;

/**
 * __useToggleFontIntegrationMutation__
 *
 * To run a mutation, you first call `useToggleFontIntegrationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleFontIntegrationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleFontIntegrationMutation, { data, loading, error }] = useToggleFontIntegrationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useToggleFontIntegrationMutation(baseOptions?: Apollo.MutationHookOptions<ToggleFontIntegrationMutation, ToggleFontIntegrationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleFontIntegrationMutation, ToggleFontIntegrationMutationVariables>(ToggleFontIntegrationDocument, options);
      }
export type ToggleFontIntegrationMutationHookResult = ReturnType<typeof useToggleFontIntegrationMutation>;
export type ToggleFontIntegrationMutationResult = Apollo.MutationResult<ToggleFontIntegrationMutation>;
export type ToggleFontIntegrationMutationOptions = Apollo.BaseMutationOptions<ToggleFontIntegrationMutation, ToggleFontIntegrationMutationVariables>;
export const PopularFontsDocument = gql`
    query popularFonts {
  popularFonts {
    id
    name
    menu
    tags
    category
    integrated
    publishedAt
  }
}
    `;

/**
 * __usePopularFontsQuery__
 *
 * To run a query within a React component, call `usePopularFontsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePopularFontsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePopularFontsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePopularFontsQuery(baseOptions?: Apollo.QueryHookOptions<PopularFontsQuery, PopularFontsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PopularFontsQuery, PopularFontsQueryVariables>(PopularFontsDocument, options);
      }
export function usePopularFontsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PopularFontsQuery, PopularFontsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PopularFontsQuery, PopularFontsQueryVariables>(PopularFontsDocument, options);
        }
export function usePopularFontsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PopularFontsQuery, PopularFontsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PopularFontsQuery, PopularFontsQueryVariables>(PopularFontsDocument, options);
        }
export type PopularFontsQueryHookResult = ReturnType<typeof usePopularFontsQuery>;
export type PopularFontsLazyQueryHookResult = ReturnType<typeof usePopularFontsLazyQuery>;
export type PopularFontsSuspenseQueryHookResult = ReturnType<typeof usePopularFontsSuspenseQuery>;
export type PopularFontsQueryResult = Apollo.QueryResult<PopularFontsQuery, PopularFontsQueryVariables>;
export const ImagesToConvertDocument = gql`
    query imagesToConvert($url: String!) {
  imagesToConvert(url: $url) {
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
 *      url: // value for 'url'
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
export const BigLibrariesDocument = gql`
    query bigLibraries {
  bigLibraries {
    id
    name
    description
    integrated
    homepage
    repository
    integrated
    lastVersion {
      id
      version
    }
    versions {
      id
      version
    }
  }
}
    `;

/**
 * __useBigLibrariesQuery__
 *
 * To run a query within a React component, call `useBigLibrariesQuery` and pass it any options that fit your needs.
 * When your component renders, `useBigLibrariesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBigLibrariesQuery({
 *   variables: {
 *   },
 * });
 */
export function useBigLibrariesQuery(baseOptions?: Apollo.QueryHookOptions<BigLibrariesQuery, BigLibrariesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BigLibrariesQuery, BigLibrariesQueryVariables>(BigLibrariesDocument, options);
      }
export function useBigLibrariesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BigLibrariesQuery, BigLibrariesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BigLibrariesQuery, BigLibrariesQueryVariables>(BigLibrariesDocument, options);
        }
export function useBigLibrariesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BigLibrariesQuery, BigLibrariesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BigLibrariesQuery, BigLibrariesQueryVariables>(BigLibrariesDocument, options);
        }
export type BigLibrariesQueryHookResult = ReturnType<typeof useBigLibrariesQuery>;
export type BigLibrariesLazyQueryHookResult = ReturnType<typeof useBigLibrariesLazyQuery>;
export type BigLibrariesSuspenseQueryHookResult = ReturnType<typeof useBigLibrariesSuspenseQuery>;
export type BigLibrariesQueryResult = Apollo.QueryResult<BigLibrariesQuery, BigLibrariesQueryVariables>;
export const LibraryDocument = gql`
    query library($name: String!) {
  library(name: $name) {
    id
    name
    description
    homepage
    repository
    integrated
    lastVersion {
      version
      size
      publishedAt
    }
    versions {
      version
      publishedAt
    }
  }
}
    `;

/**
 * __useLibraryQuery__
 *
 * To run a query within a React component, call `useLibraryQuery` and pass it any options that fit your needs.
 * When your component renders, `useLibraryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLibraryQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useLibraryQuery(baseOptions: Apollo.QueryHookOptions<LibraryQuery, LibraryQueryVariables> & ({ variables: LibraryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LibraryQuery, LibraryQueryVariables>(LibraryDocument, options);
      }
export function useLibraryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LibraryQuery, LibraryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LibraryQuery, LibraryQueryVariables>(LibraryDocument, options);
        }
export function useLibrarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LibraryQuery, LibraryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LibraryQuery, LibraryQueryVariables>(LibraryDocument, options);
        }
export type LibraryQueryHookResult = ReturnType<typeof useLibraryQuery>;
export type LibraryLazyQueryHookResult = ReturnType<typeof useLibraryLazyQuery>;
export type LibrarySuspenseQueryHookResult = ReturnType<typeof useLibrarySuspenseQuery>;
export type LibraryQueryResult = Apollo.QueryResult<LibraryQuery, LibraryQueryVariables>;
export const LibraryUsageDocument = gql`
    query libraryUsage($name: String!) {
  libraryUsage(name: $name) {
    downloads
    bandwidth {
      total
      rank
    }
    prev {
      downloads
      bandwidth {
        total
        rank
      }
    }
  }
}
    `;

/**
 * __useLibraryUsageQuery__
 *
 * To run a query within a React component, call `useLibraryUsageQuery` and pass it any options that fit your needs.
 * When your component renders, `useLibraryUsageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLibraryUsageQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useLibraryUsageQuery(baseOptions: Apollo.QueryHookOptions<LibraryUsageQuery, LibraryUsageQueryVariables> & ({ variables: LibraryUsageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LibraryUsageQuery, LibraryUsageQueryVariables>(LibraryUsageDocument, options);
      }
export function useLibraryUsageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LibraryUsageQuery, LibraryUsageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LibraryUsageQuery, LibraryUsageQueryVariables>(LibraryUsageDocument, options);
        }
export function useLibraryUsageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LibraryUsageQuery, LibraryUsageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LibraryUsageQuery, LibraryUsageQueryVariables>(LibraryUsageDocument, options);
        }
export type LibraryUsageQueryHookResult = ReturnType<typeof useLibraryUsageQuery>;
export type LibraryUsageLazyQueryHookResult = ReturnType<typeof useLibraryUsageLazyQuery>;
export type LibraryUsageSuspenseQueryHookResult = ReturnType<typeof useLibraryUsageSuspenseQuery>;
export type LibraryUsageQueryResult = Apollo.QueryResult<LibraryUsageQuery, LibraryUsageQueryVariables>;
export const VersionUsageDocument = gql`
    query versionUsage($library: String!) {
  versionUsage(library: $library) {
    integrated
    version
    downloads
  }
}
    `;

/**
 * __useVersionUsageQuery__
 *
 * To run a query within a React component, call `useVersionUsageQuery` and pass it any options that fit your needs.
 * When your component renders, `useVersionUsageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVersionUsageQuery({
 *   variables: {
 *      library: // value for 'library'
 *   },
 * });
 */
export function useVersionUsageQuery(baseOptions: Apollo.QueryHookOptions<VersionUsageQuery, VersionUsageQueryVariables> & ({ variables: VersionUsageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VersionUsageQuery, VersionUsageQueryVariables>(VersionUsageDocument, options);
      }
export function useVersionUsageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VersionUsageQuery, VersionUsageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VersionUsageQuery, VersionUsageQueryVariables>(VersionUsageDocument, options);
        }
export function useVersionUsageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<VersionUsageQuery, VersionUsageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<VersionUsageQuery, VersionUsageQueryVariables>(VersionUsageDocument, options);
        }
export type VersionUsageQueryHookResult = ReturnType<typeof useVersionUsageQuery>;
export type VersionUsageLazyQueryHookResult = ReturnType<typeof useVersionUsageLazyQuery>;
export type VersionUsageSuspenseQueryHookResult = ReturnType<typeof useVersionUsageSuspenseQuery>;
export type VersionUsageQueryResult = Apollo.QueryResult<VersionUsageQuery, VersionUsageQueryVariables>;
export const VersionIntegrationsDocument = gql`
    query versionIntegrations($library: String!) {
  versionIntegrations(library: $library) {
    ...VersionConfig
  }
}
    ${VersionConfigFragmentDoc}`;

/**
 * __useVersionIntegrationsQuery__
 *
 * To run a query within a React component, call `useVersionIntegrationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVersionIntegrationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVersionIntegrationsQuery({
 *   variables: {
 *      library: // value for 'library'
 *   },
 * });
 */
export function useVersionIntegrationsQuery(baseOptions: Apollo.QueryHookOptions<VersionIntegrationsQuery, VersionIntegrationsQueryVariables> & ({ variables: VersionIntegrationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VersionIntegrationsQuery, VersionIntegrationsQueryVariables>(VersionIntegrationsDocument, options);
      }
export function useVersionIntegrationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VersionIntegrationsQuery, VersionIntegrationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VersionIntegrationsQuery, VersionIntegrationsQueryVariables>(VersionIntegrationsDocument, options);
        }
export function useVersionIntegrationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<VersionIntegrationsQuery, VersionIntegrationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<VersionIntegrationsQuery, VersionIntegrationsQueryVariables>(VersionIntegrationsDocument, options);
        }
export type VersionIntegrationsQueryHookResult = ReturnType<typeof useVersionIntegrationsQuery>;
export type VersionIntegrationsLazyQueryHookResult = ReturnType<typeof useVersionIntegrationsLazyQuery>;
export type VersionIntegrationsSuspenseQueryHookResult = ReturnType<typeof useVersionIntegrationsSuspenseQuery>;
export type VersionIntegrationsQueryResult = Apollo.QueryResult<VersionIntegrationsQuery, VersionIntegrationsQueryVariables>;
export const ToggleIntegrateVersionDocument = gql`
    mutation toggleIntegrateVersion($version: String!) {
  toggleIntegrateVersion(id: $version) {
    id
  }
}
    `;
export type ToggleIntegrateVersionMutationFn = Apollo.MutationFunction<ToggleIntegrateVersionMutation, ToggleIntegrateVersionMutationVariables>;

/**
 * __useToggleIntegrateVersionMutation__
 *
 * To run a mutation, you first call `useToggleIntegrateVersionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleIntegrateVersionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleIntegrateVersionMutation, { data, loading, error }] = useToggleIntegrateVersionMutation({
 *   variables: {
 *      version: // value for 'version'
 *   },
 * });
 */
export function useToggleIntegrateVersionMutation(baseOptions?: Apollo.MutationHookOptions<ToggleIntegrateVersionMutation, ToggleIntegrateVersionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleIntegrateVersionMutation, ToggleIntegrateVersionMutationVariables>(ToggleIntegrateVersionDocument, options);
      }
export type ToggleIntegrateVersionMutationHookResult = ReturnType<typeof useToggleIntegrateVersionMutation>;
export type ToggleIntegrateVersionMutationResult = Apollo.MutationResult<ToggleIntegrateVersionMutation>;
export type ToggleIntegrateVersionMutationOptions = Apollo.BaseMutationOptions<ToggleIntegrateVersionMutation, ToggleIntegrateVersionMutationVariables>;
export const VersionFilesDocument = gql`
    query versionFiles($library: String!) {
  versionFileIntegrations(library: $library) {
    ...VersionFileConfig
  }
}
    ${VersionFileConfigFragmentDoc}`;

/**
 * __useVersionFilesQuery__
 *
 * To run a query within a React component, call `useVersionFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useVersionFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVersionFilesQuery({
 *   variables: {
 *      library: // value for 'library'
 *   },
 * });
 */
export function useVersionFilesQuery(baseOptions: Apollo.QueryHookOptions<VersionFilesQuery, VersionFilesQueryVariables> & ({ variables: VersionFilesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VersionFilesQuery, VersionFilesQueryVariables>(VersionFilesDocument, options);
      }
export function useVersionFilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VersionFilesQuery, VersionFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VersionFilesQuery, VersionFilesQueryVariables>(VersionFilesDocument, options);
        }
export function useVersionFilesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<VersionFilesQuery, VersionFilesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<VersionFilesQuery, VersionFilesQueryVariables>(VersionFilesDocument, options);
        }
export type VersionFilesQueryHookResult = ReturnType<typeof useVersionFilesQuery>;
export type VersionFilesLazyQueryHookResult = ReturnType<typeof useVersionFilesLazyQuery>;
export type VersionFilesSuspenseQueryHookResult = ReturnType<typeof useVersionFilesSuspenseQuery>;
export type VersionFilesQueryResult = Apollo.QueryResult<VersionFilesQuery, VersionFilesQueryVariables>;
export const ToggleIntegrateVersionFileDocument = gql`
    mutation toggleIntegrateVersionFile($versionFile: String!) {
  toggleIntegrateVersionFile(id: $versionFile) {
    id
  }
}
    `;
export type ToggleIntegrateVersionFileMutationFn = Apollo.MutationFunction<ToggleIntegrateVersionFileMutation, ToggleIntegrateVersionFileMutationVariables>;

/**
 * __useToggleIntegrateVersionFileMutation__
 *
 * To run a mutation, you first call `useToggleIntegrateVersionFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleIntegrateVersionFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleIntegrateVersionFileMutation, { data, loading, error }] = useToggleIntegrateVersionFileMutation({
 *   variables: {
 *      versionFile: // value for 'versionFile'
 *   },
 * });
 */
export function useToggleIntegrateVersionFileMutation(baseOptions?: Apollo.MutationHookOptions<ToggleIntegrateVersionFileMutation, ToggleIntegrateVersionFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleIntegrateVersionFileMutation, ToggleIntegrateVersionFileMutationVariables>(ToggleIntegrateVersionFileDocument, options);
      }
export type ToggleIntegrateVersionFileMutationHookResult = ReturnType<typeof useToggleIntegrateVersionFileMutation>;
export type ToggleIntegrateVersionFileMutationResult = Apollo.MutationResult<ToggleIntegrateVersionFileMutation>;
export type ToggleIntegrateVersionFileMutationOptions = Apollo.BaseMutationOptions<ToggleIntegrateVersionFileMutation, ToggleIntegrateVersionFileMutationVariables>;
export const MeasurementsDocument = gql`
    query measurements($url: String) {
  measurements(url: $url) {
    id
    url
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
 *      url: // value for 'url'
 *   },
 * });
 */
export function useMeasurementsQuery(baseOptions?: Apollo.QueryHookOptions<MeasurementsQuery, MeasurementsQueryVariables>) {
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
    mutation createMeasurement($url: String!, $remeasure: Boolean, $device: DeviceType, $connection: ConnectionType, $txSignature: String!, $walletAddress: String!, $tokenMint: String!) {
  createMeasurement(
    url: $url
    remeasure: $remeasure
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
 *      remeasure: // value for 'remeasure'
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
    rating {
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
    rating {
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
export const SearchLibraryDocument = gql`
    query searchLibrary($term: String!) {
  searchLibrary(term: $term) {
    name
    description
    latestVersion
    integrated
    homepage
    downloads
    updated
    repository
  }
}
    `;

/**
 * __useSearchLibraryQuery__
 *
 * To run a query within a React component, call `useSearchLibraryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchLibraryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchLibraryQuery({
 *   variables: {
 *      term: // value for 'term'
 *   },
 * });
 */
export function useSearchLibraryQuery(baseOptions: Apollo.QueryHookOptions<SearchLibraryQuery, SearchLibraryQueryVariables> & ({ variables: SearchLibraryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchLibraryQuery, SearchLibraryQueryVariables>(SearchLibraryDocument, options);
      }
export function useSearchLibraryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchLibraryQuery, SearchLibraryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchLibraryQuery, SearchLibraryQueryVariables>(SearchLibraryDocument, options);
        }
export function useSearchLibrarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchLibraryQuery, SearchLibraryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchLibraryQuery, SearchLibraryQueryVariables>(SearchLibraryDocument, options);
        }
export type SearchLibraryQueryHookResult = ReturnType<typeof useSearchLibraryQuery>;
export type SearchLibraryLazyQueryHookResult = ReturnType<typeof useSearchLibraryLazyQuery>;
export type SearchLibrarySuspenseQueryHookResult = ReturnType<typeof useSearchLibrarySuspenseQuery>;
export type SearchLibraryQueryResult = Apollo.QueryResult<SearchLibraryQuery, SearchLibraryQueryVariables>;
export const SearchFontsDocument = gql`
    query searchFonts($term: String!) {
  searchFonts(term: $term) {
    ...FontSearchResult
  }
}
    ${FontSearchResultFragmentDoc}`;

/**
 * __useSearchFontsQuery__
 *
 * To run a query within a React component, call `useSearchFontsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchFontsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchFontsQuery({
 *   variables: {
 *      term: // value for 'term'
 *   },
 * });
 */
export function useSearchFontsQuery(baseOptions: Apollo.QueryHookOptions<SearchFontsQuery, SearchFontsQueryVariables> & ({ variables: SearchFontsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchFontsQuery, SearchFontsQueryVariables>(SearchFontsDocument, options);
      }
export function useSearchFontsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchFontsQuery, SearchFontsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchFontsQuery, SearchFontsQueryVariables>(SearchFontsDocument, options);
        }
export function useSearchFontsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchFontsQuery, SearchFontsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchFontsQuery, SearchFontsQueryVariables>(SearchFontsDocument, options);
        }
export type SearchFontsQueryHookResult = ReturnType<typeof useSearchFontsQuery>;
export type SearchFontsLazyQueryHookResult = ReturnType<typeof useSearchFontsLazyQuery>;
export type SearchFontsSuspenseQueryHookResult = ReturnType<typeof useSearchFontsSuspenseQuery>;
export type SearchFontsQueryResult = Apollo.QueryResult<SearchFontsQuery, SearchFontsQueryVariables>;
export const WebsitesDocument = gql`
    query websites {
  websites {
    id
    host
    rating {
      overallScore
      createdAt
    }
    latestMeasurement {
      icon
      thumbnail
      description
      title
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