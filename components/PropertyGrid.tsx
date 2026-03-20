import { RealEstate } from '@/lib/types'
import PropertyCard from './PropertyCard'
import PropertySkeleton from './PropertySkeleton'

interface PropertyGridProps {
  properties: RealEstate[]
  loading: boolean
  whatsappNumber?: string
}

export default function PropertyGrid({ properties, loading, whatsappNumber }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertySkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          whatsappNumber={whatsappNumber}
        />
      ))}
    </div>
  )
}
