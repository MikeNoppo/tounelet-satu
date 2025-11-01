"use client"

import { useEffect, useState } from "react"
import { Users, Home, User, Calendar, Map } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type IconName = "users" | "home" | "user-male" | "user-female" | "calendar" | "map"

interface StatCardProps {
  label: string
  value: string
  iconName: IconName
  gradient: string
  iconColor: string
  delay?: number
  updatedAt?: string
  trend?: {
    value: number
    label: string
  }
}

const iconMap = {
  "users": Users,
  "home": Home,
  "user-male": User,
  "user-female": User,
  "calendar": Calendar,
  "map": Map,
}

export function StatCard({ 
  label, 
  value, 
  iconName, 
  gradient, 
  iconColor,
  delay = 0,
  updatedAt,
  trend 
}: StatCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 })
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  const Icon = iconMap[iconName]

  // Parse numeric value for counter animation
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0

  useEffect(() => {
    if (isVisible && !hasAnimated && numericValue > 0) {
      setHasAnimated(true)
      let startTime: number | null = null
      const duration = 2000 // 2 seconds
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * numericValue))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [isVisible, hasAnimated, numericValue])

  const displayValue = numericValue > 0 && hasAnimated 
    ? count.toLocaleString('id-ID')
    : value

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden bg-white border-2 border-amber-100 border-l-4 ${iconColor.replace('text-', 'border-l-')} hover:border-green-200 transition-all duration-300 hover:-translate-y-1 opacity-0-init ${
        isVisible ? "animate-fade-in-up" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 ${gradient} opacity-5`} />
      
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-4 rounded-xl ${gradient} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`h-8 w-8 ${iconColor}`} strokeWidth={2} />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
              trend.value >= 0 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              <span>{trend.value >= 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div className="mb-3">
          <p className="text-5xl font-bold text-slate-900 mb-1 group-hover:scale-105 transition-transform duration-300">
            {displayValue}
          </p>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        </div>

        {updatedAt && (
          <div className="pt-3 border-t border-amber-100">
            <p className="text-xs text-slate-400">Diperbarui: {updatedAt}</p>
          </div>
        )}

        <div className={`absolute bottom-0 right-0 w-24 h-24 ${gradient} opacity-10 rounded-tl-full transition-transform duration-500 group-hover:scale-150`} />
      </div>
    </div>
  )
}
