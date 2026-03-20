export type RealEstateType = 'APARTMENT' | 'HOUSE' | 'LAND' | 'COMMERCIAL' | 'OFFICE' | 'WAREHOUSE'
export type RealEstateListingType = 'SALE' | 'RENT' | 'SALE_OR_RENT'
export type RealEstateStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'RENTED' | 'INACTIVE'

export interface RealEstateImage { id: string; url: string; order: number }
export interface RealEstateFeature { id: string; feature: string }

export interface RealEstate {
  id: string; title: string; description: string | null
  type: RealEstateType; listingType: RealEstateListingType; status: RealEstateStatus
  area: number | null; landArea: number | null
  bedrooms: number | null; bathrooms: number | null; halfBathrooms: number | null
  parkingSpaces: number | null; floors: number | null; floor: number | null; age: number | null
  address: string | null; city: string | null; state: string | null; neighborhood: string | null
  latitude: number | null; longitude: number | null
  salePrice: number | null; rentPrice: number | null; maintenanceFee: number | null
  isNegotiable: boolean; agentName: string | null; stratum: number | null
  availableFrom: string | null; notes: string | null
  videoUrl: string | null; virtualTourUrl: string | null
  isPublished: boolean; businessId: string
  images: RealEstateImage[]; features: RealEstateFeature[]
  createdAt: string; updatedAt: string
}

export interface ListingsResponse { data: RealEstate[]; total: number; page: number; limit: number }

export interface Business {
  name: string
  logo: string | null
  description: string | null
  phone: string | null
  email: string | null
  website: string | null
  currency: string
}

export interface ListingFilters {
  listingType?: string; type?: string; city?: string; neighborhood?: string
  minPrice?: string; maxPrice?: string; bedrooms?: string; page?: number; limit?: number
}
