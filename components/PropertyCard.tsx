import Link from 'next/link'
import { RealEstate } from '@/lib/types'

interface PropertyCardProps {
  property: RealEstate
  whatsappNumber?: string
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(value)
}

function getListingLabel(listingType: string): { label: string; color: string } {
  switch (listingType) {
    case 'SALE': return { label: 'En Venta', color: '#009EE3' }
    case 'RENT': return { label: 'En Alquiler', color: '#63F5B0' }
    case 'SALE_OR_RENT': return { label: 'Venta o Alquiler', color: '#009EE3' }
    default: return { label: listingType, color: '#009EE3' }
  }
}

function getStatusLabel(status: string): { label: string; color: string } | null {
  switch (status) {
    case 'RESERVED': return { label: 'Reservado', color: '#F59E0B' }
    case 'SOLD': return { label: 'Vendido', color: '#EF4444' }
    case 'RENTED': return { label: 'Alquilado', color: '#8B5CF6' }
    case 'INACTIVE': return { label: 'Inactivo', color: '#6B7280' }
    default: return null
  }
}

function HousePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className="w-16 h-16 text-gray-300"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M32 4L4 28h8v28h16V40h8v16h16V28h8L32 4zm0 4.5L56 26h-4v28H40V38H24v16H12V26H8L32 8.5z" />
      </svg>
    </div>
  )
}

export default function PropertyCard({ property, whatsappNumber }: PropertyCardProps) {
  const sortedImages = [...(property.images ?? [])].sort((a, b) => a.order - b.order)
  const firstImage = sortedImages[0]

  const listing = getListingLabel(property.listingType)
  const statusBadge = getStatusLabel(property.status)

  const price = property.salePrice ?? property.rentPrice
  const isRent = !property.salePrice && property.rentPrice

  const waMessage = encodeURIComponent(`Hola Interurbana, me interesa la propiedad ${property.title}`)
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${waMessage}`
    : undefined

  const location = [property.neighborhood, property.city].filter(Boolean).join(', ')

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={property.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <HousePlaceholder />
        )}

        {/* Listing type badge */}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: listing.color }}
        >
          {listing.label}
        </span>

        {/* Status badge (only if not AVAILABLE) */}
        {statusBadge && (
          <span
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: statusBadge.color }}
          >
            {statusBadge.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-gray-900 truncate text-base leading-snug">
          {property.title}
        </h3>

        {location && (
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0 text-gray-400" aria-hidden="true">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.326 3.5 8.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{location}</span>
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400" aria-hidden="true">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              {property.bedrooms} hab.
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400" aria-hidden="true">
                <path fillRule="evenodd" d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 11-9 0V4.125zm4.5 14.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                <path d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-.75c0-1.036-.84-1.875-1.875-1.875h-.14l-5.395-12.454A1.875 1.875 0 0012.59 3.75H12a.75.75 0 000 1.5h.59c.144 0 .271.09.324.224l5.392 12.448H10.72a.75.75 0 000 1.5v2.25z" />
              </svg>
              {property.bathrooms} baños
            </span>
          )}
          {property.area != null && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400" aria-hidden="true">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 6a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 11-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm-10.28-.53a.75.75 0 000 1.06l2.25 2.25a.75.75 0 101.06-1.06L8.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-2.25 2.25z" clipRule="evenodd" />
              </svg>
              {property.area} m²
            </span>
          )}
        </div>

        {/* Price */}
        {price != null && (
          <p className="text-lg font-bold mt-1" style={{ color: '#009EE3' }}>
            S/ {formatPrice(price)}
            {isRent && <span className="text-sm font-normal text-gray-500">/mes</span>}
          </p>
        )}

        {/* Footer actions */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
          <Link
            href={`/property/${property.id}`}
            className="flex-1 text-center px-3 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#009EE3', color: '#009EE3' }}
          >
            Ver más
          </Link>

          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}
              aria-label="Contactar por WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
