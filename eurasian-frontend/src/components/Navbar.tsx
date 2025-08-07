'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
// Update the import path if the avatar component is located elsewhere, for example:
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// Or, if the file does not exist, create 'src/components/ui/avatar.tsx' and export the components.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useToast } from '../hooks/use-toast'
import { useUser } from '../contexts/UserContext'

export default function Navbar() {
  const { user, logout } = useUser()
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="Eurasian" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-foreground">Eurasian</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/platform" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Platform
              </Link>
              <Link href="/support" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Support FAQ
              </Link>
              <Link href="/team" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Our Team
              </Link>
              <Link href="/feedback" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Feedback
              </Link>
            </div>
          </div>

          {/* Authentication */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="cursor-pointer">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="cursor-pointer">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/platform" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                Platform
              </Link>
              <Link href="/support" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                Support FAQ
              </Link>
              <Link href="/team" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                Our Team
              </Link>
              <Link href="/feedback" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                Feedback
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                    Dashboard
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start px-3 py-2"
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full cursor-pointer">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full cursor-pointer">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}