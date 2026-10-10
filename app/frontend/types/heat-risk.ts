/**
 * AquaHeat — Heat Risk & Telemetry API Types
 * Human-centered heat resilience data models for Mumbai
 */

export type RiskLevel = 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' | 'PENDING';

export interface HeatMetrics {
  temperatureCelsius: number | null;
  relativeHumidityPercent: number | null;
  wetBulbGlobeTemp: number | null;
  heatIndexCelsius: number | null;
  windSpeedKmh: number | null;
  solarRadiationWm2: number | null;
}

export interface ZoneHeatRiskTelemetry {
  zoneId: string;
  zoneName: string;
  timestamp: string | null;
  riskLevel: RiskLevel;
  riskScore: number | null; // 0-100 scale
  metrics: HeatMetrics;
  isPlaceholder: boolean;
  notes: string;
}

export interface HeatTimelineSlot {
  slotHour: string;
  timeLabel: string;
  riskScore: number | null;
  forecastTempCelsius: number | null;
  forecastHeatIndexCelsius: number | null;
  riskLevel: RiskLevel;
  isPlaceholder: boolean;
}

export interface HourlyForecastPoint {
  timestamp: string; // ISO 8601 string with local timezone offset, e.g. "2026-10-10T14:00:00+05:30"
  temperature: number; // Forecast temperature (°C)
  apparentTemperature: number; // Forecast apparent / feels-like temperature (°C)
  riskLevel: RiskLevel; // Deterministic NOAA heat index category
  futureHeatRiskScore: number | null; // Preserved as null until Phase 5 ML deployment
  isForecast: true; // Explicit discriminator labeling values as forecasts, not observations
}

export type ActivityType =
  | 'WALKING'
  | 'EXERCISE'
  | 'OUTDOOR_LABOR'
  | 'TRAVELLING'
  | 'SCHOOL_COLLEGE'
  | 'INDOOR'
  | 'COMMUTE'
  | 'ATHLETIC';

export type VulnerabilityGroup = 'GENERAL' | 'SENIOR' | 'CHILDREN' | 'PRE_EXISTING';

export interface PersonalExposureAssessment {
  activityType: ActivityType;
  vulnerabilityGroup: VulnerabilityGroup;
  maxContinuousExposureMinutes: number | null;
  recommendedHydrationMlPerHour: number | null;
  riskTier: RiskLevel;
  advisoryNote: string;
  isPlaceholder: boolean;
}

export interface SafetyAdvisory {
  id: string;
  title: string;
  category: 'GENERAL' | 'WORKERS' | 'VULNERABLE' | 'HYDRATION';
  description: string;
  severity: 'INFO' | 'CAUTION' | 'CRITICAL';
  bulletPoints: string[];
}

export interface EmergencyContact {
  service: string;
  phone: string;
  agency: string;
  description: string;
  isTollFree: boolean;
}
