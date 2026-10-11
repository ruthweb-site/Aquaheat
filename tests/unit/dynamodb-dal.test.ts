import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWeatherKey,
  buildForecastKey,
  resolveTableName,
} from '../../backend/shared/db/keys.ts';
import {
  getDynamoDBDocumentClient,
  resetCachedClient,
} from '../../backend/shared/db/client.ts';
import { WeatherRepository } from '../../backend/shared/db/weather-repository.ts';
import { ForecastRepository } from '../../backend/shared/db/forecast-repository.ts';
import type { WeatherObservation } from '../../backend/shared/models/weather.ts';
import type { HourlyHeatForecast } from '../../backend/shared/models/forecast.ts';

// Helper to create a mock DynamoDB DocumentClient that captures sent commands
function createMockDocClient(mockResponses: Record<string, unknown> = {}) {
  const sentCommands: unknown[] = [];

  const mockClient = {
    sentCommands,
    send: async (command: unknown) => {
      sentCommands.push(command);
      const constructorName = (command as { constructor?: { name?: string } }).constructor?.name;

      if (constructorName && mockResponses[constructorName]) {
        return mockResponses[constructorName];
      }
      return {};
    },
  };

  return mockClient as unknown as import('@aws-sdk/lib-dynamodb').DynamoDBDocumentClient & {
    sentCommands: unknown[];
  };
}

test('DynamoDB DAL — Key Generation & Table Resolution', () => {
  // Weather primary key
  const weatherKey = buildWeatherKey('south-mumbai', '2026-10-08T12:00:00.000Z');
  assert.deepEqual(weatherKey, {
    zoneId: 'south-mumbai',
    timestamp: '2026-10-08T12:00:00.000Z',
  });

  // Forecast primary key
  const forecastKey = buildForecastKey(
    'western-suburbs',
    '2026-10-08T15:00:00.000Z'
  );
  assert.deepEqual(forecastKey, {
    zoneId: 'western-suburbs',
    forecastTimestamp: '2026-10-08T15:00:00.000Z',
  });

  // Table name resolution
  assert.equal(resolveTableName('AquaHeatWeather', 'dev'), 'AquaHeatWeather-dev');
  assert.equal(resolveTableName('AquaHeatForecasts', 'prod'), 'AquaHeatForecasts-prod');

  // Input validation for keys
  assert.throws(() => buildWeatherKey('', '2026-10-08T12:00:00.000Z'));
  assert.throws(() => buildWeatherKey('south-mumbai', ''));
  assert.throws(() => buildForecastKey('', '2026-10-08T15:00:00.000Z'));
  assert.throws(() => buildForecastKey('harbour', ''));
});

test('WeatherRepository — saveObservation writes structured item to DynamoDB', async () => {
  const mockClient = createMockDocClient();
  const repo = new WeatherRepository('AquaHeatWeather-test', mockClient);

  const sample: WeatherObservation = {
    zoneId: 'south-mumbai',
    timestamp: '2026-10-08T13:00:00.000Z',
    temperature: 34.2,
    apparentTemperature: 39.8,
    relativeHumidity: 70,
    windSpeed: 12.0,
    cloudCover: 10,
    precipitation: 0.0,
    solarRadiation: 820,
  };

  await repo.saveObservation(sample);

  assert.equal(mockClient.sentCommands.length, 1);
  const sent = mockClient.sentCommands[0] as {
    input: { TableName: string; Item: Record<string, unknown> };
  };
  assert.equal(sent.input.TableName, 'AquaHeatWeather-test');
  assert.equal(sent.input.Item.zoneId, 'south-mumbai');
  assert.equal(sent.input.Item.timestamp, '2026-10-08T13:00:00.000Z');
  assert.equal(sent.input.Item.temperature, 34.2);
});

test('WeatherRepository — getLatestObservation issues reverse-sorted query with limit 1', async () => {
  const sampleItem = {
    zoneId: 'central-mumbai',
    timestamp: '2026-10-08T14:00:00.000Z',
    temperature: 35.0,
    apparentTemperature: 41.0,
    relativeHumidity: 65,
    windSpeed: 10.0,
    cloudCover: 15,
    precipitation: 0.0,
    solarRadiation: 900,
  };

  const mockClient = createMockDocClient({
    QueryCommand: {
      Items: [sampleItem],
    },
  });

  const repo = new WeatherRepository('AquaHeatWeather-test', mockClient);
  const latest = await repo.getLatestObservation('central-mumbai');

  assert.ok(latest);
  assert.equal(latest!.zoneId, 'central-mumbai');
  assert.equal(latest!.temperature, 35.0);

  const sent = mockClient.sentCommands[0] as {
    input: {
      TableName: string;
      KeyConditionExpression: string;
      ExpressionAttributeValues: Record<string, string>;
      ScanIndexForward: boolean;
      Limit: number;
    };
  };
  assert.equal(sent.input.KeyConditionExpression, 'zoneId = :zoneId');
  assert.equal(sent.input.ExpressionAttributeValues[':zoneId'], 'central-mumbai');
  assert.equal(sent.input.ScanIndexForward, false, 'Should query descending order');
  assert.equal(sent.input.Limit, 1, 'Should request only 1 item');
});

