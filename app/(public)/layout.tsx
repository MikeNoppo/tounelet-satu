import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/sidebar-provider"
import { MainContentWrapper } from "@/components/main-content-wrapper"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <Sidebar />
      <MainContentWrapper>
        <main className="flex-1">{children}</main>
        <Footer />
      </MainContentWrapper>
      <FloatingWhatsApp />
    </SidebarProvider>
  )
}
