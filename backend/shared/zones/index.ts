/**
 * AquaHeat — Mumbai Zone Domain Model & Shared Source of Truth
 * Phase 4 Domain Definition
 *
 * Real geographic coordinates representing Greater Mumbai operational sectors:
 * 1. South Mumbai — Colaba
 * 2. Western Suburbs — Andheri
 * 3. Eastern Suburbs — Ghatkopar
 * 4. Central Mumbai — Dadar
 * 5. Harbour — Chembur
 * 6. Northern Mumbai — Borivali
 */

export interface MumbaiZone {
  id: string;
  name: string;
  representativeLocation: string;
  latitude: number;
  longitude: number;
}

export type MumbaiZoneId =
  | 'south-mumbai'
  | 'western-suburbs'
  | 'eastern-suburbs'
  | 'central-mumbai'
  | 'harbour'
  | 'northern-mumbai';

/**
 * Authentic geographic coordinates for Mumbai representative nodes.
 * Verified against IMD and municipal station coordinates:
 * - Colaba (Colaba Observatory node): 18.9067° N, 72.8147° E
 * - Andheri (Western Suburbs transit node): 19.1136° N, 72.8697° E
 * - Ghatkopar (Eastern Suburbs corridor): 19.0860° N, 72.9090° E
 * - Dadar (Central Mumbai interchange): 19.0178° N, 72.8478° E
 * - Chembur (Harbour node): 19.0622° N, 72.8978° E
 * - Borivali (Northern Mumbai gateway): 19.2288° N, 72.8541° E
 */
export const MUMBAI_ZONES: readonly MumbaiZone[] = Object.freeze([
  {
    id: 'south-mumbai',
    name: 'South Mumbai',
    representativeLocation: 'Colaba',
    latitude: 18.9067,
    longitude: 72.8147,
  },
  {
    id: 'western-suburbs',
    name: 'Western Suburbs',
    representativeLocation: 'Andheri',
    latitude: 19.1136,
    longitude: 72.8697,
  },
  {
    id: 'eastern-suburbs',
    name: 'Eastern Suburbs',
    representativeLocation: 'Ghatkopar',
    latitude: 19.0860,
    longitude: 72.9090,
  },
  {
    id: 'central-mumbai',
    name: 'Central Mumbai',
    representativeLocation: 'Dadar',
    latitude: 19.0178,
    longitude: 72.8478,
  },
  {
    id: 'harbour',
    name: 'Harbour',
    representativeLocation: 'Chembur',
    latitude: 19.0622,
    longitude: 72.8978,
  },
  {
    id: 'northern-mumbai',
    name: 'Northern Mumbai',
    representativeLocation: 'Borivali',
    latitude: 19.2288,
    longitude: 72.8541,
  },
]);

/**
 * Get a zone definition by its unique identifier.
 */
export function getZoneById(zoneId: string): MumbaiZone | undefined {
  return MUMBAI_ZONES.find((zone) => zone.id === zoneId);
}

/**
 * Type-guard checking if a string matches a recognized MumbaiZoneId.
 */
export function isValidZoneId(zoneId: string): zoneId is MumbaiZoneId {
  return MUMBAI_ZONES.some((zone) => zone.id === zoneId);
}

/**
 * Retrieve all registered zone IDs.
 */
export function getAllZoneIds(): readonly string[] {
  return MUMBAI_ZONES.map((zone) => zone.id);
}
