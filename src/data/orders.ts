import { Order } from '@/types';

export const mockOrder: Order = {
  id: 'ORD-2025-001',
  items: [
    {
      productId: 'prod-1',
      storeId: 'gozline',
      size: 'M',
      quantity: 1,
    },
    {
      productId: 'prod-6',
      storeId: 'boz-kw',
      size: 'L',
      quantity: 1,
    },
  ],
  status: 'shipped',
  total: 143.0,
  deliveryAddress: {
    fullName: 'Noura Al-Sabah',
    phone: '+965 9876 5432',
    area: { en: 'Salmiya', ar: 'السالمية' },
    block: '5',
    street: 'Salem Al-Mubarak Street',
    building: '12',
    floor: '3',
    apartment: '7',
    notes: 'Ring the doorbell twice',
  },
  paymentMethod: 'knet',
  createdAt: '2025-04-25T09:00:00Z',
  estimatedDelivery: '2025-04-30T18:00:00Z',
  trackingUpdates: [
    {
      status: 'confirmed',
      timestamp: '2025-04-25T09:05:00Z',
      note: {
        en: 'Your order has been confirmed and is being prepared.',
        ar: 'تم تأكيد طلبك وجاري تجهيزه.',
      },
    },
    {
      status: 'processing',
      timestamp: '2025-04-26T11:30:00Z',
      note: {
        en: 'Your items are being packed and prepared for shipping.',
        ar: 'جاري تغليف وتجهيز طلبك للشحن.',
      },
    },
    {
      status: 'shipped',
      timestamp: '2025-04-27T14:00:00Z',
      note: {
        en: 'Your order has been shipped and is on its way to Salmiya.',
        ar: 'تم شحن طلبك وهو في الطريق إلى السالمية.',
      },
    },
  ],
};
