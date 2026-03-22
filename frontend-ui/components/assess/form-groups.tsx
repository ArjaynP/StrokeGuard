'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle, User, Heart, Briefcase, Activity } from 'lucide-react'
import type { FormData, FormErrors, FormGroup } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FormGroupProps {
  formData: FormData
  errors: FormErrors
  onChange: (field: keyof FormData, value: FormData[keyof FormData]) => void
}

// Group 1: Personal Information
export function PersonalInfoGroup({ formData, errors, onChange }: FormGroupProps) {
  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      <CardHeader className="border-b border-border/30 bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg text-foreground">Personal Information</CardTitle>
            <CardDescription>Basic demographic details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-foreground">Age</Label>
          <Input
            id="age"
            type="number"
            min={1}
            max={120}
            placeholder="Enter your age"
            value={formData.age}
            onChange={(e) => onChange('age', e.target.value ? Number(e.target.value) : '')}
            className={cn(
              'bg-input border-border focus:border-primary',
              errors.age && 'border-destructive focus:border-destructive'
            )}
          />
          {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label className="text-foreground">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => onChange('gender', value as FormData['gender'])}
          >
            <SelectTrigger className={cn(
              'w-full bg-input border-border',
              errors.gender && 'border-destructive'
            )}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// Group 2: Medical History
export function MedicalHistoryGroup({ formData, errors, onChange }: FormGroupProps) {
  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      <CardHeader className="border-b border-border/30 bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-4/10">
            <Heart className="h-5 w-5 text-chart-4" />
          </div>
          <div>
            <CardTitle className="text-lg text-foreground">Medical History</CardTitle>
            <CardDescription>Your health background</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Hypertension */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
          <div className="space-y-0.5">
            <Label htmlFor="hypertension" className="text-foreground cursor-pointer">Hypertension</Label>
            <p className="text-sm text-muted-foreground">Do you have high blood pressure?</p>
          </div>
          <Switch
            id="hypertension"
            checked={formData.hypertension === true}
            onCheckedChange={(checked) => onChange('hypertension', checked)}
          />
        </div>

        {/* Heart Disease */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
          <div className="space-y-0.5">
            <Label htmlFor="heartDisease" className="text-foreground cursor-pointer">Heart Disease</Label>
            <p className="text-sm text-muted-foreground">Have you been diagnosed with heart disease?</p>
          </div>
          <Switch
            id="heartDisease"
            checked={formData.heartDisease === true}
            onCheckedChange={(checked) => onChange('heartDisease', checked)}
          />
        </div>

        {/* Ever Married */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
          <div className="space-y-0.5">
            <Label htmlFor="everMarried" className="text-foreground cursor-pointer">Ever Married</Label>
            <p className="text-sm text-muted-foreground">Have you ever been married?</p>
          </div>
          <Switch
            id="everMarried"
            checked={formData.everMarried === true}
            onCheckedChange={(checked) => onChange('everMarried', checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Group 3: Lifestyle
export function LifestyleGroup({ formData, errors, onChange }: FormGroupProps) {
  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      <CardHeader className="border-b border-border/30 bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <Briefcase className="h-5 w-5 text-success" />
          </div>
          <div>
            <CardTitle className="text-lg text-foreground">Lifestyle</CardTitle>
            <CardDescription>Work and living conditions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Work Type */}
        <div className="space-y-2">
          <Label className="text-foreground">Work Type</Label>
          <Select
            value={formData.workType}
            onValueChange={(value) => onChange('workType', value as FormData['workType'])}
          >
            <SelectTrigger className={cn(
              'w-full bg-input border-border',
              errors.workType && 'border-destructive'
            )}>
              <SelectValue placeholder="Select work type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Self-employed">Self-employed</SelectItem>
              <SelectItem value="Govt_job">Government Job</SelectItem>
              <SelectItem value="children">Children</SelectItem>
              <SelectItem value="Never_worked">Never Worked</SelectItem>
            </SelectContent>
          </Select>
          {errors.workType && <p className="text-sm text-destructive">{errors.workType}</p>}
        </div>

        {/* Residence Type */}
        <div className="space-y-2">
          <Label className="text-foreground">Residence Type</Label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onChange('residenceType', 'Urban')}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200',
                formData.residenceType === 'Urban'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
              )}
            >
              Urban
            </button>
            <button
              type="button"
              onClick={() => onChange('residenceType', 'Rural')}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200',
                formData.residenceType === 'Rural'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
              )}
            >
              Rural
            </button>
          </div>
          {errors.residenceType && <p className="text-sm text-destructive">{errors.residenceType}</p>}
        </div>

        {/* Smoking Status */}
        <div className="space-y-2">
          <Label className="text-foreground">Smoking Status</Label>
          <Select
            value={formData.smokingStatus}
            onValueChange={(value) => onChange('smokingStatus', value as FormData['smokingStatus'])}
          >
            <SelectTrigger className={cn(
              'w-full bg-input border-border',
              errors.smokingStatus && 'border-destructive'
            )}>
              <SelectValue placeholder="Select smoking status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never smoked">Never Smoked</SelectItem>
              <SelectItem value="formerly smoked">Formerly Smoked</SelectItem>
              <SelectItem value="smokes">Currently Smokes</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
          {errors.smokingStatus && <p className="text-sm text-destructive">{errors.smokingStatus}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// Group 4: Clinical Metrics
export function ClinicalMetricsGroup({ formData, errors, onChange }: FormGroupProps) {
  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      <CardHeader className="border-b border-border/30 bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg text-foreground">Clinical Metrics</CardTitle>
            <CardDescription>Health measurements</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Average Glucose Level */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="avgGlucoseLevel" className="text-foreground">Average Glucose Level (mg/dL)</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Normal fasting glucose is 70-100 mg/dL</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="avgGlucoseLevel"
            type="number"
            min={0}
            step={0.1}
            placeholder="e.g., 85"
            value={formData.avgGlucoseLevel}
            onChange={(e) => onChange('avgGlucoseLevel', e.target.value ? Number(e.target.value) : '')}
            className={cn(
              'bg-input border-border focus:border-primary',
              errors.avgGlucoseLevel && 'border-destructive focus:border-destructive'
            )}
          />
          {errors.avgGlucoseLevel && <p className="text-sm text-destructive">{errors.avgGlucoseLevel}</p>}
        </div>

        {/* BMI */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="bmi" className="text-foreground">BMI</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Body Mass Index = weight(kg) / height(m){'\u00B2'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="bmi"
            type="number"
            min={0}
            step={0.1}
            placeholder="e.g., 24.5"
            value={formData.bmi}
            onChange={(e) => onChange('bmi', e.target.value ? Number(e.target.value) : '')}
            className={cn(
              'bg-input border-border focus:border-primary',
              errors.bmi && 'border-destructive focus:border-destructive'
            )}
          />
          {errors.bmi && <p className="text-sm text-destructive">{errors.bmi}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// Export a map for dynamic rendering
export const formGroups: Record<FormGroup, React.FC<FormGroupProps>> = {
  1: PersonalInfoGroup,
  2: MedicalHistoryGroup,
  3: LifestyleGroup,
  4: ClinicalMetricsGroup,
}
