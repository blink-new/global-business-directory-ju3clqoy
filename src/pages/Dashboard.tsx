import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Edit, Trash2, BarChart3 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { blink } from '../blink/client'

interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  const loadUserBusinesses = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const data = await blink.db.business_listings.list({
        where: { user_id: user.id }
      })
      setBusinesses(data)
    } catch (error) {
      console.error('Error loading businesses:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadUserBusinesses()
  }, [loadUserBusinesses])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Please Sign In
          </h1>
          <p className="text-muted-foreground mb-4">
            You need to be signed in to access your dashboard.
          </p>
          <Button onClick={() => blink.auth.login()}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your business listings
            </p>
          </div>
          <Button asChild>
            <Link to="/add-listing">
              <Plus className="h-4 w-4 mr-2" />
              Add Business
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Listings
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businesses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businesses.reduce((sum: number, b: any) => sum + (b.view_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businesses.filter((b: any) => b.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Businesses List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't added any businesses yet.
                </p>
                <Button asChild>
                  <Link to="/add-listing">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Business
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.map((business: any) => (
                  <div key={business.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {business.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {business.address}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={
                          business.status === 'approved' ? 'default' :
                          business.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {business.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {business.view_count || 0} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/business/${business.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}