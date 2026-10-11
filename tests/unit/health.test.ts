import test from 'node:test';
import assert from 'node:assert/strict';
import { handler } from '../../backend/functions/health/index.ts';

test('AquaHeat Health Check Lambda — returns 200 and service status', async () => {
  const response = await handler();

  // Validate HTTP status
  assert.equal(response.statusCode, 200, 'Expected status code 200');

  // Validate headers
  assert.ok(response.headers, 'Expected headers to be defined');
  assert.equal(
    response.headers!['Content-Type'],
    'application/json',
    'Expected application/json content-type'
  );

  // Validate response payload
  const body = JSON.parse(response.body);
  assert.deepEqual(body, {
    service: 'AquaHeat',
    status: 'ok',
  });
});
