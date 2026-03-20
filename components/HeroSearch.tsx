import { ListingFilters } from '@/lib/types'

interface HeroSearchProps {
  onSearch: (filters: ListingFilters) => void
  initialFilters?: ListingFilters
}

export default function HeroSearch({ onSearch, initialFilters = {} }: HeroSearchProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const filters: ListingFilters = {}
    const listingType = data.get('listingType') as string
    const type = data.get('type') as string
    const city = data.get('city') as string
    if (listingType) filters.listingType = listingType
    if (type) filters.type = type
    if (city.trim()) filters.city = city.trim()
    filters.page = 1
    onSearch(filters)
  }

  return (
    <section
      className="relative w-full py-20 px-4"
      style={{ background: 'linear-gradient(135deg, #009EE3 0%, #007AB5 100%)' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Encuentra tu propiedad ideal
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10">
          Casas, apartamentos, locales y más en los mejores sectores
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <select
              name="listingType"
              defaultValue={initialFilters.listingType ?? ''}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:border-transparent text-sm"
              style={{ '--tw-ring-color': '#009EE3' } as React.CSSProperties}
            >
              <option value="">Operación</option>
              <option value="SALE">Venta</option>
              <option value="RENT">Alquiler</option>
              <option value="SALE_OR_RENT">Venta o Alquiler</option>
            </select>

            <select
              name="type"
              defaultValue={initialFilters.type ?? ''}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:border-transparent text-sm"
            >
              <option value="">Tipo de propiedad</option>
              <option value="APARTMENT">Apartamento</option>
              <option value="HOUSE">Casa</option>
              <option value="LAND">Terreno</option>
              <option value="COMMERCIAL">Local Comercial</option>
              <option value="OFFICE">Oficina</option>
              <option value="WAREHOUSE">Bodega</option>
            </select>

            <input
              type="text"
              name="city"
              defaultValue={initialFilters.city ?? ''}
              placeholder="Ciudad"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm"
            />

            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 text-sm whitespace-nowrap"
              style={{ backgroundColor: '#009EE3' }}
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
