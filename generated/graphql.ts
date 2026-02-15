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

export enum DeviceType {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE',
  Tablet = 'TABLET'
}

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
  createMeasurement?: Maybe<Measurement>;
};


export type MutationCreateMeasurementArgs = {
  connection?: InputMaybe<ConnectionType>;
  device?: InputMaybe<DeviceType>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** Input type for pagination */
export type PaginationInput = {
  /** Number of items to skip */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to take */
  take?: InputMaybe<Scalars['Int']['input']>;
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
  imagesToConvert: BundledImages;
  latestMeasurements?: Maybe<Array<Measurement>>;
  measurement?: Maybe<Measurement>;
  measurementDevices?: Maybe<Array<MeasurementDevice>>;
  measurementStats?: Maybe<MeasurementStats>;
  measurements?: Maybe<Array<Measurement>>;
  proxyImage?: Maybe<ProxiedImage>;
  website?: Maybe<WebsiteHost>;
  websites?: Maybe<Array<WebsiteHost>>;
};


export type QueryImagesToConvertArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLatestMeasurementsArgs = {
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMeasurementArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeasurementsArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProxyImageArgs = {
  url: Scalars['String']['input'];
};


export type QueryWebsiteArgs = {
  host?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWebsitesArgs = {
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

export type WebsiteHost = {
  __typename?: 'WebsiteHost';
  description?: Maybe<Scalars['String']['output']>;
  host: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ratings?: Maybe<Array<Rating>>;
  rootMeasurement?: Maybe<Measurement>;
  title?: Maybe<Scalars['String']['output']>;
};

export enum WebsiteHostQueryOrder {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  HostAsc = 'HOST_ASC',
  HostDesc = 'HOST_DESC'
}

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


export type MeasurementsQuery = { __typename?: 'Query', measurements?: Array<{ __typename?: 'Measurement', id: string, url: string, redirect?: string | null, title?: string | null, description?: string | null, status: MeasurementStatus, elapsed?: number | null, screenshots: Array<string>, connectionType: ConnectionType, links: Array<string>, icon?: string | null, meta?: string | null, host?: { __typename?: 'WebsiteHost', id: string, host: string } | null, device: { __typename?: 'MeasurementDevice', id: string, type: DeviceType, width: number, height: number }, bundledFiles: Array<{ __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, cacheControl?: string | null, elapsed: number, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> }> | null };

export type MeasurementDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type MeasurementDevicesQuery = { __typename?: 'Query', measurementDevices?: Array<{ __typename?: 'MeasurementDevice', id: string, type: DeviceType, width: number, height: number }> | null };

export type CreateMeasurementMutationVariables = Exact<{
  url: Scalars['String']['input'];
  device?: InputMaybe<DeviceType>;
  connection?: InputMaybe<ConnectionType>;
}>;


export type CreateMeasurementMutation = { __typename?: 'Mutation', createMeasurement?: { __typename?: 'Measurement', id: string, url: string, redirect?: string | null, title?: string | null, description?: string | null, status: MeasurementStatus, elapsed?: number | null, icon?: string | null, bundledFiles: Array<{ __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, cacheControl?: string | null, elapsed: number, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null }> } | null };

export type MeasuredFileFragment = { __typename?: 'BundledFile', id: string, url: string, size?: string | null, type: string, cacheControl?: string | null, elapsed: number, width?: number | null, height?: number | null, clientWidth?: number | null, clientHeight?: number | null };

export type WebsiteQueryVariables = Exact<{
  host: Scalars['String']['input'];
}>;


export type WebsiteQuery = { __typename?: 'Query', website?: { __typename?: 'WebsiteHost', id: string, host: string, ratings?: Array<{ __typename?: 'Rating', url: string, overallScore: number, createdAt: any }> | null } | null };

export type MeasurementHistoryQueryVariables = Exact<{
  host: Scalars['String']['input'];
  path: Scalars['String']['input'];
}>;


export type MeasurementHistoryQuery = { __typename?: 'Query', measurements?: Array<{ __typename?: 'Measurement', id: string, url: string, redirect?: string | null, createdAt: any, status: MeasurementStatus, elapsed?: number | null, connectionType: ConnectionType, screenshots: Array<string>, largestContentfulPaint?: number | null, timeToInteractive?: number | null, device: { __typename?: 'MeasurementDevice', id: string, type: DeviceType }, bundledFiles: Array<{ __typename?: 'BundledFile', id: string, url: string, type: string, elapsed: number, size?: string | null }> }> | null };

export type WebsiteRatingQueryVariables = Exact<{
  host: Scalars['String']['input'];
}>;


export type WebsiteRatingQuery = { __typename?: 'Query', website?: { __typename?: 'WebsiteHost', id: string, host: string, ratings?: Array<{ __typename?: 'Rating', url: string, httpsSupport: boolean, noMixedContent: boolean, hasDescription: boolean, hasFavicon: boolean, hasOgImage: boolean, firstContentfulPaint?: number | null, largestContentfulPaint?: number | null, stableLoadTime?: number | null, fast3GLoadTime?: number | null, slow3GLoadTime?: number | null, webpUsage: Array<string>, avifUsage: Array<string>, cacheControlUsage: Array<string>, compressionUsage: Array<string>, overallScore: number, createdAt: any, accessibility: Array<{ __typename?: 'AccessibilityViolation', violationId: string, impact: string, description: string, helpUrl: string, help: string, screenshots: Array<string> }>, measurement?: { __typename?: 'Measurement', id: string, meta?: string | null } | null }> | null } | null };

export type WebsitesQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<WebsiteHostQueryOrder>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type WebsitesQuery = { __typename?: 'Query', websites?: Array<{ __typename?: 'WebsiteHost', id: string, host: string, icon?: string | null, title?: string | null, description?: string | null, ratings?: Array<{ __typename?: 'Rating', overallScore: number, createdAt: any }> | null, rootMeasurement?: { __typename?: 'Measurement', id: string, url: string, redirect?: string | null } | null }> | null };

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
    meta
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
    mutation createMeasurement($url: String!, $device: DeviceType, $connection: ConnectionType) {
  createMeasurement(url: $url, device: $device, connection: $connection) {
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
    query websites($query: String, $order: WebsiteHostQueryOrder, $pagination: PaginationInput) {
  websites(query: $query, order: $order, pagination: $pagination) {
    id
    host
    ratings {
      overallScore
      createdAt
    }
    icon
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