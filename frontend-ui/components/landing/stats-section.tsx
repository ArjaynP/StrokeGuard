'use client'

import { Card } from '@/components/ui/card'
import { Globe, Shield, Heart } from 'lucide-react'

const stats = [
  {
    icon: Globe,
    title: '2nd Leading Cause',
    description: 'of Death Globally',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
  },
  {
    icon: Shield,
    title: '80% of Strokes',
    description: 'Are Preventable',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Heart,
    title: 'Early Detection',
    description: 'Saves Lives',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title}
              className="relative overflow-hidden bg-card border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-xl ${stat.bgColor} p-3 transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground">{stat.title}</h3>
                  <p className="text-muted-foreground">{stat.description}</p>
                </div>
              </div>
              {/* Decorative gradient */}
              <div className={`absolute -right-8 -bottom-8 w-24 h-24 ${stat.bgColor} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
