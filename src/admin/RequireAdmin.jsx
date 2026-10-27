import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useApi } from '../context/ApiContext'

export default function RequireAdmin({ children }) {
  const location = useLocation()
  const { token, isAuthenticated, signOut } = useAdminAuth()
  const { checkAdminToken } = useApi()
  const [verified, setVerified] = useState(false)
  const [checking, setChecking] = useState(Boolean(isAuthenticated))

  useEffect(() => {
    let active = true

    if (!isAuthenticated || !token) {
      setVerified(false)
      setChecking(false)
      return () => { active = false }
    }

    setChecking(true)
    checkAdminToken(token)
      .then(() => {
        if (active) setVerified(true)
      })
      .catch(() => {
        if (!active) return
        setVerified(false)
        signOut()
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => { active = false }
  }, [token, isAuthenticated, checkAdminToken, signOut])

  if (!isAuthenticated || (!checking && !verified)) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0b1018] px-5 text-slate-100">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-white/20 border-t-[#e82634]" />
          <p className="mt-4 text-sm font-semibold">Verifying admin session…</p>
        </div>
      </main>
    )
  }

  return children
}
