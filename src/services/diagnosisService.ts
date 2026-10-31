import { DiagnosisRecord } from '../types/agrilens';
import { DEMO_CASES } from '../data/demoCases';

export interface DiagnosisRequest {
  imageBase64: string;
  mimeType: string;
  cropHint?: string;
  growthStage?: string;
  location?: string;
  symptoms?: string;
  fieldId?: string;
  plantId?: string;
}

export class DiagnosisService {
  /**
   * Reads an uploaded File and converts to base64 data URL
   */
  public static async fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
    return new Promise((resolve, reject) => {
      // Validate file size (12MB limit)
      if (file.size > 12 * 1024 * 1024) {
        return reject(new Error('File exceeds the 12MB limit. Please upload a smaller image.'));
      }

      // Validate image mime type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        return reject(
          new Error(`Unsupported file type: ${file.type}. Please upload a JPEG, PNG, or WEBP image.`)
        );
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve({
          base64: result,
          mimeType: file.type || 'image/jpeg',
        });
      };
      reader.onerror = () => reject(new Error('Failed to read image file from disk.'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Executes live multimodal vision inference on the backend Express server
   */
  public static async runInference(req: DiagnosisRequest): Promise<DiagnosisRecord> {
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    const data = await res.json();

    if (!res.ok) {
      const err = new Error(data.message || 'Inference request failed');
      (err as any).canUseDemo = data.canUseDemo;
      (err as any).errorType = data.error;
      throw err;
    }

    const record: DiagnosisRecord = {
      id: 'rec_' + Math.random().toString(36).substring(2, 9),
      requestId: data.requestId,
      timestamp: new Date().toISOString(),
      imageUri: req.imageBase64,
      cropName: data.detectedCrop || 'Identified Crop Specimen',
      conditionCategory: data.conditionCategory || 'uncertain',
      conditionName: data.conditionName || 'Uncertain Foliar Condition',
      pathogenType: data.pathogenType || 'none',
      confidenceScore: typeof data.confidenceScore === 'number' ? data.confidenceScore : 0.75,
      confidenceLevel: data.confidenceLevel || 'moderate',
      severityEstimate: data.severityEstimate || 'moderate',
      visibleSymptoms: Array.isArray(data.visibleSymptoms) ? data.visibleSymptoms : [],
      symptomRegions: Array.isArray(data.symptomRegions) ? data.symptomRegions : [],
      diagnosticEvidence: data.diagnosticEvidence || '',
      diagnosticLimitations: Array.isArray(data.diagnosticLimitations) ? data.diagnosticLimitations : [],
      isUncertain: Boolean(data.isUncertain),
      advisory: data.advisory || {
        aiObservation: 'Visual observation completed.',
        potentialDiagnosis: data.conditionName,
        fieldInspectionSteps: ['Inspect nearby plants in the field.'],
        culturalPractices: ['Maintain clean field margins and remove infected debris.'],
        biologicalControls: ['Consult agricultural university bio-control guidelines.'],
        approvedManagementGuidance: ['Refer to local extension package of practices.'],
        safetyAndPpeWarnings: ['Always wear gloves and a protective mask when applying treatments.'],
        whenToConsultExpert: 'Consult local Krishi Vigyan Kendra if symptoms persist.',
        authoritativeReferences: ['ICAR Crop Protection Advisory'],
      },
      modelInfo: data.modelInfo || {
        modelName: 'gemini-3.8-flash',
        pipeline: 'AgriLens Multimodal Vision v2.4',
      },
      fieldAssociation: data.fieldAssociation,
      notes: req.symptoms,
      isDemoCase: false,
    };

    return record;
  }

  /**
   * Retrieves a curated benchmark demo case by ID
   */
  public static getDemoCase(caseId: string): DiagnosisRecord | undefined {
    return DEMO_CASES.find((c) => c.id === caseId);
  }

  /**
   * Returns all available benchmark demo cases
   */
  public static getDemoCases(): DiagnosisRecord[] {
    return DEMO_CASES;
  }
}
