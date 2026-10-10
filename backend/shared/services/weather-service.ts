/**
 * AquaHeat — Weather Service & Open-Meteo Integration
 * Phase 4 Live Observation & Environmental Heat Risk Telemetry
 *
 * Fetches real-time observations from Open-Meteo without fabricated fallbacks.
 * Categorizes environmental heat strain using recognized NOAA / NWS heat index thresholds.
 */

import { getZoneById, isValidZoneId, type MumbaiZone } from '../zones/index.ts';
import { validateWeatherObservation, type WeatherObservation } from '../models/weather.ts';
import type { HeatRiskLevel } from '../models/forecast.ts';

export class ZoneNotFoundError extends Error {
  public readonly zoneId: string;
  constructor(zoneId: string) {
    super(`Unknown or invalid zoneId: "${zoneId}". Must be one of the registered Mumbai zones.`);
    this.name = 'ZoneNotFoundError';
    this.zoneId = zoneId;
  }
}

export class WeatherProviderError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number = 502) {
    super(message);
    this.name = 'WeatherProviderError';
    this.statusCode = statusCode;
  }
}

export class WeatherProviderTimeoutError extends WeatherProviderError {
  constructor(timeoutMs: number) {
    super(`Weather provider timed out after ${timeoutMs}ms. Please try again.`, 504);
    this.name = 'WeatherProviderTimeoutError';
  }
}

export interface HourlyForecastPoint {
  timestamp: string; // ISO 8601 string with local timezone offset, e.g. "2026-10-10T14:00:00+05:30"
  temperature: number; // Forecast temperature (°C)
  apparentTemperature: number; // Forecast apparent / feels-like temperature (°C)
  riskLevel: HeatRiskLevel; // Deterministic NOAA heat index category
  futureHeatRiskScore: number | null; // Preserved as null until Phase 5 ML deployment
  isForecast: true; // Explicit discriminator labeling values as forecasts, not observations
}

export interface ZoneWeatherTelemetry {
  zoneId: string;
  zoneName: string;
  representativeLocation: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  observation: WeatherObservation;
  hourlyForecasts: HourlyForecastPoint[];
  riskLevel: HeatRiskLevel;
  futureHeatRiskScore: number | null; // Null until ML model deployment in Phase 5
  modelConfidence: number | null; // Null until ML inference deployment
  riskMethod: string;
  notes: string;
  isPlaceholder: false;
}

/**
 * Parses and validates raw hourly forecast arrays from Open-Meteo into structured HourlyForecastPoint items.
 * Enforces non-fabrication: skips malformed entries and returns an empty array if forecast data is missing.
 */
export function parseHourlyForecasts(
  hourlyPayload: unknown,
  currentTimeStr?: string,
  maxHours: number = 24
): HourlyForecastPoint[] {
  if (!hourlyPayload || typeof hourlyPayload !== 'object') {
    return [];
  }

  const h = hourlyPayload as Record<string, unknown>;
  const times = Array.isArray(h.time) ? h.time : null;
  const temps = Array.isArray(h.temperature_2m) ? h.temperature_2m : null;
  const apparentTemps = Array.isArray(h.apparent_temperature) ? h.apparent_temperature : null;

  if (!times || !temps || !apparentTemps || times.length === 0) {
    return [];
  }

  // Determine starting hour index based on current observation time or current hour
  let startIdx = 0;
  if (currentTimeStr && typeof currentTimeStr === 'string') {
    const currentHourPrefix = currentTimeStr.slice(0, 13); // e.g. "2026-10-10T14"
    const foundIdx = times.findIndex(
      (t) => typeof t === 'string' && t.startsWith(currentHourPrefix)
    );
    if (foundIdx >= 0) {
      startIdx = foundIdx;
    }
  }

  const results: HourlyForecastPoint[] = [];
  const limit = Math.min(times.length, startIdx + maxHours);

  for (let i = startIdx; i < limit; i++) {
    const rawTime = times[i];
    const rawTemp = temps[i];
    const rawApparent = apparentTemps[i];

    if (
      typeof rawTime !== 'string' ||
      typeof rawTemp !== 'number' ||
      Number.isNaN(rawTemp) ||
      typeof rawApparent !== 'number' ||
      Number.isNaN(rawApparent)
    ) {
      // Skip incomplete or non-numeric forecast entries; do not fabricate values
      continue;
    }

    // Normalize timestamp to ISO string with local Mumbai (+05:30) offset
    let isoTimestamp = rawTime;
    if (!isoTimestamp.includes('Z') && !isoTimestamp.includes('+')) {
      isoTimestamp = isoTimestamp.length === 16 ? `${isoTimestamp}:00+05:30` : `${isoTimestamp}+05:30`;
    }

    const temp = Math.round(rawTemp * 10) / 10;
    const apparent = Math.round(rawApparent * 10) / 10;
    const riskLevel = calculateEnvironmentalRiskLevel(apparent);

    results.push({
      timestamp: isoTimestamp,
      temperature: temp,
      apparentTemperature: apparent,
      riskLevel,
      futureHeatRiskScore: null,
      isForecast: true,
    });
  }

  return results;
}

/**
 * Calculates a deterministic environmental heat-risk tier from apparent temperature
 * following NOAA / National Weather Service (NWS) Heat Index categories.
 *
 * Recognized thresholds:
 * - < 27°C (< 80.6°F): SAFE (Normal coastal conditions)
 * - 27°C - 32°C (80.6°F - 89.6°F): LOW (Caution: fatigue possible with prolonged exposure)
 * - 32°C - 41°C (89.6°F - 105.8°F): MODERATE (Extreme Caution: heat cramps & exhaustion possible)
 * - 41°C - 54°C (105.8°F - 129.2°F): HIGH (Danger: heat cramps/exhaustion likely, heat stroke possible)
 * - >= 54°C (>= 129.2°F): EXTREME (Extreme Danger: heat stroke imminent with continued exposure)
 */
