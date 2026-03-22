'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface RiskGaugeProps {
  percentage: number
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH'
}

export function RiskGauge({ percentage, riskLevel }: RiskGaugeProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  useEffect(() => {
    // Animate the percentage on mount
    const duration = 1500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setAnimatedPercentage(Math.round(percentage * easeOut))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [percentage])

  const getColor = () => {
    if (riskLevel === 'LOW') return { stroke: '#22c55e', bg: 'bg-green-500/10', text: 'text-green-500', badge: 'bg-green-500/20 text-green-400 border-green-500/30' }
    if (riskLevel === 'MODERATE') return { stroke: '#eab308', bg: 'bg-yellow-500/10', text: 'text-yellow-500', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
    return { stroke: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-500', badge: 'bg-red-500/20 text-red-400 border-red-500/30' }
  }

  const colors = getColor()
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative w-64 h-64">
        {/* Background glow */}
        <div 
          className={cn('absolute inset-4 rounded-full blur-2xl opacity-30', colors.bg)}
        />
        
        {/* SVG Gauge */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-secondary"
          />
          
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${colors.stroke}40)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-6xl font-bold', colors.text)}>
            {animatedPercentage}
          </span>
          <span className="text-lg text-muted-foreground">%</span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <Badge 
        className={cn(
          'mt-6 px-6 py-2 text-lg font-semibold border',
          colors.badge
        )}
      >
        {riskLevel} RISK
      </Badge>

      <p className="mt-4 text-center text-muted-foreground max-w-xs">
        Estimated stroke risk based on your clinical profile
      </p>
    </div>
  )
}
