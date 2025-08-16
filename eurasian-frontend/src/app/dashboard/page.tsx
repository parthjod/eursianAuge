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
  LogOut,
  Instagram,
  Twitter,
  Facebook,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  User,
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
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    badge: null,
  },
]

export default function DashboardPage() {
  const { user, logout } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  
  // Real data state
  const [metrics, setMetrics] = useState({
    threatsBlocked: 1204,
    accountsProtected: 3,
    securityScore: null, // Will show error
    activeAlerts: 2
  })
  
  const [recentThreats, setRecentThreats] = useState([
    {
      id: 1,
      platform: "Twitter",
      type: "Phishing Link",
      details: "Suspicious URL detected in direct message",
      status: "Blocked",
      date: "2024-07-21",
      severity: "High"
    },
    {
      id: 2,
      platform: "Instagram",
      type: "Malicious Content",
      details: "Harmful content flagged in comments",
      status: "Flagged",
      date: "2024-07-20",
      severity: "Medium"
    },
    {
      id: 3,
      platform: "Facebook",
      type: "Suspicious Login",
      details: "Unusual login attempt detected",
      status: "Alerted",
      date: "2024-07-20",
      severity: "High"
    },
    {
      id: 4,
      platform: "Twitter",
      type: "Spam Bot",
      details: "Automated spam account detected",
      status: "Blocked",
      date: "2024-07-19",
      severity: "Low"
    },
    {
      id: 5,
      platform: "Instagram",
      type: "Fake Profile",
      details: "Impersonation account reported",
      status: "Investigating",
      date: "2024-07-18",
      severity: "Medium"
    }
  ])
  
  const [connectedAccounts, setConnectedAccounts] = useState([
    { platform: "Instagram", username: "@user123", connected: true },
    { platform: "Twitter", username: "@user123", connected: true },
    { platform: "Facebook", username: "User Name", connected: false },
  ])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch metrics
        const metricsResponse = await fetch('/api/analytics/dashboard', {
          credentials: 'include'
        })
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json()
          setMetrics(metricsData.metrics || metrics)
        }
        
        // Fetch recent threats
        const threatsResponse = await fetch('/api/threats', {
          credentials: 'include'
        })
        if (threatsResponse.ok) {
          const threatsData = await threatsResponse.json()
          if (threatsData.threats && threatsData.threats.length > 0) {
            setRecentThreats(threatsData.threats.slice(0, 5))
          }
        }
        
        // Fetch connected accounts
        const socialResponse = await fetch('/api/social', {
          credentials: 'include'
        })
        if (socialResponse.ok) {
          const socialData = await socialResponse.json()
          if (socialData.accounts && socialData.accounts.length > 0) {
            setConnectedAccounts(socialData.accounts)
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchDashboardData()
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

  const handleConnectSocial = (platform: string) => {
    toast({
      title: "Connect Account",
      description: `${platform} OAuth integration coming soon!`,
    })
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
                  item.title === "Dashboard" 
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
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Welcome back to your security dashboard</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Login successful Welcome back to Eurasian!
                </div>
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
                    <p className="text-slate-600">Loading dashboard...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-slate-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Threats Blocked</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{metrics.threatsBlocked.toLocaleString()}</div>
                        <p className="text-xs text-green-600">+20.1% from last month</p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Accounts Protected</CardTitle>
                        <User className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{metrics.accountsProtected}</div>
                        <p className="text-xs text-slate-600">{metrics.accountsProtected} connected</p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Security Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        {metrics.securityScore !== null ? (
                          <>
                            <div className="text-2xl font-bold text-slate-900">{metrics.securityScore}%</div>
                            <p className="text-xs text-green-600">Excellent</p>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl font-bold text-red-600">Error</div>
                            <p className="text-xs text-red-600">Could not load security score</p>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Active Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{metrics.activeAlerts}</div>
                        <p className="text-xs text-orange-600">Requires attention</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Threats */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-slate-900">Recent Threats</CardTitle>
                        <CardDescription className="text-slate-600">Latest security threats detected and blocked</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-5 gap-4 text-xs font-medium text-slate-500 uppercase tracking-wider pb-2 border-b">
                            <div>Platform</div>
                            <div>Type</div>
                            <div className="col-span-2">Details</div>
                            <div>Status</div>
                          </div>
                          {recentThreats.map((threat) => (
                            <div key={threat.id} className="grid grid-cols-5 gap-4 text-sm">
                              <div className="font-medium">{threat.platform}</div>
                              <div>{threat.type}</div>
                              <div className="col-span-2 text-slate-600">{threat.details}</div>
                              <div>
                                <Badge 
                                  variant={threat.status === 'Blocked' ? 'default' : 
                                          threat.status === 'Flagged' ? 'secondary' : 
                                          threat.status === 'Alerted' ? 'destructive' : 'outline'}
                                  className="text-xs"
                                >
                                  {threat.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Connected Accounts */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-slate-900">Connected Accounts</CardTitle>
                        <CardDescription className="text-slate-600">Social media accounts under protection</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-slate-600 mb-4">Connect your social media accounts to protect them from security threats.</p>
                          {connectedAccounts.map((account, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                {account.platform === 'Instagram' && <Instagram className="h-5 w-5 text-pink-600" />}
                                {account.platform === 'Twitter' && <Twitter className="h-5 w-5 text-blue-400" />}
                                {account.platform === 'Facebook' && <Facebook className="h-5 w-5 text-blue-600" />}
                                <div>
                                  <p className="font-medium text-slate-900">{account.platform}</p>
                                  <p className="text-sm text-slate-600">
                                    {account.connected ? account.username : 'Not connected'}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant={account.connected ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleConnectSocial(account.platform)}
                              >
                                {account.connected ? 'Manage' : 'Connect'}
                              </Button>
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