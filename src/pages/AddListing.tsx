import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Label } from '../components/ui/label'
import { Checkbox } from '../components/ui/checkbox'
import { Upload, X, Clock, DollarSign, Users } from 'lucide-react'
import { blink } from '../blink/client'
import { useToast } from '../hooks/use-toast'

interface AddListingProps {
  user: any
}

interface BusinessHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

interface SocialMedia {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
}

export default function AddListing({ user }: AddListingProps) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    category_id: '',
    country_id: '',
    contact_person_name: '',
    specialties: '',
    price_range: '',
    established_year: '',
    employee_count: '',
    services: ''
  })

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: '9:00-17:00',
    tuesday: '9:00-17:00',
    wednesday: '9:00-17:00',
    thursday: '9:00-17:00',
    friday: '9:00-17:00',
    saturday: 'closed',
    sunday: 'closed'
  })

  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: ''
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  const [categories, setCategories] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const navigate = useNavigate()
  const { toast } = useToast()

  const loadFormData = useCallback(async () => {
    try {
      const [categoriesData, countriesData] = await Promise.all([
        blink.db.categories.list({ where: { is_approved: "1" } }),
        blink.db.countries.list({})
      ])
      setCategories(categoriesData)
      setCountries(countriesData)
    } catch (error) {
      console.error('Error loading form data:', error)
      toast({
        title: "Error",
        description: "Failed to load form data. Please refresh the page.",
        variant: "destructive"
      })
    }
  }, [toast])

  useEffect(() => {
    loadFormData()
  }, [loadFormData])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Logo must be less than 5MB",
          variant: "destructive"
        })
        return
      }
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (photoFiles.length + files.length > 10) {
      toast({
        title: "Too many photos",
        description: "Maximum 10 photos allowed",
        variant: "destructive"
      })
      return
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Maximum 5MB per photo.`,
          variant: "destructive"
        })
        return false
      }
      return true
    })

    setPhotoFiles(prev => [...prev, ...validFiles])
    
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview('')
  }

  const uploadFiles = async () => {
    const uploadedUrls: string[] = []
    let logoUrl = ''

    try {
      // Upload logo
      if (logoFile) {
        const { publicUrl } = await blink.storage.upload(
          logoFile,
          `business-logos/${Date.now()}-${logoFile.name}`,
          { upsert: true }
        )
        logoUrl = publicUrl
      }

      // Upload photos
      for (const file of photoFiles) {
        const { publicUrl } = await blink.storage.upload(
          file,
          `business-photos/${Date.now()}-${file.name}`,
          { upsert: true }
        )
        uploadedUrls.push(publicUrl)
      }

      return { logoUrl, photoUrls: uploadedUrls }
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Failed to upload files')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add a business listing.",
        variant: "destructive"
      })
      return
    }

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Business name is required.",
        variant: "destructive"
      })
      return
    }

    if (!formData.address.trim()) {
      toast({
        title: "Validation Error", 
        description: "Business address is required.",
        variant: "destructive"
      })
      return
    }

    if (!formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Please select a category.",
        variant: "destructive"
      })
      return
    }

    if (!formData.country_id) {
      toast({
        title: "Validation Error",
        description: "Please select a country.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setUploading(true)

    try {
      // Upload files first
      const { logoUrl, photoUrls } = await uploadFiles()
      
      // Generate unique ID
      const listingId = `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Prepare data for submission - ensure all fields match database schema
      const submissionData = {
        id: listingId,
        user_id: user.id,
        name: formData.name.trim(),
        tagline: formData.tagline.trim() || null,
        description: formData.description.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        address: formData.address.trim(),
        category_id: formData.category_id,
        country_id: formData.country_id,
        contact_person_name: formData.contact_person_name.trim() || null,
        specialties: formData.specialties.trim() || null,
        price_range: formData.price_range || null,
        established_year: formData.established_year ? parseInt(formData.established_year) : null,
        employee_count: formData.employee_count || null,
        services: formData.services.trim() || null,
        business_hours: JSON.stringify(businessHours),
        social_media: JSON.stringify(socialMedia),
        logo_url: logoUrl || null,
        photos: JSON.stringify(photoUrls),
        status: 'approved', // Auto-approve for demo
        is_featured: 0,
        view_count: 0,
        rating: 0.0,
        review_count: 0
      }

      console.log('Submitting data:', submissionData)

      await blink.db.business_listings.create(submissionData)

      toast({
        title: "Success!",
        description: "Your business listing has been created successfully!",
      })
      
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating listing:', error)
      toast({
        title: "Error",
        description: `Failed to create listing: ${error.message || 'Please try again.'}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Please Sign In
          </h1>
          <p className="text-muted-foreground mb-4">
            You need to be signed in to add a business listing.
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add Your Business
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below to add your business to our directory
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_person_name">Contact Person Name *</Label>
                    <Input
                      id="contact_person_name"
                      value={formData.contact_person_name}
                      onChange={(e) => setFormData({ ...formData, contact_person_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="A brief description of your business"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of your business"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="specialties">Specialties</Label>
                    <Input
                      id="specialties"
                      value={formData.specialties}
                      onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                      placeholder="e.g., Web Development, Mobile Apps"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full business address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country_id} onValueChange={(value) => setFormData({ ...formData, country_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country: any) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Business Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_range">Price Range</Label>
                    <Select value={formData.price_range} onValueChange={(value) => setFormData({ ...formData, price_range: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$">$</SelectItem>
                        <SelectItem value="$$">$$</SelectItem>
                        <SelectItem value="$$$">$$$</SelectItem>
                        <SelectItem value="$$$$">$$$$</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="established_year">Established Year</Label>
                    <Input
                      id="established_year"
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.established_year}
                      onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                      placeholder="e.g., 2010"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employee_count">Employee Count</Label>
                    <Select value={formData.employee_count} onValueChange={(value) => setFormData({ ...formData, employee_count: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Just me</SelectItem>
                        <SelectItem value="2-5">2-5 employees</SelectItem>
                        <SelectItem value="6-10">6-10 employees</SelectItem>
                        <SelectItem value="11-25">11-25 employees</SelectItem>
                        <SelectItem value="26-50">26-50 employees</SelectItem>
                        <SelectItem value="51-100">51-100 employees</SelectItem>
                        <SelectItem value="100+">100+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="services">Services/Products</Label>
                  <Textarea
                    id="services"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    placeholder="List your main services or products"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24 capitalize font-medium">
                      {day}
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={hours !== 'closed'}
                        onCheckedChange={(checked) => {
                          setBusinessHours(prev => ({
                            ...prev,
                            [day]: checked ? '9:00-17:00' : 'closed'
                          }))
                        }}
                      />
                      <span className="text-sm">Open</span>
                    </div>
                    {hours !== 'closed' && (
                      <Input
                        value={hours}
                        onChange={(e) => setBusinessHours(prev => ({ ...prev, [day]: e.target.value }))}
                        placeholder="9:00-17:00"
                        className="w-32"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={socialMedia.facebook}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, facebook: e.target.value }))}
                      placeholder="facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={socialMedia.instagram}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="instagram.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={socialMedia.twitter}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="twitter.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={socialMedia.linkedin}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="linkedin.com/company/yourcompany"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logo & Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Logo & Photos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <Label>Business Logo</Label>
                  <div className="mt-2">
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={removeLogo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <div className="mt-2">
                          <Label htmlFor="logo-upload" className="cursor-pointer text-primary hover:text-primary/80">
                            Upload Logo
                          </Label>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photos Upload */}
                <div>
                  <Label>Business Photos</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <div className="mt-2">
                        <Label htmlFor="photos-upload" className="cursor-pointer text-primary hover:text-primary/80">
                          Upload Photos
                        </Label>
                        <Input
                          id="photos-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 5MB each, max 10 photos
                      </p>
                    </div>

                    {photoPreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {photoPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => removePhoto(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (uploading ? 'Uploading...' : 'Submitting...') : 'Submit Listing'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}