"use client"

import type { ReactNode } from "react"
import { useSidebar } from "./sidebar-provider"

export function MainContentWrapper({ children }: { children: ReactNode }) {
  const { isExpanded, isMobile } = useSidebar()

  // Saat collapsed: 80px (w-20), saat expanded: 256px (w-64)
  // Di mobile: selalu 0 karena sidebar overlay
  const marginLeft = isMobile ? "0px" : isExpanded ? "256px" : "80px"

  return (
    <div className="flex flex-col min-h-screen transition-all duration-300" style={{ marginLeft }}>
      {children}
    </div>
  )
}
