'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'

export default function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
    
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/logo.svg" alt="Eurasian" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-foreground">Eurasian</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Advanced cybersecurity powered by AI agents to protect your digital presence across social media platforms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/platform" className="text-muted-foreground hover:text-primary">
                  Platform
                </a>
              </li>
              <li>
                <a href="/support" className="text-muted-foreground hover:text-primary">
                  Support FAQ
                </a>
              </li>
              <li>
                <a href="/team" className="text-muted-foreground hover:text-primary">
                  Our Team
                </a>
              </li>
              <li>
                <a href="/feedback" className="text-muted-foreground hover:text-primary">
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Eurasian. All rights reserved.
          </p>
          
          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            className="mt-4 sm:mt-0"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark Mode
              </>
            )}
          </Button>
        </div>
      </div>
    </footer>
  )
}