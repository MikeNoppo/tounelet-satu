"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Building2 } from "lucide-react"

interface Facility {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  createdAt: string
}

export default function SaranaPrasaranaDetailPage() {
  const params = useParams()
  const [facility, setFacility] = useState<Facility | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFacility = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/public/facilities/${params.id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError("Fasilitas tidak ditemukan")
          } else {
            setError("Gagal memuat fasilitas")
          }
          return
        }

        const data = await res.json()
        setFacility(data)
      } catch (err) {
        console.error("Error fetching facility:", err)
        setError("Terjadi kesalahan saat memuat fasilitas")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchFacility()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="w-full">
        <section className="py-8 px-4 bg-white">
          <div className="mx-auto max-w-4xl">
            <Skeleton className="h-8 w-24 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-8" />
            <Skeleton className="h-96 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error || !facility) {
    return (
      <div className="w-full">
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-4xl text-center">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{error || "Fasilitas tidak ditemukan"}</h2>
            <Button asChild>
              <Link href="/sarana-prasarana">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Sarana & Prasarana
              </Link>
            </Button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="w-full">
      <section className="relative bg-slate-900 text-white py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" size="sm" asChild className="mb-4 text-white hover:text-white">
            <Link href="/sarana-prasarana">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-8 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">
              {facility.name}
            </h1>
          </div>

          {facility.imageUrl && (
            <div className="relative w-full h-[500px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={facility.imageUrl}
                alt={facility.name}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          )}

          {facility.description && (
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: facility.description }}
            />
          )}

          {!facility.description && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-slate-600">Belum ada deskripsi untuk fasilitas ini</p>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Button asChild variant="outline">
              <Link href="/sarana-prasarana">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Fasilitas
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
