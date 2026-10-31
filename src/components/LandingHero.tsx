import React from 'react';
import { TRANSLATIONS, Language } from '../i18n/translations';
import {
  Scan,
  Compass,
  Layers,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface LandingHeroProps {
  onStartDiagnosis: () => void;
  onExploreFarm: () => void;
  lang: Language;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartDiagnosis,
  onExploreFarm,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="w-full space-y-12 py-4">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#143B29] to-[#245638] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-[#D6AD5733]">
        {/* Subtle decorative agricultural ambient grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, #D6AD57 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#D6AD57]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'hi'
                ? 'आईसीएआर एवं कृषि विज्ञान केंद्र मानकों पर आधारित'
                : 'Aligned with ICAR & Agricultural Extension Protocols'}
            </span>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] text-[#FAF6ED] tracking-tight">
            {t.headline}
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl font-normal leading-relaxed">
            {t.heroSubtext}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartDiagnosis}
              className="px-6 py-3.5 rounded-2xl bg-[#D6AD57] text-[#143B29] font-bold text-sm hover:bg-[#e2bd6b] transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Scan className="w-4 h-4 text-[#143B29]" />
              <span>{t.startDiagnosis}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreFarm}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#D6AD57]" />
              <span>{t.exploreFarm}</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-white/70">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D6AD57]" />
              <span>{lang === 'hi' ? 'सटीक पत्ती घाव विश्लेषण' : 'Multimodal Vision Inference'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D6AD57]" />
              <span>{lang === 'hi' ? '3D पौधा-स्तर मैपिंग' : 'Spatial 3D Field Coordinates'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D6AD57]" />
              <span>{lang === 'hi' ? 'द्विभाषी ऑडियो सलाह' : 'Hindi & English Spoken Advisory'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Concise Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: AI Crop Diagnosis */}
        <div
          onClick={onStartDiagnosis}
          className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#80674733] hover:border-[#245638] shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF6ED] text-[#245638] flex items-center justify-center mb-4 group-hover:bg-[#245638] group-hover:text-white transition">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title text-lg font-bold text-[#245638]">
              {t.features.diagTitle}
            </h3>
            <p className="text-xs text-[#746C60] mt-2 leading-relaxed">
              {t.features.diagDesc}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#80674722] flex items-center gap-1 text-xs font-bold text-[#806747] group-hover:text-[#245638] transition">
            <span>{t.startDiagnosis}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Interactive Field Health */}
        <div
          onClick={onExploreFarm}
          className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#80674733] hover:border-[#245638] shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF6ED] text-[#245638] flex items-center justify-center mb-4 group-hover:bg-[#245638] group-hover:text-white transition">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title text-lg font-bold text-[#245638]">
              {t.features.fieldTitle}
            </h3>
            <p className="text-xs text-[#746C60] mt-2 leading-relaxed">
              {t.features.fieldDesc}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#80674722] flex items-center gap-1 text-xs font-bold text-[#806747] group-hover:text-[#245638] transition">
            <span>{t.exploreFarm}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 3: Context-Aware Crop Advisory */}
        <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#80674733] shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF6ED] text-[#245638] flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title text-lg font-bold text-[#245638]">
              {t.features.advisoryTitle}
            </h3>
            <p className="text-xs text-[#746C60] mt-2 leading-relaxed">
              {t.features.advisoryDesc}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#80674722] text-xs font-semibold text-[#806747] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#478653]" />
            <span>ICAR / TNAU Guidance</span>
          </div>
        </div>

        {/* Card 4: Crop Monitoring */}
        <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#80674733] shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF6ED] text-[#245638] flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-serif-title text-lg font-bold text-[#245638]">
              {t.features.monitoringTitle}
            </h3>
            <p className="text-xs text-[#746C60] mt-2 leading-relaxed">
              {t.features.monitoringDesc}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#80674722] text-xs font-semibold text-[#806747] flex items-center gap-1">
            <Layers className="w-4 h-4 text-[#D6AD57]" />
            <span>Timeline Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};
