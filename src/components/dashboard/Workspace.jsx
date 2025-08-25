"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FolderOpen, 
  Package, 
  Share2, 
  Download,
  Plus,
  Calendar,
  Eye,
  Box
} from "lucide-react"
import { format } from "date-fns"

export default function Workspace({ 
  selectedProject, 
  selectedPackage,
  onCreatePackage,
  onCreateItem,
  onSharePackage,
  onExportPDF,
  onSelectPackage
}) {
  // Default empty state
  if (!selectedProject && !selectedPackage) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Welcome to SpecFlow</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Select a project from the sidebar to get started, or create your first project 
          to begin organizing your interior design packages.
        </p>
      </div>
    )
  }

  // Project overview (when project selected but no package)
  if (selectedProject && !selectedPackage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{selectedProject.name}</h1>
            {selectedProject.description && (
              <p className="text-muted-foreground mt-2">{selectedProject.description}</p>
            )}
          </div>
          <Button onClick={onCreatePackage}>
            <Plus className="h-4 w-4 mr-2" />
            New Package
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {selectedProject.packages?.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No packages yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first package to start organizing items
                </p>
                <Button onClick={onCreatePackage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Package
                </Button>
              </CardContent>
            </Card>
          ) : (
            selectedProject.packages?.map((pkg) => (
              <Card 
                key={pkg.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectPackage?.(pkg)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    {pkg.is_public && <Badge variant="secondary">Public</Badge>}
                  </div>
                  {pkg.description && (
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Box className="h-4 w-4 mr-1" />
                      {pkg.items?.length || 0} items
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(pkg.updated_at), 'MMM d')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Project Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedProject.packages?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Packages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {selectedProject.packages?.reduce((sum, pkg) => sum + (pkg.items?.length || 0), 0) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {selectedProject.packages?.filter(pkg => pkg.is_public).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Public Packages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Package view (when package is selected)
  if (selectedPackage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{selectedPackage.name}</h1>
            {selectedPackage.description && (
              <p className="text-muted-foreground mt-2">{selectedPackage.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {selectedPackage.is_public && (
                <Badge variant="secondary">
                  <Eye className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              )}
              <Badge variant="outline">
                {selectedPackage.items?.length || 0} items
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onSharePackage(selectedPackage)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={() => onExportPDF(selectedPackage)}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => onCreateItem(selectedPackage.id)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {selectedPackage.items?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Box className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add your first item to start building this package
              </p>
              <Button onClick={() => onCreateItem(selectedPackage.id)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedPackage.items?.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.image_url && (
                  <div className="aspect-square bg-muted">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.vendor_link && (
                    <a
                      href={item.vendor_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View Vendor Details
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}