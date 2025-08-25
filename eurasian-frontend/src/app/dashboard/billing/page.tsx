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
  CreditCard,
  ChevronDown,
  Crown,
  Zap,
  Users as UsersIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
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

const subscriptionPlans = [
  {
    id: 'first-tier',
    name: 'First Tier Protection',
    price: 29,
    icon: Shield,
    description: 'Basic monitoring and NLP-based detection',
    features: [
      'Basic threat monitoring',
      'NLP-based content analysis',
      'Weekly reports',
      'Email alerts'
    ],
    popular: false
  },
  {
    id: 'second-tier',
    name: 'Second Tier Protection',
    price: 79,
    icon: Zap,
    description: 'Advanced monitoring with phishing detection',
    features: [
      'Everything from First tier',
      'Phishing detection',
      'URL scanning',
      'Real-time alerts',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'third-tier',
    name: 'Third Tier Protection',
    price: 149,
    icon: UsersIcon,
    description: 'Enterprise-grade security with full automation',
    features: [
      'Everything from First and Second tier',
      'Advanced threat intelligence',
      'Automated blocking',
      'IP/Domain scanning',
      '24/7 dedicated support'
    ],
    popular: false
  }
]

export default function BillingPage() {
  const { user, logout } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  type Subscription = {
    plan: string
    status: string
    nextPaymentDate?: string
    // add other fields as needed
  }
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true)
        
        const response = await fetch('/api/subscription', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setSubscription(data.subscription)
        } else {
          // User might not have a subscription yet
          setSubscription(null)
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error)
        toast({
          title: "Error",
          description: "Failed to load subscription data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchSubscriptionData()
    }
  }, [user, toast])

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    }
  }

  const handleUpgrade = async (planId: string) => {
    try {
      setProcessingAction(planId)
      
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          plan: planId,
          billingCycle: 'monthly'
        }),
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Upgrade successful",
          description: `You have been upgraded to ${subscriptionPlans.find(p => p.id === planId)?.name}`,
        })
        // Refresh subscription data
        setTimeout(() => window.location.reload(), 1000)
      } else {
        const error = await response.json()
        toast({
          title: "Upgrade failed",
          description: error.error || "Failed to upgrade subscription",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "Failed to upgrade subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your current billing period.')) {
      return
    }

    try {
      setProcessingAction('cancel')
      
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        toast({
          title: "Subscription cancelled",
          description: "Your subscription has been cancelled. You will continue to have access until the end of your current billing period.",
        })
        // Refresh subscription data
        setTimeout(() => window.location.reload(), 1000)
      } else {
        const error = await response.json()
        toast({
          title: "Cancellation failed",
          description: error.error || "Failed to cancel subscription",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const getCurrentPlan = () => {
    if (!subscription) return null
    return subscriptionPlans.find(plan => plan.id === subscription.plan)
  }

  const currentPlan = getCurrentPlan()

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
                  item.title === "Billing" 
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
                <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
                <p className="text-slate-600">Manage your subscription and billing information</p>
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
                    <p className="text-slate-600">Loading billing information...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Current Subscription */}
                  {currentPlan && (
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Crown className="h-5 w-5 text-yellow-500" />
                          <span>Current Subscription</span>
                          {subscription && subscription.status === 'active' && (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          )}
                          {subscription && subscription.status === 'cancelled' && (
                            <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          You are currently subscribed to the {currentPlan.name} plan
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Plan</label>
                            <p className="text-lg font-semibold text-slate-900">{currentPlan.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Price</label>
                            <p className="text-lg font-semibold text-slate-900">${currentPlan.price}/month</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Next Billing</label>
                            <p className="text-lg font-semibold text-slate-900">
                              {subscription && subscription.nextPaymentDate 
                                ? new Date(subscription.nextPaymentDate).toLocaleDateString()
                                : 'N/A'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {subscription && subscription.status === 'active' && (
                          <div className="mt-6 pt-6 border-t border-slate-200">
                            <Button
                              variant="destructive"
                              onClick={handleCancelSubscription}
                              disabled={processingAction === 'cancel'}
                            >
                              {processingAction === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Available Plans */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Protection Level</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {subscriptionPlans.map((plan) => (
                        <Card 
                          key={plan.id} 
                          className={`border-slate-200 relative ${
                            plan.popular ? 'border-primary shadow-lg scale-105' : ''
                          } ${
                            currentPlan?.id === plan.id ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          {plan.popular && (
                            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              Most Popular
                            </Badge>
                          )}
                          
                          <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                              <plan.icon className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription className="text-3xl font-bold">
                              ${plan.price}<span className="text-sm font-normal text-slate-600">/month</span>
                            </CardDescription>
                            <p className="text-sm text-slate-600">{plan.description}</p>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <ul className="space-y-2">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  <span className="text-sm text-slate-700">{feature}</span>
                                </li>
                              ))}
                            </ul>
                            
                            <Button
                              className={`w-full ${
                                currentPlan?.id === plan.id 
                                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  : plan.popular 
                                    ? 'bg-primary text-primary-foreground'
                                    : ''
                              }`}
                              onClick={() => handleUpgrade(plan.id)}
                              disabled={
                                Boolean(processingAction === plan.id) || 
                                Boolean(currentPlan?.id === plan.id) ||
                                Boolean(currentPlan && subscriptionPlans.indexOf(plan) <= subscriptionPlans.indexOf(currentPlan))
                              }
                            >
                              {processingAction === plan.id ? 'Processing...' :
                               currentPlan?.id === plan.id ? 'Current Plan' :
                               (currentPlan && subscriptionPlans.indexOf(plan) <= subscriptionPlans.indexOf(currentPlan)) 
                                 ? 'Downgrade' : 'Upgrade'}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Billing History */}
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span>Billing History</span>
                      </CardTitle>
                      <CardDescription>
                        View your payment history and upcoming charges
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">No billing history available</p>
                        <p className="text-sm text-slate-500 mt-2">
                          Your billing history will appear here once you subscribe to a plan
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}