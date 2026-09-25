import React from 'react';
import { FileText, Printer, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function SituationReports() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto fade-in pb-20">
      {/* Toolbar */}
      <div className="bg-white p-3 rounded-t-lg border-b-0 border border-slate-200 flex justify-between items-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" /> Report Generator
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrint} className="gap-1.5 text-xs font-semibold">
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          <Button variant="secondary" size="sm" className="gap-1.5 text-xs font-semibold">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </div>
      
      {/* Report Paper */}
      <div className="bg-white rounded-b-lg shadow-md border border-slate-200 p-8 md:p-12 min-h-[800px] relative">
        {/* Govt Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="watermark" className="w-2/3 object-contain grayscale" />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b-[3px] border-slate-800 pb-6 mb-8 relative z-10">
          <div className="flex items-center gap-5">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Seal" className="h-16 lg:h-20 grayscale opacity-90 mix-blend-multiply" />
            <div>
              <h2 className="font-serif text-2xl lg:text-3xl text-slate-900 font-bold uppercase tracking-wide">Government of Assam</h2>
              <div className="text-sm lg:text-base font-semibold text-slate-700 uppercase tracking-widest mt-1">State Emergency Operations Centre</div>
              <div className="text-xs text-slate-500 mt-2 font-mono bg-slate-100 inline-block px-2 py-0.5 border border-slate-200">
                FLOOD SITUATION REPORT
              </div>
            </div>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0 text-xs text-slate-600 font-mono space-y-1">
            <div>ID: <span className="font-bold text-slate-900">--</span></div>
            <div>DATE: <span>--</span></div>
            <div>TIME: <span>--</span></div>
            <div className="mt-2 inline-block bg-slate-100 text-slate-700 font-bold px-2 py-1 border border-slate-200 rounded uppercase tracking-wider">
              Status: Waiting for Data
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
          <div className="bg-white p-4 border border-slate-300 rounded shadow-sm text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Flooded Area</div>
            <div className="text-xl font-serif text-slate-900">--</div>
          </div>
          <div className="bg-white p-4 border border-slate-300 rounded shadow-sm text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Affected Dist.</div>
            <div className="text-xl font-serif text-slate-900">--</div>
          </div>
          <div className="bg-white p-4 border border-slate-300 rounded shadow-sm text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase mb-1 tracking-widest">People Detected</div>
            <div className="text-xl font-serif text-slate-900">--</div>
          </div>
          <div className="bg-white p-4 border border-slate-300 rounded shadow-sm text-center bg-slate-50">
            <div className="text-[9px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Critical Rescues</div>
            <div className="text-xl font-serif text-slate-700 font-bold">--</div>
          </div>
        </div>

        {/* Report Sections */}
        <div className="space-y-8 text-sm text-slate-800 relative z-10 leading-relaxed font-medium">
          <section>
            <h4 className="font-serif text-lg text-slate-900 border-b border-slate-300 pb-1 mb-3">1. Flood Information</h4>
            <p className="text-slate-600">
              Awaiting automated API ingestion for situational analysis and flood boundary mapping.
            </p>
          </section>
          
          <section>
            <h4 className="font-serif text-lg text-slate-900 border-b border-slate-300 pb-1 mb-3">2. Rescue Intelligence</h4>
            <p className="text-slate-600">
              Awaiting AI triage prioritization engine connection.
            </p>
          </section>
          
          <section>
            <h4 className="font-serif text-lg text-slate-900 border-b border-slate-300 pb-1 mb-3">3. Operational Recommendations</h4>
            <ul className="list-none space-y-2 pl-2">
              <li className="flex items-start gap-2 text-slate-500 italic">System on standby for incoming data stream...</li>
            </ul>
          </section>
        </div>

        {/* Formal Signature Block */}
        <div className="mt-16 pt-8 border-t border-slate-300 flex justify-between items-end relative z-10">
          <div className="text-xs text-slate-500 font-mono">
            Generated by JALDRISHTI System
          </div>
          <div className="text-center w-48 border-t border-slate-400 pt-2">
            <div className="text-xs font-bold text-slate-800">State Coordinator</div>
            <div className="text-[10px] text-slate-500">ASDMA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
