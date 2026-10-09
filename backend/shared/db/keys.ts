/**
 * AquaHeat — DynamoDB Key Generation & Table Schema Helpers
 * Phase 4 Data Access Layer
 *
 * Aligned with DynamoDB tables defined in infra/template.yaml:
 * - AquaHeatWeather:   PK = locationId (S), SK = timestamp (S)
 * - AquaHeatForecasts: PK = locationId (S), SK = forecastTimestamp (S)
 */

export interface WeatherPrimaryKey {
  locationId: string;
  timestamp: string;
}

export interface ForecastPrimaryKey {
  locationId: string;
  forecastTimestamp: string;
}

/**
 * Builds the primary key for the AquaHeatWeather table.
 *
 * @param zoneId - Registered Mumbai zone ID (maps to locationId partition key)
 * @param timestamp - Observation timestamp in ISO 8601 format
 */
export function buildWeatherKey(zoneId: string, timestamp: string): WeatherPrimaryKey {
  if (!zoneId || typeof zoneId !== 'string') {
    throw new Error('zoneId must be a non-empty string');
  }
  if (!timestamp || typeof timestamp !== 'string') {
    throw new Error('timestamp must be a non-empty ISO 8601 string');
  }

  return {
    locationId: zoneId,
    timestamp,
  };
}

/**
 * Builds the primary key for the AquaHeatForecasts table.
 *
 * @param zoneId - Registered Mumbai zone ID (maps to locationId partition key)
 * @param forecastTimestamp - Forecast prediction target timestamp in ISO 8601 format
 */
export function buildForecastKey(
  zoneId: string,
  forecastTimestamp: string
): ForecastPrimaryKey {
  if (!zoneId || typeof zoneId !== 'string') {
    throw new Error('zoneId must be a non-empty string');
  }
  if (!forecastTimestamp || typeof forecastTimestamp !== 'string') {
    throw new Error('forecastTimestamp must be a non-empty ISO 8601 string');
  }

  return {
    locationId: zoneId,
    forecastTimestamp,
  };
}

/**
 * Helper to resolve dynamic table names based on environment stage.
 */
export function resolveTableName(baseName: string, environment?: string): string {
  const env = environment || process.env.ENVIRONMENT || 'dev';
  return `${baseName}-${env}`;
}
