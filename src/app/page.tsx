'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-cream">
      <h1 className="text-5xl font-bold text-plum animate-fade-in">
        {t({ en: 'Tafseela', ar: 'تفصيلة' })}
      </h1>

      <p
        className="mt-4 text-lg text-ink/70 animate-fade-in"
        style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
      >
        {t({
          en: 'Where every detail matters',
          ar: 'تفصيلة تهتم بكل التفاصيل',
        })}
      </p>
    </div>
  );
}
