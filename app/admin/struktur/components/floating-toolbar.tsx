"use client"

import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

type FloatingToolbarProps = {
  nodeId: string
  position: { x: number; y: number }
  onEdit: () => void
  onDelete: () => void
}

export default function FloatingToolbar({
  position,
  onEdit,
  onDelete,
}: FloatingToolbarProps) {
  return (
    <div
      className="absolute z-50 flex gap-2 bg-white rounded-lg shadow-lg border border-slate-200 p-2"
      style={{
        left: position.x,
        top: position.y - 60,
      }}
    >
      <Button
        size="sm"
        variant="outline"
        onClick={onEdit}
        className="gap-2"
      >
        <Edit className="w-4 h-4" />
        Edit
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onDelete}
        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>
    </div>
  )
}
