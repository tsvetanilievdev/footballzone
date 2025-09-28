'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

// Simple test hook to verify React Query works
export function useTestQuery() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log('🔧 Client hydration completed!')
  }, [])

  console.log('🧪 useTestQuery hook called - isClient:', isClient)

  const query = useQuery({
    queryKey: ['test-simple'],
    queryFn: async () => {
      console.log('🚀 TEST QUERY FUNCTION EXECUTING!')
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('✅ TEST QUERY FUNCTION COMPLETED!')
      return { message: 'React Query is working!', timestamp: Date.now() }
    },
    staleTime: 0,
    gcTime: 0,
    enabled: isClient, // Only enable after client hydration
    networkMode: 'always' as const,
    refetchOnMount: true,
  })

  console.log('🔍 Test Query State:', {
    status: query.status,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
    error: query.error,
    enabled: isClient
  })

  return query
}