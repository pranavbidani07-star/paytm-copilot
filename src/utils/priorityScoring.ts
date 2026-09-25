import { Victim, AffectedRoad } from '../types';

export interface PriorityScoreBreakdown {
  floodSeverityScore: number;
  isolationScore: number;
  roadAccessScore: number;
  detectionConfidenceScore: number;
  locationConfidenceScore: number;
  totalScore: number;
  category: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendedAction: string;
}

export function calculatePriorityScore(victim: Victim, affectedRoads: AffectedRoad[]): PriorityScoreBreakdown {
  // Flood Severity: Max 30 points
  let floodSeverityScore = 0;
  if (victim.floodSeverity === 'Critical') floodSeverityScore = 30;
  else if (victim.floodSeverity === 'High') floodSeverityScore = 20;
  else if (victim.floodSeverity === 'Moderate') floodSeverityScore = 10;
  else if (victim.floodSeverity === 'Low') floodSeverityScore = 5;

  // Isolation Level: Max 25 points
  let isolationScore = 0;
  if (victim.isolationLevel === 'High') isolationScore = 25;
  else if (victim.isolationLevel === 'Medium') isolationScore = 15;
  else if (victim.isolationLevel === 'Low') isolationScore = 5;

  // Road Accessibility: Max 20 points
  let roadAccessScore = 0;
  const nearestRoad = affectedRoads.find(r => r.id === victim.nearestRoadId);
  const roadStatus = nearestRoad ? nearestRoad.status : 'Normal';
  
  if (roadStatus === 'Blocked') roadAccessScore = 20;
  else if (roadStatus === 'Partially Affected') roadAccessScore = 10;
  else roadAccessScore = 0;

  // Detection Confidence: Max 15 points (proportional to confidence %)
  const detectionConfidenceScore = Math.round((victim.detectionConfidence / 100) * 15);

  // Location Confidence: Max 10 points
  let locationConfidenceScore = 0;
  if (victim.locationConfidence === 'High') locationConfidenceScore = 10;
  else if (victim.locationConfidence === 'Medium') locationConfidenceScore = 5;
  else if (victim.locationConfidence === 'Low') locationConfidenceScore = 2;

  const totalScore = floodSeverityScore + isolationScore + roadAccessScore + detectionConfidenceScore + locationConfidenceScore;

  let category: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
  let recommendedAction = 'Monitor';

  // Deterministic Thresholds
  if (totalScore >= 75) {
    category = 'Critical';
    recommendedAction = 'Immediate Rescue';
  } else if (totalScore >= 55) {
    category = 'High';
    recommendedAction = 'Dispatch Team';
  } else if (totalScore >= 35) {
    category = 'Medium';
    recommendedAction = 'Assess / Monitor';
  } else {
    category = 'Low';
    recommendedAction = 'Monitor';
  }

  return {
    floodSeverityScore,
    isolationScore,
    roadAccessScore,
    detectionConfidenceScore,
    locationConfidenceScore,
    totalScore,
    category,
    recommendedAction
  };
}
