"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074"

export default function PetaPage() {
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch('/api/public/settings')
        if (res.ok) {
          const settings = await res.json()
          if (settings.petaBanner) {
            setBannerImage(settings.petaBanner)
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
            alt="Peta Wilayah"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-4xl font-bold">Peta Administrasi Wilayah</h1>
          <p className="text-slate-300 mt-2">Visualisasi wilayah Kelurahan Sendangan</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-slate-300 rounded-lg p-12 bg-slate-50 text-center">
            <p className="text-slate-600 text-lg mb-4">Area Peta Kelurahan Sendangan</p>
            <p className="text-slate-500 text-sm">(Embed ArcGIS/Google Maps di sini)</p>
            <div className="mt-8 h-96 bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=600&fit=crop"
                alt="Placeholder Peta"
                fill
                className="object-cover opacity-30"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
              <p className="text-slate-700 font-semibold z-10 relative">Placeholder untuk peta interaktif</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
