'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Activity, Brain } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Brain className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <Activity className="absolute -bottom-1 -right-1 h-4 w-4 text-primary animate-pulse" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              Stroke<span className="text-primary">Guard</span>
            </span>
          </Link>
          
          <Link href="/assess">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
