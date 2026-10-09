/**
 * AquaHeat — Hourly Heat Forecast Data Model
 * Phase 4 Forecast Model Specification
 *
 * Designed to hold numerical weather prediction features and future ML heat risk predictions.
 * Note: Risk scores and ML inference confidence remain null/pending until Phase 5+ ML deployment.
 */

import { isValidZoneId } from '../zones/index.ts';
import { ValidationError } from './weather.ts';

export type HeatRiskLevel =
  | 'SAFE'
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'EXTREME'
  | 'PENDING';

export interface WeatherFeatures {
  relativeHumidity: number; // Percentage (0 - 100%)
  windSpeed: number; // km/h (>= 0)
  cloudCover: number; // Percentage (0 - 100%)
  solarRadiation: number; // W/m² (>= 0)
  precipitation: number; // mm (>= 0)
}

export interface HourlyHeatForecast {
  zoneId: string;
  timestamp: string; // Forecast target hour in ISO 8601 (e.g. 2026-10-08T14:00:00.000Z)
  predictedTemperature: number; // Celsius (°C)
  predictedApparentTemperature: number; // Heat index (°C)
  weatherFeatures: WeatherFeatures;
  futureHeatRiskScore: number | null; // Null until ML inference model is connected
  riskLevel: HeatRiskLevel; // 'PENDING' when uncalculated
  modelConfidence: number | null; // Null until SageMaker inference active
}

function isValidIsoDate(value: string): boolean {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && value.includes('T');
}

/**
 * Validates and normalizes candidate hourly forecast data.
 * Enforces that uncalculated risk scores are appropriately preserved as null/PENDING.
 */
export function validateHourlyHeatForecast(data: unknown): HourlyHeatForecast {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Hourly forecast payload must be a non-null object');
  }

  const record = data as Record<string, unknown>;

  if (typeof record.zoneId !== 'string' || !isValidZoneId(record.zoneId)) {
    throw new ValidationError(
      `Invalid or missing zoneId: "${record.zoneId}"`,
      'zoneId'
    );
  }

  if (typeof record.timestamp !== 'string' || !isValidIsoDate(record.timestamp)) {
    throw new ValidationError(
      `Invalid or missing timestamp: "${record.timestamp}"`,
      'timestamp'
    );
  }

  if (
    typeof record.predictedTemperature !== 'number' ||
    Number.isNaN(record.predictedTemperature) ||
    record.predictedTemperature < 5 ||
    record.predictedTemperature > 60
  ) {
    throw new ValidationError(
      `Predicted temperature out of range (5°C to 60°C): ${record.predictedTemperature}`,
      'predictedTemperature'
    );
  }

  if (
    typeof record.predictedApparentTemperature !== 'number' ||
    Number.isNaN(record.predictedApparentTemperature) ||
    record.predictedApparentTemperature < 5 ||
    record.predictedApparentTemperature > 75
  ) {
    throw new ValidationError(
      `Predicted apparent temperature out of range (5°C to 75°C): ${record.predictedApparentTemperature}`,
      'predictedApparentTemperature'
    );
  }

  // Validate weatherFeatures object
  if (!record.weatherFeatures || typeof record.weatherFeatures !== 'object') {
    throw new ValidationError(
      'Forecast must include weatherFeatures object',
      'weatherFeatures'
    );
  }

  const features = record.weatherFeatures as Record<string, unknown>;

  if (
    typeof features.relativeHumidity !== 'number' ||
    features.relativeHumidity < 0 ||
    features.relativeHumidity > 100
  ) {
    throw new ValidationError(
      `weatherFeatures.relativeHumidity must be 0-100: ${features.relativeHumidity}`,
      'weatherFeatures.relativeHumidity'
    );
  }

  if (typeof features.windSpeed !== 'number' || features.windSpeed < 0) {
    throw new ValidationError(
      `weatherFeatures.windSpeed must be non-negative: ${features.windSpeed}`,
      'weatherFeatures.windSpeed'
    );
  }

  if (
    typeof features.cloudCover !== 'number' ||
    features.cloudCover < 0 ||
    features.cloudCover > 100
  ) {
    throw new ValidationError(
      `weatherFeatures.cloudCover must be 0-100: ${features.cloudCover}`,
      'weatherFeatures.cloudCover'
    );
  }

  if (typeof features.solarRadiation !== 'number' || features.solarRadiation < 0) {
    throw new ValidationError(
      `weatherFeatures.solarRadiation must be non-negative: ${features.solarRadiation}`,
      'weatherFeatures.solarRadiation'
    );
  }

  if (typeof features.precipitation !== 'number' || features.precipitation < 0) {
    throw new ValidationError(
      `weatherFeatures.precipitation must be non-negative: ${features.precipitation}`,
      'weatherFeatures.precipitation'
    );
  }

  // Validate futureHeatRiskScore: number (0-100) or null
  const futureScore =
    record.futureHeatRiskScore === undefined || record.futureHeatRiskScore === null
      ? null
      : typeof record.futureHeatRiskScore === 'number' &&
        record.futureHeatRiskScore >= 0 &&
        record.futureHeatRiskScore <= 100
      ? record.futureHeatRiskScore
      : (() => {
          throw new ValidationError(
            'futureHeatRiskScore must be a number between 0 and 100, or null',
            'futureHeatRiskScore'
          );
        })();

  const validRiskLevels: HeatRiskLevel[] = [
    'SAFE',
    'LOW',
    'MODERATE',
    'HIGH',
    'EXTREME',
    'PENDING',
  ];

  const riskLevel =
    typeof record.riskLevel === 'string' &&
    validRiskLevels.includes(record.riskLevel as HeatRiskLevel)
      ? (record.riskLevel as HeatRiskLevel)
      : 'PENDING';

  const confidence =
    record.modelConfidence === undefined || record.modelConfidence === null
      ? null
      : typeof record.modelConfidence === 'number' &&
        record.modelConfidence >= 0 &&
        record.modelConfidence <= 1
      ? record.modelConfidence
      : (() => {
          throw new ValidationError(
            'modelConfidence must be a number between 0 and 1, or null',
            'modelConfidence'
          );
        })();

  return {
    zoneId: record.zoneId,
    timestamp: record.timestamp,
    predictedTemperature: record.predictedTemperature,
    predictedApparentTemperature: record.predictedApparentTemperature,
    weatherFeatures: {
      relativeHumidity: features.relativeHumidity,
      windSpeed: features.windSpeed,
      cloudCover: features.cloudCover,
      solarRadiation: features.solarRadiation,
      precipitation: features.precipitation,
    },
    futureHeatRiskScore: futureScore,
    riskLevel,
    modelConfidence: confidence,
  };
}
