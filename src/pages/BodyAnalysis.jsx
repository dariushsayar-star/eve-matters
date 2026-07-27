import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiRotateCw, FiUser } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import { useSound } from '../hooks/useSound.js';

var pressurePoints = [
  { id: 'head', cx: 100, cy: 55, r: 14 },
  { id: 'shoulders', cx: 100, cy: 118, r: 20 },
  { id: 'lowerBack', cx: 100, cy: 230, r: 16 },
  { id: 'hips', cx: 100, cy: 300, r: 18 },
  { id: 'legs', cx: 100, cy: 420, r: 12 }
];

var spineTicks = [100, 124, 148, 172, 196, 220, 244, 268, 292, 316];

var ribRows = [112, 130, 148, 166, 184];

var SCAN_DURATION_MS = 20000;
var SVG_TOP = 10;
var SVG_BOTTOM = 460;

var STAGES = [
  { until: 20, text: 'در حال شناسایی نقاط تماس بدن با تشک...' },
  { until: 45, text: 'تحلیل توزیع فشار در نواحی مختلف...' },
  { until: 70, text: 'بررسی راستای طبیعی ستون فقرات...' },
  { until: 90, text: 'ارزیابی جذب حرکت و خنک‌کنندگی...' },
  { until: 100, text: 'نهایی‌سازی نتایج تحلیل...' }
];

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function generateScores(profile) {
  if (profile === 'female') {
    return {
      comfort: randomBetween(88, 98),
      sleep: randomBetween(86, 96),
      motion: randomBetween(85, 95),
      cooling: randomBetween(82, 93)
    };
  }
  return {
    comfort: randomBetween(85, 96),
    sleep: randomBetween(83, 94),
    motion: randomBetween(82, 93),
    cooling: randomBetween(85, 96)
  };
}

function getStageText(pct) {
  for (var i = 0; i < STAGES.length; i++) {
    if (pct <= STAGES[i].until) {
      return STAGES[i].text;
    }
  }
  return STAGES[STAGES.length - 1].text;
}

export default function BodyAnalysis() {
  var phaseState = useState('select');
  var phase = phaseState[0];
  var setPhase = phaseState[1];

  var profileState = useState(null);
  var profile = profileState[0];
  var setProfile = profileState[1];

  var progressState = useState(0);
  var progress = progressState[0];
  var setProgress = progressState[1];

  var scoresState = useState(null);
  var scores = scoresState[0];
  var setScores = scoresState[1];

  var sound = useSound();
  var playClick = sound.playClick;
  var playChime = sound.playChime;

  useEffect(function () {
    if (phase !== 'scanning') {
      return undefined;
    }
    setProgress(0);
    var start = performance.now();
    var raf;

    function tick(now) {
      var pct = Math.min(100, ((now - start) / SCAN_DURATION_MS) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setScores(generateScores(profile));
        setPhase('done');
        playChime();
      }
    }
    raf = requestAnimationFrame(tick);
    return function cleanup() {
      cancelAnimationFrame(raf);
    };
  }, [phase, profile, playChime]);

  function startScan(selectedProfile) {
    playClick();
    setProfile(selectedProfile);
    setPhase('scanning');
  }

  function reset() {
    playClick();
    setPhase('select');
    setProfile(null);
    setProgress(0);
    setScores(null);
  }

  var scanY = SVG_TOP + ((SVG_BOTTOM - SVG_TOP) * progress) / 100;

  var scoreCards = scores
    ? [
        { value: scores.comfort, label: 'امتیاز راحتی', color: '#F4C430' },
        { value: scores.sleep, label: 'امتیاز خواب', color: '#00D9FF' },
        { value: scores.motion, label: 'جذب حرکت', color: '#F4C430' },
        { value: scores.cooling, label: 'خنک‌کنندگی', color: '#00D9FF' }
      ]
    : [];

  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow="تحلیل بدن (نمایشی)"
        title="نقشه فشار و راحتی بدن"
        subtitle="این بخش صرفاً یک نمایش گرافیکی برای شوروم است و جایگزین ارزیابی پزشکی یا سنسور واقعی نیست."
      />
<div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center gap-6 bg-black/40">
          <div className="relative w-full max-w-xs h-[460px]">
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
                <filter id="xrayGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <motion.path
                d="M100 20 C118 20 128 34 128 52 C128 68 120 78 112 84
                   C140 96 150 120 150 150 L150 260 C150 280 145 296 138 310
                   L142 420 C142 440 132 456 116 460 L112 400 L100 340 L88 400 L84 460
                   C68 456 58 440 58 420 L62 310 C55 296 50 280 50 260 L50 150
                   C50 120 60 96 88 84 C80 78 72 68 72 52 C72 34 82 20 100 20 Z"
                fill="rgba(150,200,255,0.05)"
                stroke="rgba(150,200,255,0.3)"
                strokeWidth="1.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />

              <motion.g
                filter="url(#xrayGlow)"
                stroke="#BFE9FF"
                strokeWidth="1.6"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <ellipse cx="100" cy="50" rx="20" ry="26" />
                <path d="M84 68 Q100 80 116 68" />
                <line x1="100" y1="78" x2="100" y2="92" />

                {ribRows.map(function (y, i) {
                  var spread = 26 + i * 2;
                  return (
                    <path
                      key={'rib-' + i}
                      d={'M ' + (100 - spread) + ' ' + y + ' Q 100 ' + (y + 8) + ' ' + (100 + spread) + ' ' + y}
                    />
                  );
                })}

                <path d="M62 296 Q100 332 138 296 Q100 316 62 296 Z" strokeWidth="1.4" />
                <circle cx="80" cy="300" r="5" />
                <circle cx="120" cy="300" r="5" />

                <line x1="64" y1="98" x2="58" y2="150" />
                <line x1="58" y1="150" x2="55" y2="205" />
                <circle cx="58" cy="150" r="4" />
                <line x1="136" y1="98" x2="142" y2="150" />
                <line x1="142" y1="150" x2="145" y2="205" />
                <circle cx="142" cy="150" r="4" />

                <line x1="80" y1="305" x2="88" y2="392" />
                <line x1="120" y1="305" x2="112" y2="392" />
                <circle cx="88" cy="392" r="4" />
                <circle cx="112" cy="392" r="4" />
                <line x1="88" y1="392" x2="92" y2="452" />
                <line x1="112" y1="392" x2="108" y2="452" />
                <line x1="84" y1="454" x2="100" y2="454" />
                <line x1="100" y1="454" x2="116" y2="454" />
                {spineTicks.map(function (y, i) {
                  return <line key={'vert-' + i} x1="92" y1={y} x2="108" y2={y} />;
                })}
                <line x1="100" y1="92" x2="100" y2="316" strokeWidth="1.2" />
              </motion.g>

              {(phase === 'scanning' || phase === 'done') ? (
                <g>
                  {pressurePoints.map(function (p) {
                    var revealed = phase === 'done' || scanY >= p.cy;
                    if (!revealed) {
                      return null;
                    }
                    return (
                      <motion.circle
                        key={p.id}
                        cx={p.cx}
                        cy={p.cy}
                        r={p.r}
                        fill="url(#heat)"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2.4, repeat: Infinity }}
                      />
                    );
                  })}
                </g>
              ) : null}

              {phase === 'done' ? (
                <motion.line
                  x1="100"
                  y1="92"
                  x2="100"
                  y2="316"
                  stroke="#22c55e"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }}
                />
              ) : null}

              {phase === 'scanning' ? (
                <rect x={40} y={scanY - 13} width={120} height={26} fill="url(#scanLine)" />
              ) : null}
            </svg>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-4 w-full"
              >
                <p className="text-sm text-ash">پروفایل مشتری را انتخاب کنید</p>
                <div className="flex gap-4">
                  <button onClick={function () { startScan('male'); }} className="btn-gold flex items-center gap-2">
                    <FiUser /> شروع اسکن آقا
                  </button>
                  <button onClick={function () { startScan('female'); }} className="btn-ghost flex items-center gap-2">
                    <FiUser /> شروع اسکن خانوم
                  </button>
                </div>
              </motion.div>
            )}
            {phase === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xs text-center"
              >
                <p className="text-sm text-gold font-medium mb-1">{getStageText(progress)}</p>
                <p className="text-xs text-ash mb-2">{Math.round(progress)} درصد</p>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-gold-dark via-gold to-gold-light"
                    style={{ width: progress + '%' }}
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
          {[0, 1, 2, 3].map(function (i) {
            var card = scoreCards[i];
            return (
              <div key={i} className="glass rounded-3xl p-6 flex justify-center min-h-[190px] items-center">
                {phase === 'done' && card ? (
                  <ScoreRing value={card.value} label={card.label} color={card.color} />
                ) : (
                  <span className="text-ash text-sm text-center px-4">
                    پس از پایان اسکن نمایش داده می‌شود
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-ash/60 text-xs mt-10 max-w-xl mx-auto">
        این نمایش صرفاً جهت تجربه فروشگاهی و آموزشی طراحی شده .
      </p>
    </div>
  );
}
