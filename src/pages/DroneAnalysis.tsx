import React, { useState } from 'react';
import { Play, Pause, Eye, Video } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Observation {
  id: string;
  type: string;
  confidence: string;
  trackingId: string;
  time: string;
  status: string;
  loc: string;
}

export default function DroneAnalysis() {
  const [aiActive, setAiActive] = useState(false);
  const [observations, setObservations] = useState<Observation[]>([]);

  const handleToggleAi = () => {
    const nextState = !aiActive;
    setAiActive(nextState);
    if (nextState && observations.length === 0) {
      // Simulate live incoming observation feed when AI analysis is toggled ON
      setObservations([
        { id: 'OBS-104', type: 'Person requesting aid', confidence: '96%', trackingId: 'P-020', time: 'Just now', status: 'Critical', loc: 'Majuli Sector 4' },
        { id: 'OBS-105', type: 'Submerged Vehicle', confidence: '91%', trackingId: 'V-012', time: '2m ago', status: 'Warning', loc: 'Borpeta Road' },
      ]);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto min-h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 fade-in">
      {/* Video Stream Container */}
      <div className="flex-1 bg-black rounded-lg overflow-hidden relative shadow-lg border border-slate-800 flex flex-col">
        {/* Telemetry Bar */}
        <div className="bg-slate-900 text-white text-[10px] py-2 px-4 flex justify-between font-mono border-b border-slate-800 z-10">
          <div className="flex items-center gap-4">
            <span className="text-red-500 flex items-center gap-1.5 font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> REC
            </span>
            <span className="text-slate-400">ID: UAV-Alpha-04</span>
          </div>
          <div className="flex gap-4 text-teal-400">
            <span>ALT: 120m</span>
            <span>SPD: 15km/h</span>
            <span>GPS: 27.051N, 94.152E</span>
            <span className="hidden sm:inline text-slate-400">FPS: 60</span>
          </div>
        </div>

        {/* Video Screen */}
        <div className="flex-1 relative overflow-hidden bg-zinc-950 flex items-center justify-center min-h-[400px] cursor-crosshair group">
          <img 
            src="https://images.unsplash.com/photo-1582216503926-70e608e70fb9?auto=format&fit=crop&q=80&w=1600" 
            alt="Drone View" 
            className="w-full h-full object-cover opacity-75 filter grayscale contrast-125 sepia-[.15]" 
          />
          
          {/* Animated Scan Line */}
          {aiActive && <div className="scan-line"></div>}
          
          {/* Bounding Boxes */}
          {aiActive && (
            <>
              {/* Vehicle box */}
              <div className="absolute top-[35%] left-[25%] border-[1.5px] border-teal-400 w-[140px] h-[90px] bg-teal-400/10 transition-colors group-hover:bg-teal-400/20">
                <div className="absolute -top-5 left-[-1.5px] bg-teal-400 text-black text-[9px] font-bold px-1.5 py-0.5 font-mono shadow-sm">
                  VEHICLE · 91%
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-teal-200"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-teal-200"></div>
              </div>

              {/* Person box */}
              <div className="absolute top-[55%] left-[60%] border-[1.5px] border-orange-400 w-[60px] h-[80px] bg-orange-400/10 transition-colors group-hover:bg-orange-400/20">
                <div className="absolute -top-5 left-[-1.5px] bg-orange-400 text-black text-[9px] font-bold px-1.5 py-0.5 font-mono shadow-sm">
                  PERSON · 96%
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-orange-200"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-orange-200"></div>
              </div>
            </>
          )}

          {/* Crosshair HUD */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center relative">
              <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0.5 h-2 bg-white/40"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-0.5 h-2 bg-white/40"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-2 h-0.5 bg-white/40"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-2 h-0.5 bg-white/40"></div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-slate-900 p-3 flex justify-center gap-4 border-t border-slate-800 z-10">
          <button 
            onClick={handleToggleAi} 
            className={`px-6 py-2 rounded text-xs font-semibold flex items-center gap-2 transition-all border shadow-sm ${
              aiActive 
                ? 'bg-teal-700 hover:bg-teal-600 text-white border-teal-500' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {aiActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{aiActive ? 'Pause AI Analysis' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Observation Feed Drawer */}
      <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-teal-700" /> Latest AI Observations
          </h3>
          <span className="bg-slate-200 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
            LIVE FEED
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50 flex flex-col justify-center">
          {observations.length > 0 ? (
            observations.map((obs) => (
              <div key={obs.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2 hover:border-teal-400 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-900">{obs.type}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${obs.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                    {obs.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex justify-between font-mono">
                  <span>Location: {obs.loc}</span>
                  <span className="text-teal-700 font-bold">{obs.confidence}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex justify-between pt-1 border-t border-slate-100">
                  <span>{obs.id}</span>
                  <span>{obs.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-slate-400 text-xs font-mono border-2 border-dashed border-slate-200 rounded-lg">
              AWAITING TELEMETRY DATA...
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
          <Button variant="secondary" size="sm" className="w-full text-xs font-semibold border-slate-300" disabled={observations.length === 0}>
            Export Telemetry Log
          </Button>
        </div>
      </div>
    </div>
  );
}
