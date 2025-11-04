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
          <p className="text-slate-300 mt-2">Visualisasi wilayah Desa Tounelet Satu</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Peta Desa Tounelet Satu</h2>
          </div>
          <div className="relative w-full" style={{ height: 'auto' }}>
            <Image
              src="/map/maps.jpg"
              alt="Peta Desa Tounelet Satu"
              width={1920}
              height={1080}
              className="w-full h-auto rounded-lg shadow-lg"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  )
}
