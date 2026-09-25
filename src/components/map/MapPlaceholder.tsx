import React from 'react';
import { Layers, MapPin, ZoomIn, ZoomOut, Crosshair, ShieldAlert, AlertTriangle, Home, MapPinOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { useI18n } from '../../i18n/I18nContext';
export function MapPlaceholder() {
  const { t } = useI18n();

  return (
    <div className="relative w-full h-[600px] bg-[#eef2f5] border-t border-gray-200 overflow-hidden flex flex-col">
      {/* Map Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Mock Map Features (Polygons) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Mock Flooded Area */}
        <div className="absolute w-[40%] h-[35%] bg-brand-blue/20 border border-brand-blue/40 rounded-[40%_60%_70%_30%] transform rotate-12 blur-sm" style={{ left: '20%', top: '25%' }}></div>
        <div className="absolute w-[25%] h-[20%] bg-brand-blue/30 border border-brand-blue/50 rounded-[30%_70%_50%_50%] blur-sm" style={{ right: '30%', top: '40%' }}></div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
          <button className="p-2 hover:bg-gray-50 text-gray-700 border-b border-gray-100" title={t('overview.map.zoomIn') || 'Zoom In'}>
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-50 text-gray-700 border-b border-gray-100" title={t('overview.map.zoomOut') || 'Zoom Out'}>
            <ZoomOut className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-50 text-gray-700" title={t('overview.map.fitLocate') || 'Fit/Locate'}>
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Button variant="secondary" size="sm" className="bg-white shadow-sm gap-2">
          <Layers className="w-4 h-4" /> {t('overview.map.layers') || 'Layers'}
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur border border-gray-200 shadow-sm p-3 text-xs z-10 rounded-sm">
        <div className="font-semibold text-brand-navy mb-2">{t('overview.map.legend') || 'Legend'}</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-brand-blue/30 border border-brand-blue/50"></div>
            <span className="text-gray-600">{t('overview.map.floodExtent') || 'Flood Extent'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-status-critical rounded-full border border-white"></div>
            <span className="text-gray-600">{t('overview.map.criticalLocation') || 'Critical Location'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-status-warning rounded border border-white"></div>
            <span className="text-gray-600">{t('overview.map.affectedSettlement') || 'Affected Settlement'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-gray-700 rounded-full border border-white"></div>
            <span className="text-gray-600">{t('overview.map.blockedRoad') || 'Blocked Road'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-status-normal rounded-full border border-white"></div>
            <span className="text-gray-600">{t('overview.map.rescueTeam') || 'Rescue Team'}</span>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="absolute bottom-1 left-1 text-[10px] text-gray-400 z-10 bg-white/60 px-1 rounded">
        Mock GIS Container
      </div>
    </div>
  );
}
