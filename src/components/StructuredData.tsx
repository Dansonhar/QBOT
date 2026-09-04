import { useEffect } from 'react';

interface StructuredDataProps {
  type?: 'organization' | 'product' | 'breadcrumb' | 'faq';
  data?: any;
}

export default function StructuredData({ type = 'organization', data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(getStructuredData(type, data));
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);

  return null;
}

function getStructuredData(type: string, customData?: any) {
  const baseAddress = {
    '@type': 'PostalAddress',
    streetAddress: 'B3-6-13 SOLARIS DUTAMAS JALAN DUTAMAS 1',
    addressLocality: 'Kuala Lumpur',
    addressRegion: 'Wilayah Persekutuan Kuala Lumpur',
    postalCode: '50480',
    addressCountry: 'MY'
  };

  const baseGeo = {
    '@type': 'GeoCoordinates',
    latitude: '3.1677',
    longitude: '101.6640'
  };

  const baseContact = {
    '@type': 'ContactPoint',
    telephone: '+60126909189',
    contactType: 'customer service',
    availableLanguage: ['English', 'Malay'],
    areaServed: 'MY'
  };

  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'LocalBusiness', 'SoftwareCompany'],
        name: 'QBot',
        alternateName: 'QPOS',
        url: 'https://qbot.now',
        logo: 'https://qbot.now/qbotlogo.svg',
        description: 'AI-powered self-service kiosks and business automation solutions for F&B, wellness, gym, and retail industries in Malaysia. Serving businesses nationwide from our Publika KL showroom.',
        address: baseAddress,
        geo: baseGeo,
        telephone: '+60126909189',
        email: 'hello@qbot.now',
        contactPoint: baseContact,
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '10:00',
            closes: '19:00'
          }
        ],
        areaServed: {
          '@type': 'Country',
          name: 'Malaysia'
        },
        sameAs: [
          'https://www.facebook.com/qbotmalaysia',
          'https://www.instagram.com/qbotfuture',
          'https://www.tiktok.com/@qbotfuture'
        ],
        priceRange: '$$',
        paymentAccepted: 'Cash, Credit Card, Debit Card, Mobile Payment',
        currenciesAccepted: 'MYR',
        serviceType: [
          'Self-Service Kiosk Solutions',
          'AI-Powered Business Automation',
          'Point of Sale Systems',
          'Queue Management Systems',
          'Digital Menu Solutions'
        ],
        slogan: 'AI & Self-Service Kiosks for Business Growth',
        foundingLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Tokyo',
            addressCountry: 'Japan'
          }
        }
      };

    case 'product':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: customData?.name || 'QBot Self-Service Kiosk',
        description: customData?.description || 'AI-powered self-service kiosk for business automation',
        brand: {
          '@type': 'Brand',
          name: 'QBot'
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'QBot'
        },
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          price: customData?.price,
          priceCurrency: 'MYR',
          seller: {
            '@type': 'Organization',
            name: 'QPOS'
          },
          areaServed: 'MY'
        },
        image: customData?.image || 'https://qbot.now/selfserivce-icon.jpg',
        category: customData?.category || 'Self-Service Kiosk'
      };

    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: customData?.items?.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        })) || []
      };

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: customData?.faqs?.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        })) || []
      };

    default:
      return {};
  }
}

export function useStructuredData(type: StructuredDataProps['type'], data?: any) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `structured-data-${type}`;
    script.text = JSON.stringify(getStructuredData(type || 'organization', data));
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(`structured-data-${type}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [type, data]);
}
