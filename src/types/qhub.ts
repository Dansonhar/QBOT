export interface QHubFeature {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface AIQuestion {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface ControlCard {
  title: string;
  description: string;
  image: string;
}

export interface IndustryCard {
  name: string;
  icon: string;
}
