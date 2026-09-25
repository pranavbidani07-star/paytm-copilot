import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';
import { 
  Activity, Map, Video, ShieldAlert, Navigation, 
  FileText, MapPin, Crosshair, Radio, X
} from 'lucide-react';

const navItems = [
  { id: 'overview', path: '/overview', icon: Activity, label: 'Command Overview' },
  { id: 'floodMapping', path: '/flood-mapping', icon: Map, label: 'Flood Intelligence' },
  { id: 'droneAnalysis', path: '/drone-analysis', icon: Video, label: 'Drone Operations' },
  { id: 'rescuePriority', path: '/rescue-priority', icon: ShieldAlert, label: 'Rescue Priority' },
  { id: 'rescueRoutes', path: '/rescue-routes', icon: Navigation, label: 'Safe Routes' },
  { id: 'reports', path: '/reports', icon: FileText, label: 'Situation Reports' },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const { t } = useI18n();
  const { isDataInserted } = useData();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Element */}
      <aside 
        className={`bg-white border-r border-slate-200 w-64 flex-shrink-0 flex flex-col z-30 shadow-[2px_0_10px_rgba(0,0,0,0.02)] transition-transform duration-300 fixed md:relative inset-y-0 left-0 md:inset-auto h-full transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile close button */}
        <div className="md:hidden flex justify-end p-2 border-b border-slate-100">
          <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-2">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            {t('nav.commandModules') || 'Command Modules'}
          </div>
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                        isActive
                          ? 'bg-gov-teal text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {t(`nav.${item.id}`) || item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
            {t('nav.quickAccess') || 'Quick Access'}
          </div>
          <div className="px-2 space-y-1">
            <button 
              onClick={() => {
                navigate('/rescue-priority');
                setMobileOpen(false);
              }} 
              className="w-full text-left px-3 py-2 text-xs rounded bg-red-50 text-red-800 font-semibold flex justify-between items-center border border-red-100 hover:bg-red-100 transition-colors"
            >
              {t('nav.emergencyCases') || 'Emergency Cases'} <span className="bg-red-600 text-white text-[10px] py-0.5 px-2 rounded-full shadow-sm font-mono">{isDataInserted ? '12' : '--'}</span>
            </button>
            <button 
              onClick={() => {
                navigate('/rescue-routes');
                setMobileOpen(false);
              }} 
              className="w-full text-left px-3 py-2 text-xs rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors"
            >
              {t('nav.routePlanning') || 'Route Planning'}
            </button>
            <button 
              onClick={() => {
                navigate('/flood-mapping');
                setMobileOpen(false);
              }} 
              className="w-full text-left px-3 py-2 text-xs rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors"
            >
              {t('nav.emergencyProtocol') || 'Emergency Protocol'}
            </button>
          </div>

          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
            {t('nav.fieldNetwork') || 'Field Network'}
          </div>
          <div className="px-4 space-y-2 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {t('nav.districtNodes') || 'District Nodes'}</span>
              <span className={`font-mono font-medium ${isDataInserted ? 'text-emerald-600' : 'text-slate-400'}`}>{isDataInserted ? '35/35' : '--'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 flex items-center gap-1.5"><Crosshair className="w-3.5 h-3.5" /> {t('nav.droneFeeds') || 'Drone Feeds'}</span>
              <span className={`font-mono font-medium ${isDataInserted ? 'text-teal-600' : 'text-slate-400'}`}>{isDataInserted ? '08 Active' : '--'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 flex items-center gap-1.5"><Radio className="w-3.5 h-3.5" /> {t('nav.commHealth') || 'Comm Health'}</span>
              <span className={`font-mono font-medium ${isDataInserted ? 'text-emerald-600' : 'text-slate-400'}`}>{isDataInserted ? '99.8%' : '--'}</span>
            </div>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center shrink-0">
          <div className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">{t('app.confidentialNotice') || 'CONFIDENTIAL & OPERATIONAL'}</div>
          <div className="text-[9px] text-slate-400 mt-1 font-mono">Prototype Build v0.9.1</div>
        </div>
      </aside>
    </>
  );
}
