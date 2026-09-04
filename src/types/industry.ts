export interface Industry {
  id: string;
  name: string;
  benefits: string[];
  categories: BenefitCategory[];
  icon: string;
  image: string;
  imageStatic?: string;
  videoUrl?: string;
}

export type BenefitCategory =
  | 'save-staff-cost'
  | 'increase-upsell'
  | '24-7-access'
  | 'faster-turnover'
  | 'self-checkin'
  | 'membership-loyalty'
  | 'queue-ticketing'
  | 'data-reporting';

export interface BenefitFilter {
  id: BenefitCategory;
  label: string;
}
