'use client'
import { useEffect, useState } from 'react'
import { getStudentSession } from '@/lib/student-auth'
import LandingGate from '@/components/LandingGate'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsLoggedIn(!!getStudentSession())
    setIsAdmin(localStorage.getItem('admin_session') === 'true')
    setChecking(false)

    const onAuth = () => setIsLoggedIn(!!getStudentSession())
    const onAdminAuth = () => setIsAdmin(localStorage.getItem('admin_session') === 'true')

    window.addEventListener('studentLoggedIn', onAuth)
    window.addEventListener('studentLoggedOut', onAuth)
    window.addEventListener('adminLoggedIn', onAdminAuth)
    window.addEventListener('adminLoggedOut', onAdminAuth)
    return () => {
      window.removeEventListener('studentLoggedIn', onAuth)
      window.removeEventListener('studentLoggedOut', onAuth)
      window.removeEventListener('adminLoggedIn', onAdminAuth)
      window.removeEventListener('adminLoggedOut', onAdminAuth)
    }
  }, [])

  useEffect(() => {
    if (!checking && (isLoggedIn || isAdmin)) {
      router.push('/job-updates')
    }
  }, [checking, isLoggedIn, isAdmin, router])

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )

  if (!isLoggedIn && !isAdmin) {
    return (
      <LandingGate
        onLogin={() => setIsLoggedIn(true)}
      />
    )
  }

  return null
}
