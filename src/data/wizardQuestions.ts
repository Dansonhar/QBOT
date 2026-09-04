export interface IndustryWizard {
  id: string;
  name: string;
  headline: string;
  description: string[];
  bestFor: string[];
  image: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'checkbox' | 'radio' | 'text';
  title: string;
  description: string;
  options?: QuestionOption[];
  required?: boolean;
}

export interface QuestionOption {
  value: string;
  label: string;
  benefit?: string;
}

export const industryWizards: IndustryWizard[] = [
  {
    id: 'salon',
    name: 'Salon',
    headline: 'Automate bookings and payments',
    description: [
      'Blow up your upsell revenue with automated package suggestions',
      'Clients book, pick add-ons and pay automatically',
      'Treatment upgrades become effortless'
    ],
    bestFor: ['More upsells', 'Cutting staff cost', '24/7 access'],
    image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose how customers interact',
        required: true,
        options: [
          { value: 'stand', label: 'Stand', benefit: 'Best for walk-ins' },
          { value: 'desktop', label: 'Desktop', benefit: 'Fits reception' }
        ]
      },
      {
        id: 'upsells',
        type: 'radio',
        title: 'Upsells',
        description: 'Boost revenue automatically',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Increase package upgrades' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Convert first-time customers to regulars',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Boost repeat visits' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'How should customers receive receipts?',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'fnb',
    name: 'F&B',
    headline: 'Speed up orders and payments',
    description: [
      'Automate the ordering process and cut wait times',
      'Kitchen display system reduces mistakes',
      'Smart upsells increase basket size automatically'
    ],
    bestFor: ['Faster turnover', 'Higher revenue', 'Less errors'],
    image: 'https://images.pexels.com/photos/4792285/pexels-photo-4792285.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose how customers interact',
        required: true,
        options: [
          { value: 'stand', label: 'Stand', benefit: 'High visibility, attracts walk-ins, increases orders' },
          { value: 'desktop', label: 'Desktop', benefit: 'Space-saving, ideal for counters/walls' }
        ]
      },
      {
        id: 'table_ordering',
        type: 'radio',
        title: 'Table Ordering (Tablet)',
        description: 'Speed up ordering at every table',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Faster turnover, more convenience' },
          { value: 'no', label: 'No', benefit: 'Kiosk only' }
        ]
      },
      {
        id: 'kitchen_display',
        type: 'radio',
        title: 'Kitchen Display System',
        description: 'Send orders instantly to kitchen',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Reduce mistakes, speed up prep' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'upsells',
        type: 'radio',
        title: 'Upsells & Add-ons',
        description: 'Boost revenue automatically',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Smart prompts increase basket size' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty / Digital Stamps',
        description: 'Convert first-time diners to regulars',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Auto rewards increase retention' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'queue_alerts',
        type: 'radio',
        title: 'Queue / Alerts',
        description: 'Notify customer when order is ready',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Smoother flow' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'How should customers receive receipts?',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      },
      {
        id: 'cash_payments',
        type: 'radio',
        title: 'Cash Payments Allowed?',
        description: 'Accept physical currency',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Accept cash + digital' },
          { value: 'no', label: 'No', benefit: 'Digital only' }
        ]
      }
    ]
  },
  {
    id: 'carwash',
    name: 'Carwash',
    headline: 'Automate wash packages and payments',
    description: [
      'Visible kiosks increase premium package upgrades',
      'Reduce queue times with self-service payment',
      'Loyalty programs bring customers back weekly'
    ],
    bestFor: ['Drive-in efficiency', 'Package upsells', 'Repeat customers'],
    image: 'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand', benefit: 'Visible for drive-in lanes' },
          { value: 'desktop', label: 'Desktop', benefit: 'For small areas' }
        ]
      },
      {
        id: 'premium_upsells',
        type: 'radio',
        title: 'Premium Package Upsells',
        description: 'Increase revenue per vehicle',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Increase average ticket' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Encourage repeat visits',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'hotels',
    name: 'Hotels',
    headline: 'Streamline check-in and guest services',
    description: [
      'Self check-in speeds up lobby flow dramatically',
      'Digital room keys reduce front desk workload',
      'Guests appreciate 24/7 automated service'
    ],
    bestFor: ['Fast check-in', 'Reduced staff load', 'Guest satisfaction'],
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'self_checkin',
        type: 'radio',
        title: 'Self Check-in + Payment',
        description: 'Automate guest arrival',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Faster lobby flow' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'room_keys',
        type: 'checkbox',
        title: 'Room Keys',
        description: 'Key card distribution method',
        options: [
          { value: 'printed', label: 'Printed key card' },
          { value: 'digital', label: 'Digital code' },
          { value: 'both', label: 'Both' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Reward returning guests',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'sports',
    name: 'Sports Facilities',
    headline: 'Maximize court hours and memberships',
    description: [
      'Automated booking increases facility utilization',
      'Access control reduces manual check-ins',
      'Package upsells boost revenue per member'
    ],
    bestFor: ['Court bookings', 'Access control', 'Membership growth'],
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'booking_payment',
        type: 'radio',
        title: 'Booking & Payment',
        description: 'Automate reservations',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Maximize court hours' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'access_control',
        type: 'checkbox',
        title: 'Access Control',
        description: 'Control facility entry',
        options: [
          { value: 'face_id', label: 'Face ID', benefit: 'Fastest' },
          { value: 'turnstile', label: 'Turnstile / Access Card' },
          { value: 'wristband', label: 'Wristband' },
          { value: 'none', label: 'Not needed' }
        ]
      },
      {
        id: 'upsells',
        type: 'radio',
        title: 'Upsells',
        description: 'Promote packages and add-ons',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Boost package sales' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Reward regular members',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' },
          { value: 'both', label: 'Both' }
        ]
      }
    ]
  },
  {
    id: 'malls',
    name: 'Malls',
    headline: 'Capture leads and enhance visitor experience',
    description: [
      'Ticketing kiosks reduce queue times',
      'Sign-up stations capture customer data',
      'Loyalty programs drive repeat mall visits'
    ],
    bestFor: ['Lead capture', 'Ticketing', 'Visitor engagement'],
    image: 'https://images.pexels.com/photos/1906437/pexels-photo-1906437.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'ticketing',
        type: 'radio',
        title: 'Ticketing / Sign-ups',
        description: 'Capture visitor information',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Capture more leads' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Reward frequent shoppers',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'coworking',
    name: 'Coworking Spaces',
    headline: 'Automate memberships and room booking',
    description: [
      'Self-service booking reduces admin overhead',
      'Automated payments streamline operations',
      'Members enjoy 24/7 access to facilities'
    ],
    bestFor: ['Membership automation', 'Room booking', 'Reduced admin'],
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'membership_booking',
        type: 'radio',
        title: 'Membership / Room Booking',
        description: 'Automate facility management',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Reduce manual admin' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Reward long-term members',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'parking',
    name: 'Parking',
    headline: 'Automate entry, exit and payment',
    description: [
      'Faster entry and exit reduces congestion',
      'Automated ticketing eliminates manual processes',
      'Digital payments speed up transactions'
    ],
    bestFor: ['Fast throughput', 'Automated ticketing', 'Digital payments'],
    image: 'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'automated_ticketing',
        type: 'radio',
        title: 'Automated Ticketing / Payment',
        description: 'Streamline parking operations',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Faster entry/exit' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'tablet_fnb',
    name: 'Tablet F&B',
    headline: 'Tablet-based ordering for restaurants',
    description: [
      'Tablets at tables speed up ordering',
      'Reduces server workload significantly',
      'Smart upsells increase revenue per table'
    ],
    bestFor: ['Table ordering', 'Less staff', 'Higher spend'],
    image: 'https://images.pexels.com/photos/6347523/pexels-photo-6347523.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'tablet_ordering',
        type: 'radio',
        title: 'Tablet Ordering Only',
        description: 'Enable tablet-based ordering',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'upsells',
        type: 'radio',
        title: 'Upsells',
        description: 'Boost order value',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Reward repeat diners',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'wellness',
    name: 'Wellness',
    headline: 'Automate bookings and package upsells',
    description: [
      'Clients book treatments and pay seamlessly',
      'Package upgrades happen automatically',
      'Reduce staff workload with self-service'
    ],
    bestFor: ['Booking automation', 'Package upsells', 'Client convenience'],
    image: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'booking_payment',
        type: 'radio',
        title: 'Booking & Payment',
        description: 'Automate appointments',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'upsell_packages',
        type: 'radio',
        title: 'Upsell Packages',
        description: 'Increase treatment value',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Reward regular clients',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'clinics',
    name: 'Clinics',
    headline: 'Reduce queue and automate check-in',
    description: [
      'Self check-in reduces reception workload',
      'Automated payments speed up operations',
      'Patients appreciate faster service'
    ],
    bestFor: ['Check-in automation', 'Reduced queue', 'Payment efficiency'],
    image: 'https://images.pexels.com/photos/1250655/pexels-photo-1250655.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'checkin_payment',
        type: 'radio',
        title: 'Check-in & Payment',
        description: 'Automate patient arrival',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Reduce queue' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'gym',
    name: 'Gym',
    headline: 'Automate access and memberships',
    description: [
      'Face ID access eliminates manual check-ins',
      'Automated membership sales reduce staff time',
      'Package upsells increase revenue per member'
    ],
    bestFor: ['Access control', 'Membership sales', 'Package upsells'],
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'booking_payment',
        type: 'radio',
        title: 'Booking & Payment',
        description: 'Automate membership sales',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Maximize revenue' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'access_control',
        type: 'checkbox',
        title: 'Access Control',
        description: 'Control gym entry',
        options: [
          { value: 'face_id', label: 'Face ID', benefit: 'Fastest' },
          { value: 'turnstile', label: 'Turnstile / Access Card' },
          { value: 'wristband', label: 'Wristband' },
          { value: 'none', label: 'Not needed' }
        ]
      },
      {
        id: 'upsells',
        type: 'radio',
        title: 'Upsells',
        description: 'Promote packages',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Boost package sales' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Reward regular members',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' },
          { value: 'both', label: 'Both' }
        ]
      }
    ]
  },
  {
    id: 'education',
    name: 'Education / Academy',
    headline: 'Automate enrollment and payments',
    description: [
      'Self-service enrollment reduces admin time',
      'Automated payment collection improves cash flow',
      'Students enjoy faster onboarding'
    ],
    bestFor: ['Enrollment automation', 'Payment efficiency', 'Fast onboarding'],
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'enrollment_payment',
        type: 'radio',
        title: 'Enrollment & Payment',
        description: 'Automate student onboarding',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Faster onboarding' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'university',
    name: 'University',
    headline: 'Streamline student services',
    description: [
      'Automated ID issuance speeds up enrollment',
      'Event pass distribution becomes effortless',
      'Room booking reduces admin overhead'
    ],
    bestFor: ['Student ID', 'Event passes', 'Room booking'],
    image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'student_services',
        type: 'radio',
        title: 'Student ID / Booking / Event Passes',
        description: 'Automate student services',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'library',
    name: 'Library',
    headline: 'Automate membership and borrowing',
    description: [
      'Self-service membership sign-up',
      'Automated book borrowing and returns',
      'Room booking for study spaces'
    ],
    bestFor: ['Membership', 'Book borrowing', 'Room booking'],
    image: 'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'library_services',
        type: 'radio',
        title: 'Membership / Borrowing / Room Booking',
        description: 'Automate library operations',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'themeparks',
    name: 'Themeparks',
    headline: 'Automate ticketing and wristband top-ups',
    description: [
      'Fast-track ticket sales with self-service',
      'Wristband top-ups reduce queue times',
      'Access control streamlines park entry'
    ],
    bestFor: ['Fast ticketing', 'Wristband top-up', 'Entry control'],
    image: 'https://images.pexels.com/photos/163967/roller-coaster-amusement-park-ride-163967.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'ticketing',
        type: 'radio',
        title: 'Ticketing / Wristband Top-up',
        description: 'Automate park entry and payments',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'access_control',
        type: 'checkbox',
        title: 'Access Control',
        description: 'Control park entry',
        options: [
          { value: 'face_id', label: 'Face ID' },
          { value: 'turnstile', label: 'Turnstile / Access Card' },
          { value: 'wristband', label: 'Wristband' },
          { value: 'none', label: 'Not needed' }
        ]
      },
      {
        id: 'loyalty',
        type: 'radio',
        title: 'Loyalty',
        description: 'Reward repeat visitors',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'cinema',
    name: 'Cinema',
    headline: 'Boost ticket and concession sales',
    description: [
      'Self-ticketing reduces lobby congestion',
      'Combo meal upsells increase concession revenue',
      'Faster service improves customer satisfaction'
    ],
    bestFor: ['Fast ticketing', 'Concession upsells', 'Queue reduction'],
    image: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'ticketing_upsells',
        type: 'radio',
        title: 'Self Ticketing + Combo Upsells',
        description: 'Increase concession sales',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Sell more snacks' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'events',
    name: 'Events',
    headline: 'Streamline check-in and badge printing',
    description: [
      'Automated check-in speeds up event entry',
      'Badge printing reduces registration desk workload',
      'Ticketing kiosks handle last-minute sales'
    ],
    bestFor: ['Fast check-in', 'Badge printing', 'Ticketing'],
    image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'checkin_badge',
        type: 'radio',
        title: 'Check-in / Badge Printing / Ticketing',
        description: 'Automate event operations',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'museum',
    name: 'Museum',
    headline: 'Automate passes and memberships',
    description: [
      'Self-service ticket sales reduce queue times',
      'Membership sign-ups happen seamlessly',
      'Audio guide rentals become automated'
    ],
    bestFor: ['Ticket sales', 'Memberships', 'Audio guides'],
    image: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'passes_membership',
        type: 'radio',
        title: 'Passes / Membership / Audio Guides',
        description: 'Automate visitor services',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'transport',
    name: 'Transport',
    headline: 'Speed up boarding with QR ticketing',
    description: [
      'QR ticketing eliminates paper tickets',
      'Card top-ups happen in seconds',
      'Faster boarding improves passenger experience'
    ],
    bestFor: ['QR ticketing', 'Card top-ups', 'Fast boarding'],
    image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'qr_ticketing',
        type: 'radio',
        title: 'QR Ticketing / Top-ups',
        description: 'Automate fare collection',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Speed boarding' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'property',
    name: 'Property Management',
    headline: 'Automate visitor and resident services',
    description: [
      'Visitor check-in improves building security',
      'Resident booking for facilities',
      'Automated access control reduces manual work'
    ],
    bestFor: ['Visitor check-in', 'Facility booking', 'Access control'],
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'checkin_booking',
        type: 'radio',
        title: 'Visitor / Resident Check-in & Booking',
        description: 'Automate building services',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Improve building flow' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  },
  {
    id: 'loyalty',
    name: 'Loyalty / Rewards',
    headline: 'Grow repeat visits with automated rewards',
    description: [
      'Self-service sign-up captures more members',
      'Point redemption happens instantly',
      'Automated rewards increase customer retention'
    ],
    bestFor: ['Member sign-up', 'Point redemption', 'Retention'],
    image: 'https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&w=800',
    questions: [
      {
        id: 'kiosk_type',
        type: 'radio',
        title: 'Kiosk Type',
        description: 'Choose your setup',
        required: true,
        options: [
          { value: 'stand', label: 'Stand' },
          { value: 'desktop', label: 'Desktop' }
        ]
      },
      {
        id: 'signup_redemption',
        type: 'radio',
        title: 'Sign-up & Redemption',
        description: 'Automate loyalty program',
        options: [
          { value: 'yes', label: 'Yes', benefit: 'Grow repeat visits' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'receipt_type',
        type: 'checkbox',
        title: 'Receipt Type',
        description: 'Receipt delivery method',
        options: [
          { value: 'printed', label: 'Printed' },
          { value: 'e-receipt', label: 'E-receipt' }
        ]
      }
    ]
  }
];

export const countryCodes = [
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+1', country: 'CA', name: 'Canada' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+61', country: 'AU', name: 'Australia' },
  { code: '+65', country: 'SG', name: 'Singapore' },
  { code: '+60', country: 'MY', name: 'Malaysia' },
  { code: '+86', country: 'CN', name: 'China' },
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+81', country: 'JP', name: 'Japan' },
  { code: '+82', country: 'KR', name: 'South Korea' },
  { code: '+852', country: 'HK', name: 'Hong Kong' },
  { code: '+886', country: 'TW', name: 'Taiwan' },
  { code: '+63', country: 'PH', name: 'Philippines' },
  { code: '+66', country: 'TH', name: 'Thailand' },
  { code: '+62', country: 'ID', name: 'Indonesia' },
  { code: '+84', country: 'VN', name: 'Vietnam' },
  { code: '+971', country: 'AE', name: 'United Arab Emirates' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+33', country: 'FR', name: 'France' },
  { code: '+39', country: 'IT', name: 'Italy' },
  { code: '+34', country: 'ES', name: 'Spain' },
  { code: '+31', country: 'NL', name: 'Netherlands' },
  { code: '+41', country: 'CH', name: 'Switzerland' },
  { code: '+46', country: 'SE', name: 'Sweden' },
  { code: '+47', country: 'NO', name: 'Norway' },
  { code: '+45', country: 'DK', name: 'Denmark' },
  { code: '+358', country: 'FI', name: 'Finland' },
  { code: '+64', country: 'NZ', name: 'New Zealand' }
];
