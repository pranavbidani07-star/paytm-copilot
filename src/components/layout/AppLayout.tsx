import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UtilityBar } from './UtilityBar';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SearchModal } from '../modals/SearchModal';
import { ScreenReaderModal } from '../modals/ScreenReaderModal';
import { Menu } from 'lucide-react';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScreenReaderOpen, setIsScreenReaderOpen] = useState(false);
  const [textSize, setTextSize] = useState('base');

  return (
    <div className="text-slate-800 flex flex-col h-screen overflow-hidden bg-gov-paper">
      {/* Search & Screen Reader Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ScreenReaderModal isOpen={isScreenReaderOpen} onClose={() => setIsScreenReaderOpen(false)} />

      {/* Top Utility Bar */}
      <UtilityBar 
        onOpenScreenReader={() => setIsScreenReaderOpen(true)} 
        textSize={textSize}
        setTextSize={setTextSize}
      />

      {/* Main Header */}
      <Header 
        onOpenSearch={() => setIsSearchOpen(true)} 
        onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Content Area */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto scroll-smooth bg-gov-paper relative w-full focus:outline-none flex flex-col justify-between" 
          tabIndex={-1}
        >
          {/* Page View Container */}
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Government Footer */}
          <footer className="mt-12 bg-gov-teal text-slate-300 border-t-4 border-gov-saffron shrink-0 relative z-30">
            <div className="max-w-[1400px] mx-auto px-6 py-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-teal-800 pb-8">
                <div>
                  <div className="font-serif text-2xl text-white mb-3 flex items-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Seal" className="h-8 brightness-0 invert opacity-90" />
                    JALDRISHTI
                  </div>
                  <p className="text-xs text-teal-200/80 leading-relaxed max-w-sm">
                    Integrated AI Flood Intelligence & Response Platform for the Government of Assam, designed for rapid geospatial analysis and rescue prioritization.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Important Links</h3>
                  <ul className="text-xs space-y-2.5">
                    <li><a href="#policies" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-saffron rounded-full"></span> Website Policies</a></li>
                    <li><a href="#terms" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-saffron rounded-full"></span> Terms & Conditions</a></li>
                    <li><a href="#manager" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-saffron rounded-full"></span> Web Information Manager</a></li>
                    <li><a href="#help" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-saffron rounded-full"></span> Help & Support</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">State Control Room</h3>
                  <div className="text-xs text-teal-200/80 space-y-1.5 font-mono">
                    <div>State Emergency Operations Centre</div>
                    <div>ASDMA Complex, Dispur, Guwahati - 781006</div>
                    <div className="text-gov-saffron font-bold mt-2">Toll-Free Helpline: 1070 / 1079</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-teal-400/60 font-medium">
                <p>&copy; 2026 Government of Assam. All rights reserved.</p>
                <p className="mt-2 md:mt-0 font-mono">Last Updated: 13 Sep 2026 • SEOC Operations Node</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
