import Link from 'next/link'
import { fetchListing } from '@/lib/api'
import { RealEstate } from '@/lib/types'
import { notFound } from 'next/navigation'

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(value)
}

function getListingBadge(listingType: string): { label: string; color: string } {
  switch (listingType) {
    case 'SALE': return { label: 'En Venta', color: '#009EE3' }
    case 'RENT': return { label: 'En Alquiler', color: '#63F5B0' }
    case 'SALE_OR_RENT': return { label: 'Venta o Alquiler', color: '#009EE3' }
    default: return { label: listingType, color: '#009EE3' }
  }
}

function getStatusBadge(status: string): { label: string; color: string } {
  switch (status) {
    case 'AVAILABLE': return { label: 'Disponible', color: '#10B981' }
    case 'RESERVED': return { label: 'Reservado', color: '#F59E0B' }
    case 'SOLD': return { label: 'Vendido', color: '#EF4444' }
    case 'RENTED': return { label: 'Alquilado', color: '#8B5CF6' }
    case 'INACTIVE': return { label: 'Inactivo', color: '#6B7280' }
    default: return { label: status, color: '#6B7280' }
  }
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    APARTMENT: 'Apartamento',
    HOUSE: 'Casa',
    LAND: 'Terreno',
    COMMERCIAL: 'Local Comercial',
    OFFICE: 'Oficina',
    WAREHOUSE: 'Bodega',
  }
  return labels[type] ?? type
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-2xl text-center">
      <div className="text-gray-400 mb-1">{icon}</div>
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  )
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let property: RealEstate
  try {
    property = await fetchListing(id)
  } catch {
    notFound()
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const waMessage = encodeURIComponent(`Hola Interurbana, me interesa la propiedad ${property.title}`)
  const waHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${waMessage}` : undefined

  const sortedImages = [...(property.images ?? [])].sort((a, b) => a.order - b.order)
  const mainImage = sortedImages[0]
  const thumbImages = sortedImages.slice(1)

  const listingBadge = getListingBadge(property.listingType)
  const statusBadge = getStatusBadge(property.status)

  const price = property.salePrice ?? property.rentPrice
  const isRent = !property.salePrice && property.rentPrice

  const locationParts = [property.address, property.neighborhood, property.city, property.state].filter(Boolean)

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Top nav */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: '#009EE3' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Volver al listado
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-16">
        {/* Image gallery */}
        <div className="mb-8">
          {mainImage ? (
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video md:aspect-[16/7] w-full">
              <img
                src={mainImage.url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-video md:aspect-[16/7] w-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" className="w-20 h-20 text-gray-200" aria-hidden="true">
                <path d="M32 4L4 28h8v28h16V40h8v16h16V28h8L32 4zm0 4.5L56 26h-4v28H40V38H24v16H12V26H8L32 8.5z" />
              </svg>
            </div>
          )}

          {/* Thumbnails */}
          {thumbImages.length > 0 && (
            <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
              {thumbImages.map((img) => (
                <div key={img.id} className="shrink-0 w-28 h-20 rounded-xl overflow-hidden bg-gray-100">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column — main content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: listingBadge.color }}
                >
                  {listingBadge.label}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: statusBadge.color }}
                >
                  {statusBadge.label}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  {getTypeLabel(property.type)}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                {property.title}
              </h1>
              {locationParts.length > 0 && (
                <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 text-gray-400" aria-hidden="true">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.326 3.5 8.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  {locationParts.join(', ')}
                </p>
              )}
            </div>

            {/* Key stats */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Características principales</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.bedrooms != null && (
                  <StatItem
                    label="Habitaciones"
                    value={property.bedrooms}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                      </svg>
                    }
                  />
                )}
                {property.bathrooms != null && (
                  <StatItem
                    label="Baños"
                    value={property.bathrooms}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path fillRule="evenodd" d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 11-9 0V4.125zm4.5 14.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                        <path d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-.75c0-1.036-.84-1.875-1.875-1.875h-.14l-5.395-12.454A1.875 1.875 0 0012.59 3.75H12a.75.75 0 000 1.5h.59c.144 0 .271.09.324.224l5.392 12.448H10.72a.75.75 0 000 1.5v2.25z" />
                      </svg>
                    }
                  />
                )}
                {property.area != null && (
                  <StatItem
                    label="Área"
                    value={`${property.area} m²`}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 6a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 11-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm-10.28-.53a.75.75 0 000 1.06l2.25 2.25a.75.75 0 101.06-1.06L8.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-2.25 2.25z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                )}
                {property.floor != null && (
                  <StatItem
                    label="Piso"
                    value={property.floor}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                )}
                {property.parkingSpaces != null && (
                  <StatItem
                    label="Parqueaderos"
                    value={property.parkingSpaces}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                        <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                        <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                      </svg>
                    }
                  />
                )}
                {property.age != null && (
                  <StatItem
                    label="Antigüedad"
                    value={`${property.age} año${property.age !== 1 ? 's' : ''}`}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                )}
                {property.landArea != null && (
                  <StatItem
                    label="Área terreno"
                    value={`${property.landArea} m²`}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                      </svg>
                    }
                  />
                )}
                {property.stratum != null && (
                  <StatItem
                    label="Estrato"
                    value={property.stratum}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                      </svg>
                    }
                  />
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h2>
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </div>
              </div>
            )}

            {/* Features / amenities */}
            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Características y amenidades</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f) => (
                    <span
                      key={f.id}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ backgroundColor: '#E0F7F0', color: '#0F7553' }}
                    >
                      {f.feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Ubicación</h2>
              <div className="space-y-1.5 text-sm text-gray-600">
                {property.address && (
                  <p><span className="font-medium text-gray-700">Dirección:</span> {property.address}</p>
                )}
                {property.neighborhood && (
                  <p><span className="font-medium text-gray-700">Barrio/Sector:</span> {property.neighborhood}</p>
                )}
                {property.city && (
                  <p><span className="font-medium text-gray-700">Ciudad:</span> {property.city}</p>
                )}
                {property.state && (
                  <p><span className="font-medium text-gray-700">Departamento/Estado:</span> {property.state}</p>
                )}
              </div>
            </div>

            {/* Additional info */}
            {(property.availableFrom || property.isNegotiable || property.notes) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Información adicional</h2>
                <div className="space-y-1.5 text-sm text-gray-600">
                  {property.isNegotiable && (
                    <p className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#63F5B0' }} />
                      Precio negociable
                    </p>
                  )}
                  {property.availableFrom && (
                    <p>
                      <span className="font-medium text-gray-700">Disponible desde:</span>{' '}
                      {new Date(property.availableFrom).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                  {property.maintenanceFee != null && (
                    <p>
                      <span className="font-medium text-gray-700">Cuota de mantenimiento:</span>{' '}
                      S/ {formatPrice(property.maintenanceFee)}/mes
                    </p>
                  )}
                  {property.notes && (
                    <p className="mt-2 text-gray-500 italic">{property.notes}</p>
                  )}
                </div>
              </div>
            )}

            {/* Video / Virtual tour */}
            {(property.videoUrl || property.virtualTourUrl) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Recorrido virtual</h2>
                <div className="flex flex-wrap gap-3">
                  {property.videoUrl && (
                    <a
                      href={property.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors hover:bg-gray-50"
                      style={{ borderColor: '#009EE3', color: '#009EE3' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                        <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                      </svg>
                      Ver video
                    </a>
                  )}
                  {property.virtualTourUrl && (
                    <a
                      href={property.virtualTourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors hover:bg-gray-50"
                      style={{ borderColor: '#009EE3', color: '#009EE3' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
                      </svg>
                      Tour virtual
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column — price & contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5">
                {/* Price */}
                {price != null ? (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {isRent ? 'Precio de alquiler' : 'Precio de venta'}
                    </p>
                    <p className="text-3xl font-bold" style={{ color: '#009EE3' }}>
                      S/ {formatPrice(price)}
                      {isRent && <span className="text-base font-normal text-gray-400">/mes</span>}
                    </p>
                    {property.isNegotiable && (
                      <p className="text-xs text-gray-400 mt-1">Precio negociable</p>
                    )}
                  </div>
                ) : (
                  <p className="text-lg text-gray-500">Consultar precio</p>
                )}

                {/* Show both prices if SALE_OR_RENT */}
                {property.listingType === 'SALE_OR_RENT' && property.salePrice && property.rentPrice && (
                  <div className="text-sm text-gray-600 -mt-2">
                    <p>Alquiler: <span className="font-semibold">S/ {formatPrice(property.rentPrice)}/mes</span></p>
                  </div>
                )}

                {/* Agent */}
                {property.agentName && (
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#009EE3' }}>
                      {property.agentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Agente</p>
                      <p className="font-medium text-gray-800 text-sm">{property.agentName}</p>
                    </div>
                  </div>
                )}

                {/* WhatsApp CTA */}
                {waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Me interesa esta propiedad
                  </a>
                )}

                <Link
                  href="/"
                  className="text-center text-sm font-medium py-3 rounded-xl border transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#009EE3', color: '#009EE3' }}
                >
                  Ver más propiedades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-100 mt-8">
        © {new Date().getFullYear()} Interurbana. Todos los derechos reservados.
      </footer>
    </div>
  )
}
