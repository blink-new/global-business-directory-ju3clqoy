import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Phone, Mail, Globe, Star, Clock, Share2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { blink } from '../blink/client'

interface BusinessDetailProps {
  businessId?: string
}

export default function BusinessDetail({ businessId: propBusinessId }: BusinessDetailProps) {
  const { id } = useParams()
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Use prop businessId if provided, otherwise use URL param
  const businessId = propBusinessId || id

  const loadBusiness = useCallback(async () => {
    if (!businessId) return
    
    try {
      const businesses = await blink.db.business_listings.list({
        where: { id: businessId }
      })
      
      if (businesses.length > 0) {
        setBusiness(businesses[0])
        // Increment view count
        await blink.db.business_listings.update(businessId, {
          view_count: (businesses[0].view_count || 0) + 1
        })
      }
    } catch (error) {
      console.error('Error loading business:', error)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  useEffect(() => {
    loadBusiness()
  }, [loadBusiness])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-muted rounded mb-6"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
              <div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-6">
              {business.logo_url && (
                <div className="flex-shrink-0">
                  <img
                    src={business.logo_url}
                    alt={`${business.name} logo`}
                    className="w-24 h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {business.name}
                </h1>
                {business.tagline && (
                  <p className="text-lg text-muted-foreground mb-2">
                    {business.tagline}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium ml-1">4.8</span>
                    <span className="text-muted-foreground ml-1">(24 reviews)</span>
                  </div>
                  <Badge variant="secondary">
                    {Number(business.is_featured) > 0 ? 'Featured' : 'Verified'}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{business.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {business.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            {business.services && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {business.services.split(',').map((service: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>{service.trim()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specialties */}
            {business.specialties && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {business.specialties.split(',').map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {specialty.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review this business!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${business.phone}`}
                      className="text-primary hover:underline"
                    >
                      {business.phone}
                    </a>
                  </div>
                )}
                
                {business.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${business.email}`}
                      className="text-primary hover:underline"
                    >
                      {business.email}
                    </a>
                  </div>
                )}
                
                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                <Separator />

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{business.address}</span>
                </div>

                <Separator />

                {business.contact_person_name && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Contact Person:</span>
                    <span className="text-sm">{business.contact_person_name}</span>
                  </div>
                )}

                {business.price_range && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Price Range:</span>
                    <span className="text-sm">{business.price_range}</span>
                  </div>
                )}

                {business.established_year && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Established:</span>
                    <span className="text-sm">{business.established_year}</span>
                  </div>
                )}

                {business.employee_count && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Team Size:</span>
                    <span className="text-sm">{business.employee_count}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {business.business_hours ? (
                  <div className="space-y-2">
                    {Object.entries(JSON.parse(business.business_hours)).map(([day, hours]: [string, any]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{day}</span>
                        <span className={hours === 'closed' ? 'text-muted-foreground' : 'text-foreground'}>
                          {hours === 'closed' ? 'Closed' : hours}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Hours not specified
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}