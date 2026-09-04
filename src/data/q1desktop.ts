export interface Q1DesktopProduct {
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

export const q1DesktopProduct: Q1DesktopProduct = {
  id: 'q1-desktop',
  name: 'Q1 Desktop',
  category: 'Self-Service',
  regularPrice: 7800,
  salePrice: 7800,
  description: 'Your compact self-service powerhouse — perfect for counters, tabletops, and tight spaces.',
  longDescription: [
    'Q1 Desktop is your compact self-service powerhouse — perfect for counters, tabletops, and tight spaces. Customers can browse, order, and pay all on their own, reducing staff load and speeding up service.',
    'Sleek, space-saving, and loaded with features, it\'s ideal for cafés, kiosks, salons, and retail counters that want automation without bulk.',
    'Plug it in. Start serving. Let Q1 do the work.'
  ],
  images: [
    '/QBOT_DEKSTOP_1.webp',
    '/QBOT_DEKSTOP_2.webp',
    '/QBOT_DEKSTOP_4.webp',
    '/QBOT_DEKSTOP_5.webp',
    '/QBOT_DEKSTOP_6.webp'
  ],
  specs: {
    screen: '21.5 inch capacitive touch screen (1080x1920) RGB, UHD, 69PPI',
    processor: 'RK3568 2+16G Android 11',
    connectivity: 'Wifi and Ethernet',
    scanner: '1D/2D QR scanner',
    posHolder: 'POS holder',
    speakers: '8Ω 5W Dual channel speakers',
    cabinet: 'Cold rolled steel cabinet - White',
    stand: 'Compact without stand'
  },
  dimensions: {
    height: '679.8 mm',
    width: '305.0 mm',
    depth: '194.0 mm',
    weightWithPackaging: '45 Kg',
    netWeight: '40 Kg'
  },
  receiptOptions: [
    { id: 'ereceipt', label: 'eReceipt only', price: 0 },
    { id: 'printer', label: 'Add Printer (+RM600)', price: 600 }
  ],
  additionalFees: {
    installation: 300,
    standee: 0
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
    'Queue Display',
    'and more'
  ]
};
