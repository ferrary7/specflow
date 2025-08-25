import { supabase } from './supabase'
import { createSeedDataForUser } from './seed-data'

export const resetUserData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Not authenticated')
    }

    console.log('Resetting user data...')

    // Delete all user data in correct order (foreign key constraints)
    
    // 1. Delete items first
    const { error: itemsError } = await supabase
      .from('items')
      .delete()
      .eq('user_id', user.id)

    if (itemsError) throw itemsError

    // 2. Delete packages
    const { error: packagesError } = await supabase
      .from('packages')
      .delete()
      .eq('user_id', user.id)

    if (packagesError) throw packagesError

    // 3. Delete projects
    const { error: projectsError } = await supabase
      .from('projects')
      .delete()
      .eq('user_id', user.id)

    if (projectsError) throw projectsError

    console.log('User data cleared successfully')

    // 4. Recreate seed data
    await createSeedDataForUser(user.id)
    
    console.log('Seed data recreated successfully')
    return true

  } catch (error) {
    console.error('Error resetting user data:', error)
    throw error
  }
}