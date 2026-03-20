'use client'

import { useEffect, useState, useCallback } from 'react'
import { fetchListings } from '@/lib/api'
import { ListingFilters, RealEstate } from '@/lib/types'
import HeroSearch from './HeroSearch'
import PropertyGrid from './PropertyGrid'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Apartamento',
  HOUSE: 'Casa',
  LAND: 'Terreno',
  COMMERCIAL: 'Local Comercial',
  OFFICE: 'Oficina',
  WAREHOUSE: 'Bodega',
}

const LISTING_TYPE_LABELS: Record<string, string> = {
  SALE: 'Venta',
  RENT: 'Alquiler',
  SALE_OR_RENT: 'Venta o Alquiler',
}

export default function ListingsPage() {
  const [filters, setFilters] = useState<ListingFilters>({ page: 1, limit: 9 })
  const [listings, setListings] = useState<RealEstate[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentPage = filters.page ?? 1
  const limit = filters.limit ?? 9
  const totalPages = Math.ceil(total / limit)

  const loadListings = useCallback(async (activeFilters: ListingFilters) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchListings(activeFilters)
      setListings(result.data)
      setTotal(result.total)
    } catch {
      setError('No se pudieron cargar las propiedades. Por favor intenta de nuevo.')
      setListings([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadListings(filters)
  }, [filters, loadListings])

  function handleSearch(newFilters: ListingFilters) {
    setFilters({ ...newFilters, page: 1, limit: 9 })
  }

  function handleFilterChange(key: keyof ListingFilters, value: string) {
    setFilters(prev => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  function handlePageChange(newPage: number) {
    setFilters(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSearch onSearch={handleSearch} initialFilters={filters} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
          <div className="flex flex-wrap gap-3 flex-1">
            <select
              value={filters.listingType ?? ''}
              onChange={e => handleFilterChange('listingType', e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none"
            >
              <option value="">Todas las operaciones</option>
              <option value="SALE">Venta</option>
              <option value="RENT">Alquiler</option>
              <option value="SALE_OR_RENT">Venta o Alquiler</option>
            </select>

            <select
              value={filters.type ?? ''}
              onChange={e => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none"
            >
              <option value="">Todos los tipos</option>
              <option value="APARTMENT">Apartamento</option>
              <option value="HOUSE">Casa</option>
              <option value="LAND">Terreno</option>
              <option value="COMMERCIAL">Local Comercial</option>
              <option value="OFFICE">Oficina</option>
              <option value="WAREHOUSE">Bodega</option>
            </select>

            <input
              type="text"
              value={filters.city ?? ''}
              onChange={e => handleFilterChange('city', e.target.value)}
              placeholder="Ciudad"
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-36"
            />
          </div>

          {/* Active filter tags */}
          <div className="flex flex-wrap gap-2">
            {filters.listingType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#009EE3' }}>
                {LISTING_TYPE_LABELS[filters.listingType] ?? filters.listingType}
                <button onClick={() => handleFilterChange('listingType', '')} className="hover:opacity-75" aria-label="Quitar filtro">×</button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#009EE3' }}>
                {TYPE_LABELS[filters.type] ?? filters.type}
                <button onClick={() => handleFilterChange('type', '')} className="hover:opacity-75" aria-label="Quitar filtro">×</button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#009EE3' }}>
                {filters.city}
                <button onClick={() => handleFilterChange('city', '')} className="hover:opacity-75" aria-label="Quitar filtro">×</button>
              </span>
            )}
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-sm text-gray-500 mb-5">
            <span className="font-semibold text-gray-800">{total}</span> propiedad{total !== 1 ? 'es' : ''} encontrada{total !== 1 ? 's' : ''}
          </p>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => loadListings(filters)}
              className="px-6 py-2 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#009EE3' }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid */}
        {!error && (
          <PropertyGrid
            properties={listings}
            loading={loading}
            whatsappNumber={WHATSAPP_NUMBER}
          />
        )}

        {/* Empty state */}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 text-gray-200 mx-auto">
                <path d="M32 4L4 28h8v28h16V40h8v16h16V28h8L32 4zm0 4.5L56 26h-4v28H40V38H24v16H12V26H8L32 8.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron propiedades</h3>
            <p className="text-gray-500 mb-6">Intenta con otros filtros de búsqueda.</p>
            <button
              onClick={() => setFilters({ page: 1, limit: 9 })}
              className="px-6 py-2 rounded-xl border font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: '#009EE3', color: '#009EE3' }}
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-2 px-5 py-2 rounded-xl border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              style={{ borderColor: '#009EE3', color: '#009EE3' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
              Anterior
            </button>

            <span className="text-sm text-gray-600">
              Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-2 px-5 py-2 rounded-xl border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              style={{ borderColor: '#009EE3', color: '#009EE3' }}
            >
              Siguiente
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} Interurbana. Todos los derechos reservados.
      </footer>
    </div>
  )
}
