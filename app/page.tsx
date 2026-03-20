import ListingsPage from '@/components/ListingsPage'
import { fetchBusiness } from '@/lib/api'

export default async function Home() {
  const business = await fetchBusiness().catch(() => null)
  return <ListingsPage business={business} />
}
