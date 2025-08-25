import { createSupabaseServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import PublicPackageView from '@/components/public/PublicPackageView'

export async function generateMetadata({ params }) {
  // Skip metadata generation during build if no env vars
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      title: 'SpecFlow Package',
      description: 'Interior design package shared via SpecFlow'
    }
  }

  try {
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
  } catch (error) {
    return {
      title: 'SpecFlow Package',
      description: 'Interior design package shared via SpecFlow'
    }
  }
}

export default async function SharePage({ params }) {
  // Handle missing env vars during build
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Required</h1>
          <p className="text-muted-foreground">
            Supabase environment variables need to be configured.
          </p>
        </div>
      </div>
    )
  }

  try {
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
  } catch (error) {
    console.error('Error fetching package data:', error)
    notFound()
  }
}