'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { 
  LayoutDashboard, 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  CreditCard,
  LogOut,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ChevronDown
} from 'lucide-react'

type Threat = {
  id: string
  type: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Blocked' | 'Investigating' | 'Resolved'
  description: string
  source: string
  target: string
  detectedAt: string
  actionTaken: string
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Threat Monitor",
    url: "/dashboard/threats",
    icon: Shield,
    badge: 2,
  },
  {
    title: "Social Accounts",
    url: "/dashboard/social",
    icon: Users,
    badge: null,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: CreditCard,
    badge: null,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    badge: null,
  },
]

export default function ThreatsPage() {
  const { user, logout } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [threats, setThreats] = useState<Threat[]>([])

  // Fetch threats data
  useEffect(() => {
    const fetchThreats = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/threats', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setThreats(data.threats || [])
        }
      } catch (error) {
        console.error('Error fetching threats:', error)
        toast({
          title: "Error",
          description: "Failed to load threats data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchThreats()
    }
  }, [user, toast])

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    }
  }

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  const handleRefreshThreats = async () => {
    try {
      const response = await fetch('/api/threats/update', {
        method: 'POST',
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setThreats(data.threats || [])
        toast({
          title: "Threats Updated",
          description: "Threat data has been refreshed.",
        })
      }
    } catch (error) {
      console.error('Error refreshing threats:', error)
      toast({
        title: "Error",
        description: "Failed to refresh threats",
        variant: "destructive"
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-bold">Eurasian</h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.url)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                  item.title === "Threat Monitor" 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                <AvatarFallback>{user?.name?.charAt(0) || ''}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-800">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Threat Monitor</h1>
                <p className="text-slate-600">Monitor and manage security threats</p>
              </div>
              <Button onClick={handleRefreshThreats} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading threats...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {threats.length > 0 ? (
                    threats.map((threat) => (
                      <Card key={threat.id} className="border-slate-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className={`h-5 w-5 ${
                                threat.severity === 'Critical' ? 'text-red-600' :
                                threat.severity === 'High' ? 'text-orange-600' :
                                threat.severity === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                              }`} />
                              <CardTitle className="text-slate-900">{threat.type}</CardTitle>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={
                                threat.status === 'Blocked' ? 'default' :
                                threat.status === 'Investigating' ? 'secondary' : 'outline'
                              }>
                                {threat.status}
                              </Badge>
                              <Badge variant={
                                threat.severity === 'Critical' ? 'destructive' :
                                threat.severity === 'High' ? 'destructive' :
                                threat.severity === 'Medium' ? 'secondary' : 'outline'
                              }>
                                {threat.severity}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription className="text-slate-600">{threat.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-slate-700">Source:</span>
                              <p className="text-slate-600">{threat.source}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Target:</span>
                              <p className="text-slate-600">{threat.target}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Detected:</span>
                              <p className="text-slate-600">{new Date(threat.detectedAt).toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Action:</span>
                              <p className="text-slate-600">{threat.actionTaken}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-slate-200">
                      <CardContent className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Threats Detected</h3>
                          <p className="text-slate-600">Your accounts are secure. No threats have been detected.</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
