import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { blink } from '../blink/client'

export default function LocationPage() {
  const { type, id } = useParams()
  const [location, setLocation] = useState<any>(null)
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  const loadLocationData = useCallback(async () => {
    if (!type || !id) return
    
    try {
      let locationData = null
      let businessesData = []

      // Load location based on type
      switch (type) {
        case 'country': {
          const countries = await blink.db.countries.list({ where: { id: id } })
          if (countries.length > 0) {
            locationData = countries[0]
            businessesData = await blink.db.business_listings.list({
              where: { 
                AND: [
                  { country_id: id },
                  { status: 'approved' }
                ]
              }
            })
          }
          break
        }
        case 'state': {
          const states = await blink.db.states.list({ where: { id: id } })
          if (states.length > 0) {
            locationData = states[0]
            businessesData = await blink.db.business_listings.list({
              where: { 
                AND: [
                  { state_id: id },
                  { status: 'approved' }
                ]
              }
            })
          }
          break
        }
        case 'city': {
          const cities = await blink.db.cities.list({ where: { id: id } })
          if (cities.length > 0) {
            locationData = cities[0]
            businessesData = await blink.db.business_listings.list({
              where: { 
                AND: [
                  { city_id: id },
                  { status: 'approved' }
                ]
              }
            })
          }
          break
        }
      }

      setLocation(locationData)
      setBusinesses(businessesData)
    } catch (error) {
      console.error('Error loading location data:', error)
    } finally {
      setLoading(false)
    }
  }, [type, id])

  useEffect(() => {
    loadLocationData()
  }, [loadLocationData])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Location Not Found
          </h1>
          <p className="text-muted-foreground">
            The location you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Businesses in {location.name}
          </h1>
          <p className="text-muted-foreground">
            Discover local businesses in {location.name}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {businesses.length} businesses found
          </p>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No businesses found
            </h3>
            <p className="text-muted-foreground">
              Be the first to add a business in {location.name}!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business: any) => (
              <Link
                key={business.id}
                to={`/business/${business.id}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {business.name}
                        </CardTitle>
                        {business.tagline && (
                          <p className="text-sm text-muted-foreground">
                            {business.tagline}
                          </p>
                        )}
                      </div>
                      {Number(business.is_featured) > 0 && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{business.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">4.8</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({business.view_count || 0} views)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}