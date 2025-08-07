'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion'
import { Search, HelpCircle, Shield, Zap, Users, MessageSquare } from 'lucide-react'

const faqData = [
  {
    category: "General",
    question: "What is Eurasian?",
    answer: "Eurasian is an AI-powered cybersecurity platform that protects your digital presence across social media accounts. Our advanced AI agents monitor, detect, and block threats 24/7 to keep your accounts safe from phishing attempts, malicious content, and other security risks.",
    icon: Shield
  },
  {
    category: "General",
    question: "How does Eurasian work?",
    answer: "Eurasian uses advanced AI algorithms and natural language processing to analyze content, detect threats, and protect your social media accounts. Our system continuously monitors your connected accounts and provides real-time alerts and automated protection based on your chosen subscription tier.",
    icon: Zap
  },
  {
    category: "Accounts & Billing",
    question: "What subscription plans are available?",
    answer: "We offer three tiers: First Tier Protection ($29/month) for basic monitoring, Second Tier Protection ($79/month) with advanced phishing detection, and Third Tier Protection ($149/month) for enterprise-grade security with full automation. Each tier includes increasing levels of protection and features.",
    icon: Users
  },
  {
    category: "Accounts & Billing",
    question: "Can I change my subscription plan?",
    answer: "Yes, you can upgrade or downgrade your subscription plan at any time. When you upgrade, you'll immediately gain access to the new features. When you downgrade, the changes will take effect at the start of your next billing cycle.",
    icon: Users
  },
  {
    category: "Security",
    question: "How secure is my data with Eurasian?",
    answer: "We take data security very seriously. All data is encrypted in transit and at rest. We use industry-standard security protocols and regularly undergo security audits. Your personal information and social media data are never shared with third parties without your explicit consent.",
    icon: Shield
  },
  {
    category: "Security",
    question: "What types of threats does Eurasian protect against?",
    answer: "Eurasian protects against various threats including phishing attempts, malicious links, suspicious login attempts, impersonation attacks, harmful content, and account takeovers. Our AI agents are trained to detect both known and emerging threats.",
    icon: Shield
  },
  {
    category: "Technical",
    question: "Which social media platforms are supported?",
    answer: "Currently, Eurasian supports Instagram, Twitter, and Facebook. We're continuously working to add support for more social media platforms based on user demand and platform capabilities.",
    icon: MessageSquare
  },
  {
    category: "Technical",
    question: "How do I connect my social media accounts?",
    answer: "To connect your social media accounts, go to the Dashboard and click on 'Social Accounts'. From there, you can connect each platform using OAuth authentication. You'll be prompted to grant Eurasian the necessary permissions to monitor and protect your account.",
    icon: MessageSquare
  },
  {
    category: "Troubleshooting",
    question: "I'm not receiving alerts. What should I do?",
    answer: "First, check your email spam folder. If you're still not receiving alerts, ensure your email address is correct in your account settings and that notifications are enabled. You can also check the alert settings in your dashboard to customize notification preferences.",
    icon: HelpCircle
  },
  {
    category: "Troubleshooting",
    question: "Can I use Eurasian on multiple devices?",
    answer: "Yes, you can access your Eurasian account from multiple devices. Your dashboard and settings are synchronized across all devices. However, please ensure you log out from shared devices to maintain account security.",
    icon: HelpCircle
  }
]

const categories = ["All", "General", "Accounts & Billing", "Security", "Technical", "Troubleshooting"]

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Support & FAQ</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and get help with Eurasian
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">Security Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn about our security features and best practices
              </p>
              <Button variant="outline" size="sm">
                Read Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Can't find what you're looking for? Get in touch
              </p>
              <Button variant="outline" size="sm">
                Contact Us
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h3 className="font-semibold mb-2">Setup Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Step-by-step guide to get started with Eurasian
              </p>
              <Button variant="outline" size="sm">
                View Guide
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'answer' : 'answers'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No FAQs found matching your search.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <faq.icon className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-medium">{faq.question}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground ml-8">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Additional Help */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>
              Our support team is here to assist you with any questions or issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Email Support</h4>
                <p className="text-sm text-muted-foreground">
                  Get help via email within 24 hours
                </p>
                <Button variant="outline" size="sm">
                  support@eurasian.com
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Live Chat</h4>
                <p className="text-sm text-muted-foreground">
                  Chat with our support team in real-time
                </p>
                <Button size="sm">
                  Start Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}