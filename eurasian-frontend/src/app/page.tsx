import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Users } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI-Powered Cybersecurity
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Protect your digital presence with advanced AI agents that monitor, detect, and block threats across your social media accounts 24/7.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* AI Agent Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Protection Level</h2>
            <p className="text-muted-foreground text-lg">
              Select the AI agent that best fits your security needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* First Tier */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  First Tier Protection
                </CardTitle>
                <CardDescription className="text-2xl font-bold">
                  $29<span className="text-sm font-normal text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Basic monitoring and NLP-based detection
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Basic threat monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    NLP-based content analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Weekly reports
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Email alerts
                  </li>
                </ul>
                <Link href="/dashboard" className="inline-block w-full">
                  <Button className="w-full cursor-pointer" variant="outline">
                    Buy Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Second Tier */}
            <Card className="relative border-primary shadow-lg scale-105">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Second Tier Protection
                </CardTitle>
                <CardDescription className="text-2xl font-bold">
                  $79<span className="text-sm font-normal text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Advanced monitoring with phishing detection
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Everything from First tier
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Phishing detection
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    URL scanning
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Real-time alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Priority support
                  </li>
                </ul>
                <Link href="/dashboard" className="inline-block w-full">
                  <Button className="w-full cursor-pointer">
                    Buy Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Third Tier */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Third Tier Protection
                </CardTitle>
                <CardDescription className="text-2xl font-bold">
                  $149<span className="text-sm font-normal text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with full automation
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Everything from First and Second tier
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Advanced threat intelligence
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Automated blocking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    IP/Domain scanning
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    24/7 dedicated support
                  </li>
                </ul>
                <Link href="/dashboard" className="inline-block w-full">
                  <Button className="w-full cursor-pointer" variant="outline">
                    Buy Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}