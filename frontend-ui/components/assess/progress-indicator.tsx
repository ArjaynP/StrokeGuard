'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { FormGroup } from '@/lib/types'

interface ProgressIndicatorProps {
  currentGroup: FormGroup
  completedGroups: FormGroup[]
}

const groups = [
  { id: 1 as FormGroup, label: 'Personal Info' },
  { id: 2 as FormGroup, label: 'Medical History' },
  { id: 3 as FormGroup, label: 'Lifestyle' },
  { id: 4 as FormGroup, label: 'Clinical Metrics' },
]

export function ProgressIndicator({ currentGroup, completedGroups }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Mobile view */}
      <div className="flex md:hidden items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Step {currentGroup} of {groups.length}
        </span>
        <span className="text-sm font-medium text-foreground">
          {groups.find(g => g.id === currentGroup)?.label}
        </span>
      </div>
      <div className="md:hidden w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(currentGroup / groups.length) * 100}%` }}
        />
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between">
        {groups.map((group, index) => {
          const isCompleted = completedGroups.includes(group.id)
          const isCurrent = currentGroup === group.id
          const isPast = currentGroup > group.id

          return (
            <div key={group.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                    isCompleted || isPast
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isCurrent
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-muted-foreground'
                  )}
                >
                  {isCompleted || isPast ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{group.id}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium transition-colors',
                    isCurrent ? 'text-primary' : isPast ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {group.label}
                </span>
              </div>
              
              {index < groups.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full bg-primary transition-all duration-500',
                        isPast ? 'w-full' : 'w-0'
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
