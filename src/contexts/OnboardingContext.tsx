'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { OnboardingState, Language } from '@/types';

const STORAGE_KEY = 'tafseela-onboarding';

const initialState: OnboardingState = {
  completed: false,
  language: null,
  notificationsAllowed: null,
};

interface OnboardingContextType {
  state: OnboardingState;
  loaded: boolean;
  completeOnboarding: (language: Language, notificationsAllowed: boolean) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  const completeOnboarding = useCallback(
    (language: Language, notificationsAllowed: boolean) => {
      setState({ completed: true, language, notificationsAllowed });
    },
    []
  );

  const resetOnboarding = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{ state, loaded, completeOnboarding, resetOnboarding }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