test('WeatherRepository — getObservationsByTimeRange queries between start and end timestamps', async () => {
  const mockClient = createMockDocClient({
    QueryCommand: {
      Items: [],
    },
  });

  const repo = new WeatherRepository('AquaHeatWeather-test', mockClient);
  await repo.getObservationsByTimeRange(
    'harbour',
    '2026-10-08T10:00:00.000Z',
    '2026-10-08T14:00:00.000Z'
  );

  const sent = mockClient.sentCommands[0] as {
    input: {
      KeyConditionExpression: string;
      ExpressionAttributeValues: Record<string, string>;
      ScanIndexForward: boolean;
    };
  };
  assert.ok(sent.input.KeyConditionExpression.includes('zoneId = :zoneId'));
  assert.ok(sent.input.KeyConditionExpression.includes('BETWEEN'));
  assert.equal(sent.input.ExpressionAttributeValues[':zoneId'], 'harbour');
  assert.equal(sent.input.ScanIndexForward, true);
});

test('ForecastRepository — saveForecast writes structured item to DynamoDB', async () => {
  const mockClient = createMockDocClient();
  const repo = new ForecastRepository('AquaHeatForecasts-test', mockClient);

  const sampleForecast: HourlyHeatForecast = {
    zoneId: 'northern-mumbai',
    timestamp: '2026-10-08T16:00:00.000Z',
    predictedTemperature: 33.0,
    predictedApparentTemperature: 38.0,
    weatherFeatures: {
      relativeHumidity: 60,
      windSpeed: 15.0,
      cloudCover: 5,
      solarRadiation: 650,
      precipitation: 0.0,
    },
    futureHeatRiskScore: null,
    riskLevel: 'PENDING',
    modelConfidence: null,
  };

  await repo.saveForecast(sampleForecast);

  assert.equal(mockClient.sentCommands.length, 1);
  const sent = mockClient.sentCommands[0] as {
    input: {
      TableName: string;
      Item: Record<string, unknown>;
    };
  };
  assert.equal(sent.input.TableName, 'AquaHeatForecasts-test');
  assert.equal(sent.input.Item.zoneId, 'northern-mumbai');
  assert.equal(sent.input.Item.forecastTimestamp, '2026-10-08T16:00:00.000Z');
  assert.equal(sent.input.Item.futureHeatRiskScore, null);
});

test('ForecastRepository — getForecastsByTimeRange and getLatestForecastHorizon query by zone and timestamp', async () => {
  const mockClient = createMockDocClient({
    QueryCommand: {
      Items: [],
    },
  });

  const repo = new ForecastRepository('AquaHeatForecasts-test', mockClient);

  // Time range query
  await repo.getForecastsByTimeRange(
    'northern-mumbai',
    '2026-10-08T10:00:00.000Z',
    '2026-10-08T22:00:00.000Z'
  );

  assert.equal(mockClient.sentCommands.length, 1);
  const sentRange = mockClient.sentCommands[0] as {
    input: {
      KeyConditionExpression: string;
      ExpressionAttributeValues: Record<string, string>;
      ScanIndexForward: boolean;
    };
  };
  assert.ok(sentRange.input.KeyConditionExpression.includes('zoneId = :zoneId'));
  assert.ok(sentRange.input.KeyConditionExpression.includes('forecastTimestamp BETWEEN :startTime AND :endTime'));
  assert.equal(sentRange.input.ExpressionAttributeValues[':zoneId'], 'northern-mumbai');
  assert.equal(sentRange.input.ScanIndexForward, true);

  // Latest horizon query
  await repo.getLatestForecastHorizon('western-suburbs', '2026-10-08T12:00:00.000Z', 12);

  assert.equal(mockClient.sentCommands.length, 2);
  const sentHorizon = mockClient.sentCommands[1] as {
    input: {
      KeyConditionExpression: string;
      ExpressionAttributeValues: Record<string, string>;
      ScanIndexForward: boolean;
      Limit: number;
    };
  };
  assert.ok(sentHorizon.input.KeyConditionExpression.includes('zoneId = :zoneId'));
  assert.ok(sentHorizon.input.KeyConditionExpression.includes('forecastTimestamp >= :start'));
  assert.equal(sentHorizon.input.ExpressionAttributeValues[':zoneId'], 'western-suburbs');
  assert.equal(sentHorizon.input.Limit, 12);
});

test('DynamoDB Client — default fallback region is ap-southeast-2 (Sydney)', async () => {
  resetCachedClient();
  const prevRegion = process.env.AWS_REGION;
  delete process.env.AWS_REGION;
  try {
    const client = getDynamoDBDocumentClient();
    const region = await client.config.region();
    assert.equal(region, 'ap-southeast-2');
  } finally {
    if (prevRegion !== undefined) {
      process.env.AWS_REGION = prevRegion;
    }
    resetCachedClient();
  }
});
