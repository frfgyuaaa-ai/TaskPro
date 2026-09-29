import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

interface LanguageSelectorProps {
  variant?: 'pill' | 'button' | 'settings-row';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'pill' }) => {
  const { language, setLanguage, languages, currentLangOption, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'settings-row') {
    return (
      <div className="relative" ref={containerRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-surface-container-high/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              translate
            </span>
            <div>
              <p className="text-xs font-semibold text-on-surface">{t('language')}</p>
              <p className="text-[11px] text-on-surface-variant">{t('selectLanguage')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-xs font-bold text-on-surface border border-surface-container-high">
            <span>{currentLangOption.flag}</span>
            <span>{currentLangOption.nativeName}</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="absolute right-3 top-14 w-48 bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-2xl p-1.5 z-50">
            <div className="text-[10px] uppercase font-bold text-on-surface-variant px-2.5 py-1">
              {t('selectLanguage')}
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                  language === lang.code
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-on-surface hover:bg-surface-container font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </div>
                {language === lang.code && (
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high/70 hover:bg-surface-container-highest text-on-surface text-xs font-semibold active:scale-95 transition-all shadow-xs border border-surface-container-high/50"
      >
        <span className="text-xs">{currentLangOption.flag}</span>
        <span className="text-[11px] font-bold uppercase">{currentLangOption.code}</span>
        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-44 bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
          <div className="text-[10px] uppercase font-bold text-on-surface-variant px-2.5 py-1">
            {t('selectLanguage')}
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                language === lang.code
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </div>
              {language === lang.code && (
                <span className="material-symbols-outlined text-[16px] text-primary">check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
