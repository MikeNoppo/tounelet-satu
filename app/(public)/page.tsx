import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { StatCard } from "@/components/stat-card"
import { AnnouncementCard } from "@/components/announcement-card"
import { FeatureCard } from "@/components/feature-card"
import { EmptyState } from "@/components/empty-state"
import { HeroSection } from "@/components/hero-section"
import { Newspaper, Sparkles, ImageIcon } from "lucide-react"

// Force dynamic rendering to ensure data is always fresh
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Post {
  id: number
  type: string
  title: string
  body: string | null
  date: string | null
  createdAt: string
}

interface Potential {
  id: number
  name: string
  desc: string | null
  emoji: string | null
  imageUrl: string | null
}

interface GalleryItem {
  id: number
  url: string
  caption: string | null
}

interface Settings {
  totalJiwa?: string
  jumlahKK?: string
  lakiLaki?: string
  perempuan?: string
  tahunBerdiri?: string
  luasWilayah?: string
}

async function getSettings(): Promise<Settings> {
  try {
    // Get the base URL - use VERCEL_URL in production or localhost in development
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const res = await fetch(`${baseUrl}/api/public/settings`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) {
      console.error('Settings fetch failed:', res.status, res.statusText)
      return {}
    }
    
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return {}
  }
}

async function getAnnouncements(): Promise<Post[]> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const res = await fetch(
      `${baseUrl}/api/public/posts?category=PENGUMUMAN&limit=3`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.posts || []
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
    return []
  }
}

async function getPotentials(): Promise<Potential[]> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const res = await fetch(
      `${baseUrl}/api/public/potentials?limit=3`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch (error) {
    console.error('Failed to fetch potentials:', error)
    return []
  }
}

async function getGallery(): Promise<GalleryItem[]> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const res = await fetch(
      `${baseUrl}/api/public/gallery?limit=4`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch (error) {
    console.error('Failed to fetch gallery:', error)
    return []
  }
}

export default async function Home() {
  const [settings, announcements, potentials, gallery] = await Promise.all([
    getSettings(),
    getAnnouncements(),
    getPotentials(),
    getGallery()
  ])

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  const stats = [
    { 
      label: "Penduduk", 
      value: settings.totalJiwa || "-",
      iconName: "users" as const,
      gradient: "bg-linear-to-br from-green-500/10 to-green-600/5",
      iconColor: "text-green-600",
      updatedAt: currentDate,
    },
    { 
      label: "Keluarga", 
      value: settings.jumlahKK || "-",
      iconName: "home" as const,
      gradient: "bg-linear-to-br from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-600",
      updatedAt: currentDate,
    },
    { 
      label: "Tahun Berdiri", 
      value: settings.tahunBerdiri || "-",
      iconName: "calendar" as const,
      gradient: "bg-linear-to-br from-amber-500/10 to-amber-600/5",
      iconColor: "text-amber-600",
    },
    { 
      label: "Luas Wilayah", 
      value: settings.luasWilayah ? `${settings.luasWilayah} km²` : "-",
      iconName: "map" as const,
      gradient: "bg-linear-to-br from-teal-500/10 to-teal-600/5",
      iconColor: "text-teal-600",
    },
  ]

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return ''
    // Remove HTML tags
    const plainText = text.replace(/<[^>]*>/g, '')
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '...'
  }

  return (
    <div className="w-full">
      <HeroSection />

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-white to-amber-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-block">
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Data Desa</h2>
              <div className="h-1 w-24 bg-green-600 mx-auto rounded-full"></div>
            </div>
            <p className="text-slate-600 mt-4">Informasi kependudukan dan wilayah</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard 
                key={stats[0].label} 
                label={stats[0].label} 
                value={stats[0].value}
                iconName={stats[0].iconName}
                gradient={stats[0].gradient}
                iconColor={stats[0].iconColor}
                updatedAt={stats[0].updatedAt}
                delay={0}
              />
              <StatCard 
                key={stats[1].label} 
                label={stats[1].label} 
                value={stats[1].value}
                iconName={stats[1].iconName}
                gradient={stats[1].gradient}
                iconColor={stats[1].iconColor}
                updatedAt={stats[1].updatedAt}
                delay={100}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
              <StatCard 
                key={stats[2].label} 
                label={stats[2].label} 
                value={stats[2].value}
                iconName={stats[2].iconName}
                gradient={stats[2].gradient}
                iconColor={stats[2].iconColor}
                delay={200}
              />
              <StatCard 
                key={stats[3].label} 
                label={stats[3].label} 
                value={stats[3].value}
                iconName={stats[3].iconName}
                gradient={stats[3].gradient}
                iconColor={stats[3].iconColor}
                delay={300}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pengumuman Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Pengumuman</h2>
              <div className="h-1 w-20 bg-green-600 rounded-full"></div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/berita?tab=pengumuman">Lihat Semua</Link>
            </Button>
          </div>
          {announcements.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="Belum Ada Pengumuman"
              description="Belum ada pengumuman terbaru saat ini. Pantau terus halaman ini untuk mendapatkan informasi penting dari Desa Tounelet Satu."
              showAnimation={true}
            />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {announcements.map((announcement, index) => (
                <AnnouncementCard
                  key={announcement.id}
                  id={announcement.id}
                  title={announcement.title}
                  date={formatDate(announcement.date || announcement.createdAt)}
                  body={truncateText(announcement.body, 100)}
                  delay={index * 100}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Potensi Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 via-white to-green-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Potensi Desa</h2>
              <div className="h-1 w-20 bg-green-600 rounded-full"></div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/potensi">Lihat Semua</Link>
            </Button>
          </div>
          {potentials.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Belum Ada Data Potensi"
              description="Informasi tentang potensi unggulan kelurahan akan segera hadir. Nantikan update terbaru dari kami."
              showAnimation={true}
            />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {potentials.map((potential, index) => (
                <FeatureCard
                  key={potential.id}
                  emoji={potential.emoji}
                  imageUrl={potential.imageUrl}
                  name={potential.name}
                  desc={potential.desc || ''}
                  delay={index * 100}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-block">
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Galeri Kegiatan</h2>
              <div className="h-1 w-24 bg-green-600 mx-auto rounded-full"></div>
            </div>
            <p className="text-slate-600 mt-4">Dokumentasi aktivitas dan kegiatan desa</p>
          </div>
          {gallery.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="Galeri Masih Kosong"
              description="Dokumentasi kegiatan dan foto-foto menarik akan segera ditampilkan di sini."
              showAnimation={true}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {gallery.map((item) => (
                  <div key={item.id} className="relative h-48 rounded-lg overflow-hidden group">
                    <Image
                      src={item.url}
                      alt={item.caption || 'Gallery image'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link href="/galeri">
                  <Button variant="default">Lihat Semua Galeri</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
