/**
 * AquaHeat — Hourly Heat Forecast Repository
 * Phase 4 Data Access Layer
 *
 * Encapsulates persistence and query operations for projected hourly heat forecast horizons.
 */

import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  validateHourlyHeatForecast,
  type HourlyHeatForecast,
} from '../models/forecast.ts';
import { buildForecastKey, resolveTableName } from './keys.ts';
import { getDynamoDBDocumentClient } from './client.ts';

export interface ForecastRecordItem extends HourlyHeatForecast {
  zoneId: string; // DynamoDB Partition Key
  forecastTimestamp: string; // DynamoDB Sort Key
  ttl?: number;
}

export class ForecastRepository {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(
    tableName?: string,
    docClient?: DynamoDBDocumentClient
  ) {
    this.tableName =
      tableName ||
      process.env.FORECASTS_TABLE_NAME ||
      resolveTableName('AquaHeatForecasts');
    this.docClient = docClient || getDynamoDBDocumentClient();
  }

  /**
   * Persists a single validated hourly forecast.
   */
  async saveForecast(forecast: HourlyHeatForecast): Promise<void> {
    const validated = validateHourlyHeatForecast(forecast);
    const key = buildForecastKey(validated.zoneId, validated.timestamp);

    const item: ForecastRecordItem = {
      ...validated,
      zoneId: key.zoneId,
      forecastTimestamp: key.forecastTimestamp,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }

  /**
   * Persists a batch of hourly forecasts (e.g. 24-hour prediction trajectory).
   */
  async saveForecastBatch(forecasts: HourlyHeatForecast[]): Promise<void> {
    if (!forecasts || forecasts.length === 0) {
      return;
    }

    const chunkSize = 25;
    for (let i = 0; i < forecasts.length; i += chunkSize) {
      const chunk = forecasts.slice(i, i + chunkSize);
      const putRequests = chunk.map((fc) => {
        const validated = validateHourlyHeatForecast(fc);
        const key = buildForecastKey(validated.zoneId, validated.timestamp);
        const item: ForecastRecordItem = {
          ...validated,
          zoneId: key.zoneId,
          forecastTimestamp: key.forecastTimestamp,
        };
        return {
          PutRequest: {
            Item: item,
          },
        };
      });

      await this.docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [this.tableName]: putRequests,
          },
        })
      );
    }
  }

  /**
   * Queries forecast points for a zone across a specified time window.
   */
  async getForecastsByTimeRange(
    zoneId: string,
    startTime: string,
    endTime: string
  ): Promise<HourlyHeatForecast[]> {
    if (!zoneId) throw new Error('zoneId is required');
    if (!startTime) throw new Error('startTime is required');
    if (!endTime) throw new Error('endTime is required');

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression:
          'zoneId = :zoneId AND forecastTimestamp BETWEEN :startTime AND :endTime',
        ExpressionAttributeValues: {
          ':zoneId': zoneId,
          ':startTime': startTime,
          ':endTime': endTime,
        },
        ScanIndexForward: true, // Chronological
      })
    );

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) => validateHourlyHeatForecast(item));
  }

  /**
   * Retrieves the upcoming forecast horizon for a zone (e.g. next 24 hours from a reference time).
   */
  async getLatestForecastHorizon(
    zoneId: string,
    fromTime?: string,
    limit: number = 24
  ): Promise<HourlyHeatForecast[]> {
    if (!zoneId) throw new Error('zoneId is required');
    const start = fromTime || new Date().toISOString();

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression:
          'zoneId = :zoneId AND forecastTimestamp >= :start',
        ExpressionAttributeValues: {
          ':zoneId': zoneId,
          ':start': start,
        },
        ScanIndexForward: true,
        Limit: limit,
      })
    );

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) => validateHourlyHeatForecast(item));
  }
}
