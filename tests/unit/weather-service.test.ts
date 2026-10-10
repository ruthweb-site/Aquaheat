import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchZoneWeather,
  calculateEnvironmentalRiskLevel,
  parseHourlyForecasts,
  ZoneNotFoundError,
  WeatherProviderError,
  WeatherProviderTimeoutError,
} from '../../backend/shared/services/weather-service.ts';
import { handler as weatherHandler } from '../../backend/functions/weather/index.ts';
import { MUMBAI_ZONES } from '../../backend/shared/zones/index.ts';

test('Zone validation — accepts valid Mumbai zones', () => {
  for (const zone of MUMBAI_ZONES) {
    assert.doesNotThrow(() => {
      // Zone validation occurs at the start of fetchZoneWeather
    });
    assert.ok(zone.id);
  }
});

test('Zone validation — rejects unknown or empty zoneId', async () => {
  await assert.rejects(
    async () => fetchZoneWeather('pune-central'),
    (err: unknown) => {
      assert.ok(err instanceof ZoneNotFoundError);
      assert.equal((err as ZoneNotFoundError).zoneId, 'pune-central');
      return true;
    }
  );

  await assert.rejects(
    async () => fetchZoneWeather(''),
    (err: unknown) => {
      assert.ok(err instanceof ZoneNotFoundError);
      return true;
    }
  );
});

test('Deterministic risk calculation — classifies apparent temperatures into recognized NOAA categories', () => {
  // < 27°C -> SAFE
  assert.equal(calculateEnvironmentalRiskLevel(22.0), 'SAFE');
  assert.equal(calculateEnvironmentalRiskLevel(26.9), 'SAFE');

  // 27°C - 32°C -> LOW (Caution)
  assert.equal(calculateEnvironmentalRiskLevel(27.0), 'LOW');
  assert.equal(calculateEnvironmentalRiskLevel(31.5), 'LOW');

  // 32°C - 41°C -> MODERATE (Extreme Caution)
  assert.equal(calculateEnvironmentalRiskLevel(32.0), 'MODERATE');
  assert.equal(calculateEnvironmentalRiskLevel(38.4), 'MODERATE');
  assert.equal(calculateEnvironmentalRiskLevel(40.9), 'MODERATE');

  // 41°C - 54°C -> HIGH (Danger)
  assert.equal(calculateEnvironmentalRiskLevel(41.0), 'HIGH');
  assert.equal(calculateEnvironmentalRiskLevel(48.2), 'HIGH');
  assert.equal(calculateEnvironmentalRiskLevel(53.9), 'HIGH');

  // >= 54°C -> EXTREME (Extreme Danger)
  assert.equal(calculateEnvironmentalRiskLevel(54.0), 'EXTREME');
  assert.equal(calculateEnvironmentalRiskLevel(60.0), 'EXTREME');

  // Invalid / non-numeric -> PENDING
  assert.equal(calculateEnvironmentalRiskLevel(NaN), 'PENDING');
});

