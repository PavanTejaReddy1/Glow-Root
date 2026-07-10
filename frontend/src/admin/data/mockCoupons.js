export const mockCoupons = [
  {
    id: 1,
    code: 'WELCOME20',
    discount: 20,
    discountType: 'percentage',
    minPurchase: 500,
    maxDiscount: 200,
    expiry: '2024-12-31',
    usageLimit: 1000,
    usedCount: 456,
    status: 'active',
    description: 'Welcome discount for new customers'
  },
  {
    id: 2,
    code: 'SUMMER15',
    discount: 15,
    discountType: 'percentage',
    minPurchase: 1000,
    maxDiscount: 300,
    expiry: '2024-06-30',
    usageLimit: 500,
    usedCount: 234,
    status: 'active',
    description: 'Summer special discount'
  },
  {
    id: 3,
    code: 'FLAT500',
    discount: 500,
    discountType: 'flat',
    minPurchase: 2000,
    maxDiscount: null,
    expiry: '2024-03-31',
    usageLimit: 200,
    usedCount: 189,
    status: 'active',
    description: 'Flat discount on orders above 2000'
  },
  {
    id: 4,
    code: 'FIRSTORDER',
    discount: 10,
    discountType: 'percentage',
    minPurchase: 300,
    maxDiscount: 100,
    expiry: '2024-12-31',
    usageLimit: 10000,
    usedCount: 1234,
    status: 'active',
    description: 'First order discount'
  },
  {
    id: 5,
    code: 'FESTIVE25',
    discount: 25,
    discountType: 'percentage',
    minPurchase: 1500,
    maxDiscount: 500,
    expiry: '2024-01-15',
    usageLimit: 300,
    usedCount: 300,
    status: 'expired',
    description: 'Festive season special'
  }
];
