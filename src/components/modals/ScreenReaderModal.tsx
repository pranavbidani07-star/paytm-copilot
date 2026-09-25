import React from 'react';
import { MonitorSpeaker, X, CheckCircle2 } from 'lucide-react';

interface ScreenReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScreenReaderModal({ isOpen, onClose }: ScreenReaderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex flex-col items-center pt-20 px-4 transition-opacity duration-300">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-300 border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-serif text-xl text-slate-800 flex items-center gap-2">
            <MonitorSpeaker className="w-5 h-5 text-teal-600" /> Screen Reader Access
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-slate-600 text-sm space-y-4">
          <p>
            The JALDRISHTI platform complies with Government of India Web Guidelines (GIGW) for visual accessibility. If you have visual impairments, you can use screen readers to access this portal.
          </p>

          <div className="bg-teal-50 border border-teal-200 rounded-md p-3 text-teal-900 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>This website supports standard ARIA landmarks, keyboard navigation (`Tab`, `Shift+Tab`, `Enter`), and high contrast color ratios.</span>
          </div>

          <div className="border border-slate-200 rounded overflow-hidden mt-4">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3">Screen Reader</th>
                  <th className="p-3">Website</th>
                  <th className="p-3">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="p-3 font-semibold">NVDA</td>
                  <td className="p-3"><a href="https://www.nvaccess.org/" target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">nvaccess.org</a></td>
                  <td className="p-3 font-mono text-emerald-700 font-medium">Free / Open Source</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">System Access To Go</td>
                  <td className="p-3"><a href="https://www.satogo.com/" target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">satogo.com</a></td>
                  <td className="p-3 font-mono text-emerald-700 font-medium">Free</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">JAWS</td>
                  <td className="p-3"><a href="https://www.freedomscientific.com/" target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">freedomscientific.com</a></td>
                  <td className="p-3 font-mono text-slate-600">Commercial</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gov-teal text-white rounded text-xs font-semibold hover:bg-gov-tealLight transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
