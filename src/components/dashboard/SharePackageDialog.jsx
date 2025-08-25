"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Copy, 
  ExternalLink, 
  Eye, 
  EyeOff,
  Check,
  Loader2
} from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SharePackageDialog({ 
  open, 
  onOpenChange, 
  packageData,
  onPackageUpdated
}) {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (packageData) {
      setIsPublic(packageData.is_public || false)
      if (packageData.public_token) {
        setShareUrl(`${window.location.origin}/share/${packageData.public_token}`)
      }
    }
  }, [packageData])

  const handleTogglePublic = async (checked) => {
    if (!packageData) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({ 
          is_public: checked,
          // Generate new public_token if making public for the first time
          ...(checked && !packageData.public_token ? { public_token: crypto.randomUUID() } : {})
        })
        .eq('id', packageData.id)
        .select('*')
        .single()

      if (error) throw error

      setIsPublic(checked)
      
      if (checked && data.public_token) {
        const newShareUrl = `${window.location.origin}/share/${data.public_token}`
        setShareUrl(newShareUrl)
      }

      // Notify parent component
      onPackageUpdated?.(data)

    } catch (error) {
      console.error('Error updating package visibility:', error)
      // TODO: Add toast notification for error
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenLink = () => {
    if (shareUrl) {
      window.open(shareUrl, '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Package</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Package Info */}
          {packageData && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{packageData.name}</h3>
                    {packageData.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {packageData.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={isPublic ? "default" : "secondary"}>
                    {isPublic ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Public Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Make package public</Label>
              <p className="text-xs text-muted-foreground">
                Anyone with the link can view this package
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
              disabled={loading}
            />
          </div>

          {/* Share Link */}
          {isPublic && shareUrl && (
            <div className="space-y-3">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  disabled={!shareUrl}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenLink}
                  disabled={!shareUrl}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-600">Link copied to clipboard!</p>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Updating...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}