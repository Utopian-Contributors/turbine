import React, { useEffect } from 'react'

import { Link } from 'react-router'
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime'

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    hideSplashScreen()
  }, [])

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
      <div className="w-full max-w-md mx-auto text-center space-y-4">
        <h1>404</h1>
        <p>The page that you tried to access does not exist.</p>
        <Link to={'/'}>Return to home</Link>
      </div>
    </div>
  )
}
