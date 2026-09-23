import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const viewport: Viewport = {
  themeColor: '#0B1F3A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://anonymousclassdoubtssgsits.vercel.app'),
  title: {
    default: 'Anonymous Class Doubts SGSITS — Real-Time Classroom Doubt Platform | SGSITS Indore',
    template: '%s | Anonymous Class Doubts SGSITS',
  },
  description:
    'Anonymous Class Doubts SGSITS is the official real-time anonymous student doubt & question platform for Shri G. S. Institute of Technology and Science (SGSITS Indore), Department of Information Technology. Ask doubts freely in class without hesitation.',
  keywords: [
    'Anonymous Class Doubts SGSITS',
    'anonymous class doubts sgsits',
    'SGSITS Indore',
    'SGSITS doubts',
    'anonymous doubts SGSITS',
    'SGSITS IT Department',
    'Shri G S Institute of Technology and Science',
    'SGSITS classroom questions',
    'SGSITS Indore engineering',
    'SGSITS college doubts portal',
    'realtime student doubts SGSITS',
    'SGSITS 2nd Year IT Section B',
    'Object Oriented Programming SGSITS',
    'SGSITS doubt discussion forum',
    'anonymous classroom communication',
  ],
  authors: [
    { name: 'Department of Information Technology, SGSITS Indore', url: 'https://www.sgsits.ac.in' },
  ],
  creator: 'SGSITS Indore IT Department',
  publisher: 'Shri G. S. Institute of Technology and Science, Indore',
  applicationName: 'Anonymous Class Doubts SGSITS',
  category: 'Education & Academic Technology',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Anonymous Class Doubts SGSITS — Real-Time Classroom Doubt Platform',
    description:
      'Ask classroom doubts anonymously during lectures at SGSITS Indore without hesitation. Real-time questions and collaborative peer learning for students.',
    url: 'https://anonymousclassdoubtssgsits.vercel.app',
    siteName: 'Anonymous Class Doubts SGSITS',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anonymous Class Doubts SGSITS — Real-Time Doubt Platform',
    description:
      'Ask classroom questions anonymously at SGSITS Indore. Empowering students to ask freely and learn without hesitation.',
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'gRA9DqcG_Dr6NCAW_thkqXlHJj58SQp1TPur6sUrUSI',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://www.sgsits.ac.in/#organization',
        name: 'Shri G. S. Institute of Technology and Science (SGSITS Indore)',
        alternateName: 'SGSITS',
        url: 'https://www.sgsits.ac.in',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '23 Sir M. Visvesvaraya Marg, Park Road',
          addressLocality: 'Indore',
          addressRegion: 'Madhya Pradesh',
          postalCode: '452003',
          addressCountry: 'IN',
        },
        department: {
          '@type': 'Organization',
          name: 'Department of Information Technology',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://anonymousclassdoubtssgsits.vercel.app/#application',
        name: 'Anonymous Class Doubts SGSITS',
        operatingSystem: 'All Modern Web Browsers',
        applicationCategory: 'EducationalApplication',
        description:
          'A modern classroom doubt platform allowing SGSITS Indore students to ask questions anonymously during lectures.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://anonymousclassdoubtssgsits.vercel.app/#website',
        url: 'https://anonymousclassdoubtssgsits.vercel.app',
        name: 'Anonymous Class Doubts SGSITS',
        publisher: {
          '@id': 'https://www.sgsits.ac.in/#organization',
        },
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta
          name="google-site-verification"
          content="gRA9DqcG_Dr6NCAW_thkqXlHJj58SQp1TPur6sUrUSI"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#F6F8FB] text-[#172033] antialiased flex flex-col font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
