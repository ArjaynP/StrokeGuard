import { AlertTriangle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary/30 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 text-muted-foreground">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-warning" />
          <p className="text-sm leading-relaxed">
            StrokeGuard is for educational purposes only and is not a substitute for professional medical advice. 
            Always consult a qualified healthcare professional for medical concerns.
          </p>
        </div>
        <div className="mt-6 text-center text-xs text-muted-foreground/60">
          {new Date().getFullYear()} StrokeGuard. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
