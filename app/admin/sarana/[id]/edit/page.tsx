"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/admin/image-upload"
import { NovelEditor } from "@/components/admin/novel-editor"

export default function EditSaranaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editorContent, setEditorContent] = useState("")
  const [originalImageUrl, setOriginalImageUrl] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  })

  useEffect(() => {
    fetchFacility()
  }, [])

  const fetchFacility = async () => {
    try {
      const res = await fetch(`/api/admin/facilities/${id}`)
      const data = await res.json()
      
      setFormData({
        name: data.name,
        imageUrl: data.imageUrl || "",
      })
      setOriginalImageUrl(data.imageUrl || "")

      if (data.description) {
        setEditorContent(data.description)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat fasilitas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (originalImageUrl && originalImageUrl === formData.imageUrl) {
      try {
        await fetch('/api/admin/facilities/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: formData.imageUrl })
        })
      } catch (error) {
        console.error('Failed to delete image:', error)
      }
    }
    setFormData({ ...formData, imageUrl: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama fasilitas wajib diisi",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/facilities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: editorContent || null,
          imageUrl: formData.imageUrl || null,
        }),
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "Fasilitas berhasil diupdate",
        })
        router.push('/admin/sarana')
      } else {
        throw new Error('Failed to update facility')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate fasilitas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/sarana">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Edit Fasilitas</h2>
          <p className="text-slate-600 mt-1">Update informasi fasilitas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Fasilitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Fasilitas *</Label>
              <Input
                id="name"
                placeholder="Contoh: Gereja Santo Yoseph"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Gambar (Opsional)</Label>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                onRemove={handleRemoveImage}
                uploadEndpoint="/api/admin/facilities/upload"
                previewHeight={80}
              />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi (Opsional)</Label>
              <NovelEditor
                initialValue={editorContent}
                onChange={setEditorContent}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Link href="/admin/sarana">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Batal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
