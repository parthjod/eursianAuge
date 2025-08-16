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
  Bell,
  Lock,
  Database,
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

export default function SettingsPage() {
  const { user, logout } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false
    }
  })

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

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSetting = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }))
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
                  item.title === "Settings" 
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
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600">Manage your account settings and preferences</p>
              </div>
              <Button onClick={handleSaveSettings} disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Notifications Settings */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Configure how you receive notifications and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Email Notifications</p>
                      <p className="text-sm text-slate-600">Receive security alerts via email</p>
                    </div>
                    <Button
                      variant={settings.notifications.email ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('notifications', 'email')}
                    >
                      {settings.notifications.email ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Push Notifications</p>
                      <p className="text-sm text-slate-600">Receive push notifications on your devices</p>
                    </div>
                    <Button
                      variant={settings.notifications.push ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('notifications', 'push')}
                    >
                      {settings.notifications.push ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">SMS Alerts</p>
                      <p className="text-sm text-slate-600">Receive critical security alerts via SMS</p>
                    </div>
                    <Button
                      variant={settings.notifications.sms ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('notifications', 'sms')}
                    >
                      {settings.notifications.sms ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Security</span>
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                    </div>
                    <Button
                      variant={settings.security.twoFactor ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('security', 'twoFactor')}
                    >
                      {settings.security.twoFactor ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Login Alerts</p>
                      <p className="text-sm text-slate-600">Get notified when someone logs into your account</p>
                    </div>
                    <Button
                      variant={settings.security.loginAlerts ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('security', 'loginAlerts')}
                    >
                      {settings.security.loginAlerts ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Session Timeout</p>
                      <p className="text-sm text-slate-600">Automatically log out after inactivity</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">{settings.security.sessionTimeout} minutes</span>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Privacy & Data</span>
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Control your data and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Data Sharing</p>
                      <p className="text-sm text-slate-600">Allow sharing of anonymized data for security research</p>
                    </div>
                    <Button
                      variant={settings.privacy.dataSharing ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('privacy', 'dataSharing')}
                    >
                      {settings.privacy.dataSharing ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Analytics</p>
                      <p className="text-sm text-slate-600">Help us improve by sharing usage analytics</p>
                    </div>
                    <Button
                      variant={settings.privacy.analytics ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('privacy', 'analytics')}
                    >
                      {settings.privacy.analytics ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Marketing Communications</p>
                      <p className="text-sm text-slate-600">Receive updates about new features and services</p>
                    </div>
                    <Button
                      variant={settings.privacy.marketing ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('privacy', 'marketing')}
                    >
                      {settings.privacy.marketing ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}