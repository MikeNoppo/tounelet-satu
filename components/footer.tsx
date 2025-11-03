"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ContactSettings {
  email?: string
  telp?: string
  alamat?: string
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [contact, setContact] = useState<ContactSettings>({})

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch('/api/public/settings')
        if (res.ok) {
          const data = await res.json()
          setContact({
            email: data.email,
            telp: data.telp,
            alamat: data.alamat,
          })
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error)
      }
    }
    fetchContact()
  }, [])

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-4">
              <Image 
                src="/Emblem_of_Minahasa.png" 
                alt="Logo Minahasa" 
                width={32} 
                height={32}
              />
              <span>Desa Tounelet Satu</span>
            </div>
            <p className="text-slate-600 text-sm">
              {contact.alamat || 'Kec. Sonder, Minahasa'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Kontak</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>Email: {contact.email || '-'}</p>
              <p>Telepon/WA: {contact.telp || '-'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Tautan Cepat</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                Beranda
              </Link>
              <br />
              <Link href="/profil" className="text-slate-600 hover:text-slate-900 transition-colors">
                Profil
              </Link>
              <br />
              <Link href="/berita" className="text-slate-600 hover:text-slate-900 transition-colors">
                Berita
              </Link>
              <br />
              <Link href="/galeri" className="text-slate-600 hover:text-slate-900 transition-colors">
                Galeri
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
          <p>© {currentYear} Desa Tounelet Satu. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
