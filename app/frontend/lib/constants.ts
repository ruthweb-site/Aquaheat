import { EmergencyContact, SafetyAdvisory } from '@/types/heat-risk';

export const APP_METADATA = {
  name: 'AquaHeat',
  tagline: 'Predict → Prevent → Respond',
  subtitle: 'Mumbai Heat Safety & Well-being',
  version: '0.3.0',
  status: 'PREVIEW FOUNDATION · LIVE SENSORS AWAITING INGESTION',
} as const;

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    service: 'Medical Ambulance & Emergency',
    phone: '108',
    agency: 'Maharashtra Emergency Medical Services (MEMS)',
    description: 'Free 24x7 ambulance dispatch with trained paramedics for severe heat stroke and medical emergencies.',
    isTollFree: true,
  },
  {
    service: 'BMC Disaster Control Room',
    phone: '1916',
    agency: 'Brihanmumbai Municipal Corporation',
    description: 'Direct civic assistance for drinking water tankers, cooling shelters, and municipal ward alerts.',
    isTollFree: true,
  },
  {
    service: 'National Emergency Helpline',
    phone: '112',
    agency: 'All India Unified Emergency System',
    description: 'Single national emergency support connecting police, ambulance, and disaster rescue teams.',
    isTollFree: true,
  },
  {
    service: 'Heat Support Desk',
    phone: '1077',
    agency: 'District Disaster Management Authority',
    description: 'City heat wave public inquiries, hospital routing, and transit assistance.',
    isTollFree: true,
  },
];

export const SUPPORTIVE_RECOMMENDATIONS: SafetyAdvisory[] = [
  {
    id: 'adv-schedule',
    category: 'GENERAL',
    title: 'Midday Rest & Timing',
    severity: 'INFO',
    description: 'High heat is expected between 1:00 PM and 4:00 PM across Mumbai.',
    bulletPoints: [
      'Consider running essential outdoor errands earlier in the morning or after sunset.',
      'Take regular breaks in naturally shaded, airy, or fan-cooled locations.',
      'Wear loose, light-colored cotton clothing to help your skin breathe freely.',
    ],
  },
  {
    id: 'adv-hydration',
    category: 'HYDRATION',
    title: 'Hydration & Cooling Fluids',
    severity: 'INFO',
    description: 'Keep water with you and hydrate gently throughout your day.',
    bulletPoints: [
      'Sip water frequently — aim for small, regular drinks rather than waiting until you feel thirsty.',
      'Enjoy cooling traditional fluids like fresh coconut water, nimbu pani, chhaas (buttermilk), or kokum sherbet.',
      'Keep a reusable insulated water bottle handy when stepping outside or taking local trains.',
    ],
  },
  {
    id: 'adv-transit',
    category: 'WORKERS',
    title: 'Comfort While Moving or Working',
    severity: 'CAUTION',
    description: 'Supportive guidance for delivery partners, outdoor labor, and commuters.',
    bulletPoints: [
      'Take 10 to 15 minute rest intervals in shaded spots under trees or station canopies.',
      'Carry a small damp cloth or hand towel to gently cool your neck, wrists, and face.',
      'Look out for colleagues and teammates — remind each other to hydrate regularly.',
    ],
  },
  {
    id: 'adv-family',
    category: 'VULNERABLE',
    title: 'Caring for Loved Ones',
    severity: 'INFO',
    description: 'Gentle, thoughtful check-ins for elders, children, and household pets.',
    bulletPoints: [
      'Check in with elderly family members and neighbors during peak afternoon hours.',
      'Ensure infants and young children stay in well-ventilated, shaded rooms with plenty of fluids.',
      'Place a small bowl of fresh drinking water in your balcony or building compound for birds and animals.',
    ],
  },
];

export interface StagedTimelinePoint {
  time: string;
  score: number;
  temp: number;
  feelsLike: number;
  level: 'SAFE' | 'MODERATE' | 'HIGH' | 'EXTREME';
  description: string;
}

export const HOURLY_TIMELINE_PREVIEW: StagedTimelinePoint[] = [
  { time: '11 AM', score: 62, temp: 31, feelsLike: 35, level: 'MODERATE', description: 'Sun intensity rising' },
  { time: '12 PM', score: 72, temp: 33, feelsLike: 38, level: 'MODERATE', description: 'Warm & humid' },
  { time: '1 PM', score: 78, temp: 34, feelsLike: 39, level: 'MODERATE', description: 'Peak afternoon onset' },
  { time: '2 PM', score: 82, temp: 35, feelsLike: 41, level: 'HIGH', description: 'Peak heat window' },
  { time: '3 PM', score: 87, temp: 35, feelsLike: 42, level: 'HIGH', description: 'Peak heat window' },
  { time: '4 PM', score: 85, temp: 34, feelsLike: 40, level: 'HIGH', description: 'Gradual easing' },
  { time: '5 PM', score: 79, temp: 33, feelsLike: 38, level: 'MODERATE', description: 'Afternoon breeze begins' },
  { time: '6 PM', score: 68, temp: 31, feelsLike: 36, level: 'MODERATE', description: 'Cooling evening transition' },
];
