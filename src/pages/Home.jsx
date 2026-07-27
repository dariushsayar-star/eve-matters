import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiCpu, FiLayers, FiUserCheck, FiActivity, FiBarChart2, FiShield, FiArrowLeft } from 'react-icons/fi';
import GlassCard from '../components/GlassCard.jsx';
import ParticleField from '../components/ParticleField.jsx';
import MattressViewer from '../three/MattressViewer.jsx';
import { useSound } from '../hooks/useSound.js';

var cards = [
  { to: '/brand', icon: FiAward, title: 'برند', desc: 'داستان و فلسفه EVE Matters' },
  { to: '/technology', icon: FiCpu, title: 'فناوری', desc: 'نوآوری در هر لایه از تشک' },
  { to: '/structure', icon: FiLayers, title: 'لایه‌های تشک', desc: 'کاوش سه‌بعدی ساختار تشک' },
  { to: '/recommendation', icon: FiUserCheck, title: 'پیشنهاد هوشمند', desc: 'بهترین تشک متناسب با شما' },
  { to: '/body-analysis', icon: FiActivity, title: 'تحلیل بدن', desc: 'اسکن نمایشی فشار و راحتی بدن' },
  { to: '/compare', icon: FiBarChart2, title: 'مقایسه مدل‌ها', desc: 'NO.1 تا NO.3، EMMA، SIMBA و HAPPY+' },
  { to: '/warranty', icon: FiShield, title: 'گارانتی', desc: 'پوشش کامل و راهنمای نگهداری' }
];

var slides = [
  {
    accent: '#F4C430',
    eyebrow: 'EVE Matters Experience Center',
    title1: 'خوابی که ',
    titleGold: 'فراتر',
    title2: ' از خواب است',
    subtitle: 'تشک‌هایی که با فناوری و دقت مهندسی، آسایش را به یک تجربه لوکس تبدیل می‌کنند.',
    ctaLabel: 'کاوش ساختار تشک',
    ctaTo: '/structure',
    secondaryLabel: 'پیشنهاد هوشمند',
    secondaryTo: '/recommendation'
  },
  {
    accent: '#00D9FF',
    eyebrow: 'فناوری اختصاصی EVE',
    title1: 'هر لایه، ',
    titleGold: 'یک نوآوری',
    title2: ' مهندسی‌شده',
    subtitle: 'از فوم حافظه‌دار تا فنر پاکت مستقل، هر جزء برای آسایش شما طراحی شده.',
    ctaLabel: 'مشاهده فناوری‌ها',
    ctaTo: '/technology',
    secondaryLabel: 'ساختار تشک',
    secondaryTo: '/structure'
  },
  {
    accent: '#F4C430',
    eyebrow: 'تا ۹ سال گارانتی',
    title1: 'سرمایه‌گذاری ',
    titleGold: 'مطمئن',
    title2: ' برای خواب شما',
    subtitle: 'هر تشک EVE Matters با پشتیبانی کامل و راهنمای نگهداری اختصاصی همراه است.',
    ctaLabel: 'جزئیات گارانتی',
    ctaTo: '/warranty',
    secondaryLabel: 'مقایسه مدل‌ها',
    secondaryTo: '/compare'
  },
  {
    accent: '#00D9FF',
    eyebrow: 'پیشنهاد هوشمند',
    title1: 'تشک ',
    titleGold: 'ایده‌آل',
    title2: ' شما را پیدا کنید',
    subtitle: 'با پاسخ به چند سؤال ساده، بهترین مدل متناسب با بدن و سبک خواب شما پیشنهاد می‌شود.',
    ctaLabel: 'شروع تست هوشمند',
    ctaTo: '/recommendation',
    secondaryLabel: 'تحلیل بدن',
    secondaryTo: '/body-analysis'
  },
  {
    accent: '#F4C430',
    eyebrow: 'مدل‌های متنوع',
    title1: 'از اقتصادی تا ',
    titleGold: 'لوکس',
    title2: '، برای هر سلیقه',
    subtitle: 'NO.1، NO.2، NO.3، EMMA، SIMBA و HAPPY+ — مدلی برای هر بودجه و هر سبک خواب.',
    ctaLabel: 'مقایسه مدل‌ها',
    ctaTo: '/compare',
    secondaryLabel: 'برند ما',
    secondaryTo: '/brand'
  }
];

var SLIDE_DURATION_MS = 6000;

export default function Home() {
  var navigate = useNavigate();
  var sound = useSound();
  var playClick = sound.playClick;
  var playHover = sound.playHover;

  var slideState = useState(0);
  var slideIndex = slideState[0];
  var setSlideIndex = slideState[1];

  useEffect(function () {
    var timer = null;

    function start() {
      timer = setInterval(function () {
        setSlideIndex(function (prev) {
          return (prev + 1) % slides.length;
        });
      }, SLIDE_DURATION_MS);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        start();
      } else {
        stop();
      }
    }

    start();
    document.addEventListener('visibilitychange', handleVisibility);
    return function cleanup() {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  var slide = slides[slideIndex];
return (
    <div className="relative w-full">
      <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden px-6">
        <ParticleField density={45} className="opacity-60" />

        <AnimatePresence>
          <motion.div
            key={slide.accent + slideIndex}
            className="absolute w-[560px] h-[560px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, ' + slide.accent + '22 0%, ' + slide.accent + '00 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void pointer-events-none" />

        <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center md:text-right order-2 md:order-1"
            >
              <span className="eyebrow" style={{ color: slide.accent }}>
                {slide.eyebrow}
              </span>
              <h1 className="heading-xl mt-4">
                {slide.title1}
                <span className="gold-text">{slide.titleGold}</span>
                {slide.title2}
              </h1>
              <p className="text-ash mt-6 text-lg max-w-xl mx-auto md:mx-0">{slide.subtitle}</p>
              <div className="flex gap-4 mt-8 justify-center md:justify-start">
                <button
                  onClick={function () {
                    playClick();
                    navigate(slide.ctaTo);
                  }}
                  onMouseEnter={playHover}
                  className="btn-gold flex items-center gap-2"
                >
                  {slide.ctaLabel}
                  <FiArrowLeft />
                </button>
                <button
                  onClick={function () {
                    playClick();
                    navigate(slide.secondaryTo);
                  }}
                  onMouseEnter={playHover}
                  className="btn-ghost"
                >
                  {slide.secondaryLabel}
                </button>
              </div>

              <div className="flex gap-2 mt-8 justify-center md:justify-start">
                {slides.map(function (s, i) {
                  return (
                    <span
                      key={i}
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: i === slideIndex ? '28px' : '8px',
                        backgroundColor: i === slideIndex ? slide.accent : 'rgba(255,255,255,0.15)'
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="order-1 md:order-2 h-[360px] md:h-[440px]"
          >
            <MattressViewer />
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cards.map(function (card, i) {
            var Icon = card.icon;
            return (
              <motion.div
key={card.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <GlassCard
                  onClick={function () {
                    playClick();
                    navigate(card.to);
                  }}
                  onMouseEnter={playHover}
                  className="h-full flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="text-ash text-sm">{card.desc}</p>
                  <span className="mt-auto flex items-center gap-2 text-gold text-sm font-medium">
                    مشاهده <FiArrowLeft size={14} />
                  </span>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
