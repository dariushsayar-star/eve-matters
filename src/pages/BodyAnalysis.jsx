import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiRotateCw, FiUser, FiPrinter } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import { useSound } from '../hooks/useSound.js';

var pressurePoints = [
  { id: 'feet', cx: 30, cy: 100, r: 12 },
  { id: 'kneeL', cx: 88, cy: 88, r: 9 },
  { id: 'kneeR', cx: 88, cy: 112, r: 9 },
  { id: 'hipL', cx: 180, cy: 80, r: 14 },
  { id: 'hipR', cx: 180, cy: 120, r: 14 },
  { id: 'lowerBack', cx: 250, cy: 100, r: 18 },
  { id: 'upperBack', cx: 320, cy: 100, r: 16 },
  { id: 'shoulderL', cx: 362, cy: 72, r: 13 },
  { id: 'shoulderR', cx: 362, cy: 128, r: 13 },
  { id: 'neck', cx: 390, cy: 100, r: 9 },
  { id: 'head', cx: 425, cy: 100, r: 15 }
];

var spineTicks = [100, 124, 148, 172, 196, 220, 244, 268, 292, 316];
var ribRows = [112, 130, 148, 166, 184];

var SCAN_DURATION_MS = 20000;
var SCAN_LEFT = 10;
var SCAN_RIGHT = 470;
var DEVICE_ACCENT = '#00D9FF';

var STAGES = [
  { until: 20, text: 'در حال شناسایی نقاط تماس بدن با تشک...' },
  { until: 45, text: 'تحلیل توزیع فشار در نواحی مختلف...' },
  { until: 70, text: 'بررسی راستای طبیعی ستون فقرات...' },
  { until: 90, text: 'ارزیابی جذب حرکت و خنک‌کنندگی...' },
  { until: 100, text: 'نهایی‌سازی نتایج تحلیل...' }
];

var positionOptions = [
  { value: 'back', label: 'به پشت' },
  { value: 'side', label: 'به پهلو' },
  { value: 'stomach', label: 'به شکم' }
];

var concernOptions = [
  { value: 'back', label: 'کمردرد' },
  { value: 'neck', label: 'گردن‌درد' },
  { value: 'shoulder', label: 'شانه‌درد' },
  { value: 'none', label: 'ندارم' }
];

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function clampScore(v) {
  return Math.max(0, Math.min(100, v));
}

