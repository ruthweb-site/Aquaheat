/**
 * AquaHeat — Real Weather Observation & Risk Telemetry Lambda Handler
 * Phase 4 API Endpoint: GET /weather?zoneId={zoneId}
 */

import {
  fetchZoneWeather,
  ZoneNotFoundError,
  WeatherProviderError,
  WeatherProviderTimeoutError,
} from '../../shared/services/weather-service';
import { getAllZoneIds } from '../../shared/zones/index';

export interface APIGatewayProxyEvent {
  httpMethod?: string;
  queryStringParameters?: Record<string, string | undefined> | null;
  headers?: Record<string, string | undefined>;
}

export interface APIGatewayProxyResult {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const CORS_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': process.env.CORS_ALLOWED_ORIGIN || 'https://aquaheat.mumbai.gov.in',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Cache-Control': 'public, max-age=120, stale-while-revalidate=60',
  'X-Content-Type-Options': 'nosniff',
};

export const handler = async (
  event: APIGatewayProxyEvent = {}
): Promise<APIGatewayProxyResult> => {
  // Handle CORS OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  const zoneId = event.queryStringParameters?.zoneId?.trim();

  if (!zoneId) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Missing required query parameter "zoneId"',
        allowedZones: getAllZoneIds(),
      }),
    };
  }

  try {
    const telemetry = await fetchZoneWeather(zoneId);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(telemetry),
    };
  } catch (err: unknown) {
    if (err instanceof ZoneNotFoundError) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: err.message,
          zoneId: err.zoneId,
          allowedZones: getAllZoneIds(),
        }),
      };
    }

    if (err instanceof WeatherProviderTimeoutError) {
      return {
        statusCode: 504,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: err.message,
        }),
      };
    }

    if (err instanceof WeatherProviderError) {
      return {
        statusCode: err.statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: err.message,
        }),
      };
    }

    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Unexpected server error while processing weather telemetry',
        details: message,
      }),
    };
  }
};
