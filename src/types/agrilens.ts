export type PlantHealthCategory = 'healthy' | 'observation' | 'suspected' | 'priority';

export type ConditionCategory =
  | 'healthy'
  | 'diseased'
  | 'pest_damage'
  | 'nutrient_deficiency'
  | 'uncertain'
  | 'non_crop';

export type PathogenType =
  | 'fungal'
  | 'bacterial'
  | 'viral'
  | 'insect/pest'
  | 'physiological'
  | 'none';

export type SeverityLevel = 'none' | 'mild' | 'moderate' | 'severe' | 'uncertain';

export interface SymptomRegion {
  regionName: string;
  description: string;
  boxNormalized: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
}

export interface ImageQualityReport {
  rating: 'good' | 'fair' | 'poor';
  clarity: string;
  lighting: string;
  leafVisibility: string;
  rejectionReason?: string;
}

export interface AgriculturalAdvisory {
  aiObservation: string;
  potentialDiagnosis: string;
  fieldInspectionSteps: string[];
  culturalPractices: string[];
  biologicalControls: string[];
  approvedManagementGuidance: string[];
  safetyAndPpeWarnings: string[];
  whenToConsultExpert: string;
  authoritativeReferences: string[];
}

export interface DiagnosisRecord {
  id: string;
  requestId: string;
  timestamp: string;
  imageUri: string;
  cropName: string;
  conditionCategory: ConditionCategory;
  conditionName: string;
  pathogenType: PathogenType;
  confidenceScore: number;
  confidenceLevel: 'high' | 'moderate' | 'low' | 'uncertain';
  severityEstimate: SeverityLevel;
  visibleSymptoms: string[];
  symptomRegions: SymptomRegion[];
  diagnosticEvidence: string;
  diagnosticLimitations: string[];
  isUncertain: boolean;
  advisory: AgriculturalAdvisory;
  modelInfo: {
    modelName: string;
    pipeline: string;
    inferenceLatencyMs?: number;
  };
  fieldAssociation?: {
    fieldId: string;
    plantId: string | null;
  } | null;
  notes?: string;
  isDemoCase?: boolean;
}

export interface FieldPlant {
  id: string; // e.g., 'PLT-A01'
  row: number; // 0..3
  col: number; // 0..7
  x: number;
  z: number;
  cropType: string;
  variety: string;
  healthCategory: PlantHealthCategory;
  moisturePercent: number;
  plantedDate: string;
  lastInspected: string;
  linkedDiagnosisId?: string | null;
  notes?: string;
}

export interface FieldStatistics {
  totalPlants: number;
  healthyCount: number;
  observationCount: number;
  suspectedCount: number;
  priorityCount: number;
  analysedCount: number;
  lastObservationDate: string;
}

export interface FarmerProfile {
  name: string;
  farmName: string;
  location: string;
  state: string;
  totalAcres: number;
  primaryCrops: string[];
  language: 'en' | 'hi';
}
