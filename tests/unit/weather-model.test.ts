import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateWeatherObservation,
  ValidationError,
  type WeatherObservation,
} from '../../backend/shared/models/weather.ts';
import {
  validateHourlyHeatForecast,
  type HourlyHeatForecast,
} from '../../backend/shared/models/forecast.ts';

test('Weather Model — validates complete, valid weather observation', () => {
  const sample: WeatherObservation = {
    zoneId: 'south-mumbai',
    timestamp: '2026-10-08T12:00:00.000Z',
    temperature: 33.5,
    apparentTemperature: 38.2,
    relativeHumidity: 72,
    windSpeed: 14.5,
    cloudCover: 20,
    precipitation: 0.0,
    solarRadiation: 850,
  };

  const validated = validateWeatherObservation(sample);
  assert.deepEqual(validated, sample);
});

test('Weather Model — rejects invalid zoneId', () => {
  const invalid = {
    zoneId: 'pune-central', // Not a Mumbai zone
    timestamp: '2026-10-08T12:00:00.000Z',
    temperature: 33.5,
    apparentTemperature: 38.2,
    relativeHumidity: 72,
    windSpeed: 14.5,
    cloudCover: 20,
    precipitation: 0.0,
    solarRadiation: 850,
  };

  assert.throws(
    () => validateWeatherObservation(invalid),
    (err: unknown) => {
      assert.ok(err instanceof ValidationError);
      assert.equal((err as ValidationError).field, 'zoneId');
      return true;
    }
  );
});

test('Weather Model — rejects invalid or malformed timestamps', () => {
  const invalid = {
    zoneId: 'western-suburbs',
    timestamp: 'not-a-date',
    temperature: 32,
    apparentTemperature: 36,
    relativeHumidity: 65,
    windSpeed: 10,
    cloudCover: 30,
    precipitation: 0,
    solarRadiation: 600,
  };

  assert.throws(
    () => validateWeatherObservation(invalid),
    (err: unknown) => {
      assert.ok(err instanceof ValidationError);
      assert.equal((err as ValidationError).field, 'timestamp');
      return true;
    }
  );
});

test('Weather Model — enforces physical range checks (humidity, temperature, radiation)', () => {
  const baseValid = {
    zoneId: 'central-mumbai',
    timestamp: '2026-10-08T14:00:00.000Z',
    temperature: 34,
    apparentTemperature: 40,
    relativeHumidity: 60,
    windSpeed: 12,
    cloudCover: 15,
    precipitation: 0,
    solarRadiation: 750,
  };

  // Humidity > 100%
  assert.throws(() =>
    validateWeatherObservation({ ...baseValid, relativeHumidity: 105 })
  );

  // Negative humidity
  assert.throws(() =>
    validateWeatherObservation({ ...baseValid, relativeHumidity: -5 })
  );

  // Extreme negative temperature in tropical Mumbai
  assert.throws(() =>
    validateWeatherObservation({ ...baseValid, temperature: -10 })
  );

  // Negative precipitation
  assert.throws(() =>
    validateWeatherObservation({ ...baseValid, precipitation: -1 })
  );

  // Negative solar radiation
  assert.throws(() =>
    validateWeatherObservation({ ...baseValid, solarRadiation: -50 })
  );
});

test('Forecast Model — validates valid hourly forecast without fabricated risk scores', () => {
  const sampleForecast: HourlyHeatForecast = {
    zoneId: 'harbour',
    timestamp: '2026-10-08T15:00:00.000Z',
    predictedTemperature: 34.0,
    predictedApparentTemperature: 39.5,
    weatherFeatures: {
      relativeHumidity: 68,
      windSpeed: 11.2,
      cloudCover: 25,
      solarRadiation: 780,
      precipitation: 0,
    },
    futureHeatRiskScore: null, // Correctly uncalculated
    riskLevel: 'PENDING',
    modelConfidence: null,
  };

  const validated = validateHourlyHeatForecast(sampleForecast);
  assert.equal(validated.zoneId, 'harbour');
  assert.equal(validated.futureHeatRiskScore, null);
  assert.equal(validated.riskLevel, 'PENDING');
  assert.equal(validated.modelConfidence, null);
  assert.equal(validated.predictedTemperature, 34.0);
});

test('Forecast Model — rejects invalid weather features and out-of-range risk scores', () => {
  const base = {
    zoneId: 'eastern-suburbs',
    timestamp: '2026-10-08T16:00:00.000Z',
    predictedTemperature: 33,
    predictedApparentTemperature: 38,
    weatherFeatures: {
      relativeHumidity: 65,
      windSpeed: 10,
      cloudCover: 10,
      solarRadiation: 500,
      precipitation: 0,
    },
    futureHeatRiskScore: null,
    riskLevel: 'PENDING',
    modelConfidence: null,
  };

  // Missing weatherFeatures
  assert.throws(() =>
    validateHourlyHeatForecast({ ...base, weatherFeatures: null })
  );

  // Risk score > 100
  assert.throws(() =>
    validateHourlyHeatForecast({ ...base, futureHeatRiskScore: 120 })
  );

  // Risk score < 0
  assert.throws(() =>
    validateHourlyHeatForecast({ ...base, futureHeatRiskScore: -5 })
  );

  // Model confidence > 1
  assert.throws(() =>
    validateHourlyHeatForecast({ ...base, modelConfidence: 1.5 })
  );
});
