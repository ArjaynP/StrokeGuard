export interface FormData {
  // Personal Information
  age: number | '';
  gender: 'Male' | 'Female' | '';
  
  // Medical History
  hypertension: boolean | null;
  heartDisease: boolean | null;
  everMarried: boolean | null;
  
  // Lifestyle
  workType: 'Private' | 'Self-employed' | 'Govt_job' | 'children' | 'Never_worked' | '';
  residenceType: 'Urban' | 'Rural' | '';
  smokingStatus: 'never smoked' | 'formerly smoked' | 'smokes' | 'Unknown' | '';
  
  // Clinical Metrics
  avgGlucoseLevel: number | '';
  bmi: number | '';
}

export interface PredictionResult {
  riskPercentage: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  contributingFactors: ContributingFactor[];
}

export interface ContributingFactor {
  name: string;
  value: number;
  impact: number;
}

export interface FormErrors {
  [key: string]: string;
}

export type FormGroup = 1 | 2 | 3 | 4;
