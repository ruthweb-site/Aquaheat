/**
 * AquaHeat — Shared Backend Module Exports
 * Phase 4 Domain Model & Data Access Layer
 */

// Zone definitions & helpers
export * from './zones/index.ts';

// Weather & Forecast domain models
export * from './models/weather.ts';
export * from './models/forecast.ts';

// DynamoDB Data Access Layer
export * from './db/keys.ts';
export * from './db/client.ts';
export * from './db/weather-repository.ts';
export * from './db/forecast-repository.ts';

// Weather service & Open-Meteo provider
export * from './services/weather-service.ts';
