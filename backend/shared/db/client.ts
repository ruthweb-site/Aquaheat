/**
 * AquaHeat — DynamoDB Client Provider
 * Phase 4 Data Access Layer
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let cachedDocClient: DynamoDBDocumentClient | null = null;

/**
 * Returns a singleton or custom DynamoDB DocumentClient with standard marshalling configurations.
 */
export function getDynamoDBDocumentClient(
  customClient?: DynamoDBClient
): DynamoDBDocumentClient {
  if (customClient) {
    return DynamoDBDocumentClient.from(customClient, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
      unmarshallOptions: {
        wrapNumbers: false,
      },
    });
  }

  if (!cachedDocClient) {
    const rawClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'ap-southeast-2', // Default to Sydney AWS region
    });

    cachedDocClient = DynamoDBDocumentClient.from(rawClient, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
      unmarshallOptions: {
        wrapNumbers: false,
      },
    });
  }

  return cachedDocClient;
}

/**
 * Resets cached client (useful for unit testing isolation).
 */
export function resetCachedClient(): void {
  cachedDocClient = null;
}
