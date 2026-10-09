/**
 * AquaHeat — Weather Observation Data Model
 * Phase 4 Weather Model Specification
 */

import { isValidZoneId } from '../zones/index.ts';

export interface WeatherObservation {
  zoneId: string;
  timestamp: string; // ISO 8601 UTC string (e.g. 2026-10-08T12:00:00.000Z)
  temperature: number; // Celsius (°C)
  apparentTemperature: number; // Heat Index / "Feels like" (°C)
  relativeHumidity: number; // Percentage (0 - 100%)
  windSpeed: number; // km/h (>= 0)
  cloudCover: number; // Percentage (0 - 100%)
  precipitation: number; // Millimeters (mm, >= 0)
  solarRadiation: number; // W/m² (>= 0)
}

export class ValidationError extends Error {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Validates whether a given ISO 8601 string is valid.
 */
function isValidIsoDate(value: string): boolean {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && value.includes('T');
}

/**
 * Validates a candidate weather observation and returns a strongly-typed WeatherObservation.
 * Throws ValidationError if any required field is missing or out of plausible physical range.
 */
export function validateWeatherObservation(data: unknown): WeatherObservation {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Weather observation payload must be a non-null object');
  }

  const record = data as Record<string, unknown>;

  // zoneId validation
  if (typeof record.zoneId !== 'string' || !isValidZoneId(record.zoneId)) {
    throw new ValidationError(
      `Invalid or missing zoneId: "${record.zoneId}". Must be one of the registered Mumbai zones.`,
      'zoneId'
    );
  }

  // timestamp validation
  if (typeof record.timestamp !== 'string' || !isValidIsoDate(record.timestamp)) {
    throw new ValidationError(
      `Invalid or missing timestamp: "${record.timestamp}". Must be a valid ISO 8601 string.`,
      'timestamp'
    );
  }

  // temperature validation (Plausible coastal range: 5°C to 60°C)
  if (
    typeof record.temperature !== 'number' ||
    Number.isNaN(record.temperature) ||
    record.temperature < 5 ||
    record.temperature > 60
  ) {
    throw new ValidationError(
      `Temperature out of plausible range (5°C to 60°C): ${record.temperature}`,
      'temperature'
    );
  }

  // apparentTemperature validation
  if (
    typeof record.apparentTemperature !== 'number' ||
    Number.isNaN(record.apparentTemperature) ||
    record.apparentTemperature < 5 ||
    record.apparentTemperature > 75
  ) {
    throw new ValidationError(
      `Apparent temperature out of plausible range (5°C to 75°C): ${record.apparentTemperature}`,
      'apparentTemperature'
    );
  }

  // relativeHumidity validation (0% to 100%)
  if (
    typeof record.relativeHumidity !== 'number' ||
    Number.isNaN(record.relativeHumidity) ||
    record.relativeHumidity < 0 ||
    record.relativeHumidity > 100
  ) {
    throw new ValidationError(
      `Relative humidity must be between 0 and 100: ${record.relativeHumidity}`,
      'relativeHumidity'
    );
  }

  // windSpeed validation (0 to 250 km/h)
  if (
    typeof record.windSpeed !== 'number' ||
    Number.isNaN(record.windSpeed) ||
    record.windSpeed < 0 ||
    record.windSpeed > 250
  ) {
    throw new ValidationError(
      `Wind speed must be non-negative and under 250 km/h: ${record.windSpeed}`,
      'windSpeed'
    );
  }

  // cloudCover validation (0% to 100%)
  if (
    typeof record.cloudCover !== 'number' ||
    Number.isNaN(record.cloudCover) ||
    record.cloudCover < 0 ||
    record.cloudCover > 100
  ) {
    throw new ValidationError(
      `Cloud cover must be between 0 and 100: ${record.cloudCover}`,
      'cloudCover'
    );
  }

  // precipitation validation (>= 0 mm)
  if (
    typeof record.precipitation !== 'number' ||
    Number.isNaN(record.precipitation) ||
    record.precipitation < 0
  ) {
    throw new ValidationError(
      `Precipitation must be non-negative: ${record.precipitation}`,
      'precipitation'
    );
  }

  // solarRadiation validation (>= 0 W/m²)
  if (
    typeof record.solarRadiation !== 'number' ||
    Number.isNaN(record.solarRadiation) ||
    record.solarRadiation < 0
  ) {
    throw new ValidationError(
      `Solar radiation must be non-negative: ${record.solarRadiation}`,
      'solarRadiation'
    );
  }

  return {
    zoneId: record.zoneId,
    timestamp: record.timestamp,
    temperature: record.temperature,
    apparentTemperature: record.apparentTemperature,
    relativeHumidity: record.relativeHumidity,
    windSpeed: record.windSpeed,
    cloudCover: record.cloudCover,
    precipitation: record.precipitation,
    solarRadiation: record.solarRadiation,
  };
}
