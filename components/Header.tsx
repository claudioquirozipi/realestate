import Link from 'next/link'
import { Business } from '@/lib/types'

export default function Header({ business }: { business: Business | null }) {
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-3">
          {business?.logo ? (
            <img
              src={business.logo}
              alt={business.name ?? 'Logo'}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="text-xl font-bold" style={{ color: '#009EE3' }}>
              {business?.name ?? 'Interurbana'}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
