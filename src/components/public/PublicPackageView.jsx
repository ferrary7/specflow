"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  ExternalLink,
  Download,
  Calendar,
  Box
} from "lucide-react"
import { format } from "date-fns"
import { exportPackageToPDF, exportPackageToPDFSimple } from "@/lib/pdf-export"
import { exportPackageToPDFRobust } from "@/lib/pdf-export-simple"

export default function PublicPackageView({ packageData }) {
  const handleExportPDF = async () => {
    try {
      // Try the robust PDF export first (no HTML/CSS issues)
      try {
        await exportPackageToPDFRobust(packageData)
      } catch (error) {
        console.warn('Robust PDF export failed, trying HTML export:', error)
        try {
          await exportPackageToPDF(packageData)
        } catch (htmlError) {
          console.warn('HTML PDF export failed, falling back to simple export:', htmlError)
          await exportPackageToPDFSimple(packageData)
        }
      }
    } catch (error) {
      console.error('All PDF export methods failed:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">SpecFlow</h1>
                <p className="text-sm text-muted-foreground">Public Package View</p>
              </div>
            </div>
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Package Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{packageData.name}</h1>
                <Badge variant="secondary">
                  <Box className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              </div>
              {packageData.description && (
                <p className="text-lg text-muted-foreground mb-4">
                  {packageData.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-1" />
              From {packageData.projects?.name || 'Project'}
            </div>
            <div className="flex items-center">
              <Box className="h-4 w-4 mr-1" />
              {packageData.items?.length || 0} items
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Updated {format(new Date(packageData.updated_at), 'MMM d, yyyy')}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {packageData.items?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Box className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items yet</h3>
              <p className="text-muted-foreground text-center">
                This package doesn't contain any items at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Items ({packageData.items?.length})
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packageData.items?.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {item.image_url && (
                    <div className="aspect-square bg-muted">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                    {item.vendor_link && (
                      <a
                        href={item.vendor_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Vendor Details
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">SpecFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional package management for interior designers
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}