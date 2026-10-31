import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing with 20MB limit for image uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    pipelineVersion: 'AgriLens-Vision-v2.4',
  });
});

// Real AI Crop Diagnosis Pipeline via Gemini 3.8 Flash
app.post('/api/diagnose', async (req, res) => {
  const startTime = Date.now();
  const requestId = 'diag_' + Math.random().toString(36).substring(2, 10);

  try {
    const { imageBase64, mimeType = 'image/jpeg', cropHint, growthStage, location, symptoms, fieldId, plantId } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({
        error: 'INVALID_IMAGE',
        message: 'No valid image data provided. Please upload a clear photo of the crop leaf or stem.',
        requestId,
      });
    }

    // Clean base64 header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    // Server-side size validation (approx 12MB limit)
    const byteLength = (cleanBase64.length * 3) / 4;
    if (byteLength > 12 * 1024 * 1024) {
      return res.status(413).json({
        error: 'IMAGE_TOO_LARGE',
        message: 'The uploaded file exceeds the 12MB size limit. Please upload a compressed or standard mobile camera photo.',
        requestId,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'API_KEY_UNAVAILABLE',
        message: 'GEMINI_API_KEY is not configured in this environment. You can explore the application using the curated Hackathon Demo Cases.',
        requestId,
        canUseDemo: true,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const contextualNotes = [
      cropHint ? `Farmer provided crop species: "${cropHint}"` : 'Crop species: Unspecified (infer from image foliage)',
      growthStage ? `Observed growth stage: "${growthStage}"` : null,
      location ? `Geographic location / Agro-climatic zone: "${location}"` : null,
      symptoms ? `Farmer notes on observed field symptoms: "${symptoms}"` : null,
    ].filter(Boolean).join('. ');

    const systemPrompt = `You are AgriLens, an expert Agricultural Pathologist and Crop Health Specialist adhering strictly to ICAR (Indian Council of Agricultural Research), State Agricultural Universities (TNAU, PAU), and international agronomic standards.
Your mission is to perform rigorous, honest, and explainable visual crop disease diagnosis from field photos.

CRITICAL RULES:
1. Distinguish carefully between:
   - Genuine crop leaf/stem images vs non-agricultural/unsupported subjects.
   - Healthy foliage vs biotic disease (fungal, bacterial, viral) vs insect/pest damage vs abiotic/nutrient deficiency (e.g., Nitrogen chlorosis, Zinc deficiency).
   - Definite symptoms vs uncertain/ambiguous lesions. NEVER force an ambiguous or out-of-domain photograph into a disease label.
2. If the photo is too blurry, out of focus, poorly lit, or shows no plant foliage, set isValidCropImage = false and conditionCategory = "uncertain" or "non_crop".
3. Provide realistic confidence scores (e.g. 0.85 for distinct concentric rings of Early Blight; 0.60 for ambiguous brown speckling).
4. Outline diagnostic limitations honestly: explain that visual symptoms can mimic nutrient burn or physiological stress, and microscopic pathogen culturing is required for absolute confirmation.
5. In agricultural recommendations, NEVER fabricate chemical pesticide dosages, lethal concentrations, or proprietary mixtures. Provide safe agronomic guidance, cultural sanitary practices, bio-control options (e.g. Trichoderma viride, Pseudomonas fluorescens, Neem cake/oil), and approved management protocols. Include PPE and safe application warnings.
6. Provide normalized bounding boxes (0 to 1000 scale: [ymin, xmin, ymax, xmax]) for up to 3 distinct symptomatic regions to explain exactly where the pathogen lesions or defects appear.`;

    const userPrompt = `Analyze this agricultural field photograph with the highest diagnostic fidelity.
Context provided: ${contextualNotes}.

Return your complete evaluation strictly matching the JSON schema.`;

    // Call Gemini 3.8 Flash with a 25-second timeout safeguard
    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        {
          text: userPrompt,
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValidCropImage: {
              type: Type.BOOLEAN,
              description: 'Whether the image contains recognizable agricultural crop foliage, stems, or fruits.',
            },
            imageQuality: {
              type: Type.OBJECT,
              properties: {
                rating: { type: Type.STRING, description: '"good" | "fair" | "poor"' },
                clarity: { type: Type.STRING, description: 'Evaluation of focus and blur' },
                lighting: { type: Type.STRING, description: 'Evaluation of exposure and contrast' },
                leafVisibility: { type: Type.STRING, description: 'Whether the diseased tissue is clearly visible' },
                rejectionReason: { type: Type.STRING, description: 'Optional explanation if image is unacceptable' },
              },
              required: ['rating', 'clarity', 'lighting', 'leafVisibility'],
            },
            detectedCrop: {
              type: Type.STRING,
              description: 'Common name and botanical name (e.g., "Tomato (Solanum lycopersicum)", "Rice / Paddy (Oryza sativa)").',
            },
            conditionCategory: {
              type: Type.STRING,
              description: '"healthy" | "diseased" | "pest_damage" | "nutrient_deficiency" | "uncertain" | "non_crop"',
            },
            conditionName: {
              type: Type.STRING,
              description: 'Specific diagnosis (e.g., "Early Blight (Alternaria solani)", "Blast Disease (Magnaporthe oryzae)", "Healthy Plant Foliage").',
            },
            pathogenType: {
              type: Type.STRING,
              description: '"fungal" | "bacterial" | "viral" | "insect/pest" | "physiological" | "none"',
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'Decimal confidence between 0.00 and 1.00 based on visible symptom distinctiveness.',
            },
            confidenceLevel: {
              type: Type.STRING,
              description: '"high" | "moderate" | "low" | "uncertain"',
            },
            severityEstimate: {
              type: Type.STRING,
              description: '"none" | "mild" | "moderate" | "severe" | "uncertain"',
            },
            visibleSymptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Bullet points of observed morphological symptoms.',
            },
            symptomRegions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  regionName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  boxNormalized: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: '[ymin, xmin, ymax, xmax] coordinates from 0 to 1000',
                  },
                },
                required: ['regionName', 'description', 'boxNormalized'],
              },
            },
            diagnosticEvidence: {
              type: Type.STRING,
              description: 'Technical explanation of why this condition was predicted from visual evidence.',
            },
            diagnosticLimitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Honest diagnostic boundaries and need for laboratory verification.',
            },
            isUncertain: {
              type: Type.BOOLEAN,
              description: 'True if symptoms overlap multiple conditions or confidence is below reliable thresholds.',
            },
            advisory: {
              type: Type.OBJECT,
              properties: {
                aiObservation: { type: Type.STRING, description: 'Summary of what the AI detected' },
                potentialDiagnosis: { type: Type.STRING, description: 'Differential diagnosis and pathogen ecology' },
                fieldInspectionSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Actionable steps for the farmer to verify on standing crops',
                },
                culturalPractices: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Sanitation, spacing, irrigation adjustments, pruning',
                },
                biologicalControls: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Organic bio-pesticides or beneficial biocontrol agents',
                },
                approvedManagementGuidance: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Authoritative chemical / integrated crop protection guidelines without unvalidated dosages',
                },
                safetyAndPpeWarnings: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Protective gear, spraying intervals, and pollinator safety guidelines',
                },
                whenToConsultExpert: {
                  type: Type.STRING,
                  description: 'Specific threshold when farmer must seek KVK / agricultural extension officer assistance',
                },
                authoritativeReferences: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Scientific sources (ICAR, TNAU Agritech Portal, FAO, etc.)',
                },
              },
              required: [
                'aiObservation',
                'potentialDiagnosis',
                'fieldInspectionSteps',
                'culturalPractices',
                'biologicalControls',
                'approvedManagementGuidance',
                'safetyAndPpeWarnings',
                'whenToConsultExpert',
                'authoritativeReferences',
              ],
            },
          },
          required: [
            'isValidCropImage',
            'imageQuality',
            'detectedCrop',
            'conditionCategory',
            'conditionName',
            'pathogenType',
            'confidenceScore',
            'confidenceLevel',
            'severityEstimate',
            'visibleSymptoms',
            'symptomRegions',
            'diagnosticEvidence',
            'diagnosticLimitations',
            'isUncertain',
            'advisory',
          ],
        },
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Inference request timed out after 25 seconds')), 25000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

    const parsedResult = JSON.parse(response.text || '{}');

    // Add metadata and performance telemetry
    const resultPayload = {
      requestId,
      ...parsedResult,
      fieldAssociation: fieldId ? { fieldId, plantId: plantId || null } : null,
      modelInfo: {
        modelName: 'gemini-3.8-flash',
        pipeline: 'AgriLens Multimodal Vision v2.4',
        inferenceLatencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      source: 'live_inference',
    };

    return res.json(resultPayload);
  } catch (error: any) {
    console.error('Error in /api/diagnose:', error);
    return res.status(500).json({
      error: 'INFERENCE_FAILED',
      message: error?.message || 'Crop diagnosis inference encountered an unexpected server error.',
      requestId,
      canUseDemo: true,
    });
  }
});

// Configure Vite middleware in development, or serve static dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AgriLens Engine] Running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[AgriLens Server Error]', err);
  process.exit(1);
});
