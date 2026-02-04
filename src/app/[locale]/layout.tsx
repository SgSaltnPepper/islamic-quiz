import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Noto_Nastaliq_Urdu, Amiri } from 'next/font/google';
import Navbar from '@/components/ui/Navbar'; // 1. Import the Navbar
import "./../globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ['arabic'], variable: '--font-amiri', display: 'swap' });
const urdu = Noto_Nastaliq_Urdu({ weight: ['400', '700'], subsets: ['arabic'], variable: '--font-urdu', display: 'swap' });

export const metadata = {
  title: 'Islamic Quiz - Lucknow Edition',
  description: 'Test your knowledge and grow your faith.',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const isRTL = locale === 'ar' || locale === 'ur';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${amiri.variable} ${urdu.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-emerald-50 relative overflow-hidden selection:bg-emerald-200 selection:text-emerald-900">
            
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.4] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#10b981 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
                maskImage: 'linear-gradient(to bottom, white, transparent)'
              }}
            />

            <div className="relative z-10">
              
              {/* 2. Add Navbar Here (It will sit on top of everything) */}
              <Navbar />
              
              {/* Add padding-top so content doesn't get hidden behind fixed navbar */}
              <div className="pt-24"> 
                {children}
              </div>
              
            </div>
            
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}