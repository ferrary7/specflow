import { createSupabaseServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import PublicPackageView from '@/components/public/PublicPackageView'

export async function generateMetadata({ params }) {
  const cookieStore = cookies()
  const supabase = createSupabaseServerClient(cookieStore)
  
  const { data: pkg } = await supabase
    .from('packages')
    .select('name, description')
    .eq('public_token', params.packageId)
    .eq('is_public', true)
    .single()

  if (!pkg) {
    return {
      title: 'Package Not Found'
    }
  }

  return {
    title: `${pkg.name} - SpecFlow`,
    description: pkg.description || `View ${pkg.name} package details`,
  }
}

export default async function SharePage({ params }) {
  const cookieStore = cookies()
  const supabase = createSupabaseServerClient(cookieStore)
  
  // Fetch package with items using public_token
  const { data: packageData, error } = await supabase
    .from('packages')
    .select(`
      *,
      items (*),
      projects (
        name,
        description
      )
    `)
    .eq('public_token', params.packageId)
    .eq('is_public', true)
    .single()

  if (error || !packageData) {
    notFound()
  }

  return <PublicPackageView packageData={packageData} />
}