import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

type ThemePreference = 'system' | 'light' | 'dark'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: ResolvedTheme
  themePreference: ThemePreference
  setThemePreference: (pref: ThemePreference) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem('theme-preference') as ThemePreference | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
    // Migrate old 'theme' key
    const legacy = localStorage.getItem('theme') as ResolvedTheme | null
    if (legacy === 'light' || legacy === 'dark') return legacy
    return 'system'
  })

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  const theme: ResolvedTheme = themePreference === 'system' ? systemTheme : themePreference

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const setThemePreference = useCallback((pref: ThemePreference) => {
    setThemePreferenceState(pref)
    localStorage.setItem('theme-preference', pref)
  }, [])

  const toggle = useCallback(() => {
    setThemePreference(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setThemePreference])

  return (
    <ThemeContext.Provider value={{ theme, themePreference, setThemePreference, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
