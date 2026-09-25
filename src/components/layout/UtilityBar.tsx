import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

interface UtilityBarProps {
  onOpenScreenReader: () => void;
  textSize: string;
  setTextSize: (size: string) => void;
}

export function UtilityBar({ onOpenScreenReader, textSize, setTextSize }: UtilityBarProps) {
  const { t } = useI18n();

  const handleSizeChange = (size: string) => {
    setTextSize(size);
    const html = document.documentElement;
    if (size === 'sm') {
      html.style.fontSize = '14px';
    } else if (size === 'base') {
      html.style.fontSize = '16px';
    } else if (size === 'lg') {
      html.style.fontSize = '18px';
    }
  };

  return (
    <div className="bg-slate-800 text-slate-300 text-[11px] py-1 px-4 flex justify-between items-center border-b border-t-[3px] border-t-gov-saffron z-50">
      <div className="flex items-center gap-4">
        <div className="flex gap-[2px] h-3 w-4 rounded-sm overflow-hidden border border-slate-600">
          <div className="bg-gov-saffron w-full"></div>
          <div className="bg-white w-full"></div>
          <div className="bg-gov-green w-full"></div>
        </div>
        <span className="font-medium tracking-wide uppercase">{t('app.govTitle')}</span>
        <span className="hidden md:inline border-l border-slate-600 pl-4 uppercase">{t('app.deptTitle')}</span>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => handleSizeChange('sm')} 
            className={`hover:text-white font-mono ${textSize === 'sm' ? 'text-gov-saffron font-bold' : ''}`} 
            aria-label="Decrease text size"
          >
            A-
          </button>
          <button 
            onClick={() => handleSizeChange('base')} 
            className={`hover:text-white font-mono ${textSize === 'base' ? 'text-gov-saffron font-bold' : ''}`} 
            aria-label="Default text size"
          >
            A
          </button>
          <button 
            onClick={() => handleSizeChange('lg')} 
            className={`hover:text-white font-mono ${textSize === 'lg' ? 'text-gov-saffron font-bold' : ''}`} 
            aria-label="Increase text size"
          >
            A+
          </button>
        </div>
      </div>
    </div>
  );
}
