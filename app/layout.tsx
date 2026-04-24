import type {Metadata} from 'next';
import { Inter, Montserrat, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

export async function generateMetadata(): Promise<Metadata> {
  const appUrl = process.env.APP_URL || 'https://basespin.xyz';
  return {
    title: 'BaseSpin',
    description: 'Sophisticated on-chain spin wheel',
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: `${appUrl}/og-image.png`,
        button: {
          title: 'Launch BaseSpin',
          action: {
            type: 'launch_miniapp',
            name: 'BaseSpin',
            url: appUrl,
            splashImageUrl: `${appUrl}/splash.png`,
            splashBackgroundColor: '#050608',
          },
        },
      }),
    },
  };
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${cormorant.variable}`}>
      <body suppressHydrationWarning className="bg-[#050608] text-[#e0d8d0]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
