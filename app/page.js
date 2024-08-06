'use client'

import { useSession } from 'next-auth/react'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SessionSwitcher } from './components/SessionSwitcher'

export default function Home() {
  const { data: session } = useSession()
  return (
    <ProtectedRoute>
      <h1>Welcome, {session?.user?.name}</h1>
      <SessionSwitcher />
    </ProtectedRoute>
  )
}
