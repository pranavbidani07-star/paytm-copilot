import React from 'react';
import { VictimDetectionAssessment, AffectedAreasAssessment, RescueTeam, RescueRoute } from '../../types';
import { Home, User, AlertTriangle, MapPin, MapPinOff, Truck } from 'lucide-react';

interface VictimMapProps {
  assessment: VictimDetectionAssessment;
  affectedAreasAssessment: AffectedAreasAssessment;
  activeLayers: Record<string, boolean>;
  highlightedId: string | null;
  onVictimClick?: (id: string) => void;
  teams?: RescueTeam[];
  primaryRoute?: RescueRoute | null;
  alternativeRoute?: RescueRoute | null;
}

export function VictimMap({ 
  assessment, 
  affectedAreasAssessment, 
  activeLayers, 
  highlightedId, 
  onVictimClick,
  teams = [],
  primaryRoute = null,
  alternativeRoute = null
}: VictimMapProps) {
  return (
    <div className="w-full h-full min-h-[400px] bg-blue-50/30 relative overflow-hidden flex items-center justify-center">
      {/* Abstract Base Map */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M 0,20 Q 30,30 50,10 T 100,25 L 100,100 L 0,100 Z" fill="#e2e8f0" />
        <path d="M 0,60 Q 40,40 60,80 T 100,70 L 100,100 L 0,100 Z" fill="#cbd5e1" />
      </svg>

      {/* Map Content Container */}
      <div className="relative w-full h-full" style={{ maxWidth: '800px', maxHeight: '600px' }}>
        
        {/* Layer: Flood Extent */}
        {activeLayers.floodExtent && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            <path d="M 20,40 Q 30,20 50,30 T 70,50 Q 80,70 50,80 T 20,60 Z" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,1" />
            <path d="M 60,20 Q 75,10 85,25 T 70,40 Z" fill="#3b82f6" fillOpacity="0.05" />
          </svg>
        )}

        {/* Layer: Blocked Roads from AffectedAreasAssessment */}
        {activeLayers.blockedRoads && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
            {affectedAreasAssessment.roads.filter(r => r.status === 'Blocked').map(road => {
              const pathData = `M ${road.path[0][0]},${road.path[0][1]} L ${road.path[1][0]},${road.path[1][1]}`;
              return (
                <path 
                  key={road.id} 
                  d={pathData} 
                  stroke="#ef4444" 
                  strokeWidth="0.8" 
                  strokeDasharray="1,0.5"
                  className="transition-all duration-300 opacity-60"
                />
              );
            })}
          </svg>
        )}

        {/* Layer: Routes */}
        {activeLayers.routes && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-15" viewBox="0 0 100 100">
            {alternativeRoute && (
              <path 
                d={`M ${alternativeRoute.fullPath.map(p => `${p[0]},${p[1]}`).join(' L ')}`} 
                fill="none"
                stroke="#94a3b8" 
                strokeWidth="0.6" 
                strokeDasharray="1,1"
                className="opacity-70"
              />
            )}
            {primaryRoute && (
              <path 
                d={`M ${primaryRoute.fullPath.map(p => `${p[0]},${p[1]}`).join(' L ')}`} 
                fill="none"
                stroke="#2563eb" 
                strokeWidth="1.2" 
                className="drop-shadow-md"
              />
            )}
            {primaryRoute?.segments.map((segment, idx) => {
              if (segment.status === 'Flooded') {
                return (
                  <path 
                    key={idx}
                    d={`M ${segment.path[0][0]},${segment.path[0][1]} L ${segment.path[1][0]},${segment.path[1][1]}`}
                    fill="none"
                    stroke="#ef4444" 
                    strokeWidth="1.2"
                    strokeDasharray="2,1"
                  />
                );
              }
              return null;
            })}
          </svg>
        )}

        {/* Layer: Settlements */}
        {activeLayers.settlements && (
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {affectedAreasAssessment.settlements.map(settlement => (
              <div 
                key={settlement.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-60"
                style={{ left: `${settlement.x}%`, top: `${settlement.y}%` }}
              >
                <div className="w-4 h-4 rounded-full bg-brand-navy flex items-center justify-center shadow-sm">
                  <Home className="w-2 h-2 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Layer: Rescue Teams */}
        {activeLayers.teams && (
          <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {teams.map(team => (
              <div 
                key={team.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
                style={{ left: `${team.x}%`, top: `${team.y}%` }}
              >
                <div className="w-8 h-8 rounded-md bg-white border-2 border-brand-navy flex items-center justify-center shadow-md">
                  <Truck className="w-4 h-4 text-brand-navy" />
                </div>
                <div className="mt-1 bg-white px-1.5 py-0.5 rounded shadow-sm text-[9px] font-bold text-brand-navy whitespace-nowrap border border-gray-100">
                  {team.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Layer: Victims */}
        {activeLayers.victims && (
          <div className="absolute inset-0 w-full h-full">
            {assessment.victims.map(victim => {
              // Skip rendering if no coordinates are available
              if (victim.x === null || victim.y === null) return null;

              const isHighlighted = highlightedId === victim.id;
              
              const colorClass = victim.priority === 'Critical' ? 'bg-status-critical text-white' : 
                                 victim.priority === 'High' ? 'bg-status-warning text-white' : 
                                 'bg-brand-blue text-white';

              return (
                <div 
                  key={victim.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${isHighlighted ? 'scale-125 z-30' : 'scale-100 z-20 hover:scale-110'}`}
                  style={{ left: `${victim.x}%`, top: `${victim.y}%` }}
                  onClick={() => onVictimClick && onVictimClick(victim.id)}
                >
                  <div className="relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md ${colorClass} ${isHighlighted ? 'ring-4 ring-offset-1 ring-brand-blue/30' : 'border border-white'}`}>
                      <User className="w-3.5 h-3.5" />
                    </div>
                    {/* Verification Indicator */}
                    {victim.verificationStatus === 'Verified' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-status-normal rounded-full border border-white flex items-center justify-center">
                        <MapPin className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {isHighlighted && (
                    <div className="mt-1 bg-white px-2 py-1 rounded shadow-md text-xs font-bold text-brand-navy whitespace-nowrap border border-gray-100 flex flex-col items-center">
                      <span>{victim.id}</span>
                      <span className="text-[10px] text-gray-500 font-normal">{victim.priority} Priority</span>
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
