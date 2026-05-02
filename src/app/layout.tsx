import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import ThemeProvider from '@/components/shared/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { BrandFollowProvider } from '@/contexts/BrandFollowContext';
import { ReviewsProvider } from '@/contexts/ReviewsContext';
import { OrdersProvider } from '@/contexts/OrdersContext';
import { RestockAlertsProvider } from '@/contexts/RestockAlertsContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { FoldersProvider } from '@/contexts/FoldersContext';
import { AddressesProvider } from '@/contexts/AddressesContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tafseela | تفصيلة',
  description: 'Where every detail matters',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${ibmPlexArabic.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <OnboardingProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <FoldersProvider>
                      <BrandFollowProvider>
                        <ReviewsProvider>
                          <AddressesProvider>
                            <OrdersProvider>
                              <RestockAlertsProvider>
                                {children}
                              </RestockAlertsProvider>
                            </OrdersProvider>
                          </AddressesProvider>
                        </ReviewsProvider>
                      </BrandFollowProvider>
                    </FoldersProvider>
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </OnboardingProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
