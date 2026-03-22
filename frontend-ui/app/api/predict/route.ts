import { NextRequest, NextResponse } from 'next/server'

interface FormData {
  age: number
  gender: 'Male' | 'Female'
  hypertension: boolean
  heartDisease: boolean
  everMarried: boolean
  workType: string
  residenceType: 'Urban' | 'Rural'
  smokingStatus: string
  avgGlucoseLevel: number
  bmi: number
}

interface ContributingFactor {
  name: string
  value: number
  impact: number
}

interface PredictionResult {
  riskPercentage: number
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH'
  contributingFactors: ContributingFactor[]
}

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json()

    // Try to proxy to the ML backend if available
    try {
      const mlResponse = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: body.age,
          gender: body.gender,
          hypertension: body.hypertension ? 1 : 0,
          heart_disease: body.heartDisease ? 1 : 0,
          ever_married: body.everMarried ? 'Yes' : 'No',
          work_type: body.workType,
          Residence_type: body.residenceType,
          avg_glucose_level: body.avgGlucoseLevel,
          bmi: body.bmi,
          smoking_status: body.smokingStatus,
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (mlResponse.ok) {
        const mlResult = await mlResponse.json()
        return NextResponse.json(mlResult)
      }
    } catch {
      // ML backend not available, use mock prediction
      console.log('[v0] ML backend not available, using mock prediction')
    }

    // Generate mock prediction based on input factors
    const riskFactors = calculateRiskFactors(body)
    const riskPercentage = Math.min(100, Math.max(0, riskFactors.totalRisk))
    
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH'
    if (riskPercentage <= 30) {
      riskLevel = 'LOW'
    } else if (riskPercentage <= 60) {
      riskLevel = 'MODERATE'
    } else {
      riskLevel = 'HIGH'
    }

    const result: PredictionResult = {
      riskPercentage: Math.round(riskPercentage),
      riskLevel,
      contributingFactors: riskFactors.factors,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Error in predict API:', error)
    return NextResponse.json(
      { error: 'Failed to process prediction' },
      { status: 500 }
    )
  }
}

function calculateRiskFactors(data: FormData): { totalRisk: number; factors: ContributingFactor[] } {
  const factors: ContributingFactor[] = []
  let totalRisk = 5 // Base risk

  // Age factor (major contributor)
  const ageImpact = Math.min(30, Math.max(5, (data.age - 30) * 0.5))
  if (data.age > 45) {
    totalRisk += ageImpact
  }
  factors.push({
    name: 'Age',
    value: data.age,
    impact: Math.round(Math.min(30, Math.max(5, data.age > 45 ? ageImpact : 5))),
  })

  // Glucose level factor
  let glucoseImpact = 5
  if (data.avgGlucoseLevel > 100) {
    glucoseImpact = Math.min(25, (data.avgGlucoseLevel - 100) * 0.15 + 10)
    totalRisk += glucoseImpact - 5
  }
  factors.push({
    name: 'Glucose Level',
    value: data.avgGlucoseLevel,
    impact: Math.round(glucoseImpact),
  })

  // BMI factor
  let bmiImpact = 5
  if (data.bmi > 25) {
    bmiImpact = Math.min(20, (data.bmi - 25) * 2 + 8)
    totalRisk += bmiImpact - 5
  }
  factors.push({
    name: 'BMI',
    value: data.bmi,
    impact: Math.round(bmiImpact),
  })

  // Hypertension factor
  const hypertensionImpact = data.hypertension ? 18 : 3
  totalRisk += data.hypertension ? 15 : 0
  factors.push({
    name: 'Hypertension',
    value: data.hypertension ? 1 : 0,
    impact: hypertensionImpact,
  })

  // Heart disease factor
  const heartDiseaseImpact = data.heartDisease ? 20 : 2
  totalRisk += data.heartDisease ? 18 : 0
  factors.push({
    name: 'Heart Disease',
    value: data.heartDisease ? 1 : 0,
    impact: heartDiseaseImpact,
  })

  // Smoking status factor
  let smokingImpact = 2
  if (data.smokingStatus === 'smokes') {
    smokingImpact = 15
    totalRisk += 12
  } else if (data.smokingStatus === 'formerly smoked') {
    smokingImpact = 8
    totalRisk += 5
  }
  factors.push({
    name: 'Smoking',
    value: smokingImpact,
    impact: smokingImpact,
  })

  // Sort factors by impact (highest first)
  factors.sort((a, b) => b.impact - a.impact)

  return { totalRisk, factors }
}
