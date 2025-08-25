"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
  FolderOpen,
  Folder,
  Package,
  Box,
  Plus,
  ChevronRight,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import CreateProjectDialog from "./CreateProjectDialog"
import CreatePackageDialog from "./CreatePackageDialog"

export default function ProjectSidebar({ 
  projects = [],
  selectedProject,
  selectedPackage,
  onSelectProject,
  onSelectPackage,
  onProjectCreated,
  onPackageCreated
}) {
  const [openProjects, setOpenProjects] = useState(new Set())
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreatePackage, setShowCreatePackage] = useState(false)
  const [createPackageProjectId, setCreatePackageProjectId] = useState(null)

  const toggleProject = (projectId) => {
    const newOpen = new Set(openProjects)
    if (newOpen.has(projectId)) {
      newOpen.delete(projectId)
    } else {
      newOpen.add(projectId)
    }
    setOpenProjects(newOpen)
  }

  const handleCreatePackage = (projectId) => {
    setCreatePackageProjectId(projectId)
    setShowCreatePackage(true)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Create Project Button */}
      <div className="p-4 border-b">
        <Button 
          onClick={() => setShowCreateProject(true)}
          className="w-full justify-start"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No projects yet</p>
              <p className="text-xs">Create your first project to get started</p>
            </div>
          ) : (
            projects.map((project) => (
              <Collapsible
                key={project.id}
                open={openProjects.has(project.id)}
                onOpenChange={() => toggleProject(project.id)}
              >
                <div className="group">
                  <div className="flex items-center">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "flex-1 justify-start h-8 px-2",
                          selectedProject?.id === project.id && "bg-accent"
                        )}
                        onClick={() => onSelectProject?.(project)}
                      >
                        {openProjects.has(project.id) ? (
                          <ChevronDown className="h-3 w-3 mr-1" />
                        ) : (
                          <ChevronRight className="h-3 w-3 mr-1" />
                        )}
                        <Folder className="h-4 w-4 mr-2" />
                        <span className="truncate">{project.name}</span>
                      </Button>
                    </CollapsibleTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCreatePackage(project.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <CollapsibleContent className="ml-4">
                    {project.packages?.length === 0 ? (
                      <div className="py-2 px-2">
                        <p className="text-xs text-muted-foreground">No packages yet</p>
                      </div>
                    ) : (
                      project.packages?.map((pkg) => (
                        <Button
                          key={pkg.id}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-7 px-2 mb-1",
                            selectedPackage?.id === pkg.id && "bg-accent"
                          )}
                          onClick={() => onSelectPackage?.(pkg)}
                        >
                          <Package className="h-3 w-3 mr-2" />
                          <span className="truncate">{pkg.name}</span>
                          {pkg.is_public && (
                            <Box className="h-3 w-3 ml-auto text-green-500" />
                          )}
                        </Button>
                      ))
                    )}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Dialogs */}
      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
        onProjectCreated={onProjectCreated}
      />

      <CreatePackageDialog
        open={showCreatePackage}
        onOpenChange={setShowCreatePackage}
        projectId={createPackageProjectId}
        onPackageCreated={onPackageCreated}
      />
    </div>
  )
}