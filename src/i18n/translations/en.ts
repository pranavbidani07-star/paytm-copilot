export const en = {
  app: {
    title: 'JALDRISHTI',
    subtitle: 'AI Flood Intelligence & Response',
    govTitle: 'Government of Assam',
    deptTitle: 'Assam State Disaster Management Authority',
    seocTitle: 'State Emergency Operations Centre',
    monitoring: 'Assessment Status: Live Operations',
    newAssessment: 'New Assessment',
    sarAnalysis: 'SAR Flood Mapping',
    droneAnalysis: 'Drone Operations',
    screenReader: 'Screen Reader Access',
    skipToContent: 'Skip to Main Content',
    searchPlaceholder: 'Search case IDs, locations, or modules...',
    emergencyAlerts: 'Emergency Alerts',
    viewAllCases: 'VIEW ALL CASES',
    confidentialNotice: 'CONFIDENTIAL & OPERATIONAL'
  },
  nav: {
    overview: 'Command Overview',
    floodMapping: 'Flood Intelligence',
    droneAnalysis: 'Drone Operations',
    affectedAreas: 'Affected Areas',
    victimDetection: 'Victim Detection',
    rescuePriority: 'Rescue Priority',
    rescueRoutes: 'Safe Routes',
    rescueTeams: 'Rescue Teams',
    reports: 'Situation Reports',
    dataLayers: 'Data & Layers',
    settings: 'Settings',
    quickAccess: 'Quick Access',
    emergencyCases: 'Emergency Cases',
    routePlanning: 'Route Planning',
    emergencyProtocol: 'Emergency Protocol',
    fieldNetwork: 'Field Network',
    districtNodes: 'District Nodes',
    droneFeeds: 'Drone Feeds',
    commHealth: 'Comm Health'
  },
  overview: {
    title: 'Flood Resilience Command Center',
    subtitle: 'Real-time overview of flood conditions, affected areas and rescue operations.',
    gisStatusLabel: 'Operational GIS Data Status:',
    gisDataInserted: 'DATA INSERTED & ACTIVE',
    gisNoData: 'NO DATA INSERTED (STANDBY)',
    ingestDataBtn: 'Ingest Live Data',
    clearDataBtn: 'Clear Inserted Data',
    gisStandbyTitle: 'Operational GIS Map Unavailable',
    gisStandbyBadge: 'GIS MAP STANDBY MODE',
    gisStandbyDesc: 'No geospatial or observation dataset has been inserted into the system yet. Insert live data or run satellite/drone analysis to activate the operational GIS map.',
    quickActionsTitle: 'Command Quick Actions',
    uploadSarData: 'Upload SAR Data',
    analyzeDroneFeed: 'Analyze Drone Feed',
    viewAffectedAreas: 'View Affected Areas',
    safeRoutesPlanning: 'Safe Routes Planning',
    recentReportsTitle: 'Recent Situation Reports',
    viewAllReports: 'View all reports',
    rescueQueueTitle: 'Operational Rescue Queue',
    liveSystemLog: 'Live System Log',
    standbyReportsMsg: 'System on standby. No reports generated yet.',
    standbyQueueMsg: 'Queue empty. Waiting for AI triage...',
    standbyLogMsg: 'Live event stream disconnected.',
    stats: {
      floodedArea: 'Flooded Area',
      affectedSettlements: 'Affected Settlements',
      blockedRoads: 'Blocked Roads',
      peopleDetected: 'People Detected',
      criticalPriority: 'Critical Priority'
    },
    activity: {
      title: 'Recent Activity'
    },
    priority: {
      title: 'Rescue Priority',
      critical: 'Critical',
      high: 'High'
    },
    reports: {
      title: 'Recent Reports',
      completed: 'Completed',
      viewAll: 'View all reports',
      columns: {
        assessment: 'Assessment',
        area: 'Area',
        source: 'Source',
        status: 'Status',
        date: 'Date',
        action: 'Action'
      }
    },
    map: {
      legend: 'Legend',
      floodExtent: 'Flood Extent',
      affectedSettlement: 'Affected Settlement',
      blockedRoad: 'Blocked Road',
      rescueTeam: 'Rescue Team',
      criticalLocation: 'Critical Location',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      fitLocate: 'Fit / Locate',
      layers: 'Layers'
    }
  },
  floodMapping: {
    title: 'Flood Mapping Intelligence',
    subtitle: 'Generate flood extent maps from cloud-penetrating SAR imagery.',
    emptyState: {
      title: 'No flood assessment loaded',
      description: 'Upload Sentinel-1 SAR data to begin a flood assessment.',
      uploadBtn: 'Upload SAR Data'
    },
    upload: {
      title: 'Sentinel-1 SAR Data',
      description: 'Upload Sentinel-1 SAR imagery to generate an all-weather flood assessment.',
      replaceBtn: 'Replace file',
      startBtn: 'Start Flood Analysis'
    },
    results: {
      summary: 'Assessment Summary',
      floodedArea: 'Flooded Area',
      severity: 'Flood Severity',
      affectedSettlements: 'Affected Settlements',
      affectedRoads: 'Affected/Blocked Roads'
    }
  },
  droneAnalysis: {
    title: 'Drone Intelligence & Surveillance',
    subtitle: 'Analyze aerial video to detect stranded victims, vehicles and rescue assets.',
    emptyState: {
      title: 'No drone analysis loaded',
      description: 'Upload drone footage to begin aerial detection.',
      uploadBtn: 'Upload Drone Video',
      loadSampleBtn: 'Load Sample Analysis'
    }
  },
  victimDetection: {
    title: 'Stranded Victim Detection',
    subtitle: 'AI-assisted identification of stranded individuals and groups.',
    emptyState: {
      title: 'Victim detection analysis not available',
      description: 'Ingest live observations to display victim detection location markers.',
      loadSampleBtn: 'Ingest Live Detection Data'
    }
  },
  affectedAreas: {
    title: 'Affected Areas & Infrastructure',
    subtitle: 'Identify flooded settlements, blocked roads and critical zones.',
    emptyState: {
      title: 'No affected-area assessment loaded',
      description: 'Run a flood assessment to identify affected settlements, roads and critical zones.',
      loadSampleBtn: 'Ingest Assessment Data'
    }
  },
  rescuePriority: {
    title: 'Rescue Priority Triage',
    subtitle: 'Multi-criteria priority ranking for search and rescue deployment.',
    emptyState: {
      title: 'No active priority cases',
      description: 'Waiting for flood assessment or victim detection data to rank priority targets.'
    }
  },
  rescueRoutes: {
    title: 'Safe Rescue Routes Planning',
    subtitle: 'Compute safe navigation paths avoiding flooded zones and blocked roads.',
    emptyState: {
      title: 'No route analysis active',
      description: 'Ingest geospatial data to compute optimal rescue paths.'
    }
  },
  situationReports: {
    title: 'Situation Reports & SEOC Bulletins',
    subtitle: 'Official disaster situation reports and summary briefings.',
    emptyState: {
      title: 'No reports generated yet',
      description: 'Reports will be generated automatically as assessments are completed.'
    }
  }
};
