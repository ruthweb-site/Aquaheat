/**
 * AquaHeat — Weather Observation Repository
 * Phase 4 Data Access Layer
 *
 * Encapsulates all persistence logic for weather observation records.
 * Keeps Lambda handlers and application services completely decoupled from raw AWS SDK commands.
 */

import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { validateWeatherObservation, type WeatherObservation } from '../models/weather.ts';
import { buildWeatherKey, resolveTableName } from './keys.ts';
import { getDynamoDBDocumentClient } from './client.ts';

export interface WeatherRecordItem extends WeatherObservation {
  zoneId: string; // DynamoDB Partition Key
  ttl?: number; // Optional Time to Live for historical archival
}

export class WeatherRepository {
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(
    tableName?: string,
    docClient?: DynamoDBDocumentClient
  ) {
    this.tableName =
      tableName ||
      process.env.WEATHER_TABLE_NAME ||
      resolveTableName('AquaHeatWeather');
    this.docClient = docClient || getDynamoDBDocumentClient();
  }

  /**
   * Persists a validated weather observation to DynamoDB.
   */
  async saveObservation(observation: WeatherObservation): Promise<void> {
    const validated = validateWeatherObservation(observation);
    const key = buildWeatherKey(validated.zoneId, validated.timestamp);

    const item: WeatherRecordItem = {
      ...validated,
      zoneId: key.zoneId,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }

  /**
   * Retrieves the most recent weather observation for a specific Mumbai zone.
   * Leverages reverse-sorted query (ScanIndexForward: false, Limit: 1).
   */
  async getLatestObservation(zoneId: string): Promise<WeatherObservation | null> {
    if (!zoneId) {
      throw new Error('zoneId is required');
    }

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'zoneId = :zoneId',
        ExpressionAttributeValues: {
          ':zoneId': zoneId,
        },
        ScanIndexForward: false, // Descending order: newest first
        Limit: 1,
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const item = result.Items[0];
    return validateWeatherObservation(item);
  }

  /**
   * Queries historical observations within a time range for a specific zone.
   *
   * @param zoneId - Mumbai zone ID
   * @param startTime - ISO 8601 inclusive start time
   * @param endTime - ISO 8601 inclusive end time
   */
  async getObservationsByTimeRange(
    zoneId: string,
    startTime: string,
    endTime: string
  ): Promise<WeatherObservation[]> {
    if (!zoneId) throw new Error('zoneId is required');
    if (!startTime) throw new Error('startTime is required');
    if (!endTime) throw new Error('endTime is required');

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression:
          'zoneId = :zoneId AND #ts BETWEEN :startTime AND :endTime',
        ExpressionAttributeNames: {
          '#ts': 'timestamp',
        },
        ExpressionAttributeValues: {
          ':zoneId': zoneId,
          ':startTime': startTime,
          ':endTime': endTime,
        },
        ScanIndexForward: true, // Chronological ascending
      })
    );

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) => validateWeatherObservation(item));
  }

  /**
   * Batch writes multiple weather observations (up to 25 items per DynamoDB limit).
   */
  async batchSaveObservations(observations: WeatherObservation[]): Promise<void> {
    if (!observations || observations.length === 0) {
      return;
    }

    // Chunk into batches of 25 (DynamoDB BatchWriteItem limit)
    const chunkSize = 25;
    for (let i = 0; i < observations.length; i += chunkSize) {
      const chunk = observations.slice(i, i + chunkSize);
      const putRequests = chunk.map((obs) => {
        const validated = validateWeatherObservation(obs);
        const key = buildWeatherKey(validated.zoneId, validated.timestamp);
        const item: WeatherRecordItem = {
          ...validated,
          zoneId: key.zoneId,
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
}
