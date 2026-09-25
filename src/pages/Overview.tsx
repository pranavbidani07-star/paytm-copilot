import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useData } from '../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { MapPlaceholder } from '../components/map/MapPlaceholder';
import { Modal } from '../components/ui/Modal';
import { mockStatistics, mockActivities, mockPriorities, mockReports } from '../data/mockData';
import { Statistic, ActivityEvent, RescuePriority, Report } from '../types';
import { 
  Waves, Home, MapPinOff, Users, AlertTriangle, 
  CheckCircle2, ArrowRight, Eye, AlertCircle, Clock, Plus, UploadCloud, Video, Map as MapIcon, Navigation, RefreshCw, Database, Layers, Play
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Waves, Home, MapPinOff, Users, AlertTriangle
};

export default function Overview() {
  const { t, language } = useI18n();
  const { isDataInserted, insertData, clearData } = useData();
  const navigate = useNavigate();
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  // Multi-lingual hero texts
  const heroContent = {
    en: {
      heading: "See the flood.<br/><span class='text-teal-400'>Understand the risk.</span><br/>Act before it becomes a crisis.",
      sub: "Integrated flood intelligence and response coordination for Assam."
    },
    hi: {
      heading: "बाढ़ को देखें।<br/><span class='text-teal-400'>जोखिम को समझें।</span><br/>संकट बनने से पहले कार्रवाई करें।",
      sub: "असम के लिए एकीकृत बाढ़ खुफिया और प्रतिक्रिया समन्वय।"
    },
    as: {
      heading: "বানপানী চাওক।<br/><span class='text-teal-400'>ঝুঁকি বুজি পাওক।</span><br/>সংকট হোৱাৰ আগতে ব্যৱস্থা লওক।",
      sub: "অসমৰ বাবে সংহত বানপানী তথ্য আৰু সাহায্য সমন্বয়।"
    }
  };

  const currentHero = heroContent[language as keyof typeof heroContent] || heroContent.en;

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6 fade-in">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200 h-[280px] md:h-[340px] flex items-end hero-container bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&q=80&w=1600" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542274368-443d694d79aa?auto=format&fit=crop&q=80&w=1600';
          }} 
          alt="Aerial Flood View Assam" 
          className="absolute inset-0 w-full h-full object-cover hero-img opacity-80 mix-blend-luminosity"
        />
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gov-teal via-gov-teal/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gov-teal/90 via-gov-teal/40 to-transparent"></div>
        
        <div className="relative z-10 p-6 md:p-8 w-full flex justify-between items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-widest flex items-center gap-2 border border-red-500 backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> {t('app.monitoring') || 'LIVE OPERATIONS'}
              </span>
              <span className="bg-black/40 text-teal-200 text-[10px] font-mono px-2 py-1 rounded-sm border border-teal-500/30 backdrop-blur-md">
                LATEST SAR PASS: 14:32 IST
              </span>
            </div>
            <h2 
              className="font-serif text-3xl md:text-5xl text-white mb-2 leading-tight drop-shadow-lg"
              dangerouslySetInnerHTML={{ __html: currentHero.heading }}
            />
            <p className="text-slate-200 font-medium text-sm md:text-base mt-3">
              {currentHero.sub}
            </p>
          </div>
          <div className="hidden lg:flex flex-col items-end text-right font-mono text-[10px] text-teal-200/80 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div> HUMAN-IN-THE-LOOP ACTIVE
            </div>
            <div>MAJULI SECTOR 4 SCANNED: 98%</div>
            <div className="text-gov-saffron border border-gov-saffron/30 bg-gov-saffron/10 px-2 py-0.5 mt-2 rounded">
              SYS_WARN: WATER LEVEL RISING
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {mockStatistics.map((stat: Statistic) => {
          const Icon = iconMap[stat.icon] || AlertCircle;
          const isCritical = stat.id === '5';
          return (
            <Card key={stat.id} className={isCritical ? 'border-red-200 bg-red-50/20' : 'bg-white'}>
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div className={`text-2xl font-bold font-mono ${isCritical ? 'text-red-700' : 'text-slate-900'}`}>
                    {isDataInserted ? stat.value : '--'}
                  </div>
                  <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-teal-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-slate-700 font-bold truncate">
                    {stat.id === '1' ? t('overview.stats.floodedArea') :
                     stat.id === '2' ? t('overview.stats.affectedSettlements') :
                     stat.id === '3' ? t('overview.stats.blockedRoads') :
                     stat.id === '4' ? t('overview.stats.peopleDetected') :
                     t('overview.stats.criticalPriority')}
                  </div>
                  {stat.context && (
                    <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                      {stat.context}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="overflow-hidden shadow-sm flex flex-col bg-white border-slate-200">
            <CardHeader className="bg-slate-50 py-3 border-b border-slate-200 flex flex-row items-center justify-between z-10 relative">
              <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-teal-700" />
                Operational GIS Map ({t('app.seocTitle') || 'Assam State Operational Centre'})
              </h3>
              {isDataInserted && (
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-teal-700 h-7 px-2 text-xs" onClick={() => navigate('/flood-mapping')}>
                  Expand Full Screen <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </CardHeader>
            
            {/* CONDITIONAL OPERATIONAL GIS MAP DISPLAY */}
            {isDataInserted ? (
              <MapPlaceholder />
            ) : (
              <div className="relative w-full h-[600px] bg-slate-900 overflow-hidden flex flex-col items-center justify-center p-6 text-center border-t border-slate-800">
                {/* Background Grid Simulation */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(#0d9488 1px, transparent 1px), linear-gradient(90deg, #0d9488 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/90 pointer-events-none"></div>

                <div className="relative z-10 max-w-md bg-slate-800/90 border border-slate-700/80 backdrop-blur-md rounded-xl p-8 shadow-2xl space-y-4">
                  <div className="w-16 h-16 bg-slate-700/60 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-400/30 shadow-inner">
                    <MapIcon className="w-8 h-8 opacity-80" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-wide">{t('overview.gisStandbyTitle') || 'Operational GIS Map Unavailable'}</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {t('overview.gisStandbyDesc') || 'No geospatial dataset has been inserted into the system yet.'}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <Button 
                      onClick={() => navigate('/flood-mapping')} 
                      className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs px-6 py-2.5 gap-2 shadow-lg shadow-teal-900/30"
                    >
                      <UploadCloud className="w-4 h-4" /> {t('overview.uploadSarData') || 'Upload SAR Data'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {t('overview.quickActionsTitle') || 'Command Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button variant="secondary" className="flex-col h-20 gap-2 font-semibold text-xs border-slate-200 hover:bg-teal-50 hover:border-teal-300" onClick={() => navigate('/flood-mapping')}>
                  <UploadCloud className="w-5 h-5 text-teal-700" />
                  {t('overview.uploadSarData') || 'Upload SAR Data'}
                </Button>
                <Button variant="secondary" className="flex-col h-20 gap-2 font-semibold text-xs border-slate-200 hover:bg-teal-50 hover:border-teal-300" onClick={() => navigate('/drone-analysis')}>
                  <Video className="w-5 h-5 text-teal-700" />
                  {t('overview.analyzeDroneFeed') || 'Analyze Drone Feed'}
                </Button>
                <Button variant="secondary" className="flex-col h-20 gap-2 font-semibold text-xs border-slate-200 hover:bg-teal-50 hover:border-teal-300" onClick={() => navigate('/affected-areas')}>
                  <AlertTriangle className="w-5 h-5 text-teal-700" />
                  {t('overview.viewAffectedAreas') || 'View Affected Areas'}
                </Button>
                <Button variant="secondary" className="flex-col h-20 gap-2 font-semibold text-xs border-slate-200 hover:bg-teal-50 hover:border-teal-300" onClick={() => navigate('/rescue-routes')}>
                  <Navigation className="w-5 h-5 text-teal-700" />
                  {t('overview.safeRoutesPlanning') || 'Safe Routes Planning'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {t('overview.recentReportsTitle') || 'Recent Situation Reports'}
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-teal-700 text-xs font-semibold" onClick={() => navigate('/reports')}>
                {t('overview.viewAllReports') || 'View all reports'} <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">{t('overview.reports.columns.assessment') || 'Report Assessment'}</th>
                    <th className="px-4 py-3">{t('overview.reports.columns.area') || 'District'}</th>
                    <th className="px-4 py-3">{t('overview.reports.columns.source') || 'Source'}</th>
                    <th className="px-4 py-3">{t('overview.reports.columns.date') || 'Timestamp'}</th>
                    <th className="px-4 py-3">{t('overview.reports.columns.status') || 'Status'}</th>
                    <th className="px-4 py-3 text-right">{t('overview.reports.columns.action') || 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isDataInserted ? mockReports.map((report: Report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">{report.name}</td>
                      <td className="px-4 py-3 text-slate-600">{report.location}</td>
                      <td className="px-4 py-3 text-slate-600">{report.source}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{report.date}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={report.status === 'Completed' ? 'success' : report.status === 'Processing' ? 'normal' : 'warning'}>
                          {report.status}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-teal-700 h-8 px-2" onClick={() => navigate('/reports')}>
                          <Eye className="w-4 h-4 mr-1" /> Open
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-medium text-sm">
                        {t('overview.standbyReportsMsg') || 'System on standby. No reports generated yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Priority Queue Sidebar Card */}
          <Card className="border-t-4 border-t-red-600 shadow-sm bg-white border-slate-200">
            <CardHeader className="bg-red-50/50 pb-3 border-b border-red-100">
              <CardTitle className="text-red-800 flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-red-600" /> {t('overview.rescueQueueTitle') || 'Operational Rescue Queue'}
              </CardTitle>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {isDataInserted ? mockPriorities.map((priority: RescuePriority) => (
                <div key={priority.id} className="p-4 flex flex-col gap-2.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900 leading-tight">{priority.location}</div>
                      <div className="text-xs text-red-700 font-semibold mt-1 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {priority.peopleDetected} people stranded
                      </div>
                    </div>
                    <StatusBadge status={priority.level === 'Critical' ? 'critical' : 'warning'}>
                      {priority.level}
                    </StatusBadge>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 font-medium">
                    {priority.reason}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full mt-1 text-xs font-semibold bg-slate-100 hover:bg-teal-700 hover:text-white transition-colors"
                    onClick={() => navigate('/rescue-priority')}
                  >
                    View Case Details
                  </Button>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-500 font-medium text-sm">
                  {t('overview.standbyQueueMsg') || 'Queue empty. Waiting for AI triage...'}
                </div>
              )}
            </div>
          </Card>

          {/* Activity Log */}
          <Card className="shadow-sm bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {t('overview.liveSystemLog') || 'Live System Log'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-4 py-2">
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-5 py-4">
                  {isDataInserted ? mockActivities.map((activity: ActivityEvent) => (
                    <div key={activity.id} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center 
                        ${activity.status === 'success' ? 'bg-emerald-600' : 
                          activity.status === 'critical' ? 'bg-red-600' : 
                          activity.status === 'warning' ? 'bg-amber-600' : 'bg-teal-700'}`}>
                        {activity.status === 'success' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div className="text-xs font-bold text-slate-800 leading-snug">{activity.description}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-2">
                        {activity.location && <span>{activity.location} • </span>}
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-slate-500 text-sm ml-4 italic">
                      {t('overview.standbyLogMsg') || 'Live event stream disconnected.'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isAssessmentModalOpen} 
        onClose={() => setIsAssessmentModalOpen(false)}
        title="Trigger New Assessment"
      >
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            variant="secondary" 
            className="justify-start h-14 px-4 hover:border-teal-600 hover:text-teal-700 transition-colors group"
            onClick={() => {
              setIsAssessmentModalOpen(false);
              navigate('/flood-mapping');
            }}
          >
            <div className="bg-slate-100 p-2 rounded group-hover:bg-teal-100 mr-3">
              <UploadCloud className="w-5 h-5 text-slate-600 group-hover:text-teal-800" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">SAR Satellite Flood Mapping</div>
              <div className="text-xs text-slate-500 font-normal mt-0.5">Upload Sentinel-1 SAR imagery for segmentation</div>
            </div>
          </Button>
          <Button 
            variant="secondary" 
            className="justify-start h-14 px-4 hover:border-teal-600 hover:text-teal-700 transition-colors group"
            onClick={() => {
              setIsAssessmentModalOpen(false);
              navigate('/drone-analysis');
            }}
          >
            <div className="bg-slate-100 p-2 rounded group-hover:bg-teal-100 mr-3">
              <Video className="w-5 h-5 text-slate-600 group-hover:text-teal-800" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">UAV Drone Intelligence</div>
              <div className="text-xs text-slate-500 font-normal mt-0.5 font-mono">Run AI object detection on live drone feeds</div>
            </div>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
