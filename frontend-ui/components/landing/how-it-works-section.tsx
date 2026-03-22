'use client'

import { Card } from '@/components/ui/card'
import { ClipboardList, Brain, BarChart3, ArrowRight } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Enter Your Details',
    description: 'Provide your clinical and lifestyle information through our simple, guided form.',
  },
  {
    step: '02',
    icon: Brain,
    title: 'AI Analyzes Your Risk',
    description: 'Our neural network processes your data using advanced machine learning algorithms.',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Receive Your Risk Score',
    description: 'Get a comprehensive risk assessment with personalized recommendations.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to understand your stroke risk and take control of your health
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50" style={{ transform: 'translateY(-50%)' }} />
          
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <Card 
                className="relative overflow-hidden bg-card border-border/50 p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 group h-full animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background border border-primary/30 items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
