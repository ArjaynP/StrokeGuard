'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertTriangle, AlertOctagon, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecommendationsProps {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH'
}

const recommendationsByLevel = {
  LOW: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    items: [
      'Maintain a healthy diet rich in fruits and vegetables',
      'Exercise regularly (at least 150 minutes per week)',
      'Monitor blood pressure annually',
      'Avoid smoking and limit alcohol consumption',
      'Get regular health check-ups',
    ],
  },
  MODERATE: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    items: [
      'Schedule a check-up with your physician',
      'Monitor glucose and blood pressure regularly',
      'Consider lifestyle modifications',
      'Discuss stroke prevention with your doctor',
      'Review your medication if applicable',
      'Manage stress through relaxation techniques',
    ],
  },
  HIGH: {
    icon: AlertOctagon,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    items: [
      'Seek medical attention promptly',
      'Inform your doctor of these risk factors immediately',
      'Do not ignore symptoms like sudden numbness or confusion',
      'Call emergency services if experiencing stroke symptoms',
      'Consider immediate lifestyle changes',
      'Follow all prescribed medical treatments',
    ],
  },
}

export function Recommendations({ riskLevel }: RecommendationsProps) {
  const config = recommendationsByLevel[riskLevel]
  const Icon = config.icon

  return (
    <Card className={cn('bg-card border-border/50 h-full', `border-l-4 ${config.borderColor}`)}>
      <CardHeader className="border-b border-border/30 bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', config.bgColor)}>
            <Shield className={cn('h-5 w-5', config.color)} />
          </div>
          <CardTitle className="text-lg text-foreground">Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {config.items.map((item, index) => (
            <li 
              key={index}
              className="flex items-start gap-3 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.color)} />
              <span className="text-foreground leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
