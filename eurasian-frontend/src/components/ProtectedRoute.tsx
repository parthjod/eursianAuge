'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '../contexts/UserContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only redirect if we're not loading, user is not authenticated, and we haven't redirected yet
    if (!isLoading && !user && !hasRedirected) {
      setHasRedirected(true)
      // Add redirect parameter to indicate where the user was trying to go
      const redirectUrl = `${redirectTo}?redirect=/dashboard`
      router.push(redirectUrl)
    }
  }, [user, isLoading, router, redirectTo, hasRedirected])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated and we haven't redirected yet, show nothing
  if (!user && !hasRedirected) {
    return null
  }

  // If user is not authenticated and we have redirected, show nothing
  if (!user) {
    return null
  }

  return <>{children}</>
}