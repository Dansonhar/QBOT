export interface Q1StandProduct {
  id: string;
  name: string;
  category: string;
  regularPrice: number;
  salePrice: number;
  description: string;
  longDescription: string[];
  images: string[];
  specs: {
    screen: string;
    processor: string;
    connectivity: string;
    scanner: string;
    posHolder: string;
    speakers: string;
    cabinet: string;
    stand: string;
  };
  dimensions: {
    height: string;
    width: string;
    depth: string;
    weightWithPackaging: string;
    netWeight: string;
  };
  receiptOptions: {
    id: string;
    label: string;
    price: number;
  }[];
  additionalFees: {
    installation: number;
    standee: number;
  };
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  whyChoose: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  modules: string[];
}

export const q1StandProduct: Q1StandProduct = {
  id: 'q1-stand',
  name: 'Q1 Stand',
  category: 'Self-Service',
  regularPrice: 8300,
  salePrice: 8300,
  description: 'Full-height self-service kiosk built to handle peak hours and constant flow. Customers can order, pay, and check in with zero staff needed.',
  longDescription: [
    'Q1 Stand is a full-height self-service kiosk built to handle peak hours and constant flow. Customers can order, pay, and check in with zero staff needed — reducing queues and boosting efficiency instantly.',
    'Sleek, modern, and durable, it\'s perfect for F&B outlets, ticketed venues, clinics, and any space that needs smooth, contactless service.',
    'Professional look. Nonstop performance. The smart way to scale.'
  ],
  images: [
    '/Q_STAND_1.webp',
    '/Q_STAND_2.webp',
    '/Q_STAND_3.webp',
    '/Q_STAND_4.webp',
    '/Q_STAND_5.webp'
  ],
  specs: {
    screen: '21.5 inch capacitive touch screen (1080x1920) RGB, UHD, 69PPI',
    processor: 'RK3568 2+16G Android 11',
    connectivity: 'Wifi and Ethernet',
    scanner: '1D/2D QR scanner',
    posHolder: 'POS holder',
    speakers: '8Ω 5W Dual channel speakers',
    cabinet: 'Cold rolled steel cabinet - White',
    stand: 'Integrated Sexy Stand'
  },
  dimensions: {
    height: '1638 mm',
    width: '396 mm',
    depth: '322 mm',
    weightWithPackaging: '45 Kg',
    netWeight: '40 Kg'
  },
  receiptOptions: [
    { id: 'ereceipt', label: 'eReceipt only', price: 0 },
    { id: 'printer', label: 'Add Printer (+RM600)', price: 600 }
  ],
  additionalFees: {
    installation: 500,
    standee: 500
  },
  features: [
    {
      icon: 'Monitor',
      title: 'The Hardware',
      description: 'Compact, sleek self-service kiosks built for durability and easy placement — designed to fit smoothly into any F&B or beauty setup.'
    },
    {
      icon: 'TrendingUp',
      title: 'Promo Screen',
      description: 'Attract customers with eye-catching offers and upsells before they even touch the screen.'
    },
    {
      icon: 'Smartphone',
      title: 'User-friendly UI',
      description: 'Big buttons, simple interface. Customers browse, customize, and place their orders easily — no staff needed.'
    },
    {
      icon: 'CreditCard',
      title: 'Major Payment Supported',
      description: 'Fast, secure cashless or card payments handled right at the kiosk.'
    },
    {
      icon: 'Monitor',
      title: 'KDS / QDS Integration',
      description: 'Orders go directly to your kitchen or service team, while customers track their order on-screen.'
    },
    {
      icon: 'Brain',
      title: 'AI Dashboard',
      description: 'Manage your menu and promotions anytime on the cloud — plus let AI analyze your sales trends and recommend smart actions to boost profits.'
    },
    {
      icon: 'Globe',
      title: 'Webstore',
      description: 'Seamlessly link your online store with the kiosk, so you manage everything in one system.'
    },
    {
      icon: 'Puzzle',
      title: 'Addon Modules',
      description: 'Easily expand with extra features like appointment system, loyalty programs, digital stamp cards, or marketing tools.'
    },
    {
      icon: 'Sparkles',
      title: 'Custom Ideas',
      description: 'Tell us what you dream of — we\'ll help design and build custom solutions just for your business.'
    }
  ],
  whyChoose: {
    title: 'Why Q Kiosk?',
    items: [
      {
        title: 'Speed up order and payment process.',
        description: 'Seamless ordering process with video menu.'
      },
      {
        title: 'Boost sales with Upselling feature.',
        description: 'No need rely on staff mood anymore.'
      },
      {
        title: 'Reduce Staffing & Operational Costs.',
        description: 'RM299/mth vs RM2,500/mth. Your choice.'
      },
      {
        title: 'Live content update & AI Insights.',
        description: 'You have a new superpower.'
      }
    ]
  },
  modules: [
    'Paperless Receipt',
    'Digital Stampcard',
    'Webstore',
    'Appointment System',
    'Kitchen Display',
    'Queue Display'
  ]
};
