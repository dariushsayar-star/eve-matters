import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiCheckCircle, FiRotateCw } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import { useSound } from '../hooks/useSound.js';

const pressurePoints = [
  { cx: 100, cy: 70, r: 14, delay: 0 },
  { cx: 100, cy: 145, r: 20, delay: 0.2 },
  { cx: 100, cy: 230, r: 16, delay: 0.4 },
  { cx: 100, cy: 310, r: 18, delay: 0.6 },
  { cx: 100, cy: 420, r: 12, delay: 0.8 }
];

const SCAN_DURATION_MS = 3200;

export default function BodyAnalysis() {
  const [phase, setPhase] = useState('idle');
  const [progress, setProgress] = useState(0);
  const { playClick, playChime } = useSound();

  useEffect(() => {
    if (phase !== 'scanning') return;
    setProgress(0);
    const start = performance.now();
    let raf;
    function tick(now) {
      const pct = Math.min(100, ((now - start) / SCAN_DURATION_MS) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase('done');
        playChime();
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, playChime]);

  const startScan = () => {
    playClick();
    setPhase('scanning');
  };

  const reset = () => {
    playClick();
    setPhase('idle');
    setProgress(0);
  };

  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow="تحلیل بدن (نمایشی)"
        title="نقشه فشار و راحتی بدن"
        subtitle="این بخش صرفاً یک نمایش گرافیکی برای شوروم است و جایگزین ارزیابی پزشکی یا سنسور واقعی نیست."
      />

      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center gap-6">
          <div className="relative w-full max-w-xs h-[440px]">
            <svg viewBox="0 0 200 480" className="w-full h-full">
              <defs>
                <radialGradient id="heat" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.9" />
                  <stop offset="55%" stopColor="#F4C430" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="scanLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                </linearGradient>
              </defs>

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
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />

              {phase === 'done' ? (
                <g>
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
                  <motion.path
                    d="M100 40 C98 100 102 160 100 220 C98 280 102 340 100 420"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }}
                  />
                </g>
              ) : null}

              {phase === 'scanning' ? (
                <motion.rect
                  x={40}
                  width={120}
                  height={26}
                  fill="url(#scanLine)"
                  initial={{ y: 10 }}
                  animate={{ y: 440 }}
                  transition={{ duration: SCAN_DURATION_MS / 1000, ease: 'linear' }}
                />
              ) : null}
            </svg>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.button
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={startScan}
                className="btn-gold flex items-center gap-2"
              >
                <FiPlay /> شروع اسکن مشتری
              </motion.button>
            )}
            {phase === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xs"
              >
                <p className="text-center text-sm text-ash mb-2">
                  در حال تحلیل نقاط فشار بدن... {Math.round(progress)}٪
                </p>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-gold-dark via-gold to-gold-light"
                    style={{ width: ${progress}% }}
                  />
                </div>
              </motion.div>
            )}
            {phase === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <span className="flex items-center gap-2 text-gold font-semibold">
                  <FiCheckCircle /> تحلیل کامل شد
                </span>
                <button onClick={reset} className="btn-ghost flex items-center gap-2 text-sm">
                  <FiRotateCw /> اسکن دوباره
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { value: 94, label: 'امتیاز راحتی', color: '#F4C430' },
            { value: 91, label: 'امتیاز خواب', color: '#00D9FF' },
            { value: 88, label: 'جذب حرکت', color: '#F4C430' },
            { value: 90, label: 'خنک‌کنندگی', color: '#00D9FF' }
          ].map((s) => (
            <div key={s.label} className="glass rounded-3xl p-6 flex justify-center min-h-[190px] items-center">
              {phase === 'done' ? (
                <ScoreRing value={s.value} label={s.label} color={s.color} />
              ) : (
                <span className="text-ash text-sm text-center px-4">
                  پس از پایان اسکن نمایش داده می‌شود
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
<p className="text-center text-ash/60 text-xs mt-10 max-w-xl mx-auto">
        این نمایش صرفاً جهت تجربه فروشگاهی و آموزشی طراحی شده و مبتنی بر داده‌های واقعی بدن مشتری نیست.
      </p>
    </div>
  );
}
