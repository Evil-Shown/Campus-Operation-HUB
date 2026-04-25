import { useEffect, useState } from 'react'
import { listResources } from '../api/resources'
import { useAuth } from '../context/AuthContext'

export default function useResources(filters = {}) {
  const { type, location, minCapacity } = filters
  const { apiBaseUrl, token } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchResources() {
      if (!apiBaseUrl || !token) {
        if (isMounted) {
          setResources([])
          setLoading(false)
        }
        return
      }

      try {
        if (isMounted) {
          setLoading(true)
          setError(null)
        }

        const data = await listResources({
          baseUrl: apiBaseUrl,
          token,
          type,
          location,
          minCapacity,
        })

        if (isMounted) {
          setResources(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load resources')
          setResources([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchResources()

    return () => {
      isMounted = false
    }
  }, [apiBaseUrl, token, type, location, minCapacity])

  return { resources, loading, error }
}
