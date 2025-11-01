import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Logo & Address */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-4">
              <span className="text-2xl">🥜</span>
              <span>Kelurahan Sendangan</span>
            </div>
            <p className="text-slate-600 text-sm">Jl. Sendangan, Kec. Kawangkoan, Kab. Minahasa</p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Kontak</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>Email: kelurahansendangan@contoh.go.id</p>
              <p>Telepon/WA: 0812-xxxx-xxxx</p>
            </div>
          </div>

          {/* Column 3: Quick Links */}
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

        {/* Copyright */}
        <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
          <p>© {currentYear} Kelurahan Sendangan. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
