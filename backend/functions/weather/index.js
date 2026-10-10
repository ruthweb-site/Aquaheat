"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// backend/functions/weather/index.ts
var index_exports = {};
__export(index_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(index_exports);

// backend/shared/zones/index.ts
var MUMBAI_ZONES = Object.freeze([
  {
    id: "south-mumbai",
    name: "South Mumbai",
    representativeLocation: "Colaba",
    latitude: 18.9067,
    longitude: 72.8147
  },
  {
    id: "western-suburbs",
    name: "Western Suburbs",
    representativeLocation: "Andheri",
    latitude: 19.1136,
    longitude: 72.8697
  },
  {
    id: "eastern-suburbs",
    name: "Eastern Suburbs",
    representativeLocation: "Ghatkopar",
    latitude: 19.086,
    longitude: 72.909
  },
  {
    id: "central-mumbai",
    name: "Central Mumbai",
    representativeLocation: "Dadar",
    latitude: 19.0178,
    longitude: 72.8478
  },
  {
    id: "harbour",
    name: "Harbour",
    representativeLocation: "Chembur",
    latitude: 19.0622,
    longitude: 72.8978
  },
  {
    id: "northern-mumbai",
    name: "Northern Mumbai",
    representativeLocation: "Borivali",
    latitude: 19.2288,
    longitude: 72.8541
  }
]);
function getZoneById(zoneId) {
  return MUMBAI_ZONES.find((zone) => zone.id === zoneId);
}
function isValidZoneId(zoneId) {
  return MUMBAI_ZONES.some((zone) => zone.id === zoneId);
}
function getAllZoneIds() {
  return MUMBAI_ZONES.map((zone) => zone.id);
}

// backend/shared/models/weather.ts
var ValidationError = class extends Error {
  field;
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
};
function isValidIsoDate(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && value.includes("T");
}
function validateWeatherObservation(data) {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Weather observation payload must be a non-null object");
  }
  const record = data;
  if (typeof record.zoneId !== "string" || !isValidZoneId(record.zoneId)) {
    throw new ValidationError(
      `Invalid or missing zoneId: "${record.zoneId}". Must be one of the registered Mumbai zones.`,
      "zoneId"
    );
  }
  if (typeof record.timestamp !== "string" || !isValidIsoDate(record.timestamp)) {
    throw new ValidationError(
      `Invalid or missing timestamp: "${record.timestamp}". Must be a valid ISO 8601 string.`,
      "timestamp"
    );
  }
  if (typeof record.temperature !== "number" || Number.isNaN(record.temperature) || record.temperature < 5 || record.temperature > 60) {
    throw new ValidationError(
      `Temperature out of plausible range (5\xB0C to 60\xB0C): ${record.temperature}`,
      "temperature"
    );
  }
  if (typeof record.apparentTemperature !== "number" || Number.isNaN(record.apparentTemperature) || record.apparentTemperature < 5 || record.apparentTemperature > 75) {
    throw new ValidationError(
      `Apparent temperature out of plausible range (5\xB0C to 75\xB0C): ${record.apparentTemperature}`,
      "apparentTemperature"
    );
  }
  if (typeof record.relativeHumidity !== "number" || Number.isNaN(record.relativeHumidity) || record.relativeHumidity < 0 || record.relativeHumidity > 100) {
    throw new ValidationError(
      `Relative humidity must be between 0 and 100: ${record.relativeHumidity}`,
      "relativeHumidity"
    );
  }
  if (typeof record.windSpeed !== "number" || Number.isNaN(record.windSpeed) || record.windSpeed < 0 || record.windSpeed > 250) {
    throw new ValidationError(
      `Wind speed must be non-negative and under 250 km/h: ${record.windSpeed}`,
      "windSpeed"
    );
  }
  if (typeof record.cloudCover !== "number" || Number.isNaN(record.cloudCover) || record.cloudCover < 0 || record.cloudCover > 100) {
    throw new ValidationError(
      `Cloud cover must be between 0 and 100: ${record.cloudCover}`,
      "cloudCover"
    );
  }
  if (typeof record.precipitation !== "number" || Number.isNaN(record.precipitation) || record.precipitation < 0) {
    throw new ValidationError(
      `Precipitation must be non-negative: ${record.precipitation}`,
      "precipitation"
    );
  }
  if (typeof record.solarRadiation !== "number" || Number.isNaN(record.solarRadiation) || record.solarRadiation < 0) {
    throw new ValidationError(
      `Solar radiation must be non-negative: ${record.solarRadiation}`,
      "solarRadiation"
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
    solarRadiation: record.solarRadiation
  };
}

// backend/shared/services/weather-service.ts
var ZoneNotFoundError = class extends Error {
  zoneId;
  constructor(zoneId) {
    super(`Unknown or invalid zoneId: "${zoneId}". Must be one of the registered Mumbai zones.`);
    this.name = "ZoneNotFoundError";
    this.zoneId = zoneId;
  }
};
var WeatherProviderError = class extends Error {
  statusCode;
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "WeatherProviderError";
    this.statusCode = statusCode;
  }
};
var WeatherProviderTimeoutError = class extends WeatherProviderError {
  constructor(timeoutMs) {
    super(`Weather provider timed out after ${timeoutMs}ms. Please try again.`, 504);
    this.name = "WeatherProviderTimeoutError";
  }
};
function parseHourlyForecasts(hourlyPayload, currentTimeStr, maxHours = 24) {
  if (!hourlyPayload || typeof hourlyPayload !== "object") {
    return [];
  }
  const h = hourlyPayload;
  const times = Array.isArray(h.time) ? h.time : null;
  const temps = Array.isArray(h.temperature_2m) ? h.temperature_2m : null;
  const apparentTemps = Array.isArray(h.apparent_temperature) ? h.apparent_temperature : null;
  if (!times || !temps || !apparentTemps || times.length === 0) {
    return [];
  }
  let startIdx = 0;
  if (currentTimeStr && typeof currentTimeStr === "string") {
    const currentHourPrefix = currentTimeStr.slice(0, 13);
    const foundIdx = times.findIndex(
      (t) => typeof t === "string" && t.startsWith(currentHourPrefix)
    );
    if (foundIdx >= 0) {
      startIdx = foundIdx;
    }
  }
  const results = [];
  const limit = Math.min(times.length, startIdx + maxHours);
  for (let i = startIdx; i < limit; i++) {
    const rawTime = times[i];
    const rawTemp = temps[i];
    const rawApparent = apparentTemps[i];
    if (typeof rawTime !== "string" || typeof rawTemp !== "number" || Number.isNaN(rawTemp) || typeof rawApparent !== "number" || Number.isNaN(rawApparent)) {
      continue;
    }
    let isoTimestamp = rawTime;
    if (!isoTimestamp.includes("Z") && !isoTimestamp.includes("+")) {
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
      isForecast: true
    });
  }
  return results;
}
function calculateEnvironmentalRiskLevel(apparentTemperatureCelsius) {
  if (typeof apparentTemperatureCelsius !== "number" || Number.isNaN(apparentTemperatureCelsius)) {
    return "PENDING";
  }
  if (apparentTemperatureCelsius < 27) {
    return "SAFE";
  }
  if (apparentTemperatureCelsius < 32) {
    return "LOW";
  }
  if (apparentTemperatureCelsius < 41) {
    return "MODERATE";
  }
  if (apparentTemperatureCelsius < 54) {
    return "HIGH";
  }
  return "EXTREME";
}
async function fetchZoneWeather(zoneId, options = {}) {
  if (!zoneId || typeof zoneId !== "string" || !isValidZoneId(zoneId)) {
    throw new ZoneNotFoundError(zoneId || "");
  }
  const zone = getZoneById(zoneId);
  if (!zone) {
    throw new ZoneNotFoundError(zoneId);
  }
  const timeoutMs = options.timeoutMs ?? 6e3;
  const fetchFn = options.customFetch ?? fetch;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${zone.latitude}&longitude=${zone.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,cloud_cover&hourly=temperature_2m,apparent_temperature&forecast_days=2&timezone=auto`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetchFn(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "AquaHeat-Mumbai-Heat-Safety/0.4.0"
      }
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new WeatherProviderTimeoutError(timeoutMs);
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new WeatherProviderError(`Failed to connect to weather provider: ${message}`, 502);
  } finally {
    clearTimeout(timeoutId);
  }
  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new WeatherProviderError(
      `Weather provider returned HTTP ${response.status}: ${errorBody.slice(0, 200)}`,
      502
    );
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new WeatherProviderError("Failed to parse weather provider JSON response", 502);
  }
  if (!payload || typeof payload !== "object" || !("current" in payload)) {
    throw new WeatherProviderError('Weather provider payload missing "current" observation block', 502);
  }
  const current = payload.current;
  if (!current || typeof current !== "object") {
    throw new WeatherProviderError('Invalid "current" observation data from weather provider', 502);
  }
  const temp = typeof current.temperature_2m === "number" ? current.temperature_2m : NaN;
  const apparentTemp = typeof current.apparent_temperature === "number" ? current.apparent_temperature : NaN;
  const humidity = typeof current.relative_humidity_2m === "number" ? current.relative_humidity_2m : NaN;
  const wind = typeof current.wind_speed_10m === "number" ? current.wind_speed_10m : NaN;
  const cloud = typeof current.cloud_cover === "number" ? current.cloud_cover : 0;
  const precip = typeof current.precipitation === "number" ? current.precipitation : 0;
  if (Number.isNaN(temp) || Number.isNaN(apparentTemp) || Number.isNaN(humidity) || Number.isNaN(wind)) {
    throw new WeatherProviderError("Weather provider returned non-numeric telemetry values", 502);
  }
  let timestampStr = (/* @__PURE__ */ new Date()).toISOString();
  if (typeof current.time === "string" && current.time.includes("T")) {
    const candidate = current.time.endsWith("Z") ? current.time : `${current.time}:00.000Z`;
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      timestampStr = candidate;
    }
  }
  const observation = validateWeatherObservation({
    zoneId: zone.id,
    timestamp: timestampStr,
    temperature: temp,
    apparentTemperature: apparentTemp,
    relativeHumidity: humidity,
    windSpeed: wind,
    cloudCover: cloud,
    precipitation: precip,
    solarRadiation: 0
    // Not provided in current basic Open-Meteo endpoint; default 0 non-negative
  });
  const riskLevel = calculateEnvironmentalRiskLevel(observation.apparentTemperature);
  const hourlyForecasts = parseHourlyForecasts(
    payload.hourly,
    typeof current.time === "string" ? current.time : void 0,
    24
  );
  return {
    zoneId: zone.id,
    zoneName: zone.name,
    representativeLocation: zone.representativeLocation,
    coordinates: {
      latitude: zone.latitude,
      longitude: zone.longitude
    },
    observation,
    hourlyForecasts,
    riskLevel,
    futureHeatRiskScore: null,
    // Transparently preserved as null (Phase 5 ML pending)
    modelConfidence: null,
    // Preserved as null
    riskMethod: "Deterministic NOAA/NWS environmental heat categories derived from real-time apparent temperature. Predictive ML risk scores remain pending Phase 5 SageMaker deployment.",
    notes: "Ambient environmental measurement. Individual heat vulnerability varies with physical activity, hydration, shade, and personal health.",
    isPlaceholder: false
  };
}

// backend/functions/weather/index.ts
var CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.CORS_ALLOWED_ORIGIN || "https://aquaheat.mumbai.gov.in",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Cache-Control": "public, max-age=120, stale-while-revalidate=60",
  "X-Content-Type-Options": "nosniff"
};
var handler = async (event = {}) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ""
    };
  }
  const zoneId = event.queryStringParameters?.zoneId?.trim();
  if (!zoneId) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Missing required query parameter "zoneId"',
        allowedZones: getAllZoneIds()
      })
    };
  }
  try {
    const telemetry = await fetchZoneWeather(zoneId);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(telemetry)
    };
  } catch (err) {
    if (err instanceof ZoneNotFoundError) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: err.message,
          zoneId: err.zoneId,
          allowedZones: getAllZoneIds()
        })
      };
    }
    if (err instanceof WeatherProviderTimeoutError) {
      return {
        statusCode: 504,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: err.message
        })
      };
    }
    if (err instanceof WeatherProviderError) {
      return {
        statusCode: err.statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: err.message
        })
      };
    }
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Unexpected server error while processing weather telemetry",
        details: message
      })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
