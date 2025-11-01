"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - simplified for sidebar layout */}
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-lg text-slate-900 group transition-all hover-scale"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform">🥜</span>
            <span className="group-hover:text-blue-600 transition-colors">Kelurahan Sendangan</span>
          </Link>

          {/* Empty space for layout balance */}
          <div />
        </div>
      </div>
    </header>
  )
}
