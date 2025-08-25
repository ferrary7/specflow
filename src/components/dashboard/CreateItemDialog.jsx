"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from 'uuid'

export default function CreateItemDialog({ 
  open, 
  onOpenChange, 
  packageId,
  onItemCreated 
}) {
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    vendor_link: "",
    image_file: null,
    image_preview: null
  })
  const fileInputRef = useRef(null)

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        image_file: file,
        image_preview: reader.result
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image_file: null,
      image_preview: null
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadImage = async (file, userId) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${uuidv4()}.${fileExt}`

    const { error } = await supabase.storage
      .from('item-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !packageId) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      let imageUrl = null

      // Upload image if provided
      if (formData.image_file) {
        setImageUploading(true)
        imageUrl = await uploadImage(formData.image_file, user.id)
        setImageUploading(false)
      }

      const { data, error } = await supabase
        .from('items')
        .insert([
          {
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            vendor_link: formData.vendor_link.trim() || null,
            image_url: imageUrl,
            package_id: packageId,
            user_id: user.id
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Reset form
      setFormData({ 
        name: "", 
        description: "", 
        vendor_link: "", 
        image_file: null, 
        image_preview: null 
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Notify parent
      onItemCreated?.(data)
      
      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating item:', error)
      // TODO: Add toast notification for error
    } finally {
      setLoading(false)
      setImageUploading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ 
      name: "", 
      description: "", 
      vendor_link: "", 
      image_file: null, 
      image_preview: null 
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Item Image</Label>
              {formData.image_preview ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <img
                        src={formData.image_preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Item Name */}
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name *</Label>
              <Input
                id="item-name"
                placeholder="Enter item name..."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                placeholder="Enter item description..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={loading}
                rows={3}
              />
            </div>

            {/* Vendor Link */}
            <div className="space-y-2">
              <Label htmlFor="vendor-link">Vendor Link</Label>
              <Input
                id="vendor-link"
                type="url"
                placeholder="https://example.com/product"
                value={formData.vendor_link}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor_link: e.target.value }))}
                disabled={loading}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {(loading || imageUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {imageUploading ? 'Uploading...' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}