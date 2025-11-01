import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { StatCard } from "@/components/stat-card"
import { AnnouncementCard } from "@/components/announcement-card"
import { FeatureCard } from "@/components/feature-card"
import { EmptyState } from "@/components/empty-state"
import { HeroSection } from "@/components/hero-section"
import { Newspaper, Sparkles, ImageIcon } from "lucide-react"

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/public/settings`, {
      next: { revalidate: 3600 }
    })
    if (!res.ok) return {}
    return res.json()
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return {}
  }
}

async function getAnnouncements(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/public/posts?category=PENGUMUMAN&limit=3`,
      { next: { revalidate: 300 } }
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/public/potentials?limit=3`,
      { next: { revalidate: 3600 } }
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/public/gallery?limit=4`,
      { next: { revalidate: 3600 } }
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

  const stats = [
    { 
      label: "Penduduk", 
      value: settings.totalJiwa || "-",
      iconName: "users" as const,
      gradient: "bg-linear-to-br from-green-500/10 to-green-600/5",
      iconColor: "text-green-600",
      trend: { value: 2.5, label: "dari tahun lalu" }
    },
    { 
      label: "Keluarga", 
      value: settings.jumlahKK || "-",
      iconName: "home" as const,
      gradient: "bg-linear-to-br from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-600",
      trend: { value: 1.2, label: "dari tahun lalu" }
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
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Sekilas Kependudukan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard 
                key={stat.label} 
                label={stat.label} 
                value={stat.value}
                iconName={stat.iconName}
                gradient={stat.gradient}
                iconColor={stat.iconColor}
                trend={stat.trend}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

            {/* Pengumuman Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Pengumuman</h2>
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
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Potensi Kelurahan</h2>
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

      <section className="py-16 px-4 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Galeri Kegiatan</h2>
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
