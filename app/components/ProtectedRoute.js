'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return
        if (!session) router.push('/auth/login')
    }, [session, status, router])

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    return children
}