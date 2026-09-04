export interface Module {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'ordering' | 'operations' | 'loyalty' | 'booking';
}

export type ModuleCategory = 'all' | 'ordering' | 'operations' | 'loyalty' | 'booking';