function generateScores(profile, position, concern) {
  var base;
  if (profile === 'female') {
    base = {
      comfort: randomBetween(88, 96),
      sleep: randomBetween(86, 94),
      motion: randomBetween(85, 93),
      cooling: randomBetween(82, 91)
    };
  } else {
    base = {
      comfort: randomBetween(85, 94),
      sleep: randomBetween(83, 92),
      motion: randomBetween(82, 91),
      cooling: randomBetween(85, 94)
    };
  }

  var reasons = [];

  if (concern === 'back') {
    base.sleep += randomBetween(2, 6);
    reasons.push('امتیاز حمایت از ستون فقرات با توجه به کمردرد شما تنظیم شد');
  } else if (concern === 'neck') {
    base.comfort += randomBetween(2, 5);
    reasons.push('لایه راحتی برای کاهش فشار گردن در نظر گرفته شد');
  } else if (concern === 'shoulder') {
    base.motion += randomBetween(2, 5);
    reasons.push('جذب حرکت برای کاهش فشار روی شانه تنظیم شد');
  }

  if (position === 'side') {
    base.comfort += randomBetween(1, 4);
    reasons.push('نتایج متناسب با خواب به پهلو محاسبه شد');
  } else if (position === 'back') {
    base.sleep += randomBetween(1, 4);
    reasons.push('نتایج متناسب با خواب به پشت محاسبه شد');
  } else if (position === 'stomach') {
    base.sleep += randomBetween(1, 3);
    reasons.push('نتایج متناسب با خواب به شکم محاسبه شد');
  }

  return {
    scores: {
      comfort: clampScore(base.comfort),
      sleep: clampScore(base.sleep),
      motion: clampScore(base.motion),
      cooling: clampScore(base.cooling)
    },
    reasons: reasons
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

function labelFor(options, value) {
  for (var i = 0; i < options.length; i++) {
    if (options[i].value === value) {
      return options[i].label;
    }
  }
  return '';
}

function formatDate() {
  var d = new Date();
  return d.toLocaleDateString('fa-IR') + ' - ' + d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

function statusLabelFor(score) {
  if (score >= 90) {
    return 'عالی';
  }
  if (score >= 75) {
    return 'بهینه';
  }
  return 'متعادل';
}

export default function BodyAnalysis() {
  var phaseState = useState('setup');
  var phase = phaseState[0];
  var setPhase = phaseState[1];

  var genderState = useState(null);
  var gender = genderState[0];
  var setGender = genderState[1];

  var positionState = useState(null);
  var position = positionState[0];
  var setPosition = positionState[1];

  var concernState = useState(null);
  var concern = concernState[0];
  var setConcern = concernState[1];

  var progressState = useState(0);
  var progress = progressState[0];
  var setProgress = progressState[1];

  var resultState = useState(null);
  var result = resultState[0];
  var setResult = resultState[1];

  var reportDateState = useState('');
  var reportDate = reportDateState[0];
  var setReportDate = reportDateState[1];

  var sound = useSound();
  var playClick = sound.playClick;
  var playChime = sound.playChime;
  var playHover = sound.playHover;

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
        setResult(generateScores(gender, position, concern));
        setReportDate(formatDate());
        setPhase('done');
        playChime();
      }
    }
    raf = requestAnimationFrame(tick);
    return function cleanup() {
      cancelAnimationFrame(raf);
    };
  }, [phase, gender, position, concern, playChime]);

  useEffect(function () {
    if (phase !== 'scanning') {
      return undefined;
    }
    var beep = setInterval(function () {
      playHover();
    }, 2000);
    return function cleanup() {
      clearInterval(beep);
    };
  }, [phase, playHover]);

  function startScan() {
    if (!gender || !position || !concern) {
      return;
    }
    playClick();
    setPhase('scanning');
  }

  function reset() {
    playClick();
    setPhase('setup');
    setGender(null);
    setPosition(null);
    setConcern(null);
    setProgress(0);
    setResult(null);
  }

  function printReport() {
    playClick();
    window.print();
  }

  var scanX = SCAN_LEFT + ((SCAN_RIGHT - SCAN_LEFT) * progress) / 100;
  var canStart = Boolean(gender && position && concern);

  var scoreCards = result
    ? [
        { value: result.scores.comfort, label: 'امتیاز راحتی', color: '#F4C430' },
        { value: result.scores.sleep, label: 'امتیاز خواب', color: '#00D9FF' },
        { value: result.scores.motion, label: 'جذب حرکت', color: '#F4C430' },
        { value: result.scores.cooling, label: 'خنک‌کنندگی', color: '#00D9FF' }
      ]
    : [];

  var overallScore = result
    ? Math.round((result.scores.comfort + result.scores.sleep + result.scores.motion + result.scores.cooling) / 4)
    : 0;

  var statusLabel = phase === 'done' ? statusLabelFor(overallScore) : '';

  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow="تحلیل بدن ()"
        title="نقشه فشار و راحتی بدن"
        subtitle="این بخش جایگزین ارزیابی پزشکی نیست."
      />

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="relative glass rounded-3xl p-8 flex flex-col items-center justify-center gap-6 bg-black/40 overflow-hidden">
          <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl-md" style={{ borderColor: DEVICE_ACCENT }} />
          <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr-md" style={{ borderColor: DEVICE_ACCENT }} />
          <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl-md" style={{ borderColor: DEVICE_ACCENT }} />
          <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br-md" style={{ borderColor: DEVICE_ACCENT }} />

          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,217,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.5) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {phase === 'scanning' ? (
            <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
              <motion.span
                className="w-2.5 h-2.5 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
              <span className="text-xs tracking-widest text-red-400 font-semibold">SCAN</span>
            </div>
          ) : null}

          {phase === 'scanning' ? (
            <div className="absolute top-6 left-6 z-10 text-xs font-mono" style={{ color: DEVICE_ACCENT }}>
              {Math.floor((progress / 100) * 20)}s / 20s
            </div>
          ) : null}

          <div className="relative z-10 w-full flex items-stretch gap-3">
            <div className="flex-1 max-w-md mx-auto h-[220px]">
              <svg viewBox="0 0 480 200" className="w-full h-full">
                <defs>
                  <radialGradient id="heatCold" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#2563eb" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heatMid" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#facc15" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heatHot" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#ff3b30" stopOpacity="0.85" />
                    <stop offset="70%" stopColor="#ff9500" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#ff9500" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="scanLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00D9FF" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="bodyClip">
                    <path d="M460 100 C460 118 446 128 428 128 C412 128 402 120 396 112 C384 140 360 150 330 150 L220 150 C200 150 184 145 170 138 L60 142 C40 142 24 132 20 116 L80 112 L140 100 L80 88 L20 84 C24 68 40 58 60 58 L170 62 C184 55 200 50 220 50 L330 50 C360 50 384 60 396 88 C402 80 412 72 428 72 C446 72 460 82 460 100 Z" />
                  </clipPath>
                  <filter id="xrayGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <motion.path
                  d="M460 100 C460 118 446 128 428 128 C412 128 402 120 396 112 C384 140 360 150 330 150 L220 150 C200 150 184 145 170 138 L60 142 C40 142 24 132 20 116 L80 112 L140 100 L80 88 L20 84 C24 68 40 58 60 58 L170 62 C184 55 200 50 220 50 L330 50 C360 50 384 60 396 88 C402 80 412 72 428 72 C446 72 460 82 460 100 Z"
                  fill="rgba(150,200,255,0.05)"
                  stroke="rgba(150,200,255,0.35)"
                  strokeWidth="1.4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />

                {phase === 'done' ? (
                  <motion.g
                    clipPath="url(#bodyClip)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <circle cx="30" cy="100" r="40" fill="url(#heatCold)" />
                    <circle cx="88" cy="100" r="42" fill="url(#heatCold)" />
                    <circle cx="180" cy="100" r="55" fill="url(#heatMid)" />
                    <circle cx="250" cy="100" r="65" fill="url(#heatHot)" />
                    <circle cx="320" cy="100" r="60" fill="url(#heatHot)" />
                    <circle cx="362" cy="100" r="48" fill="url(#heatMid)" />
                    <circle cx="425" cy="100" r="38" fill="url(#heatCold)" />
                  </motion.g>
                ) : (
                  <motion.g
                    filter="url(#xrayGlow)"
                    stroke="#BFE9FF"
                    strokeWidth="1.6"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    transition={{ duration: 1, delay: 0.4 }}
                  >
                    <ellipse cx="430" cy="100" rx="26" ry="20" />
                    <path d="M412 84 Q400 100 412 116" />
                    <line x1="402" y1="100" x2="388" y2="100" />

                    {ribRows.map(function (y, i) {
                      var spread = 26 + i * 2;
                      var x = 480 - y;
                      var ctrlX = 472 - y;
                      return (
                        <path
                          key={'rib-' + i}
                          d={'M ' + x + ' ' + (100 - spread) + ' Q ' + ctrlX + ' 100 ' + x + ' ' + (100 + spread)}
                        />
                      );
                    })}

                    <path d="M184 62 Q148 100 184 138 Q164 100 184 62 Z" strokeWidth="1.4" />
                    <circle cx="180" cy="80" r="5" />
                    <circle cx="180" cy="120" r="5" />

                    <line x1="382" y1="64" x2="330" y2="58" />
                    <line x1="330" y1="58" x2="275" y2="55" />
                    <circle cx="330" cy="58" r="4" />
                    <line x1="382" y1="136" x2="330" y2="142" />
                    <line x1="330" y1="142" x2="275" y2="145" />
                    <circle cx="330" cy="142" r="4" />

                    <line x1="175" y1="80" x2="88" y2="88" />
                    <line x1="175" y1="120" x2="88" y2="112" />
                    <circle cx="88" cy="88" r="4" />
                    <circle cx="88" cy="112" r="4" />
                    <line x1="88" y1="88" x2="28" y2="92" />
                    <line x1="88" y1="112" x2="28" y2="108" />
                    <line x1="26" y1="84" x2="26" y2="100" />
                    <line x1="26" y1="100" x2="26" y2="116" />

                    {spineTicks.map(function (y, i) {
                      var x = 480 - y;
                      return <line key={'vert-' + i} x1={x} y1="92" x2={x} y2="108" />;
                    })}
                    <line x1="388" y1="100" x2="164" y2="100" strokeWidth="1.2" />
                  </motion.g>
                )}

                {phase === 'done' ? (
                  <line x1="20" y1="100" x2="460" y2="100" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.85" />
                ) : null}

                {phase === 'scanning' ? (
                  <g>
                    {pressurePoints.map(function (p) {
                      var revealed = scanX >= p.cx;
                      if (!revealed) {
                        return null;
                      }
                      return (
                        <motion.circle
                          key={p.id}
                          cx={p.cx}
                          cy={p.cy}
                          r={p.r}
                          fill="url(#heatMid)"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.1, 0.9] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      );
                    })}
                  </g>
                ) : null}

                {phase === 'scanning' ? (
                  <rect x={scanX - 13} y={10} width={26} height={180} fill="url(#scanLine)" />
                ) : null}
              </svg>
            </div>

            <div className="flex flex-col items-center gap-1 w-10 shrink-0">
              <div
                className="w-2.5 flex-1 rounded-full border border-white/10"
                style={{
                  background:
                    'linear-gradient(to top, #2563eb, #00D9FF, #4ade80, #facc15, #ff9500, #ff3b30, #ffffff)'
                }}
              />
              <span className="text-[10px] text-ash mt-1">فشار</span>
              {statusLabel ? (
                <span className="text-[11px] font-semibold" style={{ color: DEVICE_ACCENT }}>
                  {statusLabel}
                </span>
              ) : null}
            </div>
          </div>

          <div className="relative z-10 w-full">
            {phase === 'scanning' ? (
              <div className="w-full max-w-xs mx-auto text-center">
                <p className="text-sm font-medium mb-1" style={{ color: DEVICE_ACCENT }}>
                  {getStageText(progress)}
                </p>
                <p className="text-xs text-ash mb-2">دقت آنالیز: {Math.round(progress)} درصد</p>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full" style={{ width: progress + '%', backgroundColor: DEVICE_ACCENT }} />
                </div>
              </div>
            ) : null}

            {phase === 'done' ? (
              <div className="flex flex-col items-center gap-3">
                <span className="flex items-center gap-2 text-gold font-semibold">
                  <FiCheckCircle /> تحلیل کامل شد
                </span>
                <button onClick={reset} className="btn-ghost flex items-center gap-2 text-sm">
                  <FiRotateCw /> اسکن دوباره
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {phase === 'setup' ? (
            <div className="glass rounded-3xl p-6 flex flex-col gap-6">
              <div>
                <p className="text-sm text-ash mb-3">پروفایل مشتری</p>
                <div className="flex gap-3">
                  <button
                    onClick={function () {
                      playClick();
                      setGender('male');
                    }}
                    className={gender === 'male' ? 'btn-gold flex items-center gap-2' : 'btn-ghost flex items-center gap-2'}
                  >
                    <FiUser /> آقا
                  </button>
                  <button
                    onClick={function () {
                      playClick();
                      setGender('female');
                    }}
                    className={gender === 'female' ? 'btn-gold flex items-center gap-2' : 'btn-ghost flex items-center gap-2'}
                  >
                    <FiUser /> خانوم
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-ash mb-3">حالت خواب</p>
                <div className="flex flex-wrap gap-3">
                  {positionOptions.map(function (opt) {
                    var active = position === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={function () {
                          playClick();
                          setPosition(opt.value);
                        }}
                        className={active ? 'btn-gold' : 'btn-ghost'}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm text-ash mb-3">آیا از دردی رنج می‌برید؟</p>
                <div className="flex flex-wrap gap-3">
                  {concernOptions.map(function (opt) {
                    var active = concern === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={function () {
                          playClick();
                          setConcern(opt.value);
                        }}
                        className={active ? 'btn-gold' : 'btn-ghost'}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={startScan}
                disabled={!canStart}
                className={canStart ? 'btn-gold w-full' : 'btn-ghost w-full opacity-40 cursor-not-allowed'}
              >
                شروع اسکن
              </button>
            </div>
          ) : null}

          {phase !== 'setup' ? (
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
          ) : null}

          {phase === 'done' && result ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-gold rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="eyebrow">گزارش تحلیل خواب</p>
                  <p className="text-xs text-ash mt-1">{reportDate}</p>
                </div>
                <span className="text-3xl font-black gold-text">{overallScore}%</span>
              </div>

              <div className="border-t border-dashed border-white/15 my-4" />

              <div className="flex flex-wrap gap-2 text-xs text-ash mb-4">
                <span className="px-3 py-1 rounded-full bg-white/5">
                  پروفایل: {gender === 'female' ? 'خانوم' : 'آقا'}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5">
                  حالت خواب: {labelFor(positionOptions, position)}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5">
                  نگرانی اصلی: {labelFor(concernOptions, concern)}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                {result.reasons.map(function (r, i) {
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm text-ivory/85">
                      <FiCheckCircle className="text-gold shrink-0" size={14} />
                      {r}
                    </div>
                  );
                })}
              </div>

              <button onClick={printReport} className="btn-ghost w-full flex items-center justify-center gap-2 text-sm">
                <FiPrinter /> چاپ گزارش
              </button>
            </motion.div>
          ) : null}
        </div>
      </div>

      <p className="text-center text-ash/60 text-xs mt-10 max-w-xl mx-auto">
        این نمایش صرفاً جهت تجربه فروشگاهی و آموزشی طراحی شده و مبتنی بر داده‌های واقعی بدن مشتری نیست.
      </p>
    </div>
  );
}
