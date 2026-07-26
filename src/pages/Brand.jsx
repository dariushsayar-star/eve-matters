import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading.jsx';
import GlassCard from '../components/GlassCard.jsx';

const timeline = [
  { year: '۲۰۰۸', title: 'تولد یک ایده', desc: 'EVE Matters با هدف بازتعریف خواب لوکس در استودیویی کوچک آغاز شد.' },
  { year: '۲۰۱۳', title: 'اولین نوآوری فوم', desc: 'معرفی فرمول اختصاصی فوم حافظه‌دار با تنظیم حرارتی پیشرفته.' },
  { year: '۲۰۱۷', title: 'گسترش جهانی', desc: 'حضور در بیش از ۲۰ کشور با شبکه‌ای از شوروم‌های تخصصی.' },
  { year: '۲۰۲۲', title: 'آزمایشگاه راحتی', desc: 'راه‌اندازی مرکز تحقیقاتی اختصاصی برای علم خواب و ارگونومی.' },
  { year: '۲۰۲۶', title: 'مرکز تجربه دیجیتال', desc: 'معرفی EVE Matters Experience Center برای تجربه‌ای هوشمند و لمسی.' }
];

export default function Brand() {
  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      {/* Hero banner with video-background support (poster fallback shown) */}
      <section className="relative rounded-3xl overflow-hidden h-[46vh] min-h-[320px] mb-16 glass">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          poster=""
        >
          {/* Place a brand film at src/assets/brand-loop.mp4 to activate the video background */}
          <source src="./assets/brand-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <span className="eyebrow">EVE Matters</span>
          <h1 className="heading-xl mt-4">هنر خواب <span className="gold-text">لوکس</span></h1>
        </div>
      </section>

      <SectionHeading
        eyebrow="فلسفه ما"
        title="راحتی که با علم طراحی شده"
        subtitle="ما باور داریم که خواب باکیفیت پایه‌ی یک زندگی بهتر است. هر تشک EVE Matters نتیجه‌ی سال‌ها تحقیق در ارگونومی، مواد پیشرفته و طراحی بی‌زمان است."
      />

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {[
          { title: 'صنعتگری دقیق', desc: 'هر تشک با استانداردهای دست‌ساز و کنترل کیفیت چندمرحله‌ای تولید می‌شود.' },
          { title: 'مواد پیشرو', desc: 'انتخاب مواد اولیه از برترین تأمین‌کنندگان جهانی برای دوام و آسایش.' },
          { title: 'طراحی بی‌زمان', desc: 'زیبایی‌شناسی مینیمال که با هر فضای خواب هماهنگ می‌شود.' }
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <GlassCard className="h-full">
              <h3 className="text-xl font-bold mb-2 text-gold">{item.title}</h3>
              <p className="text-ash text-sm leading-relaxed">{item.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      <SectionHeading eyebrow="مسیر ما" title="خط زمانی برند" />
      <div className="relative border-r-2 border-gold/25 pr-8 space-y-12 mr-4">
        {timeline.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative"
          >
            <span className="absolute -right-[42px] top-1 w-4 h-4 rounded-full bg-gold shadow-gold" />
            <span className="text-gold font-black text-lg">{item.year}</span>
            <h4 className="text-xl font-bold mt-1">{item.title}</h4>
            <p className="text-ash text-sm mt-2 max-w-xl">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
