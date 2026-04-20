import { Buffer as BufferPolyfill } from 'buffer'
globalThis.Buffer = globalThis.Buffer ?? BufferPolyfill

import { Theme } from '@radix-ui/themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { WalletContextProvider } from './contexts/WalletContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <WalletContextProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WalletContextProvider>
    </Theme>
  </StrictMode>,
)
