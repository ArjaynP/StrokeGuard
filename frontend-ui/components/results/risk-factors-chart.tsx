'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { BarChart3 } from 'lucide-react'
import type { ContributingFactor } from '@/lib/types'

interface RiskFactorsChartProps {
  factors: ContributingFactor[]
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH'
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ContributingFactor }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-foreground">{data.name}</p>
        <p className="text-xs text-muted-foreground">
          Impact: {data.impact}%
        </p>
      </div>
    )
  }
  return null
}

export function RiskFactorsChart({ factors, riskLevel }: RiskFactorsChartProps) {
  const getBarColor = () => {
    if (riskLevel === 'LOW') return '#22c55e'
    if (riskLevel === 'MODERATE') return '#eab308'
    return '#ef4444'
  }

  const barColor = getBarColor()

  return (
    <Card className="bg-card border-border/50 h-full">
      <CardHeader className="border-b border-border/30 bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg text-foreground">Risk Factors Analyzed</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={factors}
            layout="vertical"
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 100]}
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary))' }} />
            <Bar 
              dataKey="impact" 
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
            >
              {factors.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={barColor}
                  fillOpacity={0.8 - (index * 0.1)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
