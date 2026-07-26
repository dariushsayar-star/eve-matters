import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading.jsx';
import ScoreRing from '../components/ScoreRing.jsx';

const pressurePoints = [
  { cx: 100, cy: 70, r: 14, delay: 0 }, // head/neck
  { cx: 100, cy: 145, r: 20, delay: 0.2 }, // shoulders
  { cx: 100, cy: 230, r: 16, delay: 0.4 }, // lower back
  { cx: 100, cy: 310, r: 18, delay: 0.6 }, // hips
  { cx: 100, cy: 420, r: 12, delay: 0.8 } // legs
];

export default function BodyAnalysis() {
  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow="تحلیل بدن (نمایشی)"
        title="نقشه فشار و راحتی بدن"
        subtitle="این بخش صرفاً یک نمایش گرافیکی برای شوروم است و جایگزین ارزیابی پزشکی نیست."
      />

      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* Animated body silhouette with heatmap + spine */}
        <div className="glass rounded-3xl p-8 flex items-center justify-center">
          <svg viewBox="0 0 200 480" className="w-full max-w-xs h-[440px]">
            <defs>
              <radialGradient id="heat" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#F4C430" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Body silhouette */}
            <motion.path
              d="M100 20 C118 20 128 34 128 52 C128 68 120 78 112 84
                 C140 96 150 120 150 150 L150 260 C150 280 145 296 138 310
                 L142 420 C142 440 132 456 116 460 L112 400 L100 340 L88 400 L84 460
                 C68 456 58 440 58 420 L62 310 C55 296 50 280 50 260 L50 150
                 C50 120 60 96 88 84 C80 78 72 68 72 52 C72 34 82 20 100 20 Z"
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(244,196,48,0.4)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />

            {/* Heatmap glows */}
            {pressurePoints.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="url(#heat)"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, delay: p.delay }}
              />
            ))}

            {/* Green spine line */}
            <motion.path
              d="M100 40 C98 100 102 160 100 220 C98 280 102 340 100 420"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }}
            />
          </svg>
        </div>

        {/* Score panel */}
        <div className="grid grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 flex justify-center">
            <ScoreRing value={94} label="امتیاز راحتی" color="#F4C430" />
          </div>
          <div className="glass rounded-3xl p-6 flex justify-center">
            <ScoreRing value={91} label="امتیاز خواب" color="#00D9FF" />
          </div>
          <div className="glass rounded-3xl p-6 flex justify-center">
            <ScoreRing value={88} label="جذب حرکت" color="#F4C430" />
          </div>
          <div className="glass rounded-3xl p-6 flex justify-center">
            <ScoreRing value={90} label="خنک‌کنندگی" color="#00D9FF" />
          </div>
        </div>
      </div>

      <p className="text-center text-ash/60 text-xs mt-10 max-w-xl mx-auto">
        این نمایش صرفاً جهت تجربه فروشگاهی و آموزشی طراحی شده و مبتنی بر داده‌های واقعی بدن مشتری نیست.
      </p>
    </div>
  );
}
