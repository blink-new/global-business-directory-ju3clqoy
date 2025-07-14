import { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { parseBusinessUrl } from '../utils/urlHelpers'
import BusinessDetail from './BusinessDetail'

export default function BusinessDetailSEO() {
  const { '*': catchAll } = useParams()
  const location = useLocation()
  const [businessId, setBusinessId] = useState<string | null>(null)

  useEffect(() => {
    // Parse the URL to extract business ID
    const parsed = parseBusinessUrl(location.pathname)
    if (parsed.businessId) {
      setBusinessId(parsed.businessId)
    } else if (catchAll) {
      // Handle direct business ID from catch-all route
      setBusinessId(catchAll)
    }
  }, [location.pathname, catchAll])

  if (!businessId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Business Not Found
          </h1>
          <p className="text-muted-foreground">
            The business you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  // Pass the extracted business ID to the original BusinessDetail component
  return <BusinessDetail businessId={businessId} />
}