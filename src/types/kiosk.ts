export interface KioskModel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  perfectFor: string;
  benefits: string[];
  image: string;
}

export type CounterSpace = 'compact' | 'medium' | 'large';
export type CustomerVolume = 'low' | 'medium' | 'high';
export type BusinessNeed = 'ordering' | 'ticketing' | 'checkin' | 'membership';
