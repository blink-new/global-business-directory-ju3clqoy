// URL helper functions for SEO-friendly business listing URLs

export function createBusinessSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function createCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function createLocationSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateBusinessUrl(businessId: string, business?: any, category?: any, location?: any): string {
  // For now, use simple business ID URL until we have full category/location data
  return `/business/${businessId}`
}

export function generateCategoryUrl(categorySlug: string): string {
  if (categorySlug === 'all') {
    return '/search'
  }
  return `/category/${categorySlug}`
}

export function generateLocationUrl(locationType: string, locationId: string): string {
  return `/location/${locationType}/${locationId}`
}

export function parseBusinessUrl(pathname: string): { businessId?: string, categorySlug?: string, locationSlug?: string, businessSlug?: string } {
  // Handle new SEO URL format: /category/location/business-name-id
  const seoPattern = /^\/([^/]+)\/([^/]+)\/(.+)-([^-]+)$/
  const seoMatch = pathname.match(seoPattern)
  if (seoMatch) {
    return {
      categorySlug: seoMatch[1],
      locationSlug: seoMatch[2], 
      businessSlug: seoMatch[3],
      businessId: seoMatch[4]
    }
  }
  
  // Handle legacy URL format: /business/id
  const legacyPattern = /^\/business\/(.+)$/
  const legacyMatch = pathname.match(legacyPattern)
  if (legacyMatch) {
    return {
      businessId: legacyMatch[1]
    }
  }
  
  return {}
}