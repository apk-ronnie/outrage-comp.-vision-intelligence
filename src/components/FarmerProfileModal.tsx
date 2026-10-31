import React, { useState } from 'react';
import { FarmerProfile } from '../types/agrilens';
import { User, MapPin, Sprout, Globe, Check, X, Shield, Download } from 'lucide-react';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  onUpdateProfile: (p: FarmerProfile) => void;
  onExportData: () => void;
  lang: 'en' | 'hi';
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onExportData,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [form, setForm] = useState<FarmerProfile>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(form);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#FFFDF8] border border-[#80674733] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#245638] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#D6AD57]" />
            <h3 className="font-serif-title text-lg font-bold">
              {isHi ? 'किसान प्रोफ़ाइल व खेत सेटिंग्स' : 'Farmer Profile & Field Configuration'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#245638] mb-1">
                {isHi ? 'किसान का नाम' : 'Farmer Name'}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#80674744] bg-[#FAF6ED] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#245638] mb-1">
                {isHi ? 'खेत / फार्म का नाम' : 'Farm / Holding Name'}
              </label>
              <input
                type="text"
                value={form.farmName}
                onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#80674744] bg-[#FAF6ED] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#245638] mb-1">
                {isHi ? 'जिला व राज्य' : 'Location / District'}
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#80674744] bg-[#FAF6ED] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#245638] mb-1">
                {isHi ? 'कुल भूमि (एकड़)' : 'Holding Size (Acres)'}
              </label>
              <input
                type="number"
                value={form.totalAcres}
                onChange={(e) => setForm({ ...form, totalAcres: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#80674744] bg-[#FAF6ED] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#245638] mb-1">
              {isHi ? 'मुख्य उगाई जाने वाली फसलें' : 'Primary Crops'}
            </label>
            <input
              type="text"
              value={form.primaryCrops.join(', ')}
              onChange={(e) =>
                setForm({
                  ...form,
                  primaryCrops: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#80674744] bg-[#FAF6ED] text-xs text-[#24342A] focus:outline-none focus:ring-2 focus:ring-[#245638]"
            />
          </div>

          {/* Data Export Button */}
          <div className="pt-3 border-t border-[#80674722] flex items-center justify-between">
            <button
              type="button"
              onClick={onExportData}
              className="px-3 py-1.5 rounded-xl border border-[#80674733] text-xs font-semibold text-[#806747] hover:bg-[#FAF6ED] transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isHi ? 'डेटा बैकअप डाउनलोड करें' : 'Export Field Records (JSON)'}</span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#80674722] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#746C60] hover:bg-[#FAF6ED] transition"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#245638] text-white text-xs font-bold hover:bg-[#143B29] transition flex items-center gap-1.5 shadow"
            >
              {savedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#D6AD57]" />
                  <span>{isHi ? 'सहेजा गया!' : 'Saved!'}</span>
                </>
              ) : (
                <span>{isHi ? 'प्रोफ़ाइल अपडेट करें' : 'Save Profile'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
