import { NextRequest, NextResponse } from 'next/server';
import { MUMBAI_ZONES } from '@/lib/zones';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zoneId = searchParams.get('zoneId')?.trim();

  // If BACKEND_API_URL is configured (e.g. pointing to local SAM on 3001), proxy to it
  const backendBase = process.env.BACKEND_API_URL;
  if (backendBase) {
    try {
      const backendRes = await fetch(
        `${backendBase.replace(/\/$/, '')}/weather?zoneId=${encodeURIComponent(zoneId || '')}`,
        {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        }
      );
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    } catch {
      // Fall through to direct server-side fetch if backend proxy unreachable
    }
  }

  if (!zoneId) {
    return NextResponse.json(
      {
        error: 'Missing required query parameter "zoneId"',
        allowedZones: MUMBAI_ZONES.map((z) => z.id),
      },
      { status: 400 }
    );
  }

  const zone = MUMBAI_ZONES.find((z) => z.id === zoneId);
  if (!zone) {
    return NextResponse.json(
      {
        error: `Unknown zoneId: "${zoneId}"`,
        allowedZones: MUMBAI_ZONES.map((z) => z.id),
      },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${zone.latitude}&longitude=${zone.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,cloud_cover&hourly=temperature_2m,apparent_temperature&forecast_days=2&timezone=auto`;

  try {
    const res = await fetch(openMeteoUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'AquaHeat-Mumbai-Heat-Safety/0.4.0',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Weather provider returned HTTP ${res.status}` },
        { status: 502 }
      );
    }

    const payload = await res.json();
    const current = payload.current;

    if (!current || typeof current !== 'object') {
      return NextResponse.json(
        { error: 'Weather provider returned malformed payload' },
        { status: 502 }
      );
    }

    const temp = Number(current.temperature_2m);
    const apparentTemp = Number(current.apparent_temperature);
    const humidity = Number(current.relative_humidity_2m);
    const wind = Number(current.wind_speed_10m);
    const cloud = Number(current.cloud_cover ?? 0);
    const precip = Number(current.precipitation ?? 0);

    // Calculate deterministic NOAA risk level
    const getRiskLevel = (t: number) => {
      if (Number.isNaN(t)) return 'PENDING';
      if (t < 27) return 'SAFE';
      if (t < 32) return 'LOW';
      if (t < 41) return 'MODERATE';
      if (t < 54) return 'HIGH';
      return 'EXTREME';
    };

    const riskLevel = getRiskLevel(apparentTemp);

    const timestampStr =
      typeof current.time === 'string' && current.time.includes('T')
        ? (current.time.endsWith('Z') ? current.time : `${current.time}:00.000Z`)
        : new Date().toISOString();

    // Parse hourly forecast items
    const hourlyPayload = payload.hourly;
    const hourlyForecasts: Array<{
      timestamp: string;
      temperature: number;
      apparentTemperature: number;
      riskLevel: string;
      futureHeatRiskScore: null;
      isForecast: true;
    }> = [];

    if (
      hourlyPayload &&
      typeof hourlyPayload === 'object' &&
      Array.isArray(hourlyPayload.time) &&
      Array.isArray(hourlyPayload.temperature_2m) &&
      Array.isArray(hourlyPayload.apparent_temperature)
    ) {
      const times = hourlyPayload.time;
      const temps = hourlyPayload.temperature_2m;
      const appTemps = hourlyPayload.apparent_temperature;

      let startIdx = 0;
      if (typeof current.time === 'string') {
        const prefix = current.time.slice(0, 13);
        const idx = times.findIndex((t: unknown) => typeof t === 'string' && t.startsWith(prefix));
        if (idx >= 0) startIdx = idx;
      }

      const limit = Math.min(times.length, startIdx + 24);
      for (let i = startIdx; i < limit; i++) {
        const hTime = times[i];
        const hTemp = temps[i];
        const hAppTemp = appTemps[i];

        if (
          typeof hTime === 'string' &&
          typeof hTemp === 'number' &&
          !Number.isNaN(hTemp) &&
          typeof hAppTemp === 'number' &&
          !Number.isNaN(hAppTemp)
        ) {
          let iso = hTime;
          if (!iso.includes('Z') && !iso.includes('+')) {
            iso = iso.length === 16 ? `${iso}:00+05:30` : `${iso}+05:30`;
          }

          hourlyForecasts.push({
            timestamp: iso,
            temperature: Math.round(hTemp * 10) / 10,
            apparentTemperature: Math.round(hAppTemp * 10) / 10,
            riskLevel: getRiskLevel(hAppTemp),
            futureHeatRiskScore: null,
            isForecast: true,
          });
        }
      }
    }

    return NextResponse.json({
      zoneId: zone.id,
      zoneName: zone.name,
      representativeLocation: zone.representativeLocation,
      coordinates: {
        latitude: zone.latitude,
        longitude: zone.longitude,
      },
      observation: {
        zoneId: zone.id,
        timestamp: timestampStr,
        temperature: temp,
        apparentTemperature: apparentTemp,
        relativeHumidity: humidity,
        windSpeed: wind,
        cloudCover: cloud,
        precipitation: precip,
        solarRadiation: 0,
      },
      hourlyForecasts,
      riskLevel,
      futureHeatRiskScore: null,
      modelConfidence: null,
      riskMethod:
        'Deterministic NOAA/NWS environmental heat categories derived from real-time apparent temperature. Predictive ML risk scores remain pending Phase 5 SageMaker deployment.',
      notes:
        'Ambient environmental measurement. Individual heat vulnerability varies with physical activity, hydration, shade, and personal health.',
      isPlaceholder: false,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Weather provider request timed out' },
        { status: 504 }
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Failed to fetch weather: ${message}` },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
