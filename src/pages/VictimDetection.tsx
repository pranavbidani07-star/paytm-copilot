import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useData } from '../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { VictimMap } from '../components/map/VictimMap';
import { mockVictimDetectionAssessment, mockAffectedAreasAssessment } from '../data/mockData';
import { 
  Users, Map as MapIcon, Layers, Search, AlertTriangle, 
  MapPin, MapPinOff, ArrowRight, Crosshair, ZoomIn, ZoomOut, CheckCircle2, Navigation, Target, ShieldAlert
} from 'lucide-react';

export default function VictimDetection() {
  const { t } = useI18n();
  const { isDataInserted, insertData } = useData();
  const navigate = useNavigate();

  const [viewState, setViewState] = useState<'empty' | 'results'>(
    isDataInserted ? 'results' : 'empty'
  );

  useEffect(() => {
    if (isDataInserted && viewState === 'empty') {
      setViewState('results');
    }
  }, [isDataInserted]);

  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterConfidence, setFilterConfidence] = useState('All');
  const [filterVerification, setFilterVerification] = useState('All');

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    floodExtent: true,
    victims: true,
    settlements: true,
    blockedRoads: true,
    rescueTeams: false
  });

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const loadSampleAnalysis = () => {
    insertData();
    setViewState('results');
  };

  const handleVictimClick = (id: string) => {
    setHighlightedId(id);
    // Auto-scroll up to the map on mobile
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderEmptyState = () => (
    <Card className="max-w-2xl mx-auto mt-12 border-dashed border-2 bg-gray-50/50">
      <CardContent className="flex flex-col items-center text-center p-12">
        <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mb-6">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-brand-navy mb-2">
          {t('victimDetection.emptyState.title') || 'Victim detection analysis not available'}
        </h3>
        <p className="text-gray-500 mb-8 max-w-md">
          {t('victimDetection.emptyState.description') || 'Upload or load a drone analysis to review potentially stranded people.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          <Button onClick={() => navigate('/drone-analysis')} className="w-full sm:w-auto px-8 shadow-sm">
            {t('victimDetection.emptyState.goToDroneBtn') || 'Go to Drone Analysis'}
          </Button>
          <Button variant="secondary" onClick={loadSampleAnalysis} className="w-full sm:w-auto">
            {t('victimDetection.emptyState.loadSampleBtn') || 'Load Sample Analysis'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResultsState = () => {
    const assessment = mockVictimDetectionAssessment;
    const selectedVictim = assessment.victims.find(v => v.id === highlightedId) || null;

    // Filtering logic
    const filteredVictims = assessment.victims.filter(v => {
      const matchSearch = v.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.settlement.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPriority = filterPriority === 'All' || v.priority === filterPriority;
      const matchSeverity = filterSeverity === 'All' || v.floodSeverity === filterSeverity;
      const matchConfidence = filterConfidence === 'All' || v.locationConfidence === filterConfidence;
      const matchVerification = filterVerification === 'All' || v.verificationStatus === filterVerification;

      return matchSearch && matchPriority && matchSeverity && matchConfidence && matchVerification;
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                {t('victimDetection.summary.potential') || 'Potential Victims'}
              </div>
              <div className="text-2xl font-bold text-brand-navy">{assessment.summary.potentialVictims}</div>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-status-critical">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                {t('victimDetection.summary.critical') || 'Critical'}
              </div>
              <div className="text-2xl font-bold text-status-critical">{assessment.summary.critical}</div>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-status-warning">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                {t('victimDetection.summary.highPriority') || 'High Priority'}
              </div>
              <div className="text-2xl font-bold text-status-warning">{assessment.summary.highPriority}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                {t('victimDetection.summary.mediumPriority') || 'Medium Priority'}
              </div>
              <div className="text-2xl font-bold text-brand-navy">{assessment.summary.mediumPriority}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-status-normal" />
                {t('victimDetection.summary.verified') || 'Location Verified'}
              </div>
              <div className="text-2xl font-bold text-brand-navy">{assessment.summary.locationVerified}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Map Area - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden shadow-sm flex flex-col border border-gray-200">
              <CardHeader className="bg-white py-3 border-b border-gray-200 flex flex-row items-center justify-between z-10 relative">
                <h3 className="text-sm font-semibold tracking-wide text-brand-navy flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-brand-blue" />
                  {t('victimDetection.title') || 'VICTIM DETECTION'}
                </h3>
                <StatusBadge status="warning">{t('victimDetection.demoIndicator') || 'Demo Analysis Data'}</StatusBadge>
              </CardHeader>
              
              <div className="relative w-full aspect-video bg-blue-50/20">
                <VictimMap 
                  assessment={assessment}
                  affectedAreasAssessment={mockAffectedAreasAssessment}
                  activeLayers={activeLayers}
                  highlightedId={highlightedId}
                  onVictimClick={handleVictimClick}
                />

                {/* Map Controls Floating */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="w-8 h-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center hover:bg-gray-50 text-brand-blue transition-colors mt-2">
                    <Crosshair className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  <Layers className="w-4 h-4 text-gray-400 mr-2" />
                  
                  {Object.keys(activeLayers).map(layerKey => (
                    <button 
                      key={layerKey}
                      onClick={() => toggleLayer(layerKey)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                        activeLayers[layerKey] 
                          ? 'bg-blue-50 border-blue-200 text-brand-blue' 
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {t(`victimDetection.map.layers.${layerKey}`) || layerKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Selected Victim */}
          <div className="lg:col-span-1 space-y-4 h-full">
            <Card className="shadow-sm h-full flex flex-col">
              <CardHeader className="py-4 border-b border-gray-100 bg-gray-50">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Selected Victim Intelligence</span>
                  {selectedVictim && <StatusBadge status={selectedVictim.priority === 'Critical' ? 'critical' : selectedVictim.priority === 'High' ? 'warning' : 'normal'}>{selectedVictim.priority}</StatusBadge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                {selectedVictim ? (
                  <div className="flex flex-col h-full overflow-y-auto">
                    
                    {/* Evidence Viewer (Visual Placeholder) */}
                    <div className="relative w-full aspect-video bg-gray-900 border-b border-gray-200 overflow-hidden group">
                      {/* Realistic aerial/flood-response style visual placeholder background */}
                      <div className="absolute inset-0 bg-[#3f4b3b] opacity-80" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3Cpath d='M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z' fill='%232c3e50' opacity='0.4'/%3E%3C/svg%3E")`,
                        backgroundSize: 'cover'
                      }}></div>
                      
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-mono rounded backdrop-blur-sm">
                        {t('victimDetection.selectedPanel.evidenceViewer.title') || 'Representative Demo Evidence'}
                      </div>
                      
                      {/* CSS Bounding Box over "person" */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[1.5px] border-brand-blue w-12 h-16 bg-blue-500/10 transition-all">
                        <div className="absolute -top-5 -left-[1px] bg-brand-blue text-white text-[9px] px-1 font-mono font-bold whitespace-nowrap">
                          Person | {selectedVictim.detectionConfidence}%
                        </div>
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-white -translate-x-[2px] -translate-y-[2px]"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-white translate-x-[2px] translate-y-[2px]"></div>
                      </div>

                      <div className="absolute bottom-2 left-2 text-[10px] text-white/80 font-mono flex flex-col gap-0.5">
                        <span>{selectedVictim.frameId} | {selectedVictim.timestamp}</span>
                        <span>{selectedVictim.telemetryAvailable ? 'GPS: Locked' : 'GPS: Unavailable'}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                          {t('victimDetection.selectedPanel.victimId') || 'Victim ID'}
                        </div>
                        <div className="font-mono text-brand-navy font-bold">{selectedVictim.id}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">{t('victimDetection.selectedPanel.detection') || 'Detection'}</div>
                          <div className="text-sm font-medium text-gray-800">{selectedVictim.detectionStatus}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">{t('victimDetection.selectedPanel.detectionConfidence') || 'Detection confidence'}</div>
                          <div className="text-sm font-medium text-gray-800">{selectedVictim.detectionConfidence}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">{t('victimDetection.selectedPanel.nearestSettlement') || 'Nearest settlement'}</div>
                          <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-blue" />
                            {selectedVictim.settlement}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">{t('victimDetection.selectedPanel.locationConfidence') || 'Location confidence'}</div>
                          <div className={`text-sm font-medium ${
                            selectedVictim.locationConfidence === 'High' ? 'text-status-normal' : 
                            selectedVictim.locationConfidence === 'Medium' ? 'text-status-warning' : 'text-gray-500'
                          }`}>
                            {selectedVictim.locationConfidence}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">{t('victimDetection.selectedPanel.floodContext') || 'Flood context'}</div>
                          <div className="text-sm font-medium text-gray-800">{selectedVictim.floodSeverity} flood zone</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">{t('victimDetection.selectedPanel.estimatedIsolation') || 'Estimated isolation'}</div>
                          <div className="text-sm font-medium text-gray-800">{selectedVictim.isolationLevel}</div>
                        </div>
                      </div>

                      <div className={`p-3 rounded-md text-xs mt-4 ${selectedVictim.telemetryAvailable ? 'bg-blue-50/50 text-gray-600 border border-blue-100' : 'bg-orange-50 text-status-warning border border-orange-100'}`}>
                        {selectedVictim.telemetryAvailable 
                          ? t('victimDetection.selectedPanel.locationInferredNote') || 'Location is inferred from available drone/telemetry data.'
                          : (
                            <span className="flex items-center gap-2 font-medium">
                              <AlertTriangle className="w-4 h-4" />
                              {t('victimDetection.selectedPanel.locationUnavailableNote') || 'Exact location unavailable'}
                            </span>
                          )
                        }
                      </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 mt-auto flex flex-col gap-2">
                      <Button className="w-full justify-center" onClick={() => navigate('/rescue-priority')}>
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        {t('victimDetection.selectedPanel.actions.addToRescue') || 'Add to Rescue Priority'}
                      </Button>
                      <Button variant="secondary" className="w-full justify-center" onClick={() => navigate('/rescue-routes')}>
                        <Navigation className="w-4 h-4 mr-2" />
                        {t('victimDetection.selectedPanel.actions.openRoute') || 'Open Rescue Route'}
                      </Button>
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                    <Target className="w-12 h-12 mb-4 text-gray-200" />
                    <p>Select a victim marker on the map or from the table below to view detailed intelligence.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Intelligence Table */}
        <Card>
          <CardHeader className="py-4 border-b border-gray-100 bg-white sticky top-0 z-10 rounded-t-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="text-sm flex items-center gap-2 whitespace-nowrap">
                <Users className="w-4 h-4 text-brand-blue" />
                Victim Intelligence
              </CardTitle>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2 lg:gap-4 text-sm w-full lg:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder={t('victimDetection.filters.searchPlaceholder') || 'Search victim ID or settlement...'}
                    className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <select 
                  className="border border-gray-200 rounded-md py-1.5 px-3 bg-white text-gray-600 focus:outline-none"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="All">Priority: All</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select 
                  className="border border-gray-200 rounded-md py-1.5 px-3 bg-white text-gray-600 focus:outline-none hidden sm:block"
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                >
                  <option value="All">Flood: All</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low</option>
                </select>
                
                <select 
                  className="border border-gray-200 rounded-md py-1.5 px-3 bg-white text-gray-600 focus:outline-none hidden md:block"
                  value={filterConfidence}
                  onChange={(e) => setFilterConfidence(e.target.value)}
                >
                  <option value="All">Location: All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </CardHeader>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-brand-gray text-gray-600 font-semibold border-b border-gray-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">{t('victimDetection.table.victimId') || 'Victim ID'}</th>
                  <th className="px-4 py-3">{t('victimDetection.table.location') || 'Location'}</th>
                  <th className="px-4 py-3 hidden md:table-cell">{t('victimDetection.table.detConfidence') || 'Det. Conf.'}</th>
                  <th className="px-4 py-3 hidden lg:table-cell">{t('victimDetection.table.locConfidence') || 'Loc. Conf.'}</th>
                  <th className="px-4 py-3 hidden sm:table-cell">{t('victimDetection.table.severity') || 'Severity'}</th>
                  <th className="px-4 py-3 hidden xl:table-cell">{t('victimDetection.table.isolation') || 'Isolation'}</th>
                  <th className="px-4 py-3">{t('victimDetection.table.priority') || 'Priority'}</th>
                  <th className="px-4 py-3">{t('victimDetection.table.status') || 'Status'}</th>
                  <th className="px-4 py-3 text-right">{t('victimDetection.table.action') || 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVictims.map(v => (
                  <tr 
                    key={v.id} 
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${highlightedId === v.id ? 'bg-blue-50/50' : ''}`}
                    onClick={() => handleVictimClick(v.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-brand-navy">{v.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{v.settlement}</div>
                      {!v.telemetryAvailable && <div className="text-[10px] text-gray-400">Inferred</div>}
                    </td>
                    <td className="px-4 py-3 font-mono hidden md:table-cell">{v.detectionConfidence}%</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={v.locationConfidence === 'High' ? 'text-status-normal' : v.locationConfidence === 'Low' ? 'text-gray-400' : 'text-gray-600'}>
                        {v.locationConfidence}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{v.floodSeverity}</td>
                    <td className="px-4 py-3 hidden xl:table-cell text-gray-600">{v.isolationLevel}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={v.priority === 'Critical' ? 'critical' : v.priority === 'High' ? 'warning' : 'normal'}>
                        {v.priority}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3">
                      {v.verificationStatus === 'Verified' ? (
                        <span className="flex items-center gap-1 text-status-normal text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" /> {t('victimDetection.filters.verified') || 'Verified'}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">{t('victimDetection.filters.unverified') || 'Unverified'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-brand-blue h-8 px-2 text-xs">
                        {t('victimDetection.table.actions.view') || 'View'}
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredVictims.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">No victims match the current filters</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Bulk Actions at bottom */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <Button onClick={() => navigate('/rescue-priority')}>
            {t('victimDetection.bulkActions.addToRescue') || 'Add Critical Victims to Rescue Priority'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="secondary">
            {t('victimDetection.bulkActions.export') || 'Export Detection Data'}
          </Button>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy tracking-tight">
            {t('victimDetection.title') || 'Victim Detection'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            {t('victimDetection.subtitle') || 'Identify and assess potentially stranded people from drone observations.'}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <StatusBadge status={viewState === 'results' ? 'warning' : 'warning'}>
              {viewState === 'results' ? 'Demo Analysis Data' : 'Awaiting Data'}
            </StatusBadge>
            {viewState === 'results' && (
              <div className="text-xs text-gray-400 font-medium">
                Analysis: VD-2026-0718-005
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {viewState === 'results' && (
            <Button onClick={() => setViewState('empty')} variant="secondary" className="shadow-sm">
              Change Analysis
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pb-8">
        {viewState === 'empty' && renderEmptyState()}
        {viewState === 'results' && renderResultsState()}
      </div>
    </div>
  );
}
