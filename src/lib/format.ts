export function formatPrice(amount: number): string {
  return `${amount.toFixed(3)} KD`;
}

export function formatDate(dateString: string, language: 'en' | 'ar'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'ar' ? 'ar-KW' : 'en-KW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
