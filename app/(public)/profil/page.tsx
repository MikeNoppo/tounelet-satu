"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText } from "lucide-react"

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069"

interface ProfileData {
  visi?: string
  misi?: string
  sejarah?: string
  profilUmum?: string
}

export default function ProfilPage() {
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [loading, setLoading] = useState(true)
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/public/profile")
        if (!res.ok) throw new Error("Failed to fetch profile")

        const data = await res.json()
        setProfileData(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setProfileData({})
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch('/api/public/settings')
        if (res.ok) {
          const settings = await res.json()
          if (settings.profilBanner) {
            setBannerImage(settings.profilBanner)
          }
        }
      } catch (error) {
        console.error('Failed to fetch banner:', error)
      }
    }
    fetchBanner()
  }, [])
  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt="Profil Kelurahan"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Profil Kelurahan Sendangan</h1>
          <p className="text-slate-300 mt-2">Informasi lengkap tentang kelurahan kami</p>
        </div>
      </section>

      {/* Tabs Content */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-10 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : (
            <Tabs defaultValue="visi-misi" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
                <TabsTrigger value="sejarah">Sejarah</TabsTrigger>
                <TabsTrigger value="profil-umum">Profil Umum</TabsTrigger>
                <TabsTrigger value="wilayah">Wilayah</TabsTrigger>
              </TabsList>

              {/* Tab 1: Visi & Misi */}
              <TabsContent value="visi-misi" className="space-y-8 mt-8">
                {!profileData.visi && !profileData.misi ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada data visi dan misi</p>
                  </div>
                ) : (
                  <>
                    {profileData.visi && (
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Visi</h2>
                        <div
                          className="prose prose-slate max-w-none"
                          dangerouslySetInnerHTML={{ __html: profileData.visi }}
                        />
                      </div>
                    )}

                    {profileData.misi && (
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Misi</h2>
                        <div
                          className="prose prose-slate max-w-none"
                          dangerouslySetInnerHTML={{ __html: profileData.misi }}
                        />
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Tab 2: Sejarah */}
              <TabsContent value="sejarah" className="space-y-8 mt-8">
                {!profileData.sejarah ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada data sejarah</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Sejarah Kelurahan</h2>
                    <div
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: profileData.sejarah }}
                    />
                  </div>
                )}
              </TabsContent>

              {/* Tab 3: Profil Umum */}
              <TabsContent value="profil-umum" className="space-y-8 mt-8">
                {!profileData.profilUmum ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Belum ada data profil umum</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Profil Umum</h2>
                    <div
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: profileData.profilUmum }}
                    />
                  </div>
                )}
              </TabsContent>

              {/* Tab 4: Wilayah (Static for now) */}
              <TabsContent value="wilayah" className="space-y-8 mt-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Informasi Wilayah</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-600">Kecamatan:</span>
                      <span className="font-semibold text-slate-900">Kawangkoan</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-600">Kabupaten:</span>
                      <span className="font-semibold text-slate-900">Minahasa</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-600">Provinsi:</span>
                      <span className="font-semibold text-slate-900">Sulawesi Utara</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-600">Jumlah Lingkungan:</span>
                      <span className="font-semibold text-slate-900">6</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </div>
  )
}
