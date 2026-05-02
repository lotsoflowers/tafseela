export type Country = {
  code: string;
  name: { en: string; ar: string };
  flag: string;
  dialCode: string;
};

export const countries: Country[] = [
  { code: 'KW', name: { en: 'Kuwait', ar: 'الكويت' }, flag: '🇰🇼', dialCode: '+965' },
  { code: 'AE', name: { en: 'United Arab Emirates', ar: 'الإمارات' }, flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: { en: 'Saudi Arabia', ar: 'السعودية' }, flag: '🇸🇦', dialCode: '+966' },
  { code: 'BH', name: { en: 'Bahrain', ar: 'البحرين' }, flag: '🇧🇭', dialCode: '+973' },
  { code: 'QA', name: { en: 'Qatar', ar: 'قطر' }, flag: '🇶🇦', dialCode: '+974' },
  { code: 'OM', name: { en: 'Oman', ar: 'عُمان' }, flag: '🇴🇲', dialCode: '+968' },
  { code: 'JO', name: { en: 'Jordan', ar: 'الأردن' }, flag: '🇯🇴', dialCode: '+962' },
  { code: 'LB', name: { en: 'Lebanon', ar: 'لبنان' }, flag: '🇱🇧', dialCode: '+961' },
  { code: 'EG', name: { en: 'Egypt', ar: 'مصر' }, flag: '🇪🇬', dialCode: '+20' },
  { code: 'MA', name: { en: 'Morocco', ar: 'المغرب' }, flag: '🇲🇦', dialCode: '+212' },
  { code: 'TN', name: { en: 'Tunisia', ar: 'تونس' }, flag: '🇹🇳', dialCode: '+216' },
  { code: 'DZ', name: { en: 'Algeria', ar: 'الجزائر' }, flag: '🇩🇿', dialCode: '+213' },
  { code: 'TR', name: { en: 'Turkey', ar: 'تركيا' }, flag: '🇹🇷', dialCode: '+90' },
  { code: 'GB', name: { en: 'United Kingdom', ar: 'المملكة المتحدة' }, flag: '🇬🇧', dialCode: '+44' },
  { code: 'US', name: { en: 'United States', ar: 'الولايات المتحدة' }, flag: '🇺🇸', dialCode: '+1' },
  { code: 'CA', name: { en: 'Canada', ar: 'كندا' }, flag: '🇨🇦', dialCode: '+1' },
  { code: 'FR', name: { en: 'France', ar: 'فرنسا' }, flag: '🇫🇷', dialCode: '+33' },
  { code: 'DE', name: { en: 'Germany', ar: 'ألمانيا' }, flag: '🇩🇪', dialCode: '+49' },
  { code: 'IT', name: { en: 'Italy', ar: 'إيطاليا' }, flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: { en: 'Spain', ar: 'إسبانيا' }, flag: '🇪🇸', dialCode: '+34' },
  { code: 'NL', name: { en: 'Netherlands', ar: 'هولندا' }, flag: '🇳🇱', dialCode: '+31' },
  { code: 'BE', name: { en: 'Belgium', ar: 'بلجيكا' }, flag: '🇧🇪', dialCode: '+32' },
  { code: 'CH', name: { en: 'Switzerland', ar: 'سويسرا' }, flag: '🇨🇭', dialCode: '+41' },
  { code: 'SE', name: { en: 'Sweden', ar: 'السويد' }, flag: '🇸🇪', dialCode: '+46' },
  { code: 'NO', name: { en: 'Norway', ar: 'النرويج' }, flag: '🇳🇴', dialCode: '+47' },
  { code: 'AU', name: { en: 'Australia', ar: 'أستراليا' }, flag: '🇦🇺', dialCode: '+61' },
  { code: 'JP', name: { en: 'Japan', ar: 'اليابان' }, flag: '🇯🇵', dialCode: '+81' },
  { code: 'IN', name: { en: 'India', ar: 'الهند' }, flag: '🇮🇳', dialCode: '+91' },
  { code: 'PK', name: { en: 'Pakistan', ar: 'باكستان' }, flag: '🇵🇰', dialCode: '+92' },
  { code: 'BD', name: { en: 'Bangladesh', ar: 'بنغلاديش' }, flag: '🇧🇩', dialCode: '+880' },
  { code: 'PH', name: { en: 'Philippines', ar: 'الفلبين' }, flag: '🇵🇭', dialCode: '+63' },
];

export const defaultCountry = countries[0];
