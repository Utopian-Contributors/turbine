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

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
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
  homepage: Scalars['String']['output'];
  /** Whether the library is integrated */
  integrated: Scalars['Boolean']['output'];
  /** Latest version of the library */
  latestVersion: Scalars['String']['output'];
  /** Name of the library */
  name: Scalars['String']['output'];
  /** Repository URL of the library */
  repository: Scalars['String']['output'];
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

export type Mutation = {
  __typename?: 'Mutation';
  integrateVersion?: Maybe<Version>;
  login?: Maybe<User>;
  logout?: Maybe<User>;
  refreshToken?: Maybe<User>;
  register?: Maybe<User>;
  resendVerificationCode?: Maybe<Scalars['Boolean']['output']>;
  resetPassword?: Maybe<Scalars['Boolean']['output']>;
  sendResetLink?: Maybe<Scalars['Boolean']['output']>;
  verify?: Maybe<User>;
};


export type MutationIntegrateVersionArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
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


export type MutationVerifyArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  library?: Maybe<Library>;
  libraryUsage?: Maybe<LibraryUsage>;
  loggedIn: User;
  searchLibrary?: Maybe<Array<LibrarySearchResult>>;
  users?: Maybe<Array<Maybe<User>>>;
  versionIntegrations: VersionIntegrations;
  versionUsage?: Maybe<Array<VersionUsage>>;
};


export type QueryLibraryArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLibraryUsageArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchLibraryArgs = {
  term?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVersionIntegrationsArgs = {
  library?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVersionUsageArgs = {
  library?: InputMaybe<Scalars['String']['input']>;
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
  /** Bandwidth used by this version in bytes */
  bandwidth: Scalars['String']['output'];
  /** The version string */
  version: Scalars['String']['output'];
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

export type LibraryQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type LibraryQuery = { __typename?: 'Query', library?: { __typename?: 'Library', id: string, name: string, description?: string | null, homepage?: string | null, repository?: string | null, integrated?: boolean | null, lastVersion?: { __typename?: 'Version', version: string, publishedAt: any } | null, versions: Array<{ __typename?: 'Version', version: string, publishedAt: any }> } | null };

export type LibraryUsageQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type LibraryUsageQuery = { __typename?: 'Query', libraryUsage?: { __typename?: 'LibraryUsage', downloads: string, bandwidth: { __typename?: 'LibraryBandwidth', total: string, rank: string }, prev: { __typename?: 'LibraryUsage', downloads: string, bandwidth: { __typename?: 'LibraryBandwidth', total: string, rank: string } } } | null };

export type VersionUsageQueryVariables = Exact<{
  library: Scalars['String']['input'];
}>;


export type VersionUsageQuery = { __typename?: 'Query', versionUsage?: Array<{ __typename?: 'VersionUsage', version: string, bandwidth: string }> | null };

export type VersionIntegrationsQueryVariables = Exact<{
  library: Scalars['String']['input'];
}>;


export type VersionIntegrationsQuery = { __typename?: 'Query', versionIntegrations: { __typename?: 'VersionIntegrations', integrated: Array<{ __typename?: 'Version', id: string, version: string }>, popular: Array<{ __typename?: 'Version', id: string, version: string }>, other: Array<{ __typename?: 'Version', id: string, version: string }> } };

export type IntegrateVersionMutationVariables = Exact<{
  version: Scalars['String']['input'];
}>;


export type IntegrateVersionMutation = { __typename?: 'Mutation', integrateVersion?: { __typename?: 'Version', id: string } | null };

export type VersionConfigFragment = { __typename?: 'VersionIntegrations', integrated: Array<{ __typename?: 'Version', id: string, version: string }>, popular: Array<{ __typename?: 'Version', id: string, version: string }>, other: Array<{ __typename?: 'Version', id: string, version: string }> };

export type SearchLibraryQueryVariables = Exact<{
  term: Scalars['String']['input'];
}>;


export type SearchLibraryQuery = { __typename?: 'Query', searchLibrary?: Array<{ __typename?: 'LibrarySearchResult', name: string, description: string, latestVersion: string, integrated: boolean, homepage: string, downloads: number, updated: string, repository: string }> | null };

export const VersionConfigFragmentDoc = gql`
    fragment VersionConfig on VersionIntegrations {
  integrated {
    id
    version
  }
  popular {
    id
    version
  }
  other {
    id
    version
  }
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
    version
    bandwidth
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
export const IntegrateVersionDocument = gql`
    mutation integrateVersion($version: String!) {
  integrateVersion(id: $version) {
    id
  }
}
    `;
export type IntegrateVersionMutationFn = Apollo.MutationFunction<IntegrateVersionMutation, IntegrateVersionMutationVariables>;

/**
 * __useIntegrateVersionMutation__
 *
 * To run a mutation, you first call `useIntegrateVersionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIntegrateVersionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [integrateVersionMutation, { data, loading, error }] = useIntegrateVersionMutation({
 *   variables: {
 *      version: // value for 'version'
 *   },
 * });
 */
export function useIntegrateVersionMutation(baseOptions?: Apollo.MutationHookOptions<IntegrateVersionMutation, IntegrateVersionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<IntegrateVersionMutation, IntegrateVersionMutationVariables>(IntegrateVersionDocument, options);
      }
export type IntegrateVersionMutationHookResult = ReturnType<typeof useIntegrateVersionMutation>;
export type IntegrateVersionMutationResult = Apollo.MutationResult<IntegrateVersionMutation>;
export type IntegrateVersionMutationOptions = Apollo.BaseMutationOptions<IntegrateVersionMutation, IntegrateVersionMutationVariables>;
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