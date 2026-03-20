import { Business, ListingFilters, ListingsResponse, RealEstate } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const BUSINESS_ID = process.env.NEXT_PUBLIC_BUSINESS_ID

export async function fetchListings(filters: ListingFilters = {}): Promise<ListingsResponse> {
  const params = new URLSearchParams({ businessId: BUSINESS_ID!, page: String(filters.page ?? 1), limit: String(filters.limit ?? 9) })
  if (filters.listingType) params.set('listingType', filters.listingType)
  if (filters.type) params.set('type', filters.type)
  if (filters.city) params.set('city', filters.city)
  if (filters.neighborhood) params.set('neighborhood', filters.neighborhood)
  if (filters.minPrice) params.set('minPrice', filters.minPrice)
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
  if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
  const res = await fetch(`${API_URL}/v1/storefront/real-estate?${params}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch listings')
  return res.json()
}

export async function fetchBusiness(): Promise<Business> {
  const res = await fetch(`${API_URL}/v1/storefront/business?businessId=${BUSINESS_ID}`, { cache: 'force-cache' })
  if (!res.ok) throw new Error('Failed to fetch business')
  return res.json()
}

export async function fetchListing(id: string): Promise<RealEstate> {
  const res = await fetch(`${API_URL}/v1/storefront/real-estate/${id}?businessId=${BUSINESS_ID}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch listing')
  return res.json()
}
