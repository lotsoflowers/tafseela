'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Review } from '@/types';

const STORAGE_KEY = 'tafseela-reviews';

type NewReviewInput = Omit<Review, 'id' | 'createdAt'>;

interface ReviewsContextType {
  reviews: Review[];
  addReview: (input: NewReviewInput) => Review;
  deleteReview: (id: string) => void;
  getReviews: (productId: string) => Review[];
  getReview: (id: string) => Review | undefined;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    }
  }, [reviews, loaded]);

  const addReview = useCallback((input: NewReviewInput): Review => {
    const review: Review = {
      ...input,
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [review, ...prev]);
    return review;
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  }, []);

  const getReviews = useCallback(
    (productId: string): Review[] =>
      reviews.filter(r => r.productId === productId),
    [reviews]
  );

  const getReview = useCallback(
    (id: string): Review | undefined => reviews.find(r => r.id === id),
    [reviews]
  );

  return (
    <ReviewsContext.Provider
      value={{ reviews, addReview, deleteReview, getReviews, getReview }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
}
