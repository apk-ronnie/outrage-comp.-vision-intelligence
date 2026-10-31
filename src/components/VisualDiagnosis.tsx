import React, { useState, useRef } from 'react';
import { DiagnosisRecord, SymptomRegion } from '../types/agrilens';
import { DiagnosisService } from '../services/diagnosisService';
import { SpeechService } from '../services/speechService';
import { TRANSLATIONS } from '../i18n/translations';
import { DEMO_CASES } from '../data/demoCases';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  BookOpen,
  Bookmark,
  Layers,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';

interface VisualDiagnosisProps {
  onSaveRecord: (record: DiagnosisRecord) => void;
  onSelectFieldPlant?: (plantId: string) => void;
  lang: 'en' | 'hi';
}

export const VisualDiagnosis: React.FC<VisualDiagnosisProps> = ({
  onSaveRecord,
  onSelectFieldPlant,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Workflow State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');

  // Contextual inputs
  const [cropHint, setCropHint] = useState<string>('');
  const [growthStage, setGrowthStage] = useState<string>('Vegetative');
  const [location, setLocation] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [fieldBed, setFieldBed] = useState<string>('PLT-B03');

  // Execution & Results State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canFallbackToDemo, setCanFallbackToDemo] = useState(false);
  const [activeResult, setActiveResult] = useState<DiagnosisRecord | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Audio Playback State
  const [audioState, setAudioState] = useState<{ isSpeaking: boolean; isPaused: boolean }>({
    isSpeaking: false,
    isPaused: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to speech state
  React.useEffect(() => {
    const unsubscribe = SpeechService.subscribe((state) => {
      setAudioState(state);
    });
    return () => {
      unsubscribe();
      SpeechService.stop();
    };
  }, []);

  const handleFileChange = async (file: File) => {
    try {
      setErrorMessage(null);
      const { base64, mimeType: resolvedMime } = await DiagnosisService.fileToBase64(file);
      setSelectedFile(file);
      setImagePreview(base64);
      setMimeType(resolvedMime);
      setActiveResult(null);
      setSavedSuccess(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process image');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectDemoCase = (demoCase: DiagnosisRecord) => {
    setSelectedFile(null);
    setImagePreview(demoCase.imageUri);
    setMimeType('image/png');
    setCropHint(demoCase.cropName.split('(')[0].trim());
    setSymptoms(demoCase.notes || '');
    setActiveResult(demoCase);
    setErrorMessage(null);
    setSavedSuccess(false);
  };

  const handleRunDiagnosis = async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStep(1);

    const stepTimer1 = setTimeout(() => setAnalysisStep(2), 600);
    const stepTimer2 = setTimeout(() => setAnalysisStep(3), 1400);
    const stepTimer3 = setTimeout(() => setAnalysisStep(4), 2200);

    try {
      const record = await DiagnosisService.runInference({
        imageBase64: imagePreview,
        mimeType,
        cropHint: cropHint.trim() || undefined,
        growthStage: growthStage || undefined,
        location: location.trim() || undefined,
        symptoms: symptoms.trim() || undefined,
        plantId: fieldBed || undefined,
      });

      setActiveResult(record);
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setErrorMessage(
        err.message ||
          'Inference service could not process the image. You may select a Curated Benchmark Case to explore the full advisory pipeline.'
      );
      if (err.canUseDemo || !imagePreview) {
        setCanFallbackToDemo(true);
      }
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  const handleToggleAudio = () => {
    if (!activeResult) return;

    if (audioState.isSpeaking) {
      if (audioState.isPaused) {
        SpeechService.resume();
      } else {
        SpeechService.pause();
      }
    } else {
      // Build clear, natural spoken advisory in selected language
      const textToSpeak =
        lang === 'hi'
          ? `एग्रीलेंस फसल सलाह। पहचानी गई स्थिति: ${activeResult.conditionName}। अनुमानित गंभीरता: ${activeResult.severityEstimate}। मुख्य अवलोकन: ${activeResult.advisory.aiObservation}। किसान भाइयों के लिए अनुशंसित उपाय: ${activeResult.advisory.culturalPractices.join('. ')}। विशेषज्ञ परामर्श: ${activeResult.advisory.whenToConsultExpert}`
          : `AgriLens Crop Health Advisory. Condition identified: ${activeResult.conditionName}. Severity: ${activeResult.severityEstimate}. Key observation: ${activeResult.advisory.aiObservation}. Field action steps: ${activeResult.advisory.culturalPractices.join('. ')}. When to seek expert assistance: ${activeResult.advisory.whenToConsultExpert}`;

      SpeechService.speak(textToSpeak, lang);
    }
  };

  const handleStopAudio = () => {
    SpeechService.stop();
  };

  const handleSaveDiagnosis = () => {
    if (!activeResult) return;
    onSaveRecord(activeResult);
    setSavedSuccess(true);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setActiveResult(null);
    setErrorMessage(null);
    setSavedSuccess(false);
    SpeechService.stop();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Step Header */}
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#80674733] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-title text-2xl font-bold text-[#245638]">
              {t.diagnosisFlow.stepTitle}
            </h2>
            <p className="text-sm text-[#746C60] mt-1">{t.diagnosisFlow.stepDesc}</p>
          </div>

          <div className="flex items-center gap-2">
            {imagePreview && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl border border-[#80674733] text-xs font-semibold text-[#806747] hover:bg-[#FAF6ED] transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.diagnosisFlow.replacePhoto}</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{lang === 'hi' ? 'निदान सेवा सूचना' : 'Diagnostic Notice'}</p>
              <p className="mt-0.5 text-xs text-amber-800">{errorMessage}</p>
              {canFallbackToDemo && (
                <div className="mt-2.5">
                  <span className="text-xs font-bold block mb-1">
                    {lang === 'hi' ? 'परीक्षण हेतु नमूना मामला चुनें:' : 'Test with a curated benchmark case:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_CASES.slice(0, 3).map((dc) => (
                      <button
                        key={dc.id}
                        onClick={() => handleSelectDemoCase(dc)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-[#245638] text-white font-medium hover:bg-[#143B29] transition"
                      >
                        {dc.cropName.split('(')[0]} - {dc.conditionName.split('(')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Curated Benchmark Quick Selector (for Hackathon Judges) */}
        {!imagePreview && (
          <div className="mt-6 pt-5 border-t border-[#80674722]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#806747] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D6AD57]" />
                {t.diagnosisFlow.orPickSample}
              </span>
              <span className="text-[11px] text-[#746C60]">
                {lang === 'hi' ? 'आईसीएआर सत्यापित डेटा' : 'ICAR-standard specimens'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {DEMO_CASES.map((dc) => (
                <button
                  key={dc.id}
                  onClick={() => handleSelectDemoCase(dc)}
                  className="p-2.5 rounded-xl border border-[#80674722] bg-[#FAF6ED] hover:bg-[#FFFDF8] hover:border-[#245638] hover:shadow-sm transition text-left group flex flex-col justify-between"
                >
                  <div className="w-full h-24 rounded-lg overflow-hidden bg-stone-900 border border-[#80674722] mb-2 flex items-center justify-center">
                    <img src={dc.imageUri} alt={dc.cropName} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#245638] truncate">{dc.cropName.split('(')[0]}</h5>
                    <p className="text-[10px] text-[#746C60] truncate">{dc.conditionName.split('(')[0]}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#80674722] text-[#806747] uppercase">
                      {dc.severityEstimate}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upload Zone & Form Inputs */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Area */}
          <div className="lg:col-span-5">
            {!imagePreview ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-72 border-2 border-dashed border-[#80674755] hover:border-[#245638] rounded-2xl bg-[#FAF6ED] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition group"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFFDF8] border border-[#80674733] flex items-center justify-center text-[#245638] mb-3 group-hover:scale-110 transition shadow-sm">
                  <Upload className="w-6 h-6 text-[#245638]" />
                </div>
                <p className="text-sm font-semibold text-[#245638]">{t.diagnosisFlow.dragDropText}</p>
                <p className="text-xs text-[#746C60] mt-1">JPEG, PNG, WEBP (Max 12MB)</p>

                <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-[#245638] text-white text-xs font-semibold hover:bg-[#143B29] transition flex items-center gap-1.5 shadow"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#D6AD57]" />
                    <span>{t.diagnosisFlow.cameraCapture}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#80674733] bg-stone-900 shadow-md">
                <div className="relative aspect-square w-full">
                  <img
                    src={imagePreview}
                    alt="Uploaded Crop Specimen"
                    className="w-full h-full object-contain"
                  />

                  {/* Explainable Bounding Boxes Overlay */}
                  {showBoundingBoxes &&
                    activeResult?.symptomRegions?.map((region, idx) => {
                      const [ymin, xmin, ymax, xmax] = region.boxNormalized;
                      const top = `${ymin / 10}%`;
                      const left = `${xmin / 10}%`;
                      const width = `${(xmax - xmin) / 10}%`;
                      const height = `${(ymax - ymin) / 10}%`;

                      return (
                        <div
                          key={idx}
                          style={{ top, left, width, height }}
                          className="absolute border-2 border-[#D6AD57] bg-[#D6AD5722] rounded pointer-events-none transition"
                        >
                          <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D6AD57] text-stone-950 shadow whitespace-nowrap">
                            {region.regionName}
                          </span>
                        </div>
                      );
                    })}
                </div>

                {/* Bounding box toggle */}
                {activeResult?.symptomRegions && activeResult.symptomRegions.length > 0 && (
                  <div className="p-2.5 bg-[#FAF6ED] border-t border-[#80674722] flex items-center justify-between text-xs text-[#24342A]">
                    <span className="font-semibold">{t.results.symptomOverlayToggle}</span>
                    <button
                      type="button"
                      onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        showBoundingBoxes
                          ? 'bg-[#245638] text-white'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {showBoundingBoxes ? 'ON' : 'OFF'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hidden Input Elements */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
          </div>

          {/* Right Column: Agronomic Context Form */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#245638] mb-1">
                    {t.diagnosisFlow.cropSpeciesLabel}
                  </label>
                  <input
                    type="text"
                    value={cropHint}
                    onChange={(e) => setCropHint(e.target.value)}
                    placeholder={t.diagnosisFlow.cropSpeciesPlaceholder}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#80674744] bg-[#FFFDF8] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#245638] mb-1">
                    {t.diagnosisFlow.growthStageLabel}
                  </label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#80674744] bg-[#FFFDF8] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
                  >
                    <option value="Seedling">Seedling (अंकुरण)</option>
                    <option value="Vegetative">Vegetative (वानस्पतिक बढ़वार)</option>
                    <option value="Flowering">Flowering / Booting (फूल / कल्ले आना)</option>
                    <option value="Fruiting">Fruiting / Grain Fill (फल / दाना भरना)</option>
                    <option value="Maturity">Maturity / Harvest (परिपक्वता)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#245638] mb-1">
                    {t.diagnosisFlow.locationLabel}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Punjab, Maharashtra, West Bengal"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#80674744] bg-[#FFFDF8] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#245638] mb-1">
                    {t.diagnosisFlow.fieldIdLabel}
                  </label>
                  <select
                    value={fieldBed}
                    onChange={(e) => setFieldBed(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#80674744] bg-[#FFFDF8] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
                  >
                    <option value="PLT-B03">Plant PLT-B03 (Tomato Row B)</option>
                    <option value="PLT-C06">Plant PLT-C06 (Field Crop Row C)</option>
                    <option value="PLT-D02">Plant PLT-D02 (Rotational Bed Row D)</option>
                    <option value="PLT-A05">Plant PLT-A05 (Field Crop Row A)</option>
                    <option value="PLT-A01">Plant PLT-A01 (Healthy Control)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#245638] mb-1">
                  {t.diagnosisFlow.symptomsObservedLabel}
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t.diagnosisFlow.symptomsPlaceholder}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#80674744] bg-[#FFFDF8] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
                />
              </div>
            </div>

            {/* Run Button & Analysis Animation */}
            <div className="mt-6 pt-4 border-t border-[#80674722]">
              {isAnalyzing ? (
                <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#80674733] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#245638]">
                    <span>{t.diagnosisFlow.analyzingText}</span>
                    <span className="font-mono">{analysisStep * 25}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-[#245638] transition-all duration-500"
                      style={{ width: `${analysisStep * 25}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#746C60] italic">
                    {analysisStep === 1 && t.diagnosisFlow.verifyingQuality}
                    {analysisStep === 2 && t.diagnosisFlow.scanningFoliage}
                    {analysisStep === 3 && t.diagnosisFlow.matchingPathogen}
                    {analysisStep === 4 && t.diagnosisFlow.generatingGuidance}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRunDiagnosis}
                  disabled={!imagePreview}
                  className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-md ${
                    imagePreview
                      ? 'bg-[#245638] text-white hover:bg-[#143B29] cursor-pointer'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#D6AD57]" />
                  <span>{t.diagnosisFlow.runAnalysis}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results & Agricultural Advisory Card */}
      {activeResult && (
        <div className="bg-[#FFFDF8] rounded-2xl border-2 border-[#24563833] p-6 lg:p-8 shadow-lg space-y-6">
          {/* Top Banner: Condition & Severity */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#80674722]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#806747]">
                  {activeResult.cropName}
                </span>
                {activeResult.isDemoCase && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D6AD57] text-stone-900">
                    BENCHMARK SPECIMEN
                  </span>
                )}
              </div>
              <h3 className="font-serif-title text-2xl lg:text-3xl font-extrabold text-[#245638]">
                {activeResult.conditionName}
              </h3>
            </div>

            {/* Badges: Confidence, Severity, Pathogen */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#FAF6ED] border border-[#80674733] text-center">
                <span className="text-[10px] text-[#746C60] block font-medium">
                  {t.results.confidence}
                </span>
                <span className="font-bold text-sm text-[#245638]">
                  {Math.round(activeResult.confidenceScore * 100)}%
                </span>
              </div>

              <div
                className={`px-3.5 py-1.5 rounded-xl border text-center ${
                  activeResult.severityEstimate === 'severe'
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : activeResult.severityEstimate === 'moderate'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : activeResult.severityEstimate === 'mild'
                    ? 'bg-yellow-50 border-yellow-300 text-yellow-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                <span className="text-[10px] block font-medium">{t.results.severity}</span>
                <span className="font-bold text-sm uppercase">{activeResult.severityEstimate}</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-[#FAF6ED] border border-[#80674733] text-center">
                <span className="text-[10px] text-[#746C60] block font-medium">
                  {t.results.pathogenType}
                </span>
                <span className="font-bold text-sm text-[#806747] uppercase">
                  {activeResult.pathogenType}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Playback Controls & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#FAF6ED] border border-[#80674722]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAudio}
                className="px-4 py-2 rounded-xl bg-[#245638] text-white text-xs font-bold hover:bg-[#143B29] transition flex items-center gap-2 shadow-sm"
              >
                {audioState.isSpeaking && !audioState.isPaused ? (
                  <>
                    <Pause className="w-4 h-4 text-[#D6AD57]" />
                    <span>{t.results.pauseAudio}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-[#D6AD57]" />
                    <span>{t.results.listenAdvice}</span>
                  </>
                )}
              </button>

              {audioState.isSpeaking && (
                <button
                  type="button"
                  onClick={handleStopAudio}
                  className="px-3 py-2 rounded-xl border border-[#80674733] text-xs font-semibold text-[#806747] hover:bg-[#FFFDF8] transition flex items-center gap-1.5"
                >
                  <VolumeX className="w-4 h-4" />
                  <span>{t.results.stopAudio}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDiagnosis}
                disabled={savedSuccess}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                  savedSuccess
                    ? 'bg-emerald-700 text-white cursor-default'
                    : 'bg-[#D6AD57] text-stone-900 hover:bg-[#c49c44]'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'सहेज लिया गया' : 'Saved to Field'}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{t.results.saveToField}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visible Symptoms & Diagnostic Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#80674722] space-y-2">
              <h4 className="font-bold text-sm text-[#245638] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#478653]" />
                <span>{t.results.visibleSymptoms}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-[#24342A]">
                {activeResult.visibleSymptoms.map((sym, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#806747] font-bold">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#80674722] space-y-2">
              <h4 className="font-bold text-sm text-[#245638] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#806747]" />
                <span>{t.results.diagnosticEvidence}</span>
              </h4>
              <p className="text-xs text-[#24342A] leading-relaxed">
                {activeResult.diagnosticEvidence}
              </p>
            </div>
          </div>

          {/* Diagnostic Limitations & Honest Uncertainty Box */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>{t.results.diagnosticLimitations}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-amber-900">
              {activeResult.diagnosticLimitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>

          {/* 5-Part Grounded Agricultural Advisory Engine */}
          <div className="pt-4 border-t border-[#80674722] space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#245638]" />
              <h4 className="font-serif-title text-xl font-bold text-[#245638]">
                {t.results.advisoryHeadline}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. What the AI Observed */}
              <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#80674722]">
                <h5 className="font-bold text-xs text-[#245638] mb-1">
                  {t.advisorySections.observation}
                </h5>
                <p className="text-xs text-[#24342A]">{activeResult.advisory.aiObservation}</p>
              </div>

              {/* 2. What it Might Indicate */}
              <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#80674722]">
                <h5 className="font-bold text-xs text-[#245638] mb-1">
                  {t.advisorySections.differential}
                </h5>
                <p className="text-xs text-[#24342A]">{activeResult.advisory.potentialDiagnosis}</p>
              </div>

              {/* 3. Field Inspection Checklist */}
              <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#80674722]">
                <h5 className="font-bold text-xs text-[#245638] mb-1">
                  {t.advisorySections.fieldInspection}
                </h5>
                <ul className="space-y-1 text-xs text-[#24342A]">
                  {activeResult.advisory.fieldInspectionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#806747] font-semibold">[{idx + 1}]</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Supported Cultural & Biocontrol Practices */}
              <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#80674722]">
                <h5 className="font-bold text-xs text-[#245638] mb-1">
                  {t.advisorySections.culturalManagement}
                </h5>
                <div className="space-y-2 text-xs text-[#24342A]">
                  <div>
                    <span className="font-semibold text-[#806747]">Cultural Sanitation:</span>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 pl-1">
                      {activeResult.advisory.culturalPractices.map((cp, idx) => (
                        <li key={idx}>{cp}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-[#478653]">Biocontrol / Organic:</span>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 pl-1">
                      {activeResult.advisory.biologicalControls.map((bc, idx) => (
                        <li key={idx}>{bc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. When Expert Confirmation is Required */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 text-xs text-emerald-950">
              <h5 className="font-bold text-xs text-emerald-900 mb-1">
                {t.advisorySections.expertThreshold}
              </h5>
              <p>{activeResult.advisory.whenToConsultExpert}</p>
              <div className="mt-2 text-[11px] text-emerald-800 flex items-center gap-2">
                <span>Kisan Call Centre Toll-Free: <strong>1800-180-1551</strong></span>
                <span>•</span>
                <span>ICAR Agricultural Extension Network</span>
              </div>
            </div>

            {/* Authoritative Citations */}
            <div className="pt-2 text-[11px] text-[#746C60]">
              <span className="font-semibold text-[#245638]">{t.advisorySections.references}: </span>
              <span>{activeResult.advisory.authoritativeReferences.join(' • ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
