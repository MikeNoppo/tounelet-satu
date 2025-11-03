"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/admin/image-upload"
import { NovelEditor } from "@/components/admin/novel-editor"

export default function CreateSaranaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [editorContent, setEditorContent] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  })

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
      const res = await fetch('/api/admin/facilities', {
        method: 'POST',
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
          description: "Fasilitas berhasil ditambahkan",
        })
        router.push('/admin/sarana')
      } else {
        throw new Error('Failed to create facility')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan fasilitas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
          <h2 className="text-3xl font-bold text-slate-900">Tambah Fasilitas</h2>
          <p className="text-slate-600 mt-1">Tambahkan sarana & prasarana baru</p>
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
                onRemove={() => setFormData({ ...formData, imageUrl: "" })}
                uploadEndpoint="/api/admin/facilities/upload"
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
                {isLoading ? "Menyimpan..." : "Simpan"}
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
