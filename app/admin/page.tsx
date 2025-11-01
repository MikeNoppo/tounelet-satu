"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  Users, 
  UserPlus, 
  Trash2,
  Mail,
  Shield,
  TrendingUp,
  Eye
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog"
import Link from "next/link"

interface User {
  id: string
  email: string
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    posts: 0,
    gallery: 0,
    potentials: 0,
    users: 0,
  })
  const [users, setUsers] = useState<User[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchUsers()
  }, [])

  const fetchStats = async () => {
    try {
      const [postsRes, galleryRes, potentialsRes, usersRes] = await Promise.all([
        fetch('/api/admin/posts'),
        fetch('/api/admin/gallery'),
        fetch('/api/admin/potentials'),
        fetch('/api/admin/users'),
      ])

      const [posts, gallery, potentials, users] = await Promise.all([
        postsRes.json().catch(() => []),
        galleryRes.json().catch(() => []),
        potentialsRes.json().catch(() => []),
        usersRes.json().catch(() => []),
      ])

      setStats({
        posts: posts.length || 0,
        gallery: gallery.length || 0,
        potentials: potentials.length || 0,
        users: users.length || 0,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak sama",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "User baru berhasil ditambahkan",
        })
        setFormData({ email: "", password: "", confirmPassword: "" })
        setShowAddUser(false)
        fetchUsers()
        fetchStats()
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create user')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal membuat user",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setDeleting(true)

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "User berhasil dihapus",
        })
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        fetchUsers()
        fetchStats()
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus user",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const statCards = [
    {
      title: "Total Posts",
      value: stats.posts.toString(),
      icon: FileText,
      description: "Berita & Pengumuman",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/posts",
    },
    {
      title: "Galeri",
      value: stats.gallery.toString(),
      icon: ImageIcon,
      description: "Foto kegiatan",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Potensi",
      value: stats.potentials.toString(),
      icon: Sparkles,
      description: "Unggulan kelurahan",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Users",
      value: stats.users.toString(),
      icon: Users,
      description: "Admin users",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600 mt-1">Selamat datang di panel admin Kelurahan Sendangan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Sistem dimulai</p>
                  <p className="text-slate-500">Panel admin siap digunakan</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="/admin/posts"
                className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">Buat Post Baru</p>
                <p className="text-sm text-slate-500">Tambah berita atau pengumuman</p>
              </a>
              <a
                href="/admin/galeri"
                className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">Upload Galeri</p>
                <p className="text-sm text-slate-500">Tambah foto kegiatan</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
