import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Filter, Download, Navigation, Radio } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface CaseItem {
  id: string;
  location: string;
  coords: string;
  risk: 'Critical' | 'High' | 'Medium';
  score: number;
  people: number;
  type: string;
  detected: string;
  exposure: string;
  isolation: string;
  elapsed: string;
  confidence: string;
}

export default function RescuePriority() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  const loadSampleDataset = () => {
    const sampleCases: CaseItem[] = [
      {
        id: 'VIC-2026-0017',
        location: 'Borpeta Village (Majuli)',
        coords: '27.051° N, 94.152° E',
        risk: 'Critical',
        score: 94,
        people: 8,
        type: 'Roof Isolation · Rising Water Level',
        detected: 'Person requesting aid (UAV-04)',
        exposure: 'High (0.85m water rise)',
        isolation: 'High (No road access)',
        elapsed: '14m 20s',
        confidence: '82%'
      },
      {
        id: 'VIC-2026-0018',
        location: 'Kalgaon Sector 2',
        coords: '27.088° N, 94.210° E',
        risk: 'Critical',
        score: 91,
        people: 12,
        type: 'Structure Inundation SOS',
        detected: 'Thermal & Optical SAR Signal',
        exposure: 'Critical (1.2m water level)',
        isolation: 'Severe',
        elapsed: '32m 05s',
        confidence: '85%'
      }
    ];
    setCases(sampleCases);
    setSelectedCase(sampleCases[0]);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 leading-tight">Operational Rescue Queue</h2>
          <p className="text-slate-500 text-sm mt-1">AI-assisted triage prioritization. Final dispatch decisions remain with State Coordinator.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadSampleDataset} className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded shadow-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 flex items-center gap-2">
            Bind Dataset Stream
          </button>
          <button className="px-3 py-1.5 bg-gov-teal text-white rounded shadow-sm text-xs font-medium hover:bg-gov-tealLight flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Export Priority Manifest
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Cases Table */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-3 md:p-4">Case ID</th>
                <th className="p-3 md:p-4">Location</th>
                <th className="p-3 md:p-4">Risk Level</th>
                <th className="p-3 md:p-4">AI Score</th>
                <th className="p-3 md:p-4">People</th>
                <th className="p-3 md:p-4">Detection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.length > 0 ? (
                cases.map((item) => {
                  const isSelected = selectedCase?.id === item.id;
                  return (
                    <tr 
                      key={item.id}
                      onClick={() => setSelectedCase(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-teal-50/80 border-l-4 border-l-teal-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3 md:p-4 font-mono font-bold text-xs text-slate-900">{item.id}</td>
                      <td className="p-3 md:p-4 text-xs font-semibold text-slate-700">{item.location}</td>
                      <td className="p-3 md:p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          item.risk === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {item.risk}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 font-mono font-bold text-sm text-teal-800">{item.score}/100</td>
                      <td className="p-3 md:p-4 text-xs font-bold text-slate-800">{item.people}</td>
                      <td className="p-3 md:p-4 text-xs text-slate-500">{item.detected}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 font-mono text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert className="w-8 h-8 text-slate-300" />
                      <span>AWAITING DATASET BINDING... NO RESCUE CASES IN QUEUE</span>
                      <button onClick={loadSampleDataset} className="mt-2 text-teal-700 underline font-semibold text-xs">
                        Click here to ingest live telemetry stream
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Case Detail Drawer */}
        <div className="w-full xl:w-96 bg-gov-tealLight text-white rounded-lg shadow-lg border border-gov-tealLighter p-5 md:p-6 flex flex-col relative overflow-hidden shrink-0">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="text-teal-400 font-mono text-[10px] font-bold mb-1 tracking-widest uppercase">
                SELECTED CASE
              </div>
              <h3 className="font-serif text-3xl">{selectedCase ? selectedCase.id : '--'}</h3>
            </div>
            <span className="bg-slate-600 text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-500 shadow-sm tracking-wider uppercase">
              {selectedCase ? selectedCase.risk : 'WAITING'}
            </span>
          </div>
          
          <div className="space-y-5 mb-8 flex-1 relative z-10">
            <div>
              <div className="text-[10px] text-teal-300/70 mb-1 uppercase tracking-wider font-bold">Emergency Type</div>
              <div className="font-medium text-sm border-b border-teal-700/50 pb-2">
                {selectedCase ? selectedCase.type : 'Awaiting case selection'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-teal-300/70 mb-1 uppercase tracking-wider font-bold">Location Coordinates</div>
              <div className="font-medium text-sm border-b border-teal-700/50 pb-2 font-mono">
                {selectedCase ? selectedCase.coords : '--'}
              </div>
            </div>
            
            {/* Score Box */}
            <div className="p-4 bg-gov-teal/80 rounded border border-teal-700/50 mt-4 shadow-inner">
              <div className="flex items-center gap-4 mb-4 border-b border-teal-700/50 pb-4">
                <div className="w-16 h-16 rounded-full border-4 border-gov-tealLighter flex items-center justify-center relative bg-teal-950">
                  <div className="text-xl font-bold font-mono text-teal-300">{selectedCase ? selectedCase.score : '--'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-teal-200 font-mono tracking-widest uppercase">AI PRIORITY SCORE</div>
                  <div className="text-xs text-teal-400 mt-1 font-semibold">
                    {selectedCase ? 'Triage score computed' : 'Awaiting dataset binding'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-teal-300/70">Flood Exposure</span> 
                  <span className="font-medium text-slate-300">{selectedCase ? selectedCase.exposure : '--'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-300/70">Detection Conf.</span> 
                  <span className="font-medium text-slate-300 font-mono">{selectedCase ? selectedCase.confidence : '--'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-300/70">Isolation Status</span> 
                  <span className="font-medium text-slate-300">{selectedCase ? selectedCase.isolation : '--'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-teal-300/70">Elapsed Time</span> 
                  <span className="font-medium text-slate-300 font-mono">{selectedCase ? selectedCase.elapsed : '--'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <button disabled={!selectedCase} className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white py-2.5 rounded text-sm font-semibold transition-colors shadow flex items-center justify-center gap-2">
              <Radio className="w-4 h-4" /> Dispatch Rescue Unit
            </button>
            <button 
              onClick={() => navigate('/rescue-routes')} 
              className="w-full bg-transparent hover:bg-teal-800/50 text-teal-200 border border-teal-700 py-2.5 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> View Safe Routing Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
