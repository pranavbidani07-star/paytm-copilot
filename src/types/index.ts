export interface Statistic {
  id: string;
  label: string;
  value: string;
  icon: string;
  context?: string;
}

export interface ActivityEvent {
  id: string;
  description: string;
  location?: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical' | 'success';
}

export interface RescuePriority {
  id: string;
  location: string;
  level: 'Critical' | 'High' | 'Medium' | 'Low';
  score: number;
  peopleDetected: number;
  reason: string;
}

export interface Report {
  id: string;
  name: string;
  location: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Review Required';
  source: string;
}

export interface MapMarkerData {
  id: string;
  type: 'flood' | 'settlement' | 'road' | 'team' | 'critical';
  x: string;
  y: string;
  label?: string;
}

export interface SARDataset {
  id: string;
  name: string;
  satellite: string;
  acquisitionDate: string;
  polarization: string;
  product: string;
  coverage: string;
  status: string;
}

export interface ProcessingStage {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'complete';
}

export interface FloodSeverity {
  low: string;
  moderate: string;
  high: string;
  critical: string;
}

export interface InfrastructureImpact {
  settlements: {
    affected: number;
    severelyAffected: number;
    isolated: number;
  };
  roads: {
    blocked: number;
    partiallyAffected: number;
    inaccessible: number;
  };
  criticalZones: {
    identified: number;
    requiringImmediate: number;
  };
}

export interface FloodAssessment {
  id: string;
  source: string;
  acquisition: string;
  status: string;
  floodedArea: string;
  severity: string;
  affectedSettlements: number;
  blockedRoads: number;
  criticalZones: number;
  coverage: string;
  severityBreakdown: FloodSeverity;
  infrastructure: InfrastructureImpact;
}

export interface Victim {
  id: string;
  settlement: string;
  nearestSettlementId: string;
  nearestRoadId: string;
  criticalZoneId?: string;
  x: number | null;
  y: number | null;
  latitude?: number;
  longitude?: number;
  detectionConfidence: number;
  locationConfidence: 'High' | 'Medium' | 'Low';
  floodSeverity: 'Critical' | 'High' | 'Moderate' | 'Low';
  isolationLevel: 'High' | 'Medium' | 'Low';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  verificationStatus: 'Verified' | 'Unverified';
  detectionStatus: string;
  frameId: string;
  timestamp: string;
  trackingId: string;
  telemetryAvailable: boolean;
}

export interface VictimDetectionAssessment {
  id: string;
  sourceAnalysisId: string;
  assessmentDate: string;
  summary: {
    potentialVictims: number;
    critical: number;
    highPriority: number;
    mediumPriority: number;
    locationVerified: number;
  };
  victims: Victim[];
}

export interface DroneVideo {
  id: string;
  filename: string;
  filetype: string;
  duration: string;
  resolution: string;
  frames: number;
  captureDate: string;
  source: string;
  telemetryAvailable: boolean;
}

export interface Detection {
  id: string;
  type: 'Person' | 'Vehicle' | 'Boat';
  confidence: number;
  status: 'Critical' | 'High' | 'Verified' | 'Normal';
  frame: number;
  location: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DroneAnalysisStats {
  people: number;
  highConfidence: number;
  vehicles: number;
  boats: number;
  critical: number;
}

export interface DroneAnalysis {
  id: string;
  video: DroneVideo;
  stats: DroneAnalysisStats;
  detections: Detection[];
}

export interface AffectedSettlement {
  id: string;
  name: string;
  district: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  status: 'Isolated' | 'Severely Affected' | 'Affected';
  peopleDetected: number | null;
  roadAccess: 'Blocked' | 'Partial' | 'Available';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  x: number;
  y: number;
}

export interface AffectedRoad {
  id: string;
  name: string;
  area: string;
  impact: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  status: 'Blocked' | 'Inaccessible' | 'Partially Affected' | 'Normal';
  alternativeRoute: boolean;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  path: [number, number][];
}

export interface CriticalZone {
  id: string;
  name: string;
  severity: 'Critical' | 'High';
  reason: string;
  peopleDetected: number | null;
  x: number;
  y: number;
}

export interface AffectedAreaSummary {
  affectedSettlements: number;
  severelyAffectedSettlements: number;
  isolatedSettlements: number;
  blockedRoads: number;
  partiallyAffectedRoads: number;
  criticalZones: number;
  immediateAssessmentRequired: number;
}

export interface AffectedAreasAssessment {
  id: string;
  sourceAssessmentId: string;
  sourceType: string;
  assessmentDate: string;
  summary: AffectedAreaSummary;
  settlements: AffectedSettlement[];
  roads: AffectedRoad[];
  criticalZones: CriticalZone[];
}

export interface RescueTeam {
  id: string;
  name: string;
  type: 'NDRF' | 'SDRF' | 'Local Police' | 'Medical' | 'Helicopter';
  status: 'Available' | 'Deployed' | 'Resting';
  equipment: string[];
  x: number;
  y: number;
}

export interface RouteSegment {
  path: [number, number][];
  status: 'Clear' | 'Flooded' | 'Blocked';
  roadName: string;
}

export interface RouteWarning {
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
}

export interface RescueRoute {
  id: string;
  teamId: string;
  victimId: string;
  status: 'Optimal' | 'Alternative' | 'High Risk';
  distanceKm: number;
  estimatedTimeMins: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  segments: RouteSegment[];
  warnings: RouteWarning[];
  fullPath: [number, number][];
}
