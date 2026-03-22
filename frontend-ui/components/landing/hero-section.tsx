'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, ChevronDown } from 'lucide-react'

export function HeroSection() {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Background brain icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <Brain className="w-[600px] h-[600px] text-primary opacity-[0.04]" strokeWidth={0.5} />
        </div>

        <div className="relative animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Risk Assessment
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance">
            Early Stroke Risk Detection,{' '}
            <span className="text-primary relative">
              Powered by Machine Learning
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 4 150 2 298 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30" />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed text-pretty">
            StrokeGuard uses a custom-trained neural network to assess your stroke risk 
            based on clinical and lifestyle factors. Get personalized insights in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assess">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 text-lg px-8 py-6 group"
              >
                Assess Your Risk Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToHowItWorks}
              className="border-border hover:bg-secondary hover:border-primary/50 transition-all duration-300 text-lg px-8 py-6"
            >
              Learn More
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  )
}