export function calculateEnvironmentalRiskLevel(apparentTemperatureCelsius: number): HeatRiskLevel {
  if (typeof apparentTemperatureCelsius !== 'number' || Number.isNaN(apparentTemperatureCelsius)) {
    return 'PENDING';
  }

  if (apparentTemperatureCelsius < 27) {
    return 'SAFE';
  }
  if (apparentTemperatureCelsius < 32) {
    return 'LOW';
  }
  if (apparentTemperatureCelsius < 41) {
    return 'MODERATE';
  }
  if (apparentTemperatureCelsius < 54) {
    return 'HIGH';
  }
  return 'EXTREME';
}

export interface FetchWeatherOptions {
  timeoutMs?: number;
  customFetch?: typeof fetch;
}

/**
 * Fetches real weather observations from Open-Meteo for a designated Mumbai zone,
 * validates the atmospheric telemetry, and derives a deterministic environmental risk level.
 */
export async function fetchZoneWeather(
  zoneId: string,
  options: FetchWeatherOptions = {}
): Promise<ZoneWeatherTelemetry> {
  if (!zoneId || typeof zoneId !== 'string' || !isValidZoneId(zoneId)) {
    throw new ZoneNotFoundError(zoneId || '');
  }

  const zone = getZoneById(zoneId);
  if (!zone) {
    throw new ZoneNotFoundError(zoneId);
  }

  const timeoutMs = options.timeoutMs ?? 6000;
  const fetchFn = options.customFetch ?? fetch;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${zone.latitude}&longitude=${zone.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,cloud_cover&hourly=temperature_2m,apparent_temperature&forecast_days=2&timezone=auto`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetchFn(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'AquaHeat-Mumbai-Heat-Safety/0.4.0',
      },
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new WeatherProviderTimeoutError(timeoutMs);
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new WeatherProviderError(`Failed to connect to weather provider: ${message}`, 502);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new WeatherProviderError(
      `Weather provider returned HTTP ${response.status}: ${errorBody.slice(0, 200)}`,
      502
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new WeatherProviderError('Failed to parse weather provider JSON response', 502);
  }

  if (!payload || typeof payload !== 'object' || !('current' in payload)) {
    throw new WeatherProviderError('Weather provider payload missing "current" observation block', 502);
  }

  const current = (payload as Record<string, unknown>).current as Record<string, unknown> | undefined;
  if (!current || typeof current !== 'object') {
    throw new WeatherProviderError('Invalid "current" observation data from weather provider', 502);
  }

  // Validate raw fields from Open-Meteo
  const temp = typeof current.temperature_2m === 'number' ? current.temperature_2m : NaN;
  const apparentTemp = typeof current.apparent_temperature === 'number' ? current.apparent_temperature : NaN;
  const humidity = typeof current.relative_humidity_2m === 'number' ? current.relative_humidity_2m : NaN;
  const wind = typeof current.wind_speed_10m === 'number' ? current.wind_speed_10m : NaN;
  const cloud = typeof current.cloud_cover === 'number' ? current.cloud_cover : 0;
  const precip = typeof current.precipitation === 'number' ? current.precipitation : 0;

  if (Number.isNaN(temp) || Number.isNaN(apparentTemp) || Number.isNaN(humidity) || Number.isNaN(wind)) {
    throw new WeatherProviderError('Weather provider returned non-numeric telemetry values', 502);
  }

  // Build standard UTC ISO timestamp
  let timestampStr = new Date().toISOString();
  if (typeof current.time === 'string' && current.time.includes('T')) {
    const candidate = current.time.endsWith('Z') ? current.time : `${current.time}:00.000Z`;
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      timestampStr = candidate;
    }
  }

  // Validate observation against our strict domain model
  const observation = validateWeatherObservation({
    zoneId: zone.id,
    timestamp: timestampStr,
    temperature: temp,
    apparentTemperature: apparentTemp,
    relativeHumidity: humidity,
    windSpeed: wind,
    cloudCover: cloud,
    precipitation: precip,
    solarRadiation: 0, // Not provided in current basic Open-Meteo endpoint; default 0 non-negative
  });

  const riskLevel = calculateEnvironmentalRiskLevel(observation.apparentTemperature);

  // Parse hourly forecast data (gracefully handles missing or incomplete arrays)
  const hourlyForecasts = parseHourlyForecasts(
    (payload as Record<string, unknown>).hourly,
    typeof current.time === 'string' ? current.time : undefined,
    24
  );

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    representativeLocation: zone.representativeLocation,
    coordinates: {
      latitude: zone.latitude,
      longitude: zone.longitude,
    },
    observation,
    hourlyForecasts,
    riskLevel,
    futureHeatRiskScore: null, // Transparently preserved as null (Phase 5 ML pending)
    modelConfidence: null, // Preserved as null
    riskMethod:
      'Deterministic NOAA/NWS environmental heat categories derived from real-time apparent temperature. Predictive ML risk scores remain pending Phase 5 SageMaker deployment.',
    notes:
      'Ambient environmental measurement. Individual heat vulnerability varies with physical activity, hydration, shade, and personal health.',
    isPlaceholder: false,
  };
}
