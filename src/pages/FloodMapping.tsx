import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useData } from '../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MapPlaceholder } from '../components/map/MapPlaceholder';
import { mockSARDataset, mockProcessingPipeline, mockFloodAssessment } from '../data/mockData';
import { 
  UploadCloud, Play, FileText, CheckCircle2, Loader2, ArrowRight, 
  Map as MapIcon, Layers, Settings, ChevronRight, AlertTriangle, Home, MapPinOff
} from 'lucide-react';

export default function FloodMapping() {
  const { t } = useI18n();
  const { isDataInserted, insertData } = useData();
  const navigate = useNavigate();
  
  const [viewState, setViewState] = useState<'empty' | 'uploaded' | 'processing' | 'results'>(
    isDataInserted ? 'results' : 'empty'
  );
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Sync with global isDataInserted
  useEffect(() => {
    if (isDataInserted && viewState === 'empty') {
      setViewState('results');
    }
  }, [isDataInserted]);

  // Simulate processing pipeline
  useEffect(() => {
    if (viewState === 'processing') {
      const interval = setInterval(() => {
        setActiveStageIndex(prev => {
          if (prev >= mockProcessingPipeline.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              insertData();
              setViewState('results');
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 1500); // 1.5 seconds per stage
      return () => clearInterval(interval);
    }
  }, [viewState, insertData]);

  // Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setViewState('uploaded');
    }
  };

  const handleStartAnalysis = () => {
    setViewState('processing');
    setActiveStageIndex(0);
  };

  const resetUpload = () => setViewState('empty');

  // Renderers
  const renderEmptyState = () => (
    <Card className="max-w-2xl mx-auto mt-12 border-dashed border-2 bg-gray-50/50">
      <CardContent className="flex flex-col items-center text-center p-12">
        <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mb-6">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-brand-navy mb-2">
          {t('floodMapping.emptyState.title') || 'No flood assessment loaded'}
        </h3>
        <p className="text-gray-500 mb-8 max-w-md">
          {t('floodMapping.emptyState.description') || 'Upload Sentinel-1 SAR data to begin a flood assessment.'}
        </p>
        <div className="relative">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileUpload}
            accept=".zip,.tif,.tiff"
          />
          <Button className="px-8 shadow-sm">
            {t('floodMapping.emptyState.uploadBtn') || 'Upload SAR Data'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderUploadedState = () => (
    <Card className="max-w-2xl mx-auto mt-12 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-blue" />
          {t('floodMapping.upload.title') || 'Sentinel-1 SAR Data'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          {t('floodMapping.upload.description') || 'Upload Sentinel-1 SAR imagery to generate an all-weather flood assessment.'}
        </p>
        
        <div className="bg-blue-50/50 p-4 rounded-md border border-blue-100 flex items-start gap-3">
          <div className="mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-brand-blue" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-brand-navy truncate pr-4" title={mockSARDataset.name}>
              {mockSARDataset.name}
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 mt-4 text-sm">
              <div>
                <span className="text-gray-500 mr-2">{t('floodMapping.upload.metadata.satellite') || 'Satellite'}:</span>
                <span className="font-medium text-brand-navy">{mockSARDataset.satellite}</span>
              </div>
              <div>
                <span className="text-gray-500 mr-2">{t('floodMapping.upload.metadata.acquisitionDate') || 'Acquisition date'}:</span>
                <span className="font-medium text-brand-navy">{mockSARDataset.acquisitionDate}</span>
              </div>
              <div>
                <span className="text-gray-500 mr-2">{t('floodMapping.upload.metadata.polarization') || 'Polarization'}:</span>
                <span className="font-medium text-brand-navy">{mockSARDataset.polarization}</span>
              </div>
              <div>
                <span className="text-gray-500 mr-2">{t('floodMapping.upload.metadata.product') || 'Product'}:</span>
                <span className="font-medium text-brand-navy">{mockSARDataset.product}</span>
              </div>
              <div>
                <span className="text-gray-500 mr-2">{t('floodMapping.upload.metadata.coverage') || 'Coverage'}:</span>
                <span className="font-medium text-brand-navy">{mockSARDataset.coverage}</span>
              </div>
              <div className="col-span-2 mt-2">
                <StatusBadge status="normal">{mockSARDataset.status}</StatusBadge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={resetUpload} className="text-gray-500">
            {t('floodMapping.upload.replaceBtn') || 'Replace file'}
          </Button>
          <Button onClick={handleStartAnalysis} className="gap-2 px-6">
            <Play className="w-4 h-4 fill-current" />
            {t('floodMapping.upload.startBtn') || 'Start Flood Analysis'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderProcessingState = () => (
    <Card className="max-w-2xl mx-auto mt-12 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-100 text-center pb-8 pt-8">
        <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4 relative">
          <Settings className="w-8 h-8 absolute animate-[spin_4s_linear_infinite]" />
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        <CardTitle className="text-xl">
          {t('floodMapping.processing.title') || 'Processing Pipeline'}
        </CardTitle>
        <p className="text-sm text-gray-500 mt-2">
          {t('floodMapping.processing.description') || 'Simulated SAR flood segmentation workflow'}
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {mockProcessingPipeline.map((stage, idx) => {
            const isCompleted = idx < activeStageIndex;
            const isActive = idx === activeStageIndex;
            
            return (
              <div key={stage.id} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${isCompleted ? 'bg-status-normal border-status-normal text-white' : 
                    isActive ? 'border-brand-blue bg-blue-50 text-brand-blue' : 
                    'border-gray-200 text-gray-300'}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                   isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                   <span className="text-sm font-semibold">{idx + 1}</span>}
                </div>
                <div className={`font-medium ${isCompleted || isActive ? 'text-brand-navy' : 'text-gray-400'}`}>
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderResultsState = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Info Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="xl:col-span-1 border-t-4 border-t-brand-blue">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
              {t('floodMapping.results.floodedArea') || 'Flooded Area'}
            </div>
            <div className="text-2xl font-bold text-brand-navy">
              {mockFloodAssessment.floodedArea}
            </div>
          </CardContent>
        </Card>
        
        <Card className="xl:col-span-1 border-t-4 border-t-status-critical">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
              {t('floodMapping.results.severity') || 'Flood Severity'}
            </div>
            <div className="text-xl font-bold text-status-critical">
              {mockFloodAssessment.severity}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-1">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
              {t('floodMapping.results.affectedSettlements') || 'Affected Settlements'}
            </div>
            <div className="text-xl font-bold text-brand-navy">
              {mockFloodAssessment.affectedSettlements}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-1">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
              {t('floodMapping.results.affectedRoads') || 'Affected/Blocked Roads'}
            </div>
            <div className="text-xl font-bold text-brand-navy">
              {mockFloodAssessment.blockedRoads}
            </div>
          </CardContent>
        </Card>
        
        <Card className="xl:col-span-1">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
              {t('floodMapping.results.criticalZones') || 'Critical Zones'}
            </div>
            <div className="text-xl font-bold text-brand-navy">
              {mockFloodAssessment.criticalZones}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-1">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
              {t('floodMapping.results.coverage') || 'Assessment Coverage'}
            </div>
            <div className="text-xl font-bold text-brand-navy">
              {mockFloodAssessment.coverage}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col - Map */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="overflow-hidden shadow-sm flex flex-col border border-gray-200">
            <CardHeader className="bg-white py-3 border-b border-gray-200 flex flex-row items-center justify-between z-10 relative">
              <h3 className="text-sm font-semibold tracking-wide text-brand-navy flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-brand-blue" />
                SAR FLOOD ASSESSMENT MAP
              </h3>
            </CardHeader>
            <div className="relative">
              <MapPlaceholder />
            </div>
          </Card>
        </div>

        {/* Right Col - Panels */}
        <div className="space-y-6">
          
          {/* Assessment Info */}
          <Card className="shadow-sm">
            <CardHeader className="py-4 border-b border-gray-100">
              <CardTitle className="text-sm">
                {t('floodMapping.results.assessmentInfo.title') || 'Assessment Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t('floodMapping.results.assessmentInfo.id') || 'Assessment ID'}:</span>
                <span className="font-semibold text-brand-navy">{mockFloodAssessment.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t('floodMapping.results.assessmentInfo.source') || 'Source'}:</span>
                <span className="font-medium text-brand-navy">{mockFloodAssessment.source}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t('floodMapping.results.assessmentInfo.acquisition') || 'Acquisition'}:</span>
                <span className="font-medium text-brand-navy">{mockFloodAssessment.acquisition}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-gray-500">{t('floodMapping.results.assessmentInfo.processing') || 'Processing'}:</span>
                <StatusBadge status="success">{mockFloodAssessment.status}</StatusBadge>
              </div>
            </CardContent>
          </Card>

          {/* Severity Levels */}
          <Card className="shadow-sm">
            <CardHeader className="py-4 border-b border-gray-100">
              <CardTitle className="text-sm">
                {t('floodMapping.results.severityLevels.title') || 'Flood Severity'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-brand-blue/20"></div>
                  <span className="text-gray-600">{t('floodMapping.results.severityLevels.low') || 'Low'}</span>
                </div>
                <span className="font-semibold text-brand-navy">{mockFloodAssessment.severityBreakdown.low}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-brand-blue/50"></div>
                  <span className="text-gray-600">{t('floodMapping.results.severityLevels.moderate') || 'Moderate'}</span>
                </div>
                <span className="font-semibold text-brand-navy">{mockFloodAssessment.severityBreakdown.moderate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-brand-blue/80"></div>
                  <span className="text-gray-600">{t('floodMapping.results.severityLevels.high') || 'High'}</span>
                </div>
                <span className="font-semibold text-brand-navy">{mockFloodAssessment.severityBreakdown.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-status-critical"></div>
                  <span className="text-gray-600">{t('floodMapping.results.severityLevels.critical') || 'Critical'}</span>
                </div>
                <span className="font-semibold text-brand-navy">{mockFloodAssessment.severityBreakdown.critical}</span>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure */}
          <Card className="shadow-sm">
            <CardHeader className="py-4 border-b border-gray-100">
              <CardTitle className="text-sm">
                {t('floodMapping.results.infrastructure.title') || 'Affected Infrastructure Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {/* Settlements */}
                <div className="p-4">
                  <h4 className="font-semibold text-brand-navy flex items-center gap-2 mb-2 text-sm">
                    <Home className="w-4 h-4 text-brand-blue" />
                    {t('floodMapping.results.infrastructure.settlements') || 'Settlements'}
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1 mb-3 pl-6 list-disc marker:text-gray-300">
                    <li><span className="font-semibold">{mockFloodAssessment.infrastructure.settlements.affected}</span> {t('floodMapping.results.infrastructure.affected') || 'affected'}</li>
                    <li><span className="font-semibold">{mockFloodAssessment.infrastructure.settlements.severelyAffected}</span> {t('floodMapping.results.infrastructure.severelyAffected') || 'severely affected'}</li>
                    <li><span className="font-semibold">{mockFloodAssessment.infrastructure.settlements.isolated}</span> {t('floodMapping.results.infrastructure.isolated') || 'isolated'}</li>
                  </ul>
                  <Button variant="secondary" size="sm" className="w-full text-xs h-8" onClick={() => navigate('/affected-areas')}>
                    {t('floodMapping.results.infrastructure.viewDetails') || 'View details'} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                {/* Roads */}
                <div className="p-4">
                  <h4 className="font-semibold text-brand-navy flex items-center gap-2 mb-2 text-sm">
                    <MapPinOff className="w-4 h-4 text-brand-blue" />
                    {t('floodMapping.results.infrastructure.roads') || 'Roads'}
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1 mb-3 pl-6 list-disc marker:text-gray-300">
                    <li><span className="font-semibold">{mockFloodAssessment.infrastructure.roads.blocked}</span> {t('floodMapping.results.infrastructure.blocked') || 'blocked'}</li>
                    <li><span className="font-semibold">{mockFloodAssessment.infrastructure.roads.partiallyAffected}</span> {t('floodMapping.results.infrastructure.partiallyAffected') || 'partially affected'}</li>
                    <li><span className="font-semibold">{mockFloodAssessment.infrastructure.roads.inaccessible}</span> {t('floodMapping.results.infrastructure.inaccessible') || 'inaccessible'}</li>
                  </ul>
                  <Button variant="secondary" size="sm" className="w-full text-xs h-8" onClick={() => navigate('/affected-areas')}>
                    {t('floodMapping.results.infrastructure.viewDetails') || 'View details'} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                {/* Critical */}
                <div className="p-4 bg-red-50/20">
                  <h4 className="font-semibold text-status-critical flex items-center gap-2 mb-2 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    {t('floodMapping.results.infrastructure.criticalZones') || 'Critical Zones'}
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1 mb-3 pl-6 list-disc marker:text-status-critical">
                    <li><span className="font-semibold">{mockFloodAssessment.infrastructure.criticalZones.identified}</span> {t('floodMapping.results.infrastructure.identified') || 'identified'}</li>
                    <li><span className="font-semibold">{mockFloodAssessment.infrastructure.criticalZones.requiringImmediate}</span> {t('floodMapping.results.infrastructure.requiringImmediate') || 'requiring immediate assessment'}</li>
                  </ul>
                  <Button variant="secondary" size="sm" className="w-full text-xs h-8 border-red-200 text-status-critical hover:bg-red-50" onClick={() => navigate('/rescue-priority')}>
                    {t('floodMapping.results.infrastructure.viewDetails') || 'View details'} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Quick Actions at bottom */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={() => navigate('/drone-analysis')}>
          Analyze Drone Data <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="secondary" onClick={() => navigate('/reports')}>
          Generate Report <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy tracking-tight">
            {t('floodMapping.title') || 'Flood Mapping'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            {t('floodMapping.subtitle') || 'Generate flood extent maps from cloud-penetrating SAR imagery.'}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <StatusBadge status={viewState === 'results' ? 'success' : 'warning'}>
              {viewState === 'results' ? 'Assessment Generated' : 'Awaiting Data'}
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
            <Button onClick={resetUpload} variant="secondary" className="shadow-sm">
              New Assessment
            </Button>
          )}
          {viewState === 'empty' && (
            <Button className="shadow-sm" onClick={() => document.querySelector('input[type="file"]')?.dispatchEvent(new MouseEvent('click'))}>
              Upload SAR Data
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pb-8">
        {viewState === 'empty' && renderEmptyState()}
        {viewState === 'uploaded' && renderUploadedState()}
        {viewState === 'processing' && renderProcessingState()}
        {viewState === 'results' && renderResultsState()}
      </div>
    </div>
  );
}
