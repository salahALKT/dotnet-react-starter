import { createContext, useContext, useState, useEffect, useRef } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const refreshPromiseRef = useRef(null)

  useEffect(() => {
    const checkAndRefresh = async () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        // If a refresh operation is already in progress, wait for it
        if (refreshPromiseRef.current) {
          await refreshPromiseRef.current
        } else {
          // Start a new refresh operation and store the promise
          refreshPromiseRef.current = refreshToken()
          try {
            await refreshPromiseRef.current
          } finally {
            // Clear the ref when done
            refreshPromiseRef.current = null
          }
        }
      }
      
      setLoading(false)
    }

    checkAndRefresh()
  }, [])

  const login = async (userName, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
      })

      if (!response.ok) throw new Error('Login failed')

      const data = await response.json()
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      const userResponse = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      if (!userResponse.ok) throw new Error('Failed to fetch user info')
      const userData = await userResponse.json()
      
      setUser(userData)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const refreshToken = async () => {
    try {
      const accessToken = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken || !accessToken) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth/token/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken ,refreshToken }),
      })

      if (!response.ok) throw new Error('Token refresh failed')

      const data = await response.json()
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      const userResponse = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
      if (!userResponse.ok) throw new Error('Failed to fetch user info')
      const userData = await userResponse.json()
      setUser(userData)
    } catch (error) {
      console.error('Token refresh error:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}