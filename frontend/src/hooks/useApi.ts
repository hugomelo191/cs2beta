import { useState, useCallback } from 'react'
import { ApiResponse, ApiError, LoadingState } from '../types'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  onFinally?: () => void
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  execute: (...args: any[]) => Promise<void>
  reset: () => void
}

export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiCall(...args)
        
        if (response.success) {
          setData(response.data)
          options.onSuccess?.(response.data)
        } else {
          const apiError: ApiError = {
            message: response.message || 'Erro desconhecido',
            code: 'API_ERROR',
            details: response.errors
          }
          setError(apiError)
          options.onError?.(apiError)
        }
      } catch (err) {
        const apiError: ApiError = {
          message: err instanceof Error ? err.message : 'Erro de rede',
          code: 'NETWORK_ERROR'
        }
        setError(apiError)
        options.onError?.(apiError)
      } finally {
        setLoading(false)
        options.onFinally?.()
      }
    },
    [apiCall, options]
  )

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}

// Hook para operações CRUD
export function useCrudApi<T = any>(
  apiCall: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const api = useApi(apiCall, options)
  
  const create = useCallback(
    async (data: Partial<T>) => {
      await api.execute('POST', data)
    },
    [api]
  )

  const update = useCallback(
    async (id: string, data: Partial<T>) => {
      await api.execute('PUT', id, data)
    },
    [api]
  )

  const remove = useCallback(
    async (id: string) => {
      await api.execute('DELETE', id)
    },
    [api]
  )

  return {
    ...api,
    create,
    update,
    remove
  }
}

// Hook para listagem com paginação
export function usePaginatedApi<T = any>(
  apiCall: (page: number, limit: number, filters?: any) => Promise<ApiResponse<T[]>>,
  options: UseApiOptions<T[]> = {}
) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<any>({})
  const [hasMore, setHasMore] = useState(true)
  
  const api = useApi(apiCall, {
    ...options,
    onSuccess: (data) => {
      // Assumindo que a API retorna dados paginados
      setHasMore(data.length === limit)
      options.onSuccess?.(data)
    }
  })

  const fetchPage = useCallback(
    async (pageNum: number = 1, newFilters?: any) => {
      const newPage = pageNum
      const newFiltersData = newFilters || filters
      
      setPage(newPage)
      if (newFilters) {
        setFilters(newFiltersData)
      }
      
      await api.execute(newPage, limit, newFiltersData)
    },
    [api, limit, filters]
  )

  const nextPage = useCallback(() => {
    if (hasMore && !api.loading) {
      fetchPage(page + 1)
    }
  }, [fetchPage, page, hasMore, api.loading])

  const prevPage = useCallback(() => {
    if (page > 1 && !api.loading) {
      fetchPage(page - 1)
    }
  }, [fetchPage, page, api.loading])

  const refresh = useCallback(() => {
    fetchPage(1)
  }, [fetchPage])

  return {
    ...api,
    page,
    limit,
    filters,
    hasMore,
    setLimit,
    setFilters,
    fetchPage,
    nextPage,
    prevPage,
    refresh
  }
} 