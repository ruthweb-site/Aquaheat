import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MUMBAI_ZONES,
  getZoneById,
  isValidZoneId,
  getAllZoneIds,
} from '../../backend/shared/zones/index.ts';

test('Mumbai Zones — defines exactly the six designated operational zones', () => {
  assert.equal(MUMBAI_ZONES.length, 6, 'Should define exactly 6 Mumbai zones');

  const expectedZones = [
    { id: 'south-mumbai', name: 'South Mumbai', location: 'Colaba' },
    { id: 'western-suburbs', name: 'Western Suburbs', location: 'Andheri' },
    { id: 'eastern-suburbs', name: 'Eastern Suburbs', location: 'Ghatkopar' },
    { id: 'central-mumbai', name: 'Central Mumbai', location: 'Dadar' },
    { id: 'harbour', name: 'Harbour', location: 'Chembur' },
    { id: 'northern-mumbai', name: 'Northern Mumbai', location: 'Borivali' },
  ];

  for (const expected of expectedZones) {
    const zone = MUMBAI_ZONES.find((z) => z.id === expected.id);
    assert.ok(zone, `Zone "${expected.id}" should exist in MUMBAI_ZONES`);
    assert.equal(zone.name, expected.name, `Zone name mismatch for ${expected.id}`);
    assert.equal(
      zone.representativeLocation,
      expected.location,
      `Representative location mismatch for ${expected.id}`
    );
  }
});

test('Mumbai Zones — coordinates are real and within Greater Mumbai geographic bounds', () => {
  // Mumbai metropolitan region bounding coordinates:
  // Latitude: ~18.89° N to ~19.30° N
  // Longitude: ~72.75° E to ~73.05° E
  const MUMBAI_LAT_MIN = 18.85;
  const MUMBAI_LAT_MAX = 19.35;
  const MUMBAI_LNG_MIN = 72.75;
  const MUMBAI_LNG_MAX = 73.05;

  for (const zone of MUMBAI_ZONES) {
    assert.ok(
      typeof zone.latitude === 'number' && !Number.isNaN(zone.latitude),
      `Latitude must be a valid number for ${zone.id}`
    );
    assert.ok(
      typeof zone.longitude === 'number' && !Number.isNaN(zone.longitude),
      `Longitude must be a valid number for ${zone.id}`
    );

    assert.ok(
      zone.latitude >= MUMBAI_LAT_MIN && zone.latitude <= MUMBAI_LAT_MAX,
      `Latitude ${zone.latitude} for ${zone.id} is outside Mumbai bounds (${MUMBAI_LAT_MIN} - ${MUMBAI_LAT_MAX})`
    );

    assert.ok(
      zone.longitude >= MUMBAI_LNG_MIN && zone.longitude <= MUMBAI_LNG_MAX,
      `Longitude ${zone.longitude} for ${zone.id} is outside Mumbai bounds (${MUMBAI_LNG_MIN} - ${MUMBAI_LNG_MAX})`
    );
  }
});

test('Mumbai Zones — helper functions (getZoneById, isValidZoneId, getAllZoneIds)', () => {
  // getZoneById
  const colaba = getZoneById('south-mumbai');
  assert.ok(colaba);
  assert.equal(colaba.representativeLocation, 'Colaba');

  const invalid = getZoneById('non-existent-zone');
  assert.equal(invalid, undefined);

  // isValidZoneId
  assert.equal(isValidZoneId('western-suburbs'), true);
  assert.equal(isValidZoneId('harbour'), true);
  assert.equal(isValidZoneId('random-zone'), false);
  assert.equal(isValidZoneId(''), false);

  // getAllZoneIds
  const allIds = getAllZoneIds();
  assert.equal(allIds.length, 6);
  assert.ok(allIds.includes('south-mumbai'));
  assert.ok(allIds.includes('northern-mumbai'));
});
