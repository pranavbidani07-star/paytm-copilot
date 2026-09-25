import { Victim, RescueTeam, AffectedRoad, RescueRoute, RouteSegment, RouteWarning } from '../types';

export function calculateRoute(
  victim: Victim, 
  team: RescueTeam, 
  affectedRoads: AffectedRoad[]
): { primary: RescueRoute; alternative: RescueRoute } {
  
  // Deterministic mock generation based on IDs to keep it consistent
  const vIdHash = victim.id.charCodeAt(victim.id.length - 1);
  const tIdHash = team.id.charCodeAt(team.id.length - 1);
  const seed = (vIdHash + tIdHash) % 10;

  // Generate a mock path from team to victim
  // Team is at (team.x, team.y), Victim is at (victim.x || 50, victim.y || 50)
  const endX = victim.x || 50;
  const endY = victim.y || 50;
  
  const midX = (team.x + endX) / 2 + (seed > 5 ? 10 : -10);
  const midY = (team.y + endY) / 2 + (seed % 2 === 0 ? 10 : -10);

  const primaryPath: [number, number][] = [
    [team.x, team.y],
    [midX, midY],
    [endX, endY]
  ];

  // Primary Route Logic
  const primaryDistance = 12 + (seed * 2.5); // Mock 12-35km
  const primaryTime = Math.round(primaryDistance * 1.8); // rough time
  
  const primarySegments: RouteSegment[] = [
    { path: [[team.x, team.y], [midX, midY]], status: 'Clear', roadName: 'District Highway' },
    { path: [[midX, midY], [endX, endY]], status: seed > 7 ? 'Flooded' : 'Clear', roadName: 'Local Access Road' }
  ];

  const primaryWarnings: RouteWarning[] = [];
  if (seed > 7) {
    primaryWarnings.push({ severity: 'Warning', message: 'Water over roadway on Local Access Road (10-15cm depth).' });
  }
  
  // Find blocked roads nearby
  const blockedRoads = affectedRoads.filter(r => r.status === 'Blocked');
  if (blockedRoads.length > 0 && seed < 3) {
    primaryWarnings.push({ severity: 'Info', message: `Successfully routed around blocked ${blockedRoads[0].name}.` });
  }

  const primary: RescueRoute = {
    id: `R-${team.id}-${victim.id}-1`,
    teamId: team.id,
    victimId: victim.id,
    status: seed > 7 ? 'High Risk' : 'Optimal',
    distanceKm: parseFloat(primaryDistance.toFixed(1)),
    estimatedTimeMins: primaryTime,
    riskLevel: seed > 7 ? 'Medium' : 'Low',
    segments: primarySegments,
    warnings: primaryWarnings,
    fullPath: primaryPath
  };

  // Alternative Route Logic (Dogleg)
  const altMidX = (team.x + endX) / 2 + (seed > 5 ? -15 : 20);
  const altMidY = (team.y + endY) / 2 + (seed % 2 === 0 ? -15 : 15);
  
  const altPath: [number, number][] = [
    [team.x, team.y],
    [altMidX, altMidY],
    [endX, endY]
  ];

  const altDistance = primaryDistance * 1.4; 
  const altTime = Math.round(altDistance * 1.8);

  const altSegments: RouteSegment[] = [
    { path: [[team.x, team.y], [altMidX, altMidY]], status: 'Clear', roadName: 'State Highway Alternative' },
    { path: [[altMidX, altMidY], [endX, endY]], status: 'Clear', roadName: 'Secondary Rural Road' }
  ];

  const altWarnings: RouteWarning[] = [];
  if (seed % 2 === 0) {
    altWarnings.push({ severity: 'Info', message: 'Longer route but avoids known flood zones entirely.' });
  } else {
    altWarnings.push({ severity: 'Warning', message: 'Includes unpaved sections that may be muddy.' });
  }

  const alternative: RescueRoute = {
    id: `R-${team.id}-${victim.id}-2`,
    teamId: team.id,
    victimId: victim.id,
    status: 'Alternative',
    distanceKm: parseFloat(altDistance.toFixed(1)),
    estimatedTimeMins: altTime,
    riskLevel: 'Low',
    segments: altSegments,
    warnings: altWarnings,
    fullPath: altPath
  };

  return { primary, alternative };
}
