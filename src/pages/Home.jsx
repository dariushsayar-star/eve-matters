import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiCpu, FiLayers, FiUserCheck, FiActivity, FiBarChart2, FiShield, FiArrowLeft } from 'react-icons/fi';
import GlassCard from '../components/GlassCard.jsx';
import ParticleField from '../components/ParticleField.jsx';
import MattressViewer from '../three/MattressViewer.jsx';
import { useSound } from '../hooks/useSound.js';

const cards = [
  { to: '/brand', icon: FiAward, title: 'برند', desc: 'داستان و فلسفه EVE Matters' },
  { to: '/technology', icon: FiCpu, title: 'فناوری', desc: 'نوآوری در هر لایه از تشک' },
  { to: '/structure', icon: FiLayers, title: 'لایه‌های تشک', desc: 'کاوش سه‌بعدی ساختار تشک' },
  { to: '/recommendation', icon: FiUserCheck, title: 'پیشنهاد هوشمند', desc: 'بهترین تشک متناسب با شما' },
  { to: '/body-analysis', icon: FiActivity, title: 'تحلیل بدن', desc: 'اسکن نمایشی فشار و راحتی بدن' },
  { to: '/compare', icon: FiBarChart2, title: 'مقایسه مدل‌ها', desc: 'NO.1 تا NO.3، EMMA، SIMBA و HAPPY+' },
  { to: '/warranty', icon: FiShield, title: 'گارانتی', desc: 'پوشش کامل و راهنمای نگهداری' }
];

export default function Home() {
  const navigate = useNavigate();
  const { playClick, playHover } = useSound();

  return (
    <div className="relative w-full">
      <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden px-6">
        <ParticleField density={45} className="opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void pointer-events-none" />

        <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-center md:text-right order-2 md:order-1"
          >
            <span className="eyebrow">EVE Matters Experience Center</span>
            <h1 className="heading-xl mt-4">
              خوابی که <span className="gold-text">فراتر</span> از خواب است
            </h1>
            <p className="text-ash mt-6 text-lg max-w-xl mx-auto md:mx-0">
              تشک‌هایی که با فناوری و دقت مهندسی، آسایش را به یک تجربه لوکس تبدیل می‌کنند.
            </p>
            <div className="flex gap-4 mt-8 justify-center md:justify-start">
              <button
                onClick={() => { playClick(); navigate('/structure'); }}
                onMouseEnter={playHover}
                className="btn-gold flex items-center gap-2"
              >
                کاوش ساختار تشک
                <FiArrowLeft />
              </button>
              <button
                onClick={() => { playClick(); navigate('/recommendation'); }}
                onMouseEnter={playHover}
                className="btn-ghost"
              >
                پیشنهاد هوشمند
              </button>
            </div>
          </motion.div>

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
            const Icon = card.icon;
            return (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
>
                <GlassCard
                  onClick={() => { playClick(); navigate(card.to); }}
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
