# AgriLens: Visual AI Crop Advisory & Field Intelligence Platform

> **AgriLens** transforms multimodal vision into explainable crop disease diagnosis, interactive 3D spatial field health intelligence, and grounded agricultural action plans adhering strictly to ICAR (Indian Council of Agricultural Research) and State Agricultural University extension standards.

---

## 🌟 Key Features

1. **Real AI Multimodal Crop Diagnosis**
   - Powered by Google **Gemini 3.8 Flash** with strict structured JSON schema (`responseSchema`).
   - Evaluates foliar morphology for fungal, bacterial, viral, and nutrient deficiency disorders across staple Indian crops (Tomato, Rice/Paddy, Potato, Cotton, Wheat).
   - Normalized bounding box predictions (`[ymin, xmin, ymax, xmax]`) for visual explanation of lesion sites.
   - Pre-inference image quality and photographic domain checks (blur, illumination, non-agricultural subjects).
   - Honest diagnostic uncertainty handling and laboratory verification caveats.

2. **Interactive 3D Crop Field (Three.js Studio PBR)**
   - Procedural multi-part plant models with distinct leaf blades, curved stems, and fruit/bud accents (no flat cones).
   - Furrow mounds, raised soil beds, and rich procedural soil texturing.
   - Balanced studio lighting rig with PCFSoft shadows, warm key light, and `RoomEnvironment` reflections.
   - Camera controls: Orbit, zoom, pan, isometric/top-down/row presets, and smooth plant focus.
   - 4 Field View Modes:
     - **NORMAL VIEW**: Realistic foliage appearance.
     - **HEALTH VIEW**: Color-coded agronomic health categories (Healthy, Under Observation, Suspected Issue, Priority Alert).
     - **AI FINDINGS**: Highlights plants linked to validated diagnostic records.
     - **RESET VIEW**: Restores default camera and selection state.
   - Collapsible bottom dock with zero viewport occlusion.
   - Automatic Software WebGL guard (`isSoftwareGl`).

3. **2D Spatial Disease Heatmap**
   - Synchronized with 3D field coordinates (4 rows × 8 columns = 32 monitored units).
   - Category filtering (Healthy, Observation, Suspected, Priority).
   - Real-time field health metrics calculated strictly from actual observations.

4. **Grounded 5-Part Agricultural Advisory Engine**
   - What the AI observed.
   - What the observation indicates (differential diagnosis).
   - Field inspection checklist for the farmer.
   - Supported cultural and biocontrol practices (sanitation, drip irrigation, Trichoderma, neem cake).
   - When expert confirmation is required (KVK locator, Kisan Call Centre 1800-180-1551).
   - Zero fabricated pesticide dosages or lethal chemical recipes.

5. **Follow-Up Monitoring & Recovery Simulator**
   - Chronological observation timeline and baseline photo comparison.
   - Post-treatment recovery trajectory model clearly marked as *Hypothetical Agronomic Trajectory Model (Simulation)* with explicit agronomic assumptions.

6. **Accessibility for Indian Farmers**
   - Full bilingual interface in **English** and **Hindi (हिन्दी)** with authentic agricultural terminology.
   - **"Listen to Advice" (ऑडियो सलाह सुनें)** Web Speech API playback with play/pause/stop controls.
   - Curated Hackathon Demo Mode for offline or benchmark judge evaluations.

---

## 🚀 Running the Project

### Development
```bash
npm install
npm run dev
```
The application starts the unified full-stack Express + Vite server at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## 🔑 Environment Variables

Configured via `.env` (or AI Studio Secrets panel):
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```
*Note: All Gemini API requests are executed strictly on the server-side proxy route (`/api/diagnose`). The API key is never exposed to the client bundle.*

---

## 🏆 Hackathon Judge Demonstration Guide

Judges can explore AgriLens in two reliable modes:

1. **Curated Benchmark Demo Mode (Instant Evaluation)**
   - Click the **Demo Mode Active** badge in the navigation bar.
   - In the **Visual Diagnosis** tab, click any of the curated benchmark cards:
     - *Tomato (Early Blight - Alternaria solani)*
     - *Rice / Paddy (Blast Disease - Magnaporthe oryzae)*
     - *Potato (Late Blight - Phytophthora infestans)*
     - *Cotton (Leaf Curl Begomovirus - CLCuV)*
     - *Wheat (Healthy Crop Foliage)*
   - Inspect the normalized bounding boxes, confidence ratings, and ICAR advisory.
   - Click **"Listen to Advice (Audio)"** to test voice synthesis.
   - Click **"Save to My Field"** and navigate to **My Fields** to see the 3D plant health update in real time.

2. **Live AI Diagnosis Mode**
   - Upload any leaf photo from your device or camera.
   - Optional: select crop species or enter field observations.
   - Click **Run AI Diagnosis** to trigger live server-side multimodal vision inference via `gemini-3.8-flash`.

---

## 📚 Agricultural Reference Sources
- Indian Council of Agricultural Research (ICAR) Crop Protection Bulletins
- Tamil Nadu Agricultural University (TNAU) Agritech Portal
- Punjab Agricultural University (PAU) Integrated Pest Management Package of Practices
- Central Potato Research Institute (CPRI), Shimla
- National Rice Research Institute (NRRI), Cuttack
