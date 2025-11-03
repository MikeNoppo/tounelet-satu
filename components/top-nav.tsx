"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Users, Layers, Zap, Newspaper, Images, Map, Menu, X } from "lucide-react"
import { useState } from "react"

const navItems = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Profil", href: "/profil", icon: Users },
  { label: "Struktur", href: "/struktur", icon: Layers },
  { label: "Potensi", href: "/potensi", icon: Zap },
  { label: "Berita", href: "/berita", icon: Newspaper },
  { label: "Galeri", href: "/galeri", icon: Images },
  { label: "Peta", href: "/peta", icon: Map },
]

export function TopNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 hover:text-green-600 transition-colors">
            <Image 
              src="/Emblem_of_Minahasa.png" 
              alt="Logo Minahasa" 
              width={32} 
              height={32}
            />
            <span className="hidden sm:inline">Desa Tounelet Satu</span>
            <span className="sm:hidden">Tounelet Satu</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "text-slate-700 hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <Link
            href="/admin/login"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-700 hover:bg-green-800 transition-colors"
          >
            Admin
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "text-slate-700 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-green-700 text-white hover:bg-green-800 transition-colors mt-2"
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
