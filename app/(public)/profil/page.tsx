"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069"

interface ProfileData {
  visi?: string
  misi?: string
  sejarah?: string
  profilUmum?: string
}

interface WilayahData {
  kecamatan?: string
  kabupaten?: string
  provinsi?: string
  jumlahLingkungan?: string
}

export default function ProfilPage() {
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [wilayahData, setWilayahData] = useState<WilayahData>({})
  const [loading, setLoading] = useState(true)
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER)
  const [activeTab, setActiveTab] = useState("visi-misi")

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
          setWilayahData({
            kecamatan: settings.kecamatan,
            kabupaten: settings.kabupaten,
            provinsi: settings.provinsi,
            jumlahLingkungan: settings.jumlahLingkungan,
          })
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
          <h1 className="text-4xl font-bold">Profil Desa Tounelet Satu</h1>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
                <TabsTrigger value="sejarah">Sejarah</TabsTrigger>
                <TabsTrigger value="profil-umum">Profil Umum</TabsTrigger>
                <TabsTrigger value="wilayah">Wilayah</TabsTrigger>
              </TabsList>

              <TabsContent value="visi-misi" className="space-y-8 mt-8">
                <AnimatePresence mode="wait">
                  {activeTab === "visi-misi" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="sejarah" className="space-y-8 mt-8">
                <AnimatePresence mode="wait">
                  {activeTab === "sejarah" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {!profileData.sejarah ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">Belum ada data sejarah</p>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 mb-4">Sejarah Desa Tounelet Satu</h2>
                          <div
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: profileData.sejarah }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="profil-umum" className="space-y-8 mt-8">
                <AnimatePresence mode="wait">
                  {activeTab === "profil-umum" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="wilayah" className="space-y-8 mt-8">
                <AnimatePresence mode="wait">
                  {activeTab === "wilayah" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Informasi Wilayah</h2>
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600">Kecamatan:</span>
                            <span className="font-semibold text-slate-900">{wilayahData.kecamatan || '-'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600">Kabupaten:</span>
                            <span className="font-semibold text-slate-900">{wilayahData.kabupaten || '-'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600">Provinsi:</span>
                            <span className="font-semibold text-slate-900">{wilayahData.provinsi || '-'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-600">Jumlah Lingkungan:</span>
                            <span className="font-semibold text-slate-900">{wilayahData.jumlahLingkungan || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </div>
  )
}
