"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { exportPackageToPDF, exportPackageToPDFSimple } from '@/lib/pdf-export'
import { exportPackageToPDFRobust } from '@/lib/pdf-export-simple'
import { checkAndCreateSeedData } from '@/lib/seed-data'
import { resetUserData } from '@/lib/reset-data'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import Workspace from '@/components/dashboard/Workspace'
import CreateItemDialog from '@/components/dashboard/CreateItemDialog'
import CreatePackageDialog from '@/components/dashboard/CreatePackageDialog'
import SharePackageDialog from '@/components/dashboard/SharePackageDialog'

export default function Dashboard({ user }) {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateItem, setShowCreateItem] = useState(false)
  const [createItemPackageId, setCreateItemPackageId] = useState(null)
  const [showSharePackage, setShowSharePackage] = useState(false)
  const [sharePackageData, setSharePackageData] = useState(null)
  const [showCreatePackage, setShowCreatePackage] = useState(false)
  const [createPackageProjectId, setCreatePackageProjectId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProjects, setFilteredProjects] = useState([])

  // Fetch projects with packages and items
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          packages (
            *,
            items (*)
          )
        `)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initializeDashboard = async () => {
      // Check and create seed data for new users
      try {
        await checkAndCreateSeedData()
      } catch (error) {
        console.error('Error creating seed data:', error)
      }
      
      // Fetch projects (including any seed data just created)
      await fetchProjects()
    }
    
    initializeDashboard()
  }, [])

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = projects.map(project => {
      // Check if project matches
      const projectMatch = 
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)

      // Filter packages within this project
      const matchingPackages = project.packages?.filter(pkg => {
        // Check if package matches
        const packageMatch = 
          pkg.name.toLowerCase().includes(query) ||
          pkg.description?.toLowerCase().includes(query)

        // Check if any items in this package match
        const hasMatchingItems = pkg.items?.some(item =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
        )

        return packageMatch || hasMatchingItems
      }) || []

      // If project matches or has matching packages, include it
      if (projectMatch || matchingPackages.length > 0) {
        return {
          ...project,
          packages: projectMatch ? project.packages : matchingPackages
        }
      }

      return null
    }).filter(Boolean)

    setFilteredProjects(filtered)
  }, [searchQuery, projects])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleSelectProject = (project) => {
    setSelectedProject(project)
    setSelectedPackage(null)
  }

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg)
    // Find and set the parent project
    const parentProject = projects.find(p => p.packages.some(pack => pack.id === pkg.id))
    if (parentProject) {
      setSelectedProject(parentProject)
    }
  }

  const handleProjectCreated = (newProject) => {
    // Add the new project to the list with empty packages array
    setProjects(prev => [{ ...newProject, packages: [] }, ...prev])
    setSelectedProject({ ...newProject, packages: [] })
    setSelectedPackage(null)
  }

  const handlePackageCreated = (newPackage) => {
    // Update the projects list with the new package
    setProjects(prev => prev.map(project => 
      project.id === newPackage.project_id 
        ? { ...project, packages: [...(project.packages || []), { ...newPackage, items: [] }] }
        : project
    ))
    
    // Update selected project if it's the parent
    if (selectedProject?.id === newPackage.project_id) {
      setSelectedProject(prev => ({
        ...prev,
        packages: [...(prev.packages || []), { ...newPackage, items: [] }]
      }))
    }
  }

  const handleCreatePackage = () => {
    if (selectedProject) {
      setCreatePackageProjectId(selectedProject.id)
      setShowCreatePackage(true)
    }
  }

  const handleCreateItem = (packageId) => {
    setCreateItemPackageId(packageId)
    setShowCreateItem(true)
  }

  const handleItemCreated = (newItem) => {
    // Update the projects list with the new item
    setProjects(prev => prev.map(project => ({
      ...project,
      packages: project.packages?.map(pkg => 
        pkg.id === newItem.package_id 
          ? { ...pkg, items: [...(pkg.items || []), newItem] }
          : pkg
      )
    })))
    
    // Update selected package if it's the parent
    if (selectedPackage?.id === newItem.package_id) {
      setSelectedPackage(prev => ({
        ...prev,
        items: [...(prev.items || []), newItem]
      }))
    }
  }

  const handleSharePackage = (pkg) => {
    setSharePackageData(pkg)
    setShowSharePackage(true)
  }

  const handlePackageUpdated = (updatedPackage) => {
    // Update the projects list with the updated package
    setProjects(prev => prev.map(project => ({
      ...project,
      packages: project.packages?.map(pkg => 
        pkg.id === updatedPackage.id ? updatedPackage : pkg
      )
    })))
    
    // Update selected package if it's the same
    if (selectedPackage?.id === updatedPackage.id) {
      setSelectedPackage(updatedPackage)
    }
  }

  const handleExportPDF = async (pkg) => {
    try {
      // Try the robust PDF export first (no HTML/CSS issues)
      try {
        await exportPackageToPDFRobust(pkg)
      } catch (error) {
        console.warn('Robust PDF export failed, trying HTML export:', error)
        try {
          await exportPackageToPDF(pkg)
        } catch (htmlError) {
          console.warn('HTML PDF export failed, falling back to simple export:', htmlError)
          await exportPackageToPDFSimple(pkg)
        }
      }
    } catch (error) {
      console.error('All PDF export methods failed:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  const handleResetData = async () => {
    if (confirm('Are you sure you want to reset all your data? This will delete all your projects, packages, and items and recreate the demo data with images. This action cannot be undone.')) {
      try {
        setLoading(true)
        await resetUserData()
        // Refresh the projects list
        await fetchProjects()
        // Reset selected items
        setSelectedProject(null)
        setSelectedPackage(null)
        alert('Demo data has been reset successfully!')
      } catch (error) {
        console.error('Error resetting data:', error)
        alert('Failed to reset data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <DashboardLayout 
      user={user} 
      onSignOut={handleSignOut}
      projects={filteredProjects}
      selectedProject={selectedProject}
      selectedPackage={selectedPackage}
      onSelectProject={handleSelectProject}
      onSelectPackage={handleSelectPackage}
      onProjectCreated={handleProjectCreated}
      onPackageCreated={handlePackageCreated}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onResetData={handleResetData}
    >
      <Workspace
        selectedProject={selectedProject}
        selectedPackage={selectedPackage}
        onCreatePackage={handleCreatePackage}
        onCreateItem={handleCreateItem}
        onSharePackage={handleSharePackage}
        onExportPDF={handleExportPDF}
        onSelectPackage={handleSelectPackage}
      />

      <CreateItemDialog
        open={showCreateItem}
        onOpenChange={setShowCreateItem}
        packageId={createItemPackageId}
        onItemCreated={handleItemCreated}
      />

      <CreatePackageDialog
        open={showCreatePackage}
        onOpenChange={setShowCreatePackage}
        projectId={createPackageProjectId}
        onPackageCreated={handlePackageCreated}
      />

      <SharePackageDialog
        open={showSharePackage}
        onOpenChange={setShowSharePackage}
        packageData={sharePackageData}
        onPackageUpdated={handlePackageUpdated}
      />
    </DashboardLayout>
  )
}