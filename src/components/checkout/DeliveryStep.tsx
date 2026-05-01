'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { deliveryAreas } from '@/data/areas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { DeliveryAddress } from '@/types';

interface DeliveryStepProps {
  onNext: (address: DeliveryAddress) => void;
  className?: string;
}

export default function DeliveryStep({ onNext, className }: DeliveryStepProps) {
  const { language } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [areaIndex, setAreaIndex] = useState<number | null>(null);
  const [block, setBlock] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [notes, setNotes] = useState('');

  const isValid = fullName && phone && areaIndex !== null && block && street && building;

  const handleSubmit = () => {
    if (!isValid || areaIndex === null) return;
    const area = deliveryAreas[areaIndex];
    onNext({
      fullName,
      phone: `+965${phone}`,
      area,
      block,
      street,
      building,
      floor: floor || undefined,
      apartment: apartment || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Saved addresses placeholder */}
      <div className="rounded-xl bg-white p-4">
        <p className="text-sm text-muted-foreground">
          {language === 'ar' ? 'لا توجد عناوين محفوظة' : 'No saved addresses'}
        </p>
      </div>

      {/* New address form */}
      <div className="rounded-xl bg-white p-4 space-y-4">
        <h3 className="font-semibold text-ink text-sm">
          {language === 'ar' ? 'أضيفي عنوان جديد' : 'Add new address'}
        </h3>

        {/* Full name */}
        <div className="space-y-1.5">
          <Label>{language === 'ar' ? 'الاسم الكامل' : 'Full name'}</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={language === 'ar' ? 'سارة محمد' : 'Sara Mohammed'}
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone number'}</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0 bg-blush/30 px-2.5 py-1.5 rounded-lg border border-input">
              +965
            </span>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="9999 1234"
              type="tel"
            />
          </div>
        </div>

        {/* Area */}
        <div className="space-y-1.5">
          <Label>{language === 'ar' ? 'المنطقة' : 'Area'}</Label>
          <Select
            value={areaIndex !== null ? String(areaIndex) : undefined}
            onValueChange={(val) => setAreaIndex(Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={language === 'ar' ? 'اختاري المنطقة' : 'Select area'}
              />
            </SelectTrigger>
            <SelectContent>
              {deliveryAreas.map((area, idx) => (
                <SelectItem key={idx} value={String(idx)}>
                  {language === 'ar' ? area.ar : area.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Block, Street, Building */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>{language === 'ar' ? 'القطعة' : 'Block'}</Label>
            <Input
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              placeholder="3"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{language === 'ar' ? 'الشارع' : 'Street'}</Label>
            <Input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="15"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{language === 'ar' ? 'المبنى' : 'Building'}</Label>
            <Input
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="7"
            />
          </div>
        </div>

        {/* Floor, Apartment */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>
              {language === 'ar' ? 'الدور (اختياري)' : 'Floor (optional)'}
            </Label>
            <Input
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="2"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              {language === 'ar' ? 'الشقة (اختياري)' : 'Apt (optional)'}
            </Label>
            <Input
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              placeholder="4A"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label>
            {language === 'ar' ? 'ملاحظات التوصيل (اختياري)' : 'Delivery notes (optional)'}
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'مثال: الباب الأزرق، الطابق الثاني'
                : 'e.g. Blue door, second floor'
            }
            rows={2}
          />
        </div>
      </div>

      {/* Next button */}
      <Button
        className="w-full bg-hero hover:bg-hero/90 text-white h-12 text-base font-semibold rounded-xl"
        onClick={handleSubmit}
        disabled={!isValid}
      >
        {language === 'ar' ? 'التالي' : 'Next'}
      </Button>
    </div>
  );
}
