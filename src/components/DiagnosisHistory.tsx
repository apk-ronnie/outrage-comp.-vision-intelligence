import React, { useState } from 'react';
import { DiagnosisRecord } from '../types/agrilens';
import { TRANSLATIONS } from '../i18n/translations';
import {
  History,
  Calendar,
  Layers,
  Sparkles,
  Sliders,
  ChevronRight,
  TrendingDown,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface DiagnosisHistoryProps {
  records: DiagnosisRecord[];
  onOpenRecord: (record: DiagnosisRecord) => void;
  lang: 'en' | 'hi';
}

export const DiagnosisHistory: React.FC<DiagnosisHistoryProps> = ({
  records,
  onOpenRecord,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [compareBaseline, setCompareBaseline] = useState<DiagnosisRecord | null>(
    records[0] || null
  );
  const [sliderPos, setSliderPos] = useState<number>(50);

  // Recovery Simulation interactive slider
  const [simulationDays, setSimulationDays] = useState<number>(7);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#80674733] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-[#245638]" />
            <h2 className="font-serif-title text-2xl font-bold text-[#245638]">
              {lang === 'hi' ? 'निदान इतिहास और फॉलो-अप' : 'Diagnosis History & Follow-up Timeline'}
            </h2>
          </div>
          <p className="text-xs text-[#746C60] mt-1">
            {lang === 'hi'
              ? 'खेत के पौधों की पूर्व जांच रिपोर्ट और सुधार प्रगति का रिकॉर्ड।'
              : 'Chronological timeline of visual assessments and field observation records.'}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#FAF6ED] border border-[#80674722] text-xs font-semibold text-[#806747]">
          {records.length} {lang === 'hi' ? 'सहेजे गए रिकॉर्ड' : 'Recorded Evaluations'}
        </div>
      </div>

      {/* Interactive Photo Comparison & Recovery Simulator */}
      {compareBaseline && (
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#80674733] p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-title text-lg font-bold text-[#245638] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#D6AD57]" />
                <span>
                  {lang === 'hi' ? 'तुलना व सुधार विश्लेषण' : 'Observation Comparison & Progression'}
                </span>
              </h3>
              <p className="text-xs text-[#746C60]">
                {compareBaseline.cropName} • {compareBaseline.conditionName} (
                {compareBaseline.fieldAssociation?.plantId || 'Unassigned'})
              </p>
            </div>

            {/* Simulation Label Warning */}
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{t.results.simulationLabel}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Visual Inspection Card */}
            <div className="space-y-3">
              <div className="relative w-full aspect-square max-h-80 rounded-2xl overflow-hidden bg-stone-900 border border-[#80674733]">
                <img
                  src={compareBaseline.imageUri}
                  alt="Baseline Record"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-stone-900/80 text-white text-[11px] font-mono">
                  Day 0 Baseline: {new Date(compareBaseline.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Recovery Trajectory Simulation Controls */}
            <div className="space-y-4 p-5 rounded-2xl bg-[#FAF6ED] border border-[#80674722]">
              <div>
                <label className="block text-xs font-bold text-[#245638] mb-1">
                  {lang === 'hi'
                    ? 'कृषि उपाय के बाद अनुमानित अवधि (दिन):'
                    : 'Simulated Post-Treatment Interval:'}{' '}
                  <span className="font-mono text-sm text-[#806747]">{simulationDays} Days</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="21"
                  step="1"
                  value={simulationDays}
                  onChange={(e) => setSimulationDays(Number(e.target.value))}
                  className="w-full accent-[#245638]"
                />
              </div>

              {/* Simulation Logic Metrics */}
              <div className="space-y-2 pt-2 border-t border-[#80674722] text-xs">
                <div className="flex justify-between items-center text-[#24342A]">
                  <span>{lang === 'hi' ? 'अनुमानित रोग प्रसार दर:' : 'Expected Lesion Arrest:'}</span>
                  <strong className="text-emerald-700">
                    {simulationDays >= 10 ? '70%–85% Arrested' : '35%–50% Initial Response'}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-[#24342A]">
                  <span>{lang === 'hi' ? 'अनुमानित नई पत्ती वृद्धि:' : 'Simulated New Foliage Flushes:'}</span>
                  <strong>{simulationDays >= 14 ? '2–3 Healthy Leaflets' : '1 New Shoot'}</strong>
                </div>
                <div className="flex justify-between items-center text-[#24342A]">
                  <span>{lang === 'hi' ? 'पुनरावृत्ति जोखिम:' : 'Secondary Inoculum Risk:'}</span>
                  <strong className={simulationDays >= 14 ? 'text-emerald-600' : 'text-amber-600'}>
                    {simulationDays >= 14 ? 'Low (if debris purged)' : 'Moderate (monitor leaf wetness)'}
                  </strong>
                </div>
              </div>

              {/* Scientific Disclaimer */}
              <p className="text-[11px] text-[#746C60] leading-relaxed pt-2 border-t border-[#80674722]">
                * <em>Model Assumptions:</em> Assumes strict execution of ICAR sanitation protocols, absence of extreme rainfall events, and prompt removal of heavily sporulating lower foliage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chronological Observation List */}
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#80674733] p-6 shadow-sm space-y-4">
        <h3 className="font-serif-title text-lg font-bold text-[#245638]">
          {lang === 'hi' ? 'सभी रिकॉर्ड की सूची' : 'Recorded Diagnostic Log'}
        </h3>

        <div className="divide-y divide-[#80674722]">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#FAF6ED55] px-2 rounded-xl transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 border border-[#80674733] shrink-0">
                  <img src={rec.imageUri} alt={rec.cropName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#245638]">{rec.conditionName}</h4>
                    {rec.fieldAssociation?.plantId && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF6ED] text-[#806747] border border-[#80674733]">
                        {rec.fieldAssociation.plantId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#746C60]">{rec.cropName}</p>
                  <div className="flex items-center gap-3 text-[11px] text-[#746C60] mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(rec.timestamp).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      {t.results.confidence}:{' '}
                      <strong className="text-[#24342A]">
                        {Math.round(rec.confidenceScore * 100)}%
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setCompareBaseline(rec)}
                  className="flex-1 md:flex-none px-3 py-1.5 rounded-lg border border-[#80674733] text-xs font-semibold text-[#806747] hover:bg-[#FAF6ED] transition"
                >
                  {lang === 'hi' ? 'तुलना में देखें' : 'Inspect Timeline'}
                </button>
                <button
                  onClick={() => onOpenRecord(rec)}
                  className="flex-1 md:flex-none px-3.5 py-1.5 rounded-lg bg-[#245638] text-white text-xs font-bold hover:bg-[#143B29] transition shadow flex items-center justify-center gap-1"
                >
                  <span>{lang === 'hi' ? 'पूरी सलाह' : 'Full Advisory'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
