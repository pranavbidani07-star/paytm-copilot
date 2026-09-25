import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useData } from '../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AffectedAreasMap } from '../components/map/AffectedAreasMap';
import { mockAffectedAreasAssessment } from '../data/mockData';
import { 
  Map as MapIcon, Layers, Search, Home, AlertTriangle, 
  MapPinOff, ArrowRight, Crosshair, ZoomIn, ZoomOut, CheckCircle2
} from 'lucide-react';

export default function AffectedAreas() {
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
  
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    floodExtent: true,
    floodSeverity: true,
    settlements: true,
    roads: true,
    blockedRoads: true,
    criticalZones: true,
    rescueTeams: false
  });

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const loadSampleAssessment = () => {
    insertData();
    setViewState('results');
  };

  const handleViewOnMap = (id: string) => {
    setHighlightedId(id);
    // Auto-scroll up to the map on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setHighlightedId(null), 3000);
  };

  const renderEmptyState = () => (
    <Card className="max-w-2xl mx-auto mt-12 border-dashed border-2 bg-gray-50/50">
      <CardContent className="flex flex-col items-center text-center p-12">
        <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mb-6">
          <MapIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-brand-navy mb-2">
          {t('affectedAreas.emptyState.title') || 'No affected-area assessment loaded'}
        </h3>
        <p className="text-gray-500 mb-8 max-w-md">
          {t('affectedAreas.emptyState.description') || 'Run a flood assessment to identify affected settlements, roads and critical zones.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          <Button onClick={() => navigate('/flood-mapping')} className="w-full sm:w-auto px-8 shadow-sm">
            {t('affectedAreas.emptyState.runBtn') || 'Open Flood Mapping'}
          </Button>
          <Button variant="secondary" onClick={loadSampleAssessment} className="w-full sm:w-auto">
            {t('affectedAreas.emptyState.loadSampleBtn') || 'Load Sample Assessment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResultsState = () => {
    const assessment = mockAffectedAreasAssessment;

    // Filtered lists
    const filteredSettlements = assessment.settlements.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.district.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredRoads = assessment.roads.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Top Info Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-gray-500">{t('affectedAreas.header.assessment') || 'Assessment'}:</span>
              <span className="ml-2 font-mono font-bold text-brand-navy">{assessment.id}</span>
            </div>
            <div className="hidden sm:block text-gray-300">|</div>
            <div>
              <span className="text-gray-500">{t('affectedAreas.header.source') || 'Source'}:</span>
              <span className="ml-2 font-medium text-brand-navy">{assessment.sourceType}</span>
            </div>
            <div className="hidden sm:block text-gray-300">|</div>
            <div>
              <span className="text-gray-500">{t('affectedAreas.header.date') || 'Date'}:</span>
              <span className="ml-2 font-medium text-brand-navy">{assessment.assessmentDate}</span>
            </div>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={t('affectedAreas.filters.searchPlaceholder') || 'Search settlements, roads or zones'}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main Map Area - Left 3 Columns */}
          <div className="xl:col-span-3 space-y-4">
            <Card className="overflow-hidden shadow-sm flex flex-col border border-gray-200">
              <CardHeader className="bg-white py-3 border-b border-gray-200 flex flex-row items-center justify-between z-10 relative">
                <h3 className="text-sm font-semibold tracking-wide text-brand-navy flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-brand-blue" />
                  {t('affectedAreas.map.title') || 'OPERATIONAL MAP'}
                </h3>
                <StatusBadge status="warning">Demo Data</StatusBadge>
              </CardHeader>
              
              <div className="relative w-full aspect-video bg-blue-50/20">
                <AffectedAreasMap 
                  assessment={assessment} 
                  activeLayers={activeLayers}
                  highlightedId={highlightedId}
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

            {/* Layer Controls below map on small screens, or above? Let's put them horizontally here */}
            <Card>
              <CardContent className="p-3">
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  <Layers className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="font-semibold text-gray-600 mr-2">{t('affectedAreas.map.layers.title') || 'Map Layers'}:</span>
                  
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
                      {t(`affectedAreas.map.layers.${layerKey}`) || layerKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Summary */}
          <div className="space-y-6">
            <Card className="shadow-sm h-full">
              <CardHeader className="py-4 border-b border-gray-100 bg-gray-50">
                <CardTitle className="text-sm">{t('affectedAreas.summary.title') || 'Affected Area Summary'}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">{t('affectedAreas.summary.settlements') || 'Affected Settlements'}</span>
                    </div>
                    <span className="text-xl font-bold text-brand-navy">{assessment.summary.affectedSettlements}</span>
                  </div>
                  <div className="p-4 flex items-center justify-between bg-red-50/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-status-critical ml-1"></div>
                      <span className="text-sm font-medium text-gray-600">{t('affectedAreas.summary.severelyAffected') || 'Severely Affected'}</span>
                    </div>
                    <span className="text-lg font-bold text-status-critical">{assessment.summary.severelyAffectedSettlements}</span>
                  </div>
                  <div className="p-4 flex items-center justify-between bg-orange-50/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-status-warning ml-1"></div>
                      <span className="text-sm font-medium text-gray-600">{t('affectedAreas.summary.isolated') || 'Isolated Settlements'}</span>
                    </div>
                    <span className="text-lg font-bold text-status-warning">{assessment.summary.isolatedSettlements}</span>
                  </div>
                  <div className="p-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <MapPinOff className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">{t('affectedAreas.summary.blockedRoads') || 'Blocked Roads'}</span>
                    </div>
                    <span className="text-xl font-bold text-brand-navy">{assessment.summary.blockedRoads}</span>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-status-warning ml-1"></div>
                      <span className="text-sm font-medium text-gray-600">{t('affectedAreas.summary.partiallyAffectedRoads') || 'Partially Affected Roads'}</span>
                    </div>
                    <span className="text-lg font-bold text-status-warning">{assessment.summary.partiallyAffectedRoads}</span>
                  </div>
                  <div className="p-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-status-critical" />
                      <span className="text-sm font-bold text-status-critical">{t('affectedAreas.summary.criticalZones') || 'Critical Zones'}</span>
                    </div>
                    <span className="text-xl font-bold text-status-critical">{assessment.summary.criticalZones}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Settlements Table */}
          <Card>
            <CardHeader className="py-4 border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Home className="w-4 h-4 text-brand-blue" />
                {t('affectedAreas.settlements.title') || 'Settlement Intelligence'}
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-brand-gray text-gray-600 font-semibold border-y border-gray-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">{t('affectedAreas.settlements.table.settlement') || 'Settlement'}</th>
                    <th className="px-4 py-3">{t('affectedAreas.settlements.table.severity') || 'Severity'}</th>
                    <th className="px-4 py-3">{t('affectedAreas.settlements.table.status') || 'Status'}</th>
                    <th className="px-4 py-3">{t('affectedAreas.settlements.table.people') || 'People Detected'}</th>
                    <th className="px-4 py-3 text-right">{t('affectedAreas.settlements.table.action') || 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSettlements.map(s => (
                    <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${highlightedId === s.id ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-brand-navy">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.district}</div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.severity === 'Critical' ? 'critical' : s.severity === 'High' ? 'warning' : 'normal'}>
                          {s.severity}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">{s.status}</td>
                      <td className="px-4 py-3 font-mono">
                        {s.peopleDetected !== null ? s.peopleDetected : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-brand-blue h-8 px-2 text-xs" onClick={() => handleViewOnMap(s.id)}>
                          {t('affectedAreas.settlements.viewOnMap') || 'View on Map'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredSettlements.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No settlements found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Roads Table */}
          <Card>
            <CardHeader className="py-4 border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPinOff className="w-4 h-4 text-brand-blue" />
                {t('affectedAreas.roads.title') || 'Road Impact Analysis'}
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-brand-gray text-gray-600 font-semibold border-y border-gray-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">{t('affectedAreas.roads.table.road') || 'Road'}</th>
                    <th className="px-4 py-3">{t('affectedAreas.roads.table.impact') || 'Impact'}</th>
                    <th className="px-4 py-3">{t('affectedAreas.roads.table.access') || 'Access Status'}</th>
                    <th className="px-4 py-3">{t('affectedAreas.roads.table.altRoute') || 'Alternative Route'}</th>
                    <th className="px-4 py-3 text-right">{t('affectedAreas.roads.table.action') || 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRoads.map(r => (
                    <tr key={r.id} className={`hover:bg-gray-50 transition-colors ${highlightedId === r.id ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-brand-navy">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.area}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{r.impact}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status === 'Blocked' ? 'critical' : r.status === 'Partially Affected' ? 'warning' : 'success'}>
                          {r.status}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        {r.alternativeRoute ? (
                          <span className="flex items-center gap-1 text-status-normal text-xs font-medium"><CheckCircle2 className="w-3 h-3" /> {t('affectedAreas.roads.available') || 'Available'}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">{t('affectedAreas.roads.unavailable') || 'Not available'}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-brand-blue h-8 px-2 text-xs" onClick={() => handleViewOnMap(r.id)}>
                          {t('affectedAreas.settlements.viewOnMap') || 'View on Map'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredRoads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No roads found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Critical Zones List */}
        <Card>
          <CardHeader className="py-4 border-b border-gray-100">
            <CardTitle className="text-sm text-status-critical flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t('affectedAreas.criticalZones.title') || 'Critical Zones'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {assessment.criticalZones.map(zone => (
                <div key={zone.id} className={`p-4 transition-colors ${highlightedId === zone.id ? 'bg-red-50/30' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-brand-navy">{zone.name}</h4>
                    <StatusBadge status="critical">{zone.severity}</StatusBadge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{zone.reason}</p>
                  {zone.peopleDetected && (
                    <div className="text-xs font-medium text-gray-500 mb-3">
                      {zone.peopleDetected} people detected
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-auto">
                    <Button variant="ghost" size="sm" className="text-brand-blue text-xs px-2 h-8" onClick={() => handleViewOnMap(zone.id)}>
                      {t('affectedAreas.settlements.viewOnMap') || 'View on Map'}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-brand-blue text-xs px-2 h-8" onClick={() => navigate('/rescue-priority')}>
                      Rescue Priority
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions at bottom */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={() => navigate('/flood-mapping')}>
            View Flood Assessment <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="secondary" onClick={() => navigate('/victim-detection')}>
            View Victim Detections <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="secondary" onClick={() => navigate('/rescue-routes')}>
            Find Rescue Route <ArrowRight className="w-4 h-4 ml-2" />
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
            {t('affectedAreas.title') || 'Affected Areas'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            {t('affectedAreas.subtitle') || 'Identify flooded settlements, blocked roads and critical zones requiring response.'}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <StatusBadge status={viewState === 'results' ? 'success' : 'warning'}>
              {viewState === 'results' ? 'Assessment Loaded' : 'Awaiting Data'}
            </StatusBadge>
            {viewState === 'results' && (
              <div className="text-xs text-gray-400 font-medium">
                Last updated: Just now
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {viewState === 'results' && (
            <Button onClick={() => setViewState('empty')} variant="secondary" className="shadow-sm">
              Change Assessment
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
