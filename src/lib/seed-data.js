import { supabase } from './supabase'

export const createSeedDataForUser = async (userId) => {
  try {
    // Check if user already has data
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    if (existingProjects && existingProjects.length > 0) {
      // User already has data, don't create seed data
      return false
    }

    console.log('Creating seed data for new user:', userId)

    // Create sample projects
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          name: 'Modern Living Room',
          description: 'Contemporary living space with clean lines and neutral tones',
          user_id: userId
        },
        {
          name: 'Luxury Hotel Suite',
          description: 'High-end hospitality design with premium finishes',
          user_id: userId
        }
      ])
      .select()

    if (projectError) throw projectError

    // Create sample packages for first project
    const { data: packages, error: packageError } = await supabase
      .from('packages')
      .insert([
        {
          name: 'Furniture & Seating',
          description: 'Main furniture pieces including sofa, chairs, and coffee table',
          project_id: projects[0].id,
          user_id: userId,
          is_public: true
        },
        {
          name: 'Lighting & Accessories',
          description: 'Lighting fixtures, lamps, and decorative accessories',
          project_id: projects[0].id,
          user_id: userId,
          is_public: false
        }
      ])
      .select()

    if (packageError) throw packageError

    // Create sample packages for second project
    const { data: hotelPackages, error: hotelPackageError } = await supabase
      .from('packages')
      .insert([
        {
          name: 'Bedroom Suite',
          description: 'Premium bedroom furniture and linens',
          project_id: projects[1].id,
          user_id: userId,
          is_public: false
        }
      ])
      .select()

    if (hotelPackageError) throw hotelPackageError

    // Create sample items for first package (Furniture & Seating)
    const { data: items1, error: items1Error } = await supabase
      .from('items')
      .insert([
        {
          name: 'Mid-Century Modern Sofa',
          description: 'A sleek 3-seater sofa in charcoal fabric with walnut legs. Perfect centerpiece for contemporary living spaces.',
          image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.westelm.com/products/mid-century-modern-sofa',
          package_id: packages[0].id,
          user_id: userId
        },
        {
          name: 'Glass Coffee Table',
          description: 'Minimalist tempered glass coffee table with chrome legs. Creates an open, airy feel in the room.',
          image_url: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.cb2.com/glass-coffee-table',
          package_id: packages[0].id,
          user_id: userId
        },
        {
          name: 'Accent Armchair',
          description: 'Velvet upholstered swivel chair in deep emerald green. Adds a pop of color and comfort.',
          image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.anthropologie.com/accent-chair',
          package_id: packages[0].id,
          user_id: userId
        }
      ])
      .select()

    if (items1Error) throw items1Error

    // Create sample items for second package (Lighting & Accessories)
    const { data: items2, error: items2Error } = await supabase
      .from('items')
      .insert([
        {
          name: 'Pendant Light Fixture',
          description: 'Brass and black pendant light with geometric design. Provides focused lighting over seating area.',
          image_url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.schoolhouse.com/pendant-lighting',
          package_id: packages[1].id,
          user_id: userId
        },
        {
          name: 'Table Lamp Set',
          description: 'Pair of ceramic table lamps with linen shades. Warm ambient lighting for side tables.',
          image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.potterybarn.com/table-lamps',
          package_id: packages[1].id,
          user_id: userId
        },
        {
          name: 'Abstract Wall Art',
          description: 'Large canvas print with abstract geometric patterns in neutral tones. Statement piece for main wall.',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.artfully.com/abstract-wall-art',
          package_id: packages[1].id,
          user_id: userId
        },
        {
          name: 'Decorative Throw Pillows',
          description: 'Set of 4 textured throw pillows in coordinating colors. Adds comfort and visual interest.',
          image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.target.com/throw-pillows',
          package_id: packages[1].id,
          user_id: userId
        }
      ])
      .select()

    if (items2Error) throw items2Error

    // Create sample items for hotel bedroom package
    const { data: items3, error: items3Error } = await supabase
      .from('items')
      .insert([
        {
          name: 'King Size Platform Bed',
          description: 'Upholstered platform bed in cream bouclé fabric with brass accents. Hotel-quality comfort and style.',
          image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.restorationhardware.com/platform-bed',
          package_id: hotelPackages[0].id,
          user_id: userId
        },
        {
          name: 'Luxury Bedding Set',
          description: '600-thread count Egyptian cotton sheets, duvet, and pillowcases in crisp white. Premium hotel-style linens.',
          image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.frette.com/luxury-bedding',
          package_id: hotelPackages[0].id,
          user_id: userId
        },
        {
          name: 'Bedside Nightstands',
          description: 'Pair of marble-top nightstands with brass hardware. Elegant storage solution with hotel sophistication.',
          image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center',
          vendor_link: 'https://www.cb2.com/marble-nightstand',
          package_id: hotelPackages[0].id,
          user_id: userId
        }
      ])
      .select()

    if (items3Error) throw items3Error

    console.log('Seed data created successfully:', {
      projects: projects.length,
      packages: packages.length + hotelPackages.length,
      items: items1.length + items2.length + items3.length
    })

    return true
  } catch (error) {
    console.error('Error creating seed data:', error)
    throw error
  }
}

export const checkAndCreateSeedData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    return await createSeedDataForUser(user.id)
  } catch (error) {
    console.error('Error in checkAndCreateSeedData:', error)
    return false
  }
}