// Exploded mattress layer definitions, top to bottom.
// yOffset controls the resting exploded height in the Three.js scene.
export const mattressLayers = [
  {
    id: 'top-fabric',
    title: 'روکش پارچه‌ای',
    subtitle: 'Top Fabric',
    thickness: '0.5 cm',
    color: '#f5f1e6',
    yOffset: 3.2,
    description: 'پارچه لوکس تنفس‌پذیر که سطحی نرم، خنک و لطیف در تماس مستقیم با بدن ایجاد می‌کند.'
  },
  {
    id: 'comfort-foam',
    title: 'فوم راحتی',
    subtitle: 'Comfort Foam',
    thickness: '3 cm',
    color: '#e8dcc0',
    yOffset: 2.35,
    description: 'لایه نرم اولیه که واکنش سریع به فشار داشته و احساس آسایش فوری هنگام دراز کشیدن می‌دهد.'
  },
  {
    id: 'memory-foam',
    title: 'فوم حافظه‌دار',
    subtitle: 'Memory Foam',
    thickness: '4 cm',
    color: '#F4C430',
    yOffset: 1.5,
    description: 'با گرمای بدن نرم می‌شود و منحنی‌های طبیعی ستون فقرات را برای خوابی عمیق‌تر دنبال می‌کند.'
  },
  {
    id: 'hr-foam',
    title: 'فوم HR',
    subtitle: 'High Resilience Foam',
    thickness: '3 cm',
    color: '#d8b46a',
    yOffset: 0.65,
    description: 'فومی با برگشت‌پذیری بالا که حمایت میانی تشک را تضمین کرده و از فرورفتگی جلوگیری می‌کند.'
  },
  {
    id: 'felt',
    title: 'نمد فشرده',
    subtitle: 'Felt Layer',
    thickness: '1 cm',
    color: '#c9c3b6',
    yOffset: -0.2,
    description: 'لایه‌ای نازک که فنرها را از لایه‌های فوقانی جدا کرده و از سایش جلوگیری می‌کند.'
  },
  {
    id: 'spring-system',
    title: 'سیستم فنر',
    subtitle: 'Pocket Spring System',
    thickness: '14 cm',
    color: '#9CA3AF',
    yOffset: -1.6,
    description: 'صدها فنر منفرد که به‌طور مستقل حرکت می‌کنند و حمایت متناسب با هر نقطه از بدن ایجاد می‌کنند.'
  },
  {
    id: 'edge-support',
    title: 'حمایت لبه',
    subtitle: 'Edge Support Frame',
    thickness: '2 cm',
    color: '#00D9FF',
    yOffset: -3.05,
    description: 'قاب فوم متراکم دور تا دور تشک که پایداری کامل لبه‌ها را تضمین می‌کند.'
  },
  {
    id: 'bottom-fabric',
    title: 'روکش زیرین',
    subtitle: 'Bottom Fabric',
    thickness: '0.5 cm',
    color: '#3a3a3d',
    yOffset: -3.85,
    description: 'پارچه ضدلغزش مقاوم که پایه تشک را روی باکس اسپرینگ یا تخت ثابت نگه می‌دارد.'
  }
];
