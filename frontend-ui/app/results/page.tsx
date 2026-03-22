'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RiskGauge } from '@/components/results/risk-gauge'
import { RiskFactorsChart } from '@/components/results/risk-factors-chart'
import { Recommendations } from '@/components/results/recommendations'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react'
import type { PredictionResult } from '@/lib/types'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Try to get result from sessionStorage
    const storedResult = sessionStorage.getItem('strokeGuardResult')
    
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult)
        setResult(parsed)
      } catch (error) {
        console.error('[v0] Error parsing result:', error)
      }
    }
    
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your results...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full bg-card border-border/50">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warning/10 mb-4">
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No Results Found</h2>
              <p className="text-muted-foreground mb-6">
                Please complete the risk assessment first to view your results.
              </p>
              <Link href="/assess">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Risk Score Hero */}
          <section className="mb-12 animate-fade-in-up">
            <Card className="bg-card border-border/50 overflow-hidden">
              <CardContent className="py-12">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Your Risk Assessment Results
                  </h1>
                  <p className="text-muted-foreground">
                    Based on the information you provided
                  </p>
                </div>
                <RiskGauge 
                  percentage={result.riskPercentage} 
                  riskLevel={result.riskLevel} 
                />
              </CardContent>
            </Card>
          </section>

          {/* Charts and Recommendations */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="animate-fade-in-up stagger-1">
              <RiskFactorsChart 
                factors={result.contributingFactors} 
                riskLevel={result.riskLevel}
              />
            </div>
            <div className="animate-fade-in-up stagger-2">
              <Recommendations riskLevel={result.riskLevel} />
            </div>
          </section>

          {/* Actions */}
          <section className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
            <Link href="/assess">
              <Button 
                variant="outline" 
                className="border-border hover:bg-secondary min-w-[160px]"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Assess Again
              </Button>
            </Link>
            <Link href="/">
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground min-w-[160px]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </section>

          {/* Disclaimer */}
          <section className="mt-12 animate-fade-in-up stagger-4">
            <Card className="bg-secondary/30 border-border/30">
              <CardContent className="py-4">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-warning" />
                  <p className="text-sm leading-relaxed">
                    <strong className="text-foreground">Disclaimer:</strong> This tool is for educational 
                    purposes only. Always consult a qualified healthcare professional for medical advice. 
                    Do not make health decisions based solely on this assessment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
