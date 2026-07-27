// Mattress catalog: used by Compare page and the Smart Recommendation engine.
// Specs are derived from the EVE Matters product catalog (layer sheets for
// NO.1, NO.2, NO.3, EMMA, SIMBA, HAPPY+).
export var mattresses = [
  {
    id: 'no1',
    name: 'NO.1',
    tagline: 'تشک طبی فنری پاکت اسپرینگ، مناسب افراد با خواب سبک',
    firmness: 2,
    price: 3,
    warrantyYears: 8,
    heightCm: 30,
    color: '#F4C430',
    bestFor: ['side'],
    specs: {
      comfort: 86,
      support: 78,
      cooling: 80,
      motionIsolation: 88,
      edgeSupport: 80,
      durability: 84
    }
  },
  {
    id: 'no2',
    name: 'NO.2',
    tagline: 'هسته مرکزی پاکت اسپرینگ و میکرو پاکت، مرغوب‌ترین متریال',
    firmness: 3,
    price: 3,
    warrantyYears: 9,
    heightCm: 33,
    color: '#00D9FF',
    bestFor: ['back', 'side'],
    specs: {
      comfort: 90,
      support: 88,
      cooling: 85,
      motionIsolation: 90,
      edgeSupport: 86,
      durability: 90
    }
  },
  {
    id: 'no3',
    name: 'NO.3',
    tagline: 'هسته پاکت اسپرینگ با تراکم بالا و پد جداشونده اختصاصی',
    firmness: 3,
    price: 4,
    warrantyYears: 9,
    heightCm: 40,
    color: '#FFE08A',
    bestFor: ['back', 'side', 'stomach'],
    specs: {
      comfort: 95,
      support: 92,
      cooling: 90,
      motionIsolation: 93,
      edgeSupport: 90,
      durability: 94
    }
  },
  {
    id: 'emma',
    name: 'EMMA',
    tagline: 'تشک طبی فنری بونل، اقتصادی و مقاوم',
    firmness: 4,
    price: 1,
    warrantyYears: 5,
    heightCm: 24,
    color: '#9CA3AF',
    bestFor: ['back', 'stomach'],
    specs: {
      comfort: 78,
      support: 75,
      cooling: 72,
      motionIsolation: 65,
      edgeSupport: 74,
      durability: 72
    }
  },
  {
    id: 'simba',
    name: 'SIMBA',
    tagline: 'هسته ریباند فوق‌فشرده، مناسب کمردرد و خستگی صبحگاهی',
    firmness: 4,
    price: 2,
    warrantyYears: 6,
    heightCm: 26,
    color: '#B8860B',
    bestFor: ['back', 'side'],
    specs: {
      comfort: 83,
      support: 90,
      cooling: 76,
      motionIsolation: 80,
      edgeSupport: 78,
      durability: 82
    }
  },
  {
    id: 'happy-plus',
    name: 'HAPPY+',
    tagline: 'تشک طبی فنری بونل تقویت‌شده، انتخابی اقتصادی و باکیفیت',
    firmness: 4,
    price: 2,
    warrantyYears: 8,
    heightCm: 28,
    color: '#F4C430',
    bestFor: ['back', 'stomach'],
    specs: {
      comfort: 80,
      support: 80,
      cooling: 75,
      motionIsolation: 68,
      edgeSupport: 76,
      durability: 80
    }
  }
];

export var specLabels = {
  comfort: 'راحتی',
  support: 'حمایت',
  cooling: 'خنک‌کنندگی',
  motionIsolation: 'جذب حرکت',
  edgeSupport: 'حمایت لبه',
  durability: 'دوام'
};