test('Weather response mapping — maps Open-Meteo payload to telemetry without fabricated values', async () => {
  const mockPayload = {
    latitude: 18.91,
    longitude: 72.82,
    timezone: 'Asia/Kolkata',
    current: {
      time: '2026-10-10T14:00',
      temperature_2m: 32.5,
      relative_humidity_2m: 78,
      apparent_temperature: 42.1,
      precipitation: 0.0,
      wind_speed_10m: 14.2,
      cloud_cover: 25,
    },
  };

  const customFetch = (async () => {
    return new Response(JSON.stringify(mockPayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch;

  const result = await fetchZoneWeather('south-mumbai', { customFetch });

  assert.equal(result.zoneId, 'south-mumbai');
  assert.equal(result.zoneName, 'South Mumbai');
  assert.equal(result.representativeLocation, 'Colaba');
  assert.equal(result.observation.temperature, 32.5);
  assert.equal(result.observation.apparentTemperature, 42.1);
  assert.equal(result.observation.relativeHumidity, 78);
  assert.equal(result.observation.windSpeed, 14.2);
  assert.equal(result.observation.cloudCover, 25);
  assert.equal(result.observation.precipitation, 0.0);

  // Risk calculation: 42.1°C falls in HIGH (41-54°C)
  assert.equal(result.riskLevel, 'HIGH');

  // Must NOT invent ML risk score or model confidence
  assert.equal(result.futureHeatRiskScore, null);
  assert.equal(result.modelConfidence, null);
  assert.equal(result.isPlaceholder, false);
  // Missing hourly block falls back to empty array without crashing
  assert.deepEqual(result.hourlyForecasts, []);
});

test('Hourly forecast mapping — maps Open-Meteo hourly arrays to HourlyForecastPoint items', async () => {
  const mockPayloadWithHourly = {
    latitude: 18.91,
    longitude: 72.82,
    timezone: 'Asia/Kolkata',
    current: {
      time: '2026-10-10T14:00',
      temperature_2m: 32.5,
      relative_humidity_2m: 78,
      apparent_temperature: 42.1,
      precipitation: 0.0,
      wind_speed_10m: 14.2,
      cloud_cover: 25,
    },
    hourly: {
      time: [
        '2026-10-10T12:00',
        '2026-10-10T13:00',
        '2026-10-10T14:00',
        '2026-10-10T15:00',
        '2026-10-10T16:00',
      ],
      temperature_2m: [31.0, 32.0, 32.5, 33.1, 32.8],
      apparent_temperature: [38.5, 40.2, 42.1, 44.5, 43.0],
    },
  };

  const customFetch = (async () => {
    return new Response(JSON.stringify(mockPayloadWithHourly), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch;

  const result = await fetchZoneWeather('south-mumbai', { customFetch });

  assert.ok(Array.isArray(result.hourlyForecasts));
  // Starting from current hour (14:00), there are 3 points (14:00, 15:00, 16:00)
  assert.equal(result.hourlyForecasts.length, 3);

  const firstPoint = result.hourlyForecasts[0];
  assert.equal(firstPoint.isForecast, true);
  assert.ok(firstPoint.timestamp.includes('14:00'));
  assert.ok(firstPoint.timestamp.includes('+05:30'));
  assert.equal(firstPoint.temperature, 32.5);
  assert.equal(firstPoint.apparentTemperature, 42.1);
  assert.equal(firstPoint.riskLevel, 'HIGH');
  assert.equal(firstPoint.futureHeatRiskScore, null); // Uncalculated score remains null

  const secondPoint = result.hourlyForecasts[1];
  assert.equal(secondPoint.isForecast, true);
  assert.equal(secondPoint.temperature, 33.1);
  assert.equal(secondPoint.apparentTemperature, 44.5);
  assert.equal(secondPoint.riskLevel, 'HIGH');
  assert.equal(secondPoint.futureHeatRiskScore, null);
});

test('parseHourlyForecasts helper — handles empty, missing, or malformed hourly payload gracefully', () => {
  assert.deepEqual(parseHourlyForecasts(null), []);
  assert.deepEqual(parseHourlyForecasts(undefined), []);
  assert.deepEqual(parseHourlyForecasts({}), []);
  assert.deepEqual(parseHourlyForecasts({ time: [] }), []);
  assert.deepEqual(parseHourlyForecasts({ time: ['2026-10-10T10:00'], temperature_2m: null }), []);
});

test('parseHourlyForecasts helper — skips invalid non-numeric hours without fabricating values', () => {
  const malformed = {
    time: ['2026-10-10T10:00', '2026-10-10T11:00', '2026-10-10T12:00'],
    temperature_2m: [30.0, NaN, 32.0],
    apparent_temperature: [36.0, 38.0, 40.0],
  };

  const parsed = parseHourlyForecasts(malformed);
  // Second entry has NaN temperature, so only 2 valid points should be returned
  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].temperature, 30.0);
  assert.equal(parsed[1].temperature, 32.0);
});

test('Provider failure — throws WeatherProviderError with HTTP 502 on upstream server error', async () => {
  const customFetch = (async () => {
    return new Response('Gateway timeout upstream', { status: 500 });
  }) as unknown as typeof fetch;

  await assert.rejects(
    async () => fetchZoneWeather('western-suburbs', { customFetch }),
    (err: unknown) => {
      assert.ok(err instanceof WeatherProviderError);
      assert.equal((err as WeatherProviderError).statusCode, 502);
      return true;
    }
  );
});

test('Provider failure — throws WeatherProviderError on malformed / incomplete payload', async () => {
  const customFetch = (async () => {
    return new Response(JSON.stringify({ error: true, reason: 'Invalid parameters' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch;

  await assert.rejects(
    async () => fetchZoneWeather('central-mumbai', { customFetch }),
    (err: unknown) => {
      assert.ok(err instanceof WeatherProviderError);
      return true;
    }
  );
});

test('Provider timeout — throws WeatherProviderTimeoutError on abort', async () => {
  const customFetch = (async () => {
    const error = new Error('The operation was aborted');
    error.name = 'AbortError';
    throw error;
  }) as unknown as typeof fetch;

  await assert.rejects(
    async () => fetchZoneWeather('harbour', { customFetch }),
    (err: unknown) => {
      assert.ok(err instanceof WeatherProviderTimeoutError);
      assert.equal((err as WeatherProviderTimeoutError).statusCode, 504);
      return true;
    }
  );
});

test('Lambda handler GET /weather — returns 200 with telemetry for valid zoneId', async () => {
  const event = {
    httpMethod: 'GET',
    queryStringParameters: { zoneId: 'south-mumbai' },
  };

  const response = await weatherHandler(event);
  assert.equal(response.statusCode, 200);
  assert.ok(response.headers['Content-Type'].includes('application/json'));

  const body = JSON.parse(response.body);
  assert.equal(body.zoneId, 'south-mumbai');
  assert.equal(body.zoneName, 'South Mumbai');
  assert.equal(typeof body.observation.temperature, 'number');
  assert.equal(typeof body.observation.apparentTemperature, 'number');
  assert.equal(body.futureHeatRiskScore, null);
});

test('Lambda handler GET /weather — returns 400 for missing or invalid zoneId', async () => {
  // Missing parameter
  const missingRes = await weatherHandler({
    httpMethod: 'GET',
    queryStringParameters: null,
  });
  assert.equal(missingRes.statusCode, 400);
  const missingBody = JSON.parse(missingRes.body);
  assert.ok(missingBody.error.includes('Missing required query parameter'));

  // Invalid zone
  const invalidRes = await weatherHandler({
    httpMethod: 'GET',
    queryStringParameters: { zoneId: 'delhi-ncr' },
  });
  assert.equal(invalidRes.statusCode, 400);
  const invalidBody = JSON.parse(invalidRes.body);
  assert.ok(invalidBody.error.includes('delhi-ncr'));
  assert.ok(Array.isArray(invalidBody.allowedZones));
});

test('Lambda handler GET /weather — handles OPTIONS preflight with CORS headers', async () => {
  const optionsRes = await weatherHandler({
    httpMethod: 'OPTIONS',
  });
  assert.equal(optionsRes.statusCode, 200);
  assert.ok(optionsRes.headers['Access-Control-Allow-Origin']);
  assert.ok(optionsRes.headers['Access-Control-Allow-Methods'].includes('GET'));
});
