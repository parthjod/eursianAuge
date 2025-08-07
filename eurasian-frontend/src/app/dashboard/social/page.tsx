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
  Plus,
  RefreshCw,
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

export default function SocialPage() {
  const { user, logout } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState([
    {
      id: '1',
      platform: 'Instagram',
      username: '@user123',
      connected: true,
      isActive: true,
      followers: 1250,
      following: 350,
      posts: 89,
      lastScanned: new Date('2024-07-20').toISOString()
    },
    {
      id: '2', 
      platform: 'Twitter',
      username: '@user123',
      connected: true,
      isActive: true,
      followers: 890,
      following: 420,
      posts: 234,
      lastScanned: new Date('2024-07-19').toISOString()
    },
    {
      id: '3',
      platform: 'Facebook',
      username: 'User Name',
      connected: false,
      isActive: false,
      followers: 0,
      following: 0,
      posts: 0,
      lastScanned: null
    }
  ])

  // Fetch social accounts data
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/social', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setAccounts(data.accounts || [])
        }
      } catch (error) {
        console.error('Error fetching social accounts:', error)
        toast({
          title: "Error",
          description: "Failed to load social accounts",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchAccounts()
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

  const handleConnectAccount = async (platform: string) => {
    try {
      // For demo purposes, we'll simulate OAuth flow
      // In real implementation, this would redirect to the OAuth provider
      toast({
        title: "Connecting to " + platform,
        description: "Redirecting to OAuth login...",
      })
      
      // Simulate OAuth connection
      setTimeout(() => {
        setAccounts(prev => prev.map(account => 
          account.platform === platform 
            ? { 
                ...account, 
                connected: true, 
                isActive: true,
                followers: Math.floor(Math.random() * 2000),
                following: Math.floor(Math.random() * 500),
                posts: Math.floor(Math.random() * 100),
                lastScanned: new Date().toISOString()
              }
            : account
        ))
        toast({
          title: "Success!",
          description: `${platform} account connected successfully.`,
        })
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to connect ${platform} account`,
        variant: "destructive"
      })
    }
  }

  const handleDisconnectAccount = async (accountId: string, platform: string) => {
    try {
      setAccounts(prev => prev.map(account => 
        account.id === accountId 
          ? { 
              ...account, 
              connected: false, 
              isActive: false,
              followers: 0,
              following: 0,
              posts: 0,
              lastScanned: null
            }
          : account
      ))
      toast({
        title: "Account Disconnected",
        description: `${platform} account has been disconnected.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to disconnect ${platform} account`,
        variant: "destructive"
      })
    }
  }

  const handleScanAccount = async (accountId: string) => {
    try {
      const response = await fetch('/api/social/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Scan Complete",
          description: data.message || "Account scan completed successfully.",
        })
      }
    } catch (error) {
      console.error('Error scanning account:', error)
      toast({
        title: "Error",
        description: "Failed to scan account",
        variant: "destructive"
      })
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />
      default:
        return <Users className="h-5 w-5 text-gray-600" />
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
                  item.title === "Social Accounts" 
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
                <h1 className="text-2xl font-bold text-slate-900">Social Accounts</h1>
                <p className="text-slate-600">Manage and monitor your social media accounts</p>
              </div>
              <Button onClick={() => handleConnectAccount('New Account')}>
                <Plus className="mr-2 h-4 w-4" />
                Connect Account
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
                    <p className="text-slate-600">Loading accounts...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <Card key={account.id} className="border-slate-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getPlatformIcon(account.platform)}
                              <CardTitle className="text-slate-900">{account.platform}</CardTitle>
                            </div>
                            <Badge variant={account.isActive ? 'default' : 'secondary'}>
                              {account.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-600">@{account.username}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-slate-700">Followers:</span>
                                <p className="text-slate-600">{account.followers || 0}</p>
                              </div>
                              <div>
                                <span className="font-medium text-slate-700">Following:</span>
                                <p className="text-slate-600">{account.following || 0}</p>
                              </div>
                              <div>
                                <span className="font-medium text-slate-700">Posts:</span>
                                <p className="text-slate-600">{account.posts || 0}</p>
                              </div>
                              <div>
                                <span className="font-medium text-slate-700">Last Scan:</span>
                                <p className="text-slate-600">
                                  {account.lastScanned ? new Date(account.lastScanned).toLocaleDateString() : 'Never'}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleScanAccount(account.id)}
                                disabled={!account.connected}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Scan
                              </Button>
                              {account.connected ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDisconnectAccount(account.id, account.platform)}
                                >
                                  Disconnect
                                </Button>
                              ) : (
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={() => handleConnectAccount(account.platform)}
                                >
                                  Connect
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="col-span-full border-slate-200">
                      <CardContent className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Connected Accounts</h3>
                          <p className="text-slate-600 mb-4">Connect your social media accounts to start monitoring them for security threats.</p>
                          <Button onClick={() => handleConnectAccount('Instagram')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Connect First Account
                          </Button>
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