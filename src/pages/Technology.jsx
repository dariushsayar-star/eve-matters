import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCpu,
  FiLayers,
  FiGrid,
  FiTarget,
  FiShield,
  FiThermometer,
  FiWind
} from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { technologies } from '../data/technologies.js';
import { useSound } from '../hooks/useSound.js';

const iconMap = {
  brain: FiCpu,
  layers: FiLayers,
  grid: FiGrid,
  'circle-grid': FiTarget,
  shield: FiShield,
  snow: FiThermometer,
  wind: FiWind
};

export default function Technology() {
  const [active, setActive] = useState(technologies[0].id);
  const { playClick } = useSound();
  const activeTech = technologies.find((t) => t.id === active);
  const ActiveIcon = iconMap[activeTech.icon];

  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow="نوآوری"
        title="فناوری‌های EVE Matters"
        subtitle="هر تشک ترکیبی از فناوری‌های اختصاصی است که در کنار هم، تجربه‌ی خوابی بی‌نظیر می‌سازند."
      />

      <div className="grid md:grid-cols-3 gap-6 mb-14">
        {technologies.map((tech, i) => {
          const Icon = iconMap[tech.icon];
          const isActive = tech.id === active;
          return (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <GlassCard
                gold={isActive}
                onClick={() => { playClick(); setActive(tech.id); }}
                className={`h-full transition-all duration-500 ${isActive ? 'scale-[1.02]' : ''}`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border"
                  style={{
                    backgroundColor: `${tech.color}1A`,
                    borderColor: `${tech.color}55`,
                    color: tech.color
                  }}
                >
                  <Icon size={26} />
                </div>
                <h3 className="text-lg font-bold">{tech.title}</h3>
                <p className="text-xs text-ash tracking-widest uppercase mt-1">{tech.subtitle}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Detail panel for the selected technology */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="glass-gold rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center shrink-0 animate-glow"
            style={{ backgroundColor: `${activeTech.color}22`, color: activeTech.color }}
          >
            <ActiveIcon size={48} />
          </div>
          <div className="text-center md:text-right">
            <span className="eyebrow">{activeTech.subtitle}</span>
            <h2 className="text-2xl md:text-3xl font-black mt-2">{activeTech.title}</h2>
            <p className="text-ash mt-4 max-w-2xl leading-relaxed">{activeTech.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
