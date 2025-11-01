'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Users, Home, Mail, Phone, MapPin, Save, Image as ImageIcon, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface Settings {
  totalJiwa?: string
  jumlahKK?: string
  lakiLaki?: string
  perempuan?: string
  alamat?: string
  telp?: string
  email?: string
  website?: string
  heroImage?: string
  beritaBanner?: string
  galeriBanner?: string
  potensiBanner?: string
  profilBanner?: string
  strukturBanner?: string
  petaBanner?: string
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Settings>({})
  const [formData, setFormData] = useState<Settings>({})
  const [uploadingBanner, setUploadingBanner] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/settings')
      if (!res.ok) throw new Error('Failed to fetch settings')
      const data = await res.json()
      setSettings(data)
      setFormData(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to save settings')

      const data = await res.json()
      setSettings(data)
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (key: keyof Settings, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleBannerUpload = async (key: string, file: File) => {
    try {
      setUploadingBanner(key)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('key', key)

      const res = await fetch('/api/admin/settings/banners', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Failed to upload banner')

      const data = await res.json()
      setSettings(prev => ({ ...prev, [key]: data.url }))
      setFormData(prev => ({ ...prev, [key]: data.url }))
      toast.success('Banner uploaded successfully')
    } catch (error) {
      console.error('Error uploading banner:', error)
      toast.error('Failed to upload banner')
    } finally {
      setUploadingBanner(null)
    }
  }

  const handleBannerDelete = async (key: string) => {
    try {
      const res = await fetch(`/api/admin/settings/banners?key=${key}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete banner')

      setSettings(prev => ({ ...prev, [key]: undefined }))
      setFormData(prev => ({ ...prev, [key]: undefined }))
      toast.success('Banner deleted successfully')
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Failed to delete banner')
    }
  }

  const BannerUpload = ({ 
    label, 
    bannerKey, 
    currentUrl, 
    defaultUrl 
  }: { 
    label: string
    bannerKey: string
    currentUrl?: string
    defaultUrl: string
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100">
          <Image
            src={currentUrl || defaultUrl}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={uploadingBanner === bannerKey}
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) handleBannerUpload(bannerKey, file)
              }
              input.click()
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadingBanner === bannerKey ? 'Uploading...' : currentUrl ? 'Change Image' : 'Upload Image'}
          </Button>

          {currentUrl && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBannerDelete(bannerKey)}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>

        {!currentUrl && (
          <p className="text-xs text-muted-foreground">
            Using default image from Unsplash
          </p>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage website settings and information</p>
      </div>

      <Tabs defaultValue="population" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="population">
            <Users className="w-4 h-4 mr-2" />
            Population Data
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Home className="w-4 h-4 mr-2" />
            Contact Info
          </TabsTrigger>
          <TabsTrigger value="banners">
            <ImageIcon className="w-4 h-4 mr-2" />
            Banners & Hero
          </TabsTrigger>
        </TabsList>

        <TabsContent value="population" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Kependudukan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalJiwa">Total Jiwa</Label>
                  <Input
                    id="totalJiwa"
                    type="text"
                    value={formData.totalJiwa || ''}
                    onChange={(e) => updateField('totalJiwa', e.target.value)}
                    placeholder="6.120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jumlahKK">Jumlah KK</Label>
                  <Input
                    id="jumlahKK"
                    type="text"
                    value={formData.jumlahKK || ''}
                    onChange={(e) => updateField('jumlahKK', e.target.value)}
                    placeholder="1.845"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lakiLaki">Laki-laki</Label>
                  <Input
                    id="lakiLaki"
                    type="text"
                    value={formData.lakiLaki || ''}
                    onChange={(e) => updateField('lakiLaki', e.target.value)}
                    placeholder="3.080"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perempuan">Perempuan</Label>
                  <Input
                    id="perempuan"
                    type="text"
                    value={formData.perempuan || ''}
                    onChange={(e) => updateField('perempuan', e.target.value)}
                    placeholder="3.040"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Population Data'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setFormData(settings)}
                  disabled={saving}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alamat">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Alamat
                </Label>
                <Input
                  id="alamat"
                  type="text"
                  value={formData.alamat || ''}
                  onChange={(e) => updateField('alamat', e.target.value)}
                  placeholder="Jl. Raya Sendangan, Kec. Kawangkoan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telp">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telepon
                </Label>
                <Input
                  id="telp"
                  type="text"
                  value={formData.telp || ''}
                  onChange={(e) => updateField('telp', e.target.value)}
                  placeholder="(0431) 123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="kelurahan.sendangan@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://sendangan.example.com"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Contact Info'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setFormData(settings)}
                  disabled={saving}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            <BannerUpload
              label="Homepage Hero Image"
              bannerKey="heroImage"
              currentUrl={settings.heroImage}
              defaultUrl="https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=2070"
            />

            <BannerUpload
              label="Halaman Berita - Banner"
              bannerKey="beritaBanner"
              currentUrl={settings.beritaBanner}
              defaultUrl="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070"
            />

            <BannerUpload
              label="Halaman Galeri - Banner"
              bannerKey="galeriBanner"
              currentUrl={settings.galeriBanner}
              defaultUrl="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074"
            />

            <BannerUpload
              label="Halaman Potensi - Banner"
              bannerKey="potensiBanner"
              currentUrl={settings.potensiBanner}
              defaultUrl="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
            />

            <BannerUpload
              label="Halaman Profil - Banner"
              bannerKey="profilBanner"
              currentUrl={settings.profilBanner}
              defaultUrl="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069"
            />

            <BannerUpload
              label="Halaman Struktur - Banner"
              bannerKey="strukturBanner"
              currentUrl={settings.strukturBanner}
              defaultUrl="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070"
            />

            <BannerUpload
              label="Halaman Peta - Banner"
              bannerKey="petaBanner"
              currentUrl={settings.petaBanner}
              defaultUrl="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
