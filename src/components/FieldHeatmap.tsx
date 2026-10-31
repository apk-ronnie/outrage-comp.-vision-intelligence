import React, { useState } from 'react';
import { FieldPlant, PlantHealthCategory, FieldStatistics } from '../types/agrilens';
import { Filter, Layers, AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';

interface FieldHeatmapProps {
  plants: FieldPlant[];
  stats: FieldStatistics;
  selectedPlantId: string | null;
  onSelectPlant: (id: string | null) => void;
  onOpenDiagnosis: (diagnosisId: string) => void;
  lang: 'en' | 'hi';
}

export const FieldHeatmap: React.FC<FieldHeatmapProps> = ({
  plants,
  stats,
  selectedPlantId,
  onSelectPlant,
  onOpenDiagnosis,
  lang,
}) => {
  const [filterCategory, setFilterCategory] = useState<PlantHealthCategory | 'all'>('all');

  const filteredPlants = plants.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.healthCategory === filterCategory;
  });

  const getCellBg = (category: PlantHealthCategory, isSelected: boolean) => {
    if (isSelected) return 'ring-4 ring-[#D6AD57] scale-105 z-10';

    switch (category) {
      case 'healthy':
        return 'bg-emerald-600 text-white hover:bg-emerald-500';
      case 'observation':
        return 'bg-amber-400 text-stone-900 hover:bg-amber-300';
      case 'suspected':
        return 'bg-orange-500 text-white hover:bg-orange-400';
      case 'priority':
        return 'bg-rose-600 text-white hover:bg-rose-500 animate-pulse';
      default:
        return 'bg-stone-300 text-stone-700';
    }
  };

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  return (
    <div className="w-full bg-[#FFFDF8] rounded-2xl border border-[#80674733] p-5 shadow-sm">
      {/* Header & Metrics Summary Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#80674722]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif-title text-xl font-bold text-[#245638]">
              {lang === 'hi' ? 'खेत स्वास्थ्य हीटमैप (2D ग्रिड)' : 'Field Health Heatmap (2D Spatial Grid)'}
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAF6ED] text-[#806747] border border-[#80674722]">
              4 Rows × 8 Columns
            </span>
          </div>
          <p className="text-xs text-[#746C60] mt-0.5">
            {lang === 'hi'
              ? 'पौधों के स्वास्थ्य का वास्तविक वितरण और निदान स्थिति।'
              : 'Plant health categories calculated strictly from field scouting and vision records.'}
          </p>
        </div>

        {/* 5 Field Summary Metric Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#FAF6ED] border border-[#80674722] text-[#24342A]">
            <span className="text-[#746C60] text-[10px] block">{lang === 'hi' ? 'कुल पौधे' : 'Total Mapped'}</span>
            <span className="font-bold text-sm text-[#245638]">{stats.totalPlants}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <span className="text-emerald-700 text-[10px] block">{lang === 'hi' ? 'स्वस्थ' : 'Healthy'}</span>
            <span className="font-bold text-sm">{stats.healthyCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <span className="text-amber-700 text-[10px] block">{lang === 'hi' ? 'निगरानी' : 'Observation'}</span>
            <span className="font-bold text-sm">{stats.observationCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900">
            <span className="text-orange-700 text-[10px] block">{lang === 'hi' ? 'संभावित' : 'Suspected'}</span>
            <span className="font-bold text-sm">{stats.suspectedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
            <span className="text-rose-700 text-[10px] block">{lang === 'hi' ? 'गंभीर' : 'Priority'}</span>
            <span className="font-bold text-sm">{stats.priorityCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Category Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[#746C60] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#806747]" />
            {lang === 'hi' ? 'फ़िल्टर:' : 'Filter:'}
          </span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterCategory === 'all'
                ? 'bg-[#245638] text-white shadow-sm'
                : 'bg-[#FAF6ED] text-[#24342A] hover:bg-[#FAF6EDbb] border border-[#80674722]'
            }`}
          >
            {lang === 'hi' ? 'सभी' : 'All (32)'}
          </button>
          <button
            onClick={() => setFilterCategory('healthy')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterCategory === 'healthy'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-[#FAF6ED] text-emerald-800 hover:bg-[#FAF6EDbb] border border-[#80674722]'
            }`}
          >
            {lang === 'hi' ? 'स्वस्थ' : 'Healthy'}
          </button>
          <button
            onClick={() => setFilterCategory('observation')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterCategory === 'observation'
                ? 'bg-amber-500 text-stone-900 font-bold shadow-sm'
                : 'bg-[#FAF6ED] text-amber-800 hover:bg-[#FAF6EDbb] border border-[#80674722]'
            }`}
          >
            {lang === 'hi' ? 'निगरानी' : 'Observation'}
          </button>
          <button
            onClick={() => setFilterCategory('suspected')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterCategory === 'suspected'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-[#FAF6ED] text-orange-800 hover:bg-[#FAF6EDbb] border border-[#80674722]'
            }`}
          >
            {lang === 'hi' ? 'संभावित' : 'Suspected'}
          </button>
          <button
            onClick={() => setFilterCategory('priority')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterCategory === 'priority'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-[#FAF6ED] text-rose-800 hover:bg-[#FAF6EDbb] border border-[#80674722]'
            }`}
          >
            {lang === 'hi' ? 'गंभीर' : 'Priority'}
          </button>
        </div>

        <div className="text-[11px] text-[#746C60]">
          {lang === 'hi' ? 'अंतिम निरीक्षण:' : 'Scouting Date:'}{' '}
          <span className="font-semibold text-[#24342A]">{stats.lastObservationDate}</span>
        </div>
      </div>

      {/* 2D Heatmap Grid */}
      <div className="p-4 bg-[#FAF6ED] rounded-xl border border-[#80674722] overflow-x-auto">
        <div className="min-w-[620px]">
          {/* Row Headers & Cells */}
          {['A', 'B', 'C', 'D'].map((rowLetter, rIndex) => (
            <div key={rowLetter} className="flex items-center gap-2 mb-2.5">
              <span className="w-8 text-center text-xs font-bold text-[#806747]">Row {rowLetter}</span>
              <div className="flex-1 grid grid-cols-8 gap-2">
                {Array.from({ length: 8 }, (_, cIndex) => {
                  const id = `PLT-${rowLetter}${cIndex + 1 < 10 ? '0' : ''}${cIndex + 1}`;
                  const plant = plants.find((p) => p.id === id);
                  if (!plant) return null;

                  const isMatch = filterCategory === 'all' || plant.healthCategory === filterCategory;
                  const isSelected = plant.id === selectedPlantId;

                  return (
                    <button
                      key={id}
                      onClick={() => onSelectPlant(isSelected ? null : plant.id)}
                      disabled={!isMatch}
                      className={`relative h-12 rounded-lg font-mono text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        isMatch
                          ? `${getCellBg(plant.healthCategory, isSelected)} shadow-sm cursor-pointer`
                          : 'bg-stone-200 text-stone-400 opacity-30 cursor-not-allowed'
                      }`}
                      title={`${plant.id}: ${plant.healthCategory.toUpperCase()} - ${plant.notes}`}
                    >
                      <span className="text-[10px]">{plant.id.replace('PLT-', '')}</span>
                      {plant.linkedDiagnosisId && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-0.5" title="Has linked diagnosis record" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Plant Expanded Agronomic Card */}
      {selectedPlant && (
        <div className="mt-4 p-4 rounded-xl bg-[#FAF6ED] border border-[#80674733] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#245638] text-base">{selectedPlant.id}</h4>
              <span className="text-xs text-[#746C60] font-medium">• {selectedPlant.cropType}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedPlant.healthCategory === 'healthy'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedPlant.healthCategory === 'observation'
                    ? 'bg-amber-100 text-amber-800'
                    : selectedPlant.healthCategory === 'suspected'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {selectedPlant.healthCategory}
              </span>
            </div>
            <p className="text-xs text-[#24342A]">{selectedPlant.notes}</p>
            <div className="flex items-center gap-3 text-[11px] text-[#746C60] pt-1">
              <span>
                {lang === 'hi' ? 'किस्म:' : 'Variety:'} <strong className="text-[#24342A]">{selectedPlant.variety}</strong>
              </span>
              <span>
                {lang === 'hi' ? 'मृदा नमी:' : 'Soil Moisture:'}{' '}
                <strong className="text-[#24342A]">{selectedPlant.moisturePercent}%</strong>
              </span>
              <span>
                {lang === 'hi' ? 'रोपण तिथि:' : 'Planted:'}{' '}
                <strong className="text-[#24342A]">{selectedPlant.plantedDate}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {selectedPlant.linkedDiagnosisId ? (
              <button
                onClick={() => onOpenDiagnosis(selectedPlant.linkedDiagnosisId!)}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#245638] text-white text-xs font-semibold hover:bg-[#143B29] transition shadow flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D6AD57]" />
                <span>{lang === 'hi' ? 'रोग निदान व सलाह खोलें' : 'Open Diagnosis & Advisory'}</span>
              </button>
            ) : (
              <span className="text-xs text-[#746C60] italic">
                {lang === 'hi' ? 'कोई निदान लिंक नहीं है।' : 'No diagnosis linked yet.'}
              </span>
            )}
            <button
              onClick={() => onSelectPlant(null)}
              className="px-3 py-2 text-xs rounded-xl border border-[#80674733] text-[#746C60] hover:bg-[#FFFDF8] transition"
            >
              {lang === 'hi' ? 'बंद करें' : 'Deselect'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
