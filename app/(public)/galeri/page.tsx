"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ImageIcon, Loader2 } from "lucide-react"
import { EmptyState } from "@/components/empty-state"

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074"

interface GalleryItem {
  id: number
  url: string
  caption: string | null
  createdAt: string
}

interface GalleryResponse {
  items: GalleryItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export default function GaleriPage() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER)
  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchGallery = async (pageNum: number, append: boolean = false) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const res = await fetch(`/api/public/gallery?page=${pageNum}&limit=20`)
      if (!res.ok) throw new Error("Failed to fetch gallery")

      const data: GalleryResponse = await res.json()
      
      if (append) {
        setImages(prev => [...prev, ...data.items])
      } else {
        setImages(data.items)
      }
      
      setHasMore(data.pagination.hasMore)
      setTotal(data.pagination.total)
    } catch (error) {
      console.error("Error fetching gallery:", error)
      if (!append) {
        setImages([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchGallery(1, false)
  }, [])

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch('/api/public/settings')
        if (res.ok) {
          const settings = await res.json()
          if (settings.galeriBanner) {
            setBannerImage(settings.galeriBanner)
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
      fetchGallery(nextPage, true)
    }
  }, [page, hasMore, loadingMore])

  useEffect(() => {
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
  }, [hasMore, loadingMore, handleLoadMore])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-12 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt="Galeri Kegiatan"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Galeri Kegiatan</h1>
          <p className="text-slate-300 mt-2">Dokumentasi kegiatan dan potensi Kelurahan Sendangan</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="bg-slate-50 p-4">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="Galeri Masih Kosong"
              description="Belum ada foto kegiatan yang tersedia saat ini. Pantau terus halaman ini untuk melihat dokumentasi kegiatan dan momen menarik dari Kelurahan Sendangan."
              actionLabel="Lihat Berita Terkini"
              actionHref="/berita"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative w-full h-64 bg-slate-200">
                      <Image
                        src={image.url}
                        alt={image.caption || "Gallery image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="bg-slate-50 p-4">
                      <p className="text-slate-700 font-medium text-center line-clamp-1">
                        {image.caption || "Foto Kegiatan"}
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {formatDate(image.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div ref={observerTarget} className="mt-8 text-center">
                {loadingMore && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Memuat foto lainnya...</span>
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

                {!hasMore && images.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Menampilkan semua {total} foto
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle className="sr-only">
            {selectedImage?.caption || "Galeri Foto"}
          </DialogTitle>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.caption || "Gallery image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
              {selectedImage.caption && (
                <div className="text-center">
                  <p className="text-lg font-medium">{selectedImage.caption}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(selectedImage.createdAt)}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
