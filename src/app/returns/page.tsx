'use client';

import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PageShell from '@/components/layout/PageShell';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { BilingualText } from '@/types';

interface PolicySection {
  title: BilingualText;
  content: BilingualText;
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    title: { en: 'Return Policy', ar: 'سياسة الإرجاع' },
    content: {
      en: 'You may return items within 7 days of delivery. Items must be unworn, unwashed, and with all original tags attached. Returns are accepted for full refund to original payment method.',
      ar: 'يمكنج إرجاع المنتجات خلال ٧ أيام من التوصيل. يجب أن تكون المنتجات غير ملبوسة وغير مغسولة ومع جميع البطاقات الأصلية. يتم قبول الإرجاع مع استرداد كامل المبلغ.',
    },
  },
  {
    title: { en: 'Return Conditions', ar: 'شروط الإرجاع' },
    content: {
      en: '• Item must be in original condition with tags\n• Item must be unworn and unwashed\n• Original packaging must be included\n• Return request must be made within 7 days\n• Customer pays return shipping unless item is defective',
      ar: '• يجب أن يكون المنتج بحالته الأصلية مع البطاقات\n• يجب أن يكون غير ملبوس وغير مغسول\n• يجب إرفاق التغليف الأصلي\n• يجب تقديم طلب الإرجاع خلال ٧ أيام\n• تكلفة شحن الإرجاع على المشتري إلا في حالة وجود عيب',
    },
  },
  {
    title: { en: 'Refund Process', ar: 'عملية الاسترجاع' },
    content: {
      en: 'Once we receive and inspect your return, we will process your refund within 5-7 business days. Refunds are issued to the original payment method (KNET, credit card, or cash).',
      ar: 'بمجرد استلام وفحص المنتج المرتجع، سنقوم بمعالجة الاسترداد خلال ٥-٧ أيام عمل. يتم الاسترداد إلى طريقة الدفع الأصلية (كي نت أو بطاقة ائتمان أو نقداً).',
    },
  },
  {
    title: { en: 'Exceptions', ar: 'الاستثناءات' },
    content: {
      en: '• Final sale items cannot be returned\n• Intimate wear and swimwear are non-returnable\n• Customized or altered items cannot be returned\n• Items without original tags will not be accepted',
      ar: '• المنتجات المخفضة (تصفية) لا يمكن إرجاعها\n• الملابس الداخلية وملابس السباحة لا ترجع\n• المنتجات المعدلة أو المفصلة لا يمكن إرجاعها\n• لن يتم قبول المنتجات بدون بطاقات أصلية',
    },
  },
];

export default function ReturnsPage() {
  const { t } = useLanguage();

  return (
    <PageShell>
      <div className="min-h-screen bg-cream dark:bg-background px-4 pt-4 pb-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-plum dark:text-soft">Tafseela</h1>
          <p className="text-sm text-ink/60 mt-1">
            {t({ en: 'Returns & Refunds', ar: 'سياسة الإرجاع والاسترجاع' })}
          </p>
        </div>

        {/* Accordion */}
        <Accordion className="space-y-2">
          {POLICY_SECTIONS.map((section, index) => (
            <AccordionItem
              key={index}
              value={`section-${index}`}
              className="bg-white dark:bg-card rounded-xl shadow-sm border-0 overflow-hidden px-4"
            >
              <AccordionTrigger className="text-sm font-bold text-ink dark:text-foreground hover:no-underline py-4">
                {t(section.title)}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-ink/70 whitespace-pre-line pb-4">
                {t(section.content)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* WhatsApp Button */}
        <div className="mt-8">
          <a href="https://wa.me/96599991234" target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full py-6 text-base font-medium">
              <MessageCircle className="w-5 h-5 me-2" />
              {t({ en: 'Contact us on WhatsApp', ar: 'تواصلي معنا على واتساب' })}
            </Button>
          </a>
        </div>
      </div>
    </PageShell>
  );
}
