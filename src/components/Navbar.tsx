import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../i18n/translations';
import {
  Sprout,
  Scan,
  Layers,
  BookOpen,
  BarChart3,
  User,
  Globe,
  Sparkles,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'diagnosis' | 'myFields' | 'advisory' | 'analytics' | 'resources';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onOpenProfile: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  lang,
  onToggleLang,
  onOpenProfile,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const t = TRANSLATIONS[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: <Compass className="w-4 h-4" /> },
    { id: 'diagnosis', label: t.nav.diagnosis, icon: <Scan className="w-4 h-4" /> },
    { id: 'myFields', label: t.nav.myFields, icon: <Layers className="w-4 h-4" /> },
    { id: 'advisory', label: t.nav.advisory, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'analytics', label: t.nav.analytics, icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'resources', label: t.nav.resources, icon: <Sprout className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6ED]/95 backdrop-blur-md border-b border-[#80674722] transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#245638] flex items-center justify-center text-[#D6AD57] shadow-sm group-hover:bg-[#143B29] transition">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-serif-title font-extrabold text-xl text-[#245638] tracking-tight block">
              Agri<span className="text-[#806747]">Lens</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#746C60] -mt-1 block">
              {lang === 'hi' ? 'दृश्य एआई फसल सलाहकार' : 'Visual AI Crop Advisory'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-[#245638] text-white shadow-sm'
                    : 'text-[#24342A] hover:bg-[#80674715]'
                }`}
              >
                <span className={isActive ? 'text-[#D6AD57]' : 'text-[#806747]'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utility Controls: Demo Mode, Language Selector, Farmer Profile */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Hackathon Demo Mode Pill */}
          <button
            onClick={onToggleDemoMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              isDemoMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-[#FFFDF8] text-[#24342A] border-[#80674733] hover:bg-[#FAF6ED]'
            }`}
            title="Toggle between Live Gemini Multimodal Vision and Curated ICAR Demo Cases"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDemoMode ? 'text-amber-600' : 'text-[#806747]'}`} />
            <span>{isDemoMode ? t.demoModeActive : t.liveAiMode}</span>
          </button>

          {/* Bilingual Language Switcher */}
          <div className="flex items-center rounded-xl bg-[#FFFDF8] border border-[#80674733] p-0.5 text-xs">
            <button
              onClick={() => onToggleLang('en')}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                lang === 'en' ? 'bg-[#245638] text-white shadow-xs' : 'text-[#746C60] hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLang('hi')}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                lang === 'hi' ? 'bg-[#245638] text-white shadow-xs' : 'text-[#746C60] hover:text-black'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Farmer Profile Button */}
          <button
            onClick={onOpenProfile}
            className="p-2 rounded-xl bg-[#FFFDF8] border border-[#80674733] text-[#245638] hover:bg-[#FAF6ED] transition shadow-xs"
            title="Farmer Profile & Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => onToggleLang(lang === 'en' ? 'hi' : 'en')}
            className="px-2 py-1 rounded-lg bg-[#FFFDF8] border border-[#80674733] text-xs font-bold text-[#245638]"
          >
            {lang === 'en' ? 'हिन्दी' : 'EN'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#FFFDF8] border border-[#80674733] text-[#245638]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 bg-[#FFFDF8] border-b border-[#80674733] space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition ${
                activeTab === item.id
                  ? 'bg-[#245638] text-white'
                  : 'text-[#24342A] hover:bg-[#FAF6ED]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-3 border-t border-[#80674722] flex items-center justify-between">
            <button
              onClick={onToggleDemoMode}
              className="text-xs font-bold text-[#806747] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D6AD57]" />
              <span>{isDemoMode ? t.demoModeActive : t.liveAiMode}</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-lg bg-[#FAF6ED] text-xs font-bold text-[#245638] border border-[#80674733]"
            >
              {t.nav.profile}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
