"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Search, ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"

interface Facility {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  createdAt: string
}

function FacilityCard({ facility, delay }: { facility: Facility; delay: number }) {
  const { ref, isVisible } = useScrollAnimation<HTMLAnchorElement>({ threshold: 0.2 })

  return (
    <Link
      ref={ref}
      href={`/sarana-prasarana/${facility.id}`}
      className={`group relative bg-white border-2 border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-2xl hover:-translate-y-1 opacity-0-init ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-48 w-full bg-linear-to-br from-primary/10 to-secondary/10 overflow-hidden">
        {facility.imageUrl ? (
          <>
            <Image
              src={facility.imageUrl}
              alt={facility.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Building2 className="h-12 w-12 text-muted-foreground group-hover:scale-110 transition-transform" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {facility.name}
        </h3>
        
        {facility.description && (
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {facility.description.replace(/<[^>]*>/g, "")}
          </p>
        )}

        <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Lihat detail</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Link>
  )
}

export default function SaranaPrasaranaPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [bannerImage] = useState(DEFAULT_BANNER)

  useEffect(() => {
    fetchFacilities()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = facilities.filter(facility =>
        facility.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredFacilities(filtered)
    } else {
      setFilteredFacilities(facilities)
    }
  }, [searchQuery, facilities])

  const fetchFacilities = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/public/facilities')
      const data = await res.json()
      setFacilities(data)
      setFilteredFacilities(data)
    } catch (error) {
      console.error('Failed to fetch facilities:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative h-[400px] overflow-hidden">
        <Image
          src={bannerImage}
          alt="Sarana & Prasarana Banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 border-4 border-white/30">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Sarana & Prasarana
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-lg">
            Fasilitas dan infrastruktur yang tersedia di desa
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Daftar Fasilitas</h2>
              <p className="text-slate-600">
                Temukan berbagai fasilitas yang ada di desa
              </p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari fasilitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
                <Building2 className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchQuery ? "Fasilitas tidak ditemukan" : "Belum ada fasilitas"}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {searchQuery
                  ? "Coba gunakan kata kunci yang berbeda"
                  : "Fasilitas akan ditampilkan di sini"}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Reset Pencarian
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility, index) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  delay={index * 100}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
