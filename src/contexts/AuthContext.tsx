import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useWallet } from './WalletContext'

interface User {
  id: string
  walletAddress: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const addr = wallet.publicKey
      setUser({ id: addr, walletAddress: addr })
      setLoading(false)
    } else if (!wallet.connecting) {
      setUser(null)
      setLoading(false)
    }
  }, [wallet.connected, wallet.publicKey, wallet.connecting])

  const logout = async () => {
    await wallet.disconnect()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
