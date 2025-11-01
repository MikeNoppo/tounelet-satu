"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"

export function FloatingWhatsApp() {
  const whatsappNumber = "62812xxxx" // Replace with actual number
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:shadow-xl"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={20} />
      <span className="font-medium">Chat WA</span>
    </Link>
  )
}
