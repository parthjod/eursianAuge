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
  DropdownMenuSeparator,
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
  TrendingUp,
  ChevronDown
} from 'lucide-react'

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

export default function AnalyticsPage() {
  const { user, logout } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalThreats: 0,
    blockedThreats: 0,
    activeAccounts: 0,
    securityScore: 0,
    threatsByType: {},
    threatsByPlatform: {},
    monthlyTrends: []
  })

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/analytics', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data.analytics || analytics)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchAnalytics()
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
                  item.title === "Analytics" 
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
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
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
                <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
                <p className="text-slate-600">Security analytics and insights</p>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading analytics...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-slate-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Threats</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{analytics.totalThreats}</div>
                        <p className="text-xs text-slate-600">All time</p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Blocked Threats</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{analytics.blockedThreats}</div>
                        <p className="text-xs text-green-600">Successfully blocked</p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Active Accounts</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{analytics.activeAccounts}</div>
                        <p className="text-xs text-slate-600">Under protection</p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Security Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{analytics.securityScore}%</div>
                        <p className="text-xs text-green-600">Overall rating</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-slate-900">Threats by Type</CardTitle>
                        <CardDescription className="text-slate-600">Breakdown of detected threat types</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(analytics.threatsByType).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">{type}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-slate-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${(Number(count) / analytics.totalThreats) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-slate-600">{String(count)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-slate-900">Threats by Platform</CardTitle>
                        <CardDescription className="text-slate-600">Distribution across social platforms</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(analytics.threatsByPlatform).map(([platform, count]) => (
                            <div key={platform} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">{platform}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-slate-200 rounded-full h-2">
                                  <div 
                                    className="bg-purple-600 h-2 rounded-full" 
                                    style={{ width: `${(Number(count) / analytics.totalThreats) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-slate-600">{String(count)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}