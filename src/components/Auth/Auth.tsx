import React, { useEffect } from 'react'

import { Outlet, useLocation, useNavigate } from 'react-router'
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime'

import { motion } from 'framer-motion'
import { useLoggedInQuery } from '../../../generated/graphql'

export const Auth: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data } = useLoggedInQuery()

  useEffect(() => {
    if (data?.loggedIn && data.loggedIn.verified) {
      const redirect = localStorage.getItem('postLoginRedirect')
      if (redirect) {
        localStorage.removeItem('postLoginRedirect')
        navigate(redirect, { replace: true })
      } else if (!location.pathname.endsWith('/logout')) {
        navigate('/', { replace: true })
      }
    } else if (data?.loggedIn && !data.loggedIn.verified) {
      navigate('/auth/verify', { replace: true })
    }
    hideSplashScreen()
  }, [data?.loggedIn, navigate, location.pathname])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-4">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <img src="/turbine-wordmark.png" width="132px" className="mb-2" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="border rounded-lg p-8 w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
      <div
        className="bg-muted relative hidden lg:block overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(50, 205, 50, 0.6), green)',
        }}
      >
        <motion.h1
          className="relative mx-auto max-w-[560px] font-bold text-6xl text-center bg-clip-text bg-gradient-to-b from-green-800 to-green-600 text-transparent mt-8"
          animate={{
            opacity: [0.1, 0.5, 1, 0.1],
            top: [200, 120, 50, 0],
            transition: {
              repeat: Infinity,
              duration: 8,
              ease: 'linear',
            },
          }}
        >
          The future of the web is sustainable
        </motion.h1>
        <img
          src="/turbine-animation.svg"
          alt="Turbine animation"
          className="absolute inset-0 h-full w-full"
          style={{
            transform: 'translate(0%, 10%)',
          }}
        />
        <img
          src="/turbine-animation.svg"
          alt="Turbine animation"
          className="absolute inset-0 h-full w-full"
          style={{
            scale: 0.5,
            opacity: 0.7,
            transform: 'translate(50%, 50%)',
          }}
        />
        <img
          src="/turbine-animation.svg"
          alt="Turbine animation"
          className="absolute inset-0 h-full w-full"
          style={{
            scale: 0.5,
            opacity: 0.7,
            transform: 'translate(-50%, 50%)',
          }}
        />
      </div>
    </div>
  )
}
