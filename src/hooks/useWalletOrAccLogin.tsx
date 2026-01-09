import { AddressType, useModal, usePhantom } from '@phantom/react-sdk'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime'

import { useLoggedInQuery } from '../../generated/graphql'

export const useWalletOrAccLogin = () => {
  const navigate = useNavigate()
  const location = window.location
  const { data: loggedInQueryData } = useLoggedInQuery()
  const { open, isOpened } = useModal()
  const { isConnected, addresses } = usePhantom()

  useEffect(() => {
    if (loggedInQueryData?.loggedIn && !loggedInQueryData?.loggedIn.verified) {
      navigate('/auth/verify')
    }
    hideSplashScreen()
  }, [
    loggedInQueryData?.loggedIn,
    loggedInQueryData?.loggedIn.verified,
    navigate,
  ])

  const loginRedirect = useCallback(() => {
    localStorage.setItem(
      'postLoginRedirect',
      `${location.pathname}${location.search}`
    )
    navigate('/auth/login')
  }, [location.pathname, location.search, navigate])

  const login = useCallback(() => {
    if (!loggedInQueryData?.loggedIn) {
      loginRedirect()
    } else if (loggedInQueryData.loggedIn && !isConnected) {
      open()
    }
  }, [isConnected, loggedInQueryData?.loggedIn, loginRedirect, open])

  return {
    address:
      addresses.find((addr) => addr.addressType === AddressType.solana)
        ?.address || null,
    isOpened,
    isConnected: !!loggedInQueryData?.loggedIn && isConnected,
    isLoggedIn: !!loggedInQueryData?.loggedIn,
    login,
    loginRedirect,
    user: loggedInQueryData?.loggedIn,
  }
}
