// Mattress catalog: used by Compare page and the Smart Recommendation engine.
export const mattresses = [
  {
    id: 'simba',
    name: 'SIMBA',
    tagline: 'تعادل هوشمند بین نرمی و حمایت',
    firmness: 3, // 1 soft - 5 firm
    price: 2,
    color: '#F4C430',
    bestFor: ['back', 'side'],
    specs: {
      comfort: 92,
      support: 88,
      cooling: 85,
      motionIsolation: 90,
      edgeSupport: 82,
      durability: 90
    }
  },
  {
    id: 'happy',
    name: 'HAPPY',
    tagline: 'نرمی ابری برای خواب سبک‌بال',
    firmness: 2,
    price: 1,
    color: '#00D9FF',
    bestFor: ['side'],
    specs: {
      comfort: 95,
      support: 78,
      cooling: 80,
      motionIsolation: 93,
      edgeSupport: 74,
      durability: 82
    }
  },
  {
    id: 'royal',
    name: 'ROYAL',
    tagline: 'حمایت قدرتمند برای خواب پشت و شکم',
    firmness: 4,
    price: 3,
    color: '#B8860B',
    bestFor: ['back', 'stomach'],
    specs: {
      comfort: 85,
      support: 96,
      cooling: 88,
      motionIsolation: 84,
      edgeSupport: 94,
      durability: 96
    }
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    tagline: 'اوج لوکس با فناوری خنک‌کننده پیشرفته',
    firmness: 3,
    price: 4,
    color: '#FFE08A',
    bestFor: ['back', 'side', 'stomach'],
    specs: {
      comfort: 97,
      support: 93,
      cooling: 96,
      motionIsolation: 95,
      edgeSupport: 92,
      durability: 97
    }
  }
];

export const specLabels = {
  comfort: 'راحتی',
  support: 'حمایت',
  cooling: 'خنک‌کنندگی',
  motionIsolation: 'جذب حرکت',
  edgeSupport: 'حمایت لبه',
  durability: 'دوام'
};
