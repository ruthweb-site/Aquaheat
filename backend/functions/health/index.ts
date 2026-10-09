/**
 * AquaHeat — Health Check Probe Lambda Function
 * Phase 3 AWS SAM Infrastructure Foundation
 *
 * Simple, reliable liveness/readiness probe for API Gateway
 */

export interface HealthCheckResponse {
  service: string;
  status: string;
}

export interface APIGatewayProxyResult {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

/**
 * Lambda handler for GET /health
 */
export const handler = async (): Promise<APIGatewayProxyResult> => {
  const payload: HealthCheckResponse = {
    service: 'AquaHeat',
    status: 'ok',
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
    body: JSON.stringify(payload),
  };
};
