import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  showAnimation?: boolean
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  showAnimation = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className={`relative mb-6 ${
          showAnimation ? "animate-bounce-slow" : ""
        }`}
      >
        {/* Background circle with gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5 rounded-full blur-2xl scale-150" />
        
        {/* Icon container */}
        <div className="relative bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-full p-8 shadow-lg">
          <Icon className="h-16 w-16 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Button asChild variant="outline" size="lg">
          <Link href={actionHref}>
            {actionLabel}
          </Link>
        </Button>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3s' }} />
      </div>
    </div>
  )
}
