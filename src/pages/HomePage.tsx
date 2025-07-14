import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Building2, Star, TrendingUp, Users, Globe, Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { blink } from '../blink/client'
import { generateBusinessUrl, generateCategoryUrl, generateLocationUrl } from '../utils/urlHelpers'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [categories, setCategories] = useState([])
  const [featuredBusinesses, setFeaturedBusinesses] = useState([])
  const [recentBusinesses, setRecentBusinesses] = useState([])
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalCategories: 0,
    totalCountries: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load categories - simplified query
      const categoriesData = await blink.db.categories.list({
        limit: 8
      })
      setCategories(categoriesData.filter((cat: any) => Number(cat.is_approved) > 0))

      // Load featured businesses - simplified query
      const businessesData = await blink.db.business_listings.list({
        limit: 50
      })
      const approvedBusinesses = businessesData.filter((business: any) => business.status === 'approved')
      
      const featuredBusinesses = approvedBusinesses.filter((business: any) => 
        Number(business.is_featured) > 0
      ).slice(0, 6)
      setFeaturedBusinesses(featuredBusinesses)

      // Load recent businesses (last 20 approved listings)
      const recentBusinesses = approvedBusinesses
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20)
      setRecentBusinesses(recentBusinesses)

      // Load stats - simplified queries
      const [allBusinesses, allCategories, allCountries] = await Promise.all([
        blink.db.business_listings.list({}),
        blink.db.categories.list({}),
        blink.db.countries.list({})
      ])

      const approvedBusinessesForStats = allBusinesses.filter((business: any) => business.status === 'approved')
      const approvedCategories = allCategories.filter((cat: any) => Number(cat.is_approved) > 0)

      setStats({
        totalBusinesses: approvedBusinessesForStats.length,
        totalCategories: approvedCategories.length,
        totalCountries: allCountries.length
      })
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (location.trim()) params.set('location', location.trim())
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Discover Businesses
              <span className="text-primary block">Worldwide</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The world's most comprehensive business directory. Find, connect, and grow with millions of businesses across the globe.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-lg shadow-lg border">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-0 focus-visible:ring-0 text-lg h-12"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Where?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 border-0 focus-visible:ring-0 text-lg h-12"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-8">
                  Search
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stats.totalBusinesses.toLocaleString()}+
                </div>
                <div className="text-muted-foreground">Businesses Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stats.totalCategories}+
                </div>
                <div className="text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stats.totalCountries}+
                </div>
                <div className="text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Popular Categories
            </h2>
            <p className="text-muted-foreground">
              Explore businesses by category
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/search">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      {featuredBusinesses.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Featured Businesses
              </h2>
              <p className="text-muted-foreground">
                Discover top-rated businesses in your area
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((business: any) => (
                <Link
                  key={business.id}
                  to={generateBusinessUrl(business.id)}
                  className="group block"
                >
                  <Card className="hover:shadow-lg transition-all duration-200 group-hover:scale-105 cursor-pointer">
                    {business.logo_url && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={business.logo_url}
                          alt={`${business.name} logo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
                            {business.name}
                          </CardTitle>
                          {business.tagline && (
                            <p className="text-sm text-muted-foreground">
                              {business.tagline}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">Featured</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{business.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium ml-1">
                              {business.rating > 0 ? business.rating.toFixed(1) : '4.8'}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({business.review_count || 0} reviews)
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {business.view_count || 0} views
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Listed Businesses */}
      {recentBusinesses.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Recently Listed Businesses
              </h2>
              <p className="text-muted-foreground">
                Discover the latest additions to our directory
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBusinesses.map((business: any) => (
                <Link
                  key={business.id}
                  to={generateBusinessUrl(business.id)}
                  className="group block"
                >
                  <Card className="hover:shadow-lg transition-all duration-200 group-hover:scale-105 cursor-pointer">
                    {business.logo_url && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={business.logo_url}
                          alt={`${business.name} logo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
                            {business.name}
                          </CardTitle>
                          {business.tagline && (
                            <p className="text-sm text-muted-foreground">
                              {business.tagline}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">New</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{business.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium ml-1">
                              {business.rating > 0 ? business.rating.toFixed(1) : '4.8'}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({business.review_count || 0} reviews)
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {business.view_count || 0} views
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Our Directory?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-muted-foreground">
                Connect with businesses from around the world in one comprehensive platform
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Boost Visibility</h3>
              <p className="text-muted-foreground">
                Increase your business visibility and reach more potential customers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-muted-foreground">
                Join a trusted community of verified businesses and satisfied customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  How do I add my business?
                </h3>
                <p className="text-muted-foreground">
                  Simply click "Add Your Business" and fill out our easy form. Your listing will be live within 24 hours.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Is listing my business free?
                </h3>
                <p className="text-muted-foreground">
                  Yes! Basic listings are completely free. We also offer premium features for enhanced visibility.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  How do reviews work?
                </h3>
                <p className="text-muted-foreground">
                  Customers can leave honest reviews and ratings. You can respond to reviews to engage with your customers.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Can I edit my listing?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely! You have full control to update your business information, photos, and details anytime.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  How do I get more visibility?
                </h3>
                <p className="text-muted-foreground">
                  Complete your profile, add photos, encourage reviews, and consider our premium featured listing options.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Is my data secure?
                </h3>
                <p className="text-muted-foreground">
                  Yes, we use industry-standard security measures and never sell your personal information to third parties.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/faq">View All FAQs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already listed in our directory
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/add-listing">
                <Plus className="h-5 w-5 mr-2" />
                Add Your Business
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/search">
                Explore Directory
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}