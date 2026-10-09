import { MumbaiZone } from '@/types/zone';

/**
 * AquaHeat — Mumbai Zone Configuration
 * 6 Key Operational Zones covering the Greater Mumbai region
 */
export const MUMBAI_ZONES: readonly MumbaiZone[] = [
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
] as const;

export const DEFAULT_SELECTED_ZONE: MumbaiZone = MUMBAI_ZONES[0];
