import { motion } from 'framer-motion';
import { FiRotateCw, FiSun, FiShield, FiDroplet, FiWind, FiSlash } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { warrantyPlans, careInstructions } from '../data/warranty.js';

const iconMap = { rotate: FiRotateCw, sun: FiSun, shield: FiShield, droplet: FiDroplet, wind: FiWind, ban: FiSlash };

export default function Warranty() {
  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow="اطمینان خاطر"
        title="گارانتی و نگهداری"
        subtitle="سرمایه‌گذاری شما در خواب باکیفیت، با پشتیبانی کامل EVE Matters محافظت می‌شود."
      />

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {warrantyPlans.map((plan, i) => (
          <motion.div
            key={plan.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard gold className="h-full text-center py-10">
              <span className="text-4xl font-black gold-text">{plan.years}</span>
              <h3 className="text-xl font-bold mt-3">{plan.title}</h3>
              <p className="text-ash text-sm mt-2 max-w-xs mx-auto">{plan.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <SectionHeading eyebrow="راهنما" title="نگهداری و مراقبت" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {careInstructions.map((item, i) => {
          const Icon = iconMap[item.icon];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="h-full">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-ash text-sm leading-relaxed">{item.desc}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
