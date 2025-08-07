'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { 
  Shield, 
  Zap, 
  Users, 
  Brain, 
  Lock, 
  Globe, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Target,
  Eye,
  Cpu
} from 'lucide-react'

const features = [
  {
    title: "AI-Powered Threat Detection",
    description: "Advanced machine learning algorithms that continuously learn and adapt to new threats in real-time.",
    icon: Brain,
    category: "Core Technology"
  },
  {
    title: "Real-Time Monitoring",
    description: "24/7 surveillance of your social media accounts with instant threat detection and alerts.",
    icon: Eye,
    category: "Monitoring"
  },
  {
    title: "Automated Protection",
    description: "Instant blocking of malicious content, phishing attempts, and suspicious activities.",
    icon: Shield,
    category: "Protection"
  },
  {
    title: "Multi-Platform Support",
    description: "Comprehensive protection across Instagram, Twitter, Facebook, and more platforms.",
    icon: Globe,
    category: "Compatibility"
  },
  {
    title: "Advanced Analytics",
    description: "Detailed insights and reports about your security posture and threat landscape.",
    icon: BarChart3,
    category: "Analytics"
  },
  {
    title: "Intelligent Filtering",
    description: "NLP-based content analysis to distinguish between legitimate and harmful content.",
    icon: Cpu,
    category: "Technology"
  }
]

const capabilities = [
  {
    title: "Phishing Detection",
    description: "Identifies and blocks phishing attempts before they reach your inbox or timeline.",
    icon: Target,
    tier: ["second-tier", "third-tier"]
  },
  {
    title: "URL Scanning",
    description: "Real-time scanning of links for malicious content and suspicious domains.",
    icon: Eye,
    tier: ["second-tier", "third-tier"]
  },
  {
    title: "Threat Intelligence",
    description: "Access to global threat databases and emerging threat patterns.",
    icon: Brain,
    tier: ["third-tier"]
  },
  {
    title: "Automated Blocking",
    description: "Automatic removal of harmful content and blocking of suspicious accounts.",
    icon: Shield,
    tier: ["third-tier"]
  },
  {
    title: "IP/Domain Scanning",
    description: "Advanced scanning of IP addresses and domains for malicious activity.",
    icon: Globe,
    tier: ["third-tier"]
  },
  {
    title: "Priority Support",
    description: "24/7 dedicated support with rapid response times.",
    icon: Users,
    tier: ["second-tier", "third-tier"]
  }
]

const stats = [
  { label: "Threats Detected", value: "2.5M+", icon: AlertTriangle },
  { label: "Accounts Protected", value: "500K+", icon: Users },
  { label: "Success Rate", value: "99.9%", icon: CheckCircle },
  { label: "Response Time", value: "< 1s", icon: Zap }
]

export default function PlatformPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Advanced AI-Powered Security Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Eurasian combines cutting-edge artificial intelligence with comprehensive cybersecurity 
            to provide unparalleled protection for your digital presence across social media platforms.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform is built with state-of-the-art technology to provide comprehensive protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    {feature.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Capabilities</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Unlock powerful security features with our premium tiers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <capability.icon className="h-6 w-6 text-primary" />
                    <div className="flex gap-1">
                      {capability.tier.includes("second-tier") && (
                        <Badge variant="outline" className="text-xs">Pro</Badge>
                      )}
                      {capability.tier.includes("third-tier") && (
                        <Badge variant="default" className="text-xs">Enterprise</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {capability.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Eurasian Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI-powered security system works seamlessly in the background to protect you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Connect Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Securely connect your social media accounts using OAuth authentication
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardTitle>AI Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Our AI agents continuously monitor your accounts for threats and suspicious activity
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Instant Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get real-time alerts and automated protection based on your subscription tier
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Standards Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Security & Compliance</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We maintain the highest security standards to protect your data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Lock className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  All data is encrypted in transit and at rest
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">SOC 2 Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Regular security audits and compliance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Full compliance with data protection regulations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                <h3 className="font-semibold mb-2">Regular Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Continuous security improvements and updates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}