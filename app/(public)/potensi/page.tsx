"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, MapPin, Loader2 } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"

interface Potential {
  id: number
  name: string
  desc: string | null
  emoji: string | null
  imageUrl: string | null
  createdAt: string
}

interface PotentialsResponse {
  items: Potential[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

function PotentialCard({ potential, delay }: { potential: Potential; delay: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className={`group relative bg-white border-2 border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-secondary hover:shadow-2xl hover:-translate-y-2 opacity-0-init ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-56 w-full bg-linear-to-br from-secondary/10 to-primary/10 overflow-hidden">
        {potential.imageUrl ? (
          <>
            <Image
              src={potential.imageUrl}
              alt={potential.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-7xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
              {potential.emoji || "📍"}
            </span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-white/90 text-secondary border-secondary/30 shadow-lg">
            <Sparkles className="h-3 w-3 mr-1" />
            Unggulan
          </Badge>
        </div>

        {potential.emoji && potential.imageUrl && (
          <div className="absolute bottom-4 right-4 text-5xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
            {potential.emoji}
          </div>
        )}
      </div>

      <div className="p-6 relative">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="h-3 w-3" />
          <span>Kelurahan Sendangan</span>
        </div>

        <h3 className="font-bold text-slate-900 text-xl mb-3 group-hover:text-secondary transition-colors line-clamp-2">
          {potential.name}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {potential.desc || "Potensi unggulan dari Kelurahan Sendangan"}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse animation-delay-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse animation-delay-200" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </div>
    </div>
  )
}

export default function PotensiPage() {
  const [potentials, setPotentials] = useState<Potential[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER)
  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchPotentials = async (pageNum: number, append: boolean = false) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const res = await fetch(`/api/public/potentials?page=${pageNum}&limit=20`)
      if (!res.ok) throw new Error("Failed to fetch potentials")

      const data: PotentialsResponse = await res.json()
      
      if (append) {
        setPotentials(prev => [...prev, ...data.items])
      } else {
        setPotentials(data.items)
      }
      
      setHasMore(data.pagination.hasMore)
      setTotal(data.pagination.total)
    } catch (error) {
      console.error("Error fetching potentials:", error)
      if (!append) {
        setPotentials([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchPotentials(1, false)
  }, [])

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch('/api/public/settings')
        if (res.ok) {
          const settings = await res.json()
          if (settings.potensiBanner) {
            setBannerImage(settings.potensiBanner)
          }
        }
      } catch (error) {
        console.error('Failed to fetch banner:', error)
      }
    }
    fetchBanner()
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPotentials(nextPage, true)
    }
  }, [page, hasMore, loadingMore])

  useEffect(() => {
    if (!hasMore || total <= 20) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          handleLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loadingMore, handleLoadMore, total])

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt="Potensi Unggulan"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Potensi Unggulan Kelurahan</h1>
          <p className="text-slate-300 mt-2">Produk dan wisata unggulan Kelurahan Sendangan</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : potentials.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Belum Ada Potensi Unggulan"
              description="Saat ini belum ada data potensi unggulan yang tersedia. Silakan kembali lagi nanti untuk melihat berbagai potensi menarik dari Kelurahan Sendangan."
              actionLabel="Kembali ke Beranda"
              actionHref="/"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {potentials.map((potential, index) => (
                  <PotentialCard
                    key={potential.id}
                    potential={potential}
                    delay={index * 100}
                  />
                ))}
              </div>

              {total > 20 && (
                <div ref={observerTarget} className="mt-8 text-center">
                  {loadingMore && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Memuat potensi lainnya...</span>
                    </div>
                  )}
                  
                  {!loadingMore && hasMore && (
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      className="min-w-[200px]"
                    >
                      Muat Lebih Banyak
                    </Button>
                  )}

                  {!hasMore && (
                    <p className="text-sm text-muted-foreground">
                      Menampilkan semua {total} potensi unggulan
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
