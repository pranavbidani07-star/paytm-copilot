import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n, Language } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';
import { Search, Bell, HelpCircle, ShieldAlert, AlertTriangle, Book, Code, Mail, Menu, Database } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
}

export function Header({ onOpenSearch, onToggleMobileMenu }: HeaderProps) {
  const { t, language, setLanguage } = useI18n();
  const { isDataInserted } = useData();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <header className="bg-gov-teal text-white py-3 px-4 md:px-6 shadow-md relative z-40 flex justify-between items-center flex-shrink-0 border-b border-teal-900">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={onToggleMobileMenu} 
          className="md:hidden p-1.5 rounded hover:bg-teal-800/50 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Government Emblem Box */}
        <div className="w-10 h-12 md:w-12 md:h-14 border border-teal-700/50 flex flex-col items-center justify-center bg-teal-900/30 rounded shadow-inner p-1">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Govt Emblem" 
            className="h-7 md:h-8 object-contain opacity-90 drop-shadow-md brightness-0 invert"
          />
        </div>
        <div>
          <h1 className="font-serif text-xl md:text-3xl tracking-wide text-teal-50 drop-shadow-sm leading-none">
            {t('app.title')}
          </h1>
          <div className="text-teal-400 text-[9px] md:text-[11px] font-bold tracking-[0.15em] md:tracking-[0.2em] mt-1 uppercase">
            {t('app.subtitle')}
          </div>
          <div className="text-slate-400 text-[10px] tracking-wider mt-0.5 hidden sm:block">
            {t('app.seocTitle')} & Integrated Flood Relief Platform
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Language Selector Pill in Main Header */}
        <div className="flex bg-teal-950/80 rounded-md border border-teal-700/70 overflow-hidden text-xs shadow-inner p-0.5">
          <button 
            onClick={() => setLanguage('en')} 
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              language === 'en' ? 'bg-teal-600 text-white shadow-sm' : 'text-teal-200 hover:text-white hover:bg-teal-800/40'
            }`}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage('hi')} 
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              language === 'hi' ? 'bg-teal-600 text-white shadow-sm' : 'text-teal-200 hover:text-white hover:bg-teal-800/40'
            }`}
          >
            हिन्दी
          </button>
          <button 
            onClick={() => setLanguage('as')} 
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              language === 'as' ? 'bg-teal-600 text-white shadow-sm' : 'text-teal-200 hover:text-white hover:bg-teal-800/40'
            }`}
          >
            অসমীয়া
          </button>
        </div>
        <div className="flex items-center gap-3 text-slate-300 relative z-50">
          {/* Search Trigger */}
          <button 
            onClick={onOpenSearch} 
            className="hover:text-white transition-colors p-1.5 rounded hover:bg-teal-800/50" 
            aria-label="Search"
            title="Search (Ctrl+K)"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setNotifOpen(!notifOpen);
                setHelpOpen(false);
              }} 
              className="hover:text-white transition-colors relative block p-1.5 rounded hover:bg-teal-800/50" 
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gov-saffron rounded-full border border-gov-teal animate-pulse"></span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-10 w-72 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-[60] text-slate-800">
                <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
                  Emergency Alerts <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-sm text-[9px] shadow-sm font-mono">LIVE API</span>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  <div 
                    className="p-3 border-b border-slate-100 bg-red-50/50 hover:bg-red-50 cursor-pointer transition-colors"
                    onClick={() => {
                      navigate('/rescue-priority');
                      setNotifOpen(false);
                    }}
                  >
                    <div className="font-bold text-red-700 text-xs text-left mb-1 flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> VIC-2026-0017</span>
                      <span className="text-[9px] font-mono text-red-500">Just now</span>
                    </div>
                    <div className="text-left text-xs text-slate-600 font-medium">Borpeta Village • 82% confidence victim signal</div>
                  </div>

                  <div 
                    className="p-3 border-b border-slate-100 bg-orange-50/50 hover:bg-orange-50 cursor-pointer transition-colors"
                    onClick={() => {
                      navigate('/rescue-priority');
                      setNotifOpen(false);
                    }}
                  >
                    <div className="font-bold text-orange-700 text-xs text-left mb-1 flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> VIC-2026-0018</span>
                      <span className="text-[9px] font-mono text-orange-500">2m ago</span>
                    </div>
                    <div className="text-left text-xs text-slate-600 font-medium">Kalgaon • Isolated settlement SOS alert</div>
                  </div>
                </div>

                <div 
                  className="p-2 text-center text-xs text-slate-600 font-bold cursor-pointer hover:text-slate-900 transition-colors bg-slate-50 border-t border-slate-100"
                  onClick={() => {
                    navigate('/rescue-priority');
                    setNotifOpen(false);
                  }}
                >
                  VIEW ALL CASES &rarr;
                </div>
              </div>
            )}
          </div>

          {/* Help Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setHelpOpen(!helpOpen);
                setNotifOpen(false);
              }} 
              className="hover:text-white transition-colors block p-1.5 rounded hover:bg-teal-800/50" 
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            {helpOpen && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-[60] text-slate-800">
                <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">Support</div>
                <ul className="text-sm text-slate-600">
                  <li className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                    <a href="#manual" className="px-4 py-2.5 flex items-center gap-2 text-xs"><Book className="w-4 h-4 text-slate-400" /> User Manual</a>
                  </li>
                  <li className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                    <a href="#api" className="px-4 py-2.5 flex items-center gap-2 text-xs"><Code className="w-4 h-4 text-slate-400" /> API Documentation</a>
                  </li>
                  <li className="hover:bg-slate-50 transition-colors">
                    <a href="#admin" className="px-4 py-2.5 flex items-center gap-2 text-xs"><Mail className="w-4 h-4 text-slate-400" /> Contact ASDMA Admin</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
