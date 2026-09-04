export interface Q1DuoProduct {
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

export const q1DuoProduct: Q1DuoProduct = {
  id: 'q1-duo',
  name: 'Q1 Duo',
  category: 'Self-Service',
  regularPrice: 10800,
  salePrice: 10800,
  description: 'Our most innovative system yet — dual touchscreens for customers and staff.',
  longDescription: [
    'Our most innovative system yet — the Q1 Duo features dual touchscreens: one for customers, one for staff. It combines self-service convenience with instant cashier support, all in a single compact counter setup.',
    'Customers order and pay as usual. If assistance is needed, staff can instantly take over from the back screen — no walking around, no disruptions. It\'s self-service and POS, perfectly integrated.'
  ],
  images: [
    '/qduo-v2.webp',
    '/QDuo2.webp',
    '/QDuo5.webp',
    '/QDuo1.webp'
  ],
  specs: {
    screen: 'Dual 15.6 inch capacitive touch screens (1080x1920) RGB, FHD',
    processor: 'RK3568 2+16G Android 11',
    connectivity: 'Wifi and Ethernet',
    scanner: '1D/2D QR scanner',
    posHolder: 'POS holder',
    speakers: '8Ω 5W Dual channel speakers',
    cabinet: 'Cold rolled steel cabinet - White',
    stand: 'Dual-Screen Desktop Stand'
  },
  dimensions: {
    height: '678 mm',
    width: '355 mm',
    depth: '255 mm',
    weightWithPackaging: '15 Kg',
    netWeight: '12 Kg'
  },
  receiptOptions: [
    { id: 'ereceipt', label: 'eReceipt only', price: 0 },
    { id: 'printer', label: 'Add Printer (+RM600)', price: 600 }
  ],
  additionalFees: {
    installation: 400,
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
    'Queue Display'
  ]
};
