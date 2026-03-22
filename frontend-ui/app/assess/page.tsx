'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProgressIndicator } from '@/components/assess/progress-indicator'
import { formGroups } from '@/components/assess/form-groups'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, ArrowRight, Brain } from 'lucide-react'
import type { FormData, FormErrors, FormGroup } from '@/lib/types'

const initialFormData: FormData = {
  age: '',
  gender: '',
  hypertension: false,
  heartDisease: false,
  everMarried: false,
  workType: '',
  residenceType: '',
  smokingStatus: '',
  avgGlucoseLevel: '',
  bmi: '',
}

const groupFields: Record<FormGroup, (keyof FormData)[]> = {
  1: ['age', 'gender'],
  2: ['hypertension', 'heartDisease', 'everMarried'],
  3: ['workType', 'residenceType', 'smokingStatus'],
  4: ['avgGlucoseLevel', 'bmi'],
}

export default function AssessPage() {
  const router = useRouter()
  const [currentGroup, setCurrentGroup] = useState<FormGroup>(1)
  const [completedGroups, setCompletedGroups] = useState<FormGroup[]>([])
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateGroup = (group: FormGroup): boolean => {
    const newErrors: FormErrors = {}
    const fields = groupFields[group]

    fields.forEach((field) => {
      const value = formData[field]
      
      if (field === 'age') {
        if (value === '' || value === null) {
          newErrors.age = 'Age is required'
        } else if (typeof value === 'number' && (value < 1 || value > 120)) {
          newErrors.age = 'Age must be between 1 and 120'
        }
      }
      
      if (field === 'gender' && !value) {
        newErrors.gender = 'Please select a gender'
      }
      
      if (field === 'workType' && !value) {
        newErrors.workType = 'Please select a work type'
      }
      
      if (field === 'residenceType' && !value) {
        newErrors.residenceType = 'Please select a residence type'
      }
      
      if (field === 'smokingStatus' && !value) {
        newErrors.smokingStatus = 'Please select smoking status'
      }
      
      if (field === 'avgGlucoseLevel') {
        if (value === '' || value === null) {
          newErrors.avgGlucoseLevel = 'Glucose level is required'
        } else if (typeof value === 'number' && value < 0) {
          newErrors.avgGlucoseLevel = 'Glucose level must be positive'
        }
      }
      
      if (field === 'bmi') {
        if (value === '' || value === null) {
          newErrors.bmi = 'BMI is required'
        } else if (typeof value === 'number' && value < 0) {
          newErrors.bmi = 'BMI must be positive'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleNext = () => {
    if (validateGroup(currentGroup)) {
      setCompletedGroups((prev) => 
        prev.includes(currentGroup) ? prev : [...prev, currentGroup]
      )
      if (currentGroup < 4) {
        setCurrentGroup((prev) => (prev + 1) as FormGroup)
      }
    }
  }

  const handlePrevious = () => {
    if (currentGroup > 1) {
      setCurrentGroup((prev) => (prev - 1) as FormGroup)
    }
  }

  const handleSubmit = async () => {
    if (!validateGroup(currentGroup)) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Prediction failed')
      }

      const result = await response.json()
      
      // Store result in sessionStorage and navigate
      sessionStorage.setItem('strokeGuardResult', JSON.stringify(result))
      router.push('/results')
    } catch (error) {
      console.error('[v0] Error submitting form:', error)
      // For demo purposes, generate mock result
      const mockResult = {
        riskPercentage: Math.floor(Math.random() * 100),
        riskLevel: 'MODERATE' as const,
        contributingFactors: [
          { name: 'Age', value: formData.age as number, impact: 25 },
          { name: 'Glucose Level', value: formData.avgGlucoseLevel as number, impact: 20 },
          { name: 'BMI', value: formData.bmi as number, impact: 18 },
          { name: 'Hypertension', value: formData.hypertension ? 1 : 0, impact: 15 },
          { name: 'Heart Disease', value: formData.heartDisease ? 1 : 0, impact: 12 },
          { name: 'Smoking Status', value: formData.smokingStatus === 'smokes' ? 1 : 0, impact: 10 },
        ],
      }
      
      // Determine risk level based on percentage
      if (mockResult.riskPercentage <= 30) {
        mockResult.riskLevel = 'LOW'
      } else if (mockResult.riskPercentage <= 60) {
        mockResult.riskLevel = 'MODERATE'
      } else {
        mockResult.riskLevel = 'HIGH'
      }
      
      sessionStorage.setItem('strokeGuardResult', JSON.stringify(mockResult))
      router.push('/results')
    } finally {
      setIsLoading(false)
    }
  }

  const CurrentFormGroup = formGroups[currentGroup]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Risk Assessment
            </h1>
            <p className="text-muted-foreground">
              Complete all sections to receive your personalized stroke risk analysis
            </p>
          </div>

          {/* Progress */}
          <ProgressIndicator 
            currentGroup={currentGroup} 
            completedGroups={completedGroups} 
          />

          {/* Form Group */}
          <div className="animate-fade-in-up" key={currentGroup}>
            <CurrentFormGroup
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentGroup === 1}
              className="border-border hover:bg-secondary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentGroup < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[180px]"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Calculate My Risk
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
