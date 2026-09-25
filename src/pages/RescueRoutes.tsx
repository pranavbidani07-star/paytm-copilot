import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { VictimMap } from '../components/map/VictimMap';
import { calculateRoute } from '../utils/routePlanning';
import { 
  mockVictims, 
  mockRescueTeams, 
  mockAffectedAreasAssessment, 
  mockVictimDetectionAssessment 
} from '../data/mockData';
import { RescueRoute, RouteWarning } from '../types';
import { 
  MapPin, Truck, AlertTriangle, Info, Navigation, GitBranch, Crosshair, Clock, AlertCircle, RefreshCw
} from 'lucide-react';

export default function RescueRoutes() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [hasData, setHasData] = useState(false);
  
  // State
  const [selectedVictimId, setSelectedVictimId] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  
  const [activeRoute, setActiveRoute] = useState<'primary' | 'alternative'>('primary');
  const [routes, setRoutes] = useState<{ primary: RescueRoute; alternative: RescueRoute } | null>(null);

  // Map layer toggles
  const [mapLayers, setMapLayers] = useState({
    floodExtent: true,
    blockedRoads: true,
    victims: true,
    teams: true,
    routes: true,
    settlements: false
  });

  // Derived state
  const selectedVictim = useMemo(() => mockVictims.find(v => v.id === selectedVictimId) || null, [selectedVictimId]);
  const selectedTeam = useMemo(() => mockRescueTeams.find(t => t.id === selectedTeamId) || null, [selectedTeamId]);
  const currentRoute = routes ? routes[activeRoute] : null;

  // Initialize from URL params or default
  useEffect(() => {
    if (!hasData) {
      setSelectedVictimId('');
      setSelectedTeamId('');
      setRoutes(null);
      return;
    }
    const vid = searchParams.get('victimId');
    if (vid && mockVictims.some(v => v.id === vid)) {
      setSelectedVictimId(vid);
    } else {
      // Default to first critical victim
      const critical = mockVictims.find(v => v.priority === 'Critical');
      if (critical) setSelectedVictimId(critical.id);
    }

    // Default to first team
    setSelectedTeamId(mockRescueTeams[0].id);
  }, [searchParams, hasData]);

  const handlePlanRoute = () => {
    if (selectedVictim && selectedTeam) {
      const calcRoutes = calculateRoute(selectedVictim, selectedTeam, mockAffectedAreasAssessment.roads);
      setRoutes(calcRoutes);
      setActiveRoute('primary');
    }
  };

  // If both are selected but no routes calculated yet, we could auto-calculate, 
  // but let's require the user to explicitly click "Plan Route" or auto-calculate if initialized
  useEffect(() => {
    if (selectedVictim && selectedTeam && !routes) {
      handlePlanRoute();
    }
  }, [selectedVictimId, selectedTeamId]);

  const toggleLayer = (layer: keyof typeof mapLayers) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const renderWarning = (warning: RouteWarning, idx: number) => {
    const colorClass = warning.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                       warning.severity === 'Warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                       'bg-blue-50 text-blue-700 border-blue-200';
    
    const Icon = warning.severity === 'Critical' ? AlertCircle :
                 warning.severity === 'Warning' ? AlertTriangle : Info;

    return (
      <div key={idx} className={`flex items-start gap-3 p-3 rounded-md border ${colorClass} text-sm mb-2`}>
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <p>{warning.message}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy tracking-tight">
            {t('rescueRoutes.title') || 'Rescue Routes'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            {t('rescueRoutes.subtitle') || 'Plan safe routes avoiding flooded and blocked infrastructure.'}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <StatusBadge status={hasData ? "success" : "warning"}>
              {hasData ? "Live Data Connected" : "System Standby"}
            </StatusBadge>
            <div className="text-xs text-gray-400 font-medium">
              {hasData ? "Routes are calculated using live streaming data." : "System is standing by for real-time GIS and target data."}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setHasData(true)} variant="secondary" className="gap-2 bg-white text-teal-700 border-teal-200 shadow-sm hover:bg-teal-50 font-semibold text-sm">
            <RefreshCw className="w-4 h-4" /> Ingest Live Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start h-[calc(100vh-220px)] min-h-[600px]">
        
        {/* Left Sidebar - Controls and Summary */}
        <div className="lg:col-span-1 space-y-4 flex flex-col h-full overflow-y-auto pr-1">
          
          {/* Selectors */}
          <Card className="shrink-0 border border-gray-200 shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  {t('rescueRoutes.selectors.victim') || 'Select Victim'}
                </label>
                <select 
                  className="w-full border border-gray-200 rounded-md py-2 px-3 bg-white text-sm focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none"
                  value={selectedVictimId}
                  onChange={(e) => {
                    setSelectedVictimId(e.target.value);
                    setRoutes(null);
                  }}
                  disabled={!hasData}
                >
                  <option value="">{hasData ? "Select Target..." : "Waiting for data..."}</option>
                  {hasData && mockVictims.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.id} ({v.priority}) - {v.settlement}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  {t('rescueRoutes.selectors.team') || 'Select Rescue Team'}
                </label>
                <select 
                  className="w-full border border-gray-200 rounded-md py-2 px-3 bg-white text-sm focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none"
                  value={selectedTeamId}
                  onChange={(e) => {
                    setSelectedTeamId(e.target.value);
                    setRoutes(null);
                  }}
                  disabled={!hasData}
                >
                  <option value="">{hasData ? "Select Team..." : "Waiting for data..."}</option>
                  {hasData && mockRescueTeams.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.type})
                    </option>
                  ))}
                </select>
              </div>

              <Button 
                onClick={handlePlanRoute} 
                className="w-full" 
                variant={routes ? 'secondary' : 'primary'}
                disabled={!hasData || !selectedVictimId || !selectedTeamId}
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t('rescueRoutes.actions.planRoute') || 'Plan Route'}
              </Button>
            </CardContent>
          </Card>

          {/* Details (Target/Team) */}
          {selectedVictim && (
            <Card className="shrink-0 border-l-4 border-l-brand-blue shadow-sm">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="font-semibold text-brand-navy border-b border-gray-100 pb-2 mb-2 flex items-center justify-between">
                  <span>{t('rescueRoutes.details.title') || 'Target Details'}</span>
                  <span className="font-mono text-xs">{selectedVictim.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('rescueRoutes.details.priority') || 'Priority'}:</span>
                  <span className={`font-medium ${selectedVictim.priority === 'Critical' ? 'text-status-critical' : ''}`}>
                    {selectedVictim.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('rescueRoutes.details.confidence') || 'Loc Confidence'}:</span>
                  <span className="font-medium text-gray-700">{selectedVictim.locationConfidence}</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-gray-500 shrink-0">{t('rescueRoutes.details.settlement') || 'Near'}:</span>
                  <span className="font-medium text-gray-700 text-right">{selectedVictim.settlement}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Route Summary */}
          {currentRoute && (
            <Card className="flex-1 shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <CardHeader className="py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0">
                <CardTitle className="text-sm flex justify-between items-center">
                  <span>{t('rescueRoutes.summary.title') || 'Route Summary'}</span>
                  <StatusBadge status={currentRoute.riskLevel === 'High' || currentRoute.riskLevel === 'Critical' ? 'critical' : currentRoute.riskLevel === 'Medium' ? 'warning' : 'normal'}>
                    {currentRoute.status}
                  </StatusBadge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border border-gray-100 p-3 rounded-md text-center shadow-sm">
                    <Navigation className="w-5 h-5 mx-auto mb-1 text-brand-blue" />
                    <div className="text-lg font-bold text-brand-navy">{currentRoute.distanceKm} km</div>
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">{t('rescueRoutes.summary.distance') || 'Distance'}</div>
                  </div>
                  <div className="bg-white border border-gray-100 p-3 rounded-md text-center shadow-sm">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-brand-blue" />
                    <div className="text-lg font-bold text-brand-navy">{currentRoute.estimatedTimeMins} m</div>
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">{t('rescueRoutes.summary.time') || 'Est. Time'}</div>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      {t('rescueRoutes.summary.warnings') || 'Route Warnings'}
                    </div>
                    {currentRoute.warnings.length > 0 ? (
                      currentRoute.warnings.map((w, idx) => renderWarning(w, idx))
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        {t('rescueRoutes.summary.noWarnings') || 'No warnings for this route.'}
                      </p>
                    )}
                  </div>
                </div>

                {routes && (
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      {t('rescueRoutes.alternatives.title') || 'Alternative Routes'}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={activeRoute === 'primary' ? 'primary' : 'ghost'}
                        className="flex-1 text-xs py-1 h-auto"
                        onClick={() => setActiveRoute('primary')}
                      >
                        Primary
                      </Button>
                      <Button 
                        variant={activeRoute === 'alternative' ? 'primary' : 'ghost'}
                        className="flex-1 text-xs py-1 h-auto"
                        onClick={() => setActiveRoute('alternative')}
                      >
                        Alt 1
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Area - Large Map */}
        <div className="lg:col-span-3 h-full relative rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col bg-white">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center z-10 shrink-0">
            <h2 className="text-sm font-semibold text-brand-navy flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-blue" />
              Operational Route Map
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-brand-navy transition-colors">
                <input type="checkbox" checked={mapLayers.routes} onChange={() => toggleLayer('routes')} className="rounded text-brand-blue" />
                {t('rescueRoutes.mapToggle.routes') || 'Routes'}
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-brand-navy transition-colors">
                <input type="checkbox" checked={mapLayers.teams} onChange={() => toggleLayer('teams')} className="rounded text-brand-blue" />
                {t('rescueRoutes.mapToggle.teams') || 'Teams'}
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-brand-navy transition-colors">
                <input type="checkbox" checked={mapLayers.blockedRoads} onChange={() => toggleLayer('blockedRoads')} className="rounded text-brand-blue" />
                Blocked Roads
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-brand-navy transition-colors">
                <input type="checkbox" checked={mapLayers.floodExtent} onChange={() => toggleLayer('floodExtent')} className="rounded text-brand-blue" />
                Flood Extent
              </label>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[500px]">
            {hasData ? (
              <VictimMap 
                assessment={mockVictimDetectionAssessment}
                affectedAreasAssessment={mockAffectedAreasAssessment}
                activeLayers={mapLayers}
                highlightedId={selectedVictimId}
                onVictimClick={setSelectedVictimId}
                teams={mockRescueTeams}
                primaryRoute={activeRoute === 'primary' ? routes?.primary : undefined}
                alternativeRoute={routes?.alternative}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#eef2f5] border-t border-gray-200">
                <div className="text-gray-400 font-medium flex flex-col items-center">
                  <MapPin className="w-8 h-8 mb-2 opacity-50" />
                  <span>Awaiting GIS Data...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
