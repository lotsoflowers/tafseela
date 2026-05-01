'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'enter' | 'active' | 'exit'>('enter');

  useEffect(() => {
    // Transition to active phase after mount
    const enterTimer = setTimeout(() => setPhase('active'), 100);
    // Begin exit
    const exitTimer = setTimeout(() => setPhase('exit'), 1800);
    // Navigate away
    const navTimer = setTimeout(() => {
      router.replace('/home');
    }, 2200);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <div
      className={cn(
        'fixed inset-0 flex flex-col items-center justify-center overflow-hidden',
        'bg-gradient-to-br from-cream via-blush/30 to-cream',
        'transition-opacity duration-400',
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      )}
    >
      {/* Animated decorative elements */}
      <span
        className="absolute text-hero/[0.07] text-6xl animate-float select-none"
        style={{ top: '15%', left: '15%', animationDelay: '0s' }}
      >{'✂'}</span>
      <span
        className="absolute text-plum/[0.06] text-4xl animate-float select-none"
        style={{ top: '25%', right: '20%', animationDelay: '0.8s' }}
      >{'♢'}</span>
      <span
        className="absolute text-soft/30 text-5xl animate-float select-none"
        style={{ bottom: '20%', left: '20%', animationDelay: '1.2s' }}
      >{'✦'}</span>
      <span
        className="absolute text-hero/[0.05] text-3xl animate-float select-none"
        style={{ bottom: '30%', right: '15%', animationDelay: '0.4s' }}
      >{'◇'}</span>
      <span
        className="absolute text-plum/[0.08] text-4xl animate-spin-slow select-none"
        style={{ top: '60%', left: '10%' }}
      >{'✶'}</span>

      {/* Logo with glow */}
      <div className="relative">
        {/* Glow behind logo */}
        <div
          className={cn(
            'absolute inset-0 rounded-full blur-3xl transition-all duration-700',
            phase === 'active'
              ? 'bg-hero/20 scale-150 animate-breathe'
              : 'bg-hero/5 scale-100'
          )}
        />

        <h1
          className={cn(
            'relative gradient-text text-6xl font-extrabold tracking-tight',
            'transition-all duration-700',
            phase === 'enter'
              ? 'opacity-0 scale-90'
              : phase === 'active'
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          )}
        >
          {t({ en: 'Tafseela', ar: 'تفصيلة' })}
        </h1>
      </div>

      <p
        className={cn(
          'mt-4 text-lg text-ink/60 font-medium',
          'transition-all duration-700 delay-200',
          phase === 'enter'
            ? 'opacity-0 translate-y-3'
            : phase === 'active'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        )}
      >
        {t({
          en: 'Where every detail matters',
          ar: 'تفصيلة تهتم بكل التفاصيل',
        })}
      </p>

      {/* Loading dots */}
      <div
        className={cn(
          'mt-8 flex gap-1.5 transition-all duration-500 delay-500',
          phase === 'enter' ? 'opacity-0' : phase === 'active' ? 'opacity-100' : 'opacity-0'
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-hero/50 animate-float"
            style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1s' }}
          />
        ))}
      </div>
    </div>
  );
}

