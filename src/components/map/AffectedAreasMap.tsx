import React from 'react';
import { AffectedAreasAssessment } from '../../types';
import { Home, AlertTriangle } from 'lucide-react';

interface AffectedAreasMapProps {
  assessment: AffectedAreasAssessment;
  activeLayers: Record<string, boolean>;
  highlightedId: string | null;
}

export function AffectedAreasMap({ assessment, activeLayers, highlightedId }: AffectedAreasMapProps) {
  return (
    <div className="w-full h-full min-h-[400px] bg-blue-50/30 relative overflow-hidden flex items-center justify-center">
      {/* Abstract Base Map (always visible) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M 0,20 Q 30,30 50,10 T 100,25 L 100,100 L 0,100 Z" fill="#e2e8f0" />
        <path d="M 0,60 Q 40,40 60,80 T 100,70 L 100,100 L 0,100 Z" fill="#cbd5e1" />
      </svg>

      {/* Map Content Container */}
      <div className="relative w-full h-full" style={{ maxWidth: '800px', maxHeight: '600px' }}>
        
        {/* Layer: Flood Extent */}
        {activeLayers.floodExtent && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {/* Mock Flood Polygon */}
            <path d="M 20,40 Q 30,20 50,30 T 70,50 Q 80,70 50,80 T 20,60 Z" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,1" />
            <path d="M 60,20 Q 75,10 85,25 T 70,40 Z" fill="#3b82f6" fillOpacity="0.1" />
          </svg>
        )}

        {/* Layer: Roads */}
        {activeLayers.roads && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {assessment.roads.map(road => {
              // Should we hide normal roads if "blockedRoads" toggle is used?
              // The prompt says: "Blocked Roads" toggle. Let's just show all roads if "roads" is checked, 
              // and maybe style them differently. If only "blockedRoads" is checked, show only blocked.
              // For simplicity, we just render them based on activeLayers.
              if (!activeLayers.blockedRoads && road.status === 'Blocked') return null;
              
              const isBlocked = road.status === 'Blocked';
              const isHighlighted = highlightedId === road.id;
              
              const strokeColor = isBlocked ? '#ef4444' : '#64748b';
              const strokeWidth = isHighlighted ? 1.5 : 0.8;
              
              const pathData = `M ${road.path[0][0]},${road.path[0][1]} L ${road.path[1][0]},${road.path[1][1]}`;
              
              return (
                <path 
                  key={road.id} 
                  d={pathData} 
                  stroke={strokeColor} 
                  strokeWidth={strokeWidth} 
                  strokeDasharray={isBlocked ? "1,0.5" : "none"}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        )}

        {/* Layer: Settlements */}
        {activeLayers.settlements && (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {assessment.settlements.map(settlement => {
              const isHighlighted = highlightedId === settlement.id;
              const isIsolated = settlement.status === 'Isolated';
              const colorClass = isIsolated ? 'bg-status-critical text-white' : 
                                 settlement.severity === 'High' ? 'bg-status-warning text-white' : 
                                 'bg-brand-blue text-white';

              return (
                <div 
                  key={settlement.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300 ${isHighlighted ? 'scale-125 z-10' : 'scale-100 z-0'}`}
                  style={{ left: `${settlement.x}%`, top: `${settlement.y}%` }}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md ${colorClass} ${isHighlighted ? 'ring-4 ring-brand-blue/30' : ''}`}>
                    <Home className="w-3 h-3" />
                  </div>
                  {isHighlighted && (
                    <div className="mt-1 bg-white px-1.5 py-0.5 rounded shadow text-[10px] font-bold text-brand-navy whitespace-nowrap">
                      {settlement.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Layer: Critical Zones */}
        {activeLayers.criticalZones && (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {assessment.criticalZones.map(zone => {
              const isHighlighted = highlightedId === zone.id;
              
              return (
                <div 
                  key={zone.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300 ${isHighlighted ? 'scale-125 z-20' : 'scale-100 z-10'}`}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                >
                  <div className="w-8 h-8 flex items-center justify-center text-status-critical animate-pulse">
                    <AlertTriangle className="w-6 h-6 drop-shadow-md" />
                  </div>
                  {isHighlighted && (
                    <div className="mt-0 bg-status-critical text-white px-1.5 py-0.5 rounded shadow text-[10px] font-bold whitespace-nowrap">
                      {zone.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Grid overlay for aesthetic */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgTCA0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMmU4ZjAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none"></div>
    </div>
  );
}
