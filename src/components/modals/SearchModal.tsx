import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, ShieldAlert, Navigation, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mockSearchResults = [
    { type: 'case', id: 'VIC-2026-0017', title: 'Critical Victim Signal - Borpeta Village', route: '/rescue-priority', icon: ShieldAlert },
    { type: 'case', id: 'VIC-2026-0018', title: 'High Priority Rescue - Kalgaon', route: '/rescue-priority', icon: ShieldAlert },
    { type: 'location', id: 'LOC-04', title: 'Majuli Sector 4 Flood Inundation Zone', route: '/affected-areas', icon: MapPin },
    { type: 'module', id: 'MOD-01', title: 'Drone Operations Telemetry Feed', route: '/drone-analysis', icon: Navigation },
    { type: 'module', id: 'MOD-02', title: 'Official Situation Report Generator', route: '/reports', icon: FileText },
  ];

  const filtered = query.trim()
    ? mockSearchResults.filter(item => 
        item.id.toLowerCase().includes(query.toLowerCase()) || 
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : mockSearchResults;

  const handleSelect = (route: string) => {
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex flex-col items-center pt-20 px-4 transition-opacity duration-300">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-300 border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case IDs (VIC-0017), locations (Majuli), or modules..." 
            className="flex-1 outline-none text-base bg-transparent text-slate-800 font-medium placeholder:text-slate-400"
          />
          <span className="text-[10px] font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded border border-slate-300">ESC</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 max-h-96 overflow-y-auto divide-y divide-slate-100">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id}
                  onClick={() => handleSelect(item.route)}
                  className="p-3 hover:bg-teal-50/60 rounded cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 group-hover:bg-teal-100 group-hover:text-teal-800 rounded text-slate-600 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-800 group-hover:text-teal-900">{item.title}</div>
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-slate-600">{item.type}</span>
                        <span>{item.id}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching cases or modules found for "{query}".
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center font-mono">
          <span>JALDRISHTI Global Search</span>
          <span>Tip: Press Ctrl+K anytime to open</span>
        </div>
      </div>
    </div>
  );
}
