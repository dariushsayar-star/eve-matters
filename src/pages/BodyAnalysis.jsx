import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiRotateCw, FiUser, FiPrinter, FiShoppingBag } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import BodyScan3D from '../three/BodyScan3D.jsx';
import { useSound } from '../hooks/useSound.js';
import { recommendMattress } from '../utils/recommendation.js';

var SCAN_DURATION_MS = 20000;
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
  { value: 'lordosis', label: 'گودی کمر' },
  { value: 'discPressure', label: 'فشار روی دیسک کمر' },
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
  var reasons = [];

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

  var spine = {
    lordosis: randomBetween(78, 92),
    discPressure: randomBetween(76, 90),
    alignment: profile === 'male' ? randomBetween(83, 96) : randomBetween(80, 94),
    pelvis: profile === 'female' ? randomBetween(82, 95) : randomBetween(78, 90)
  };

  if (profile === 'female') {
    reasons.push('توزیع فشار با توجه به آناتومی لگن در پروفایل خانم تنظیم شد');
  } else {
    reasons.push('حمایت از راستای شانه و ستون فقرات با توجه به پروفایل آقا تنظیم شد');
  }

  if (concern === 'back') {
    base.sleep += randomBetween(2, 6);
    spine.alignment += randomBetween(2, 5);
    spine.discPressure += randomBetween(1, 4);
    spine.pelvis += randomBetween(1, 4);
    reasons.push('امتیاز حمایت از ستون فقرات با توجه به کمردرد شما تنظیم شد');
  } else if (concern === 'neck') {
    base.comfort += randomBetween(2, 5);
    reasons.push('لایه راحتی برای کاهش فشار گردن در نظر گرفته شد');
  } else if (concern === 'shoulder') {
    base.motion += randomBetween(2, 5);
    reasons.push('جذب حرکت برای کاهش فشار روی شانه تنظیم شد');
  } else if (concern === 'lordosis') {
    base.sleep += randomBetween(2, 6);
    spine.lordosis += randomBetween(4, 9);
    reasons.push('حمایت از انحنای طبیعی کمر (گودی کمر) در تحلیل لحاظ شد');
  } else if (concern === 'discPressure') {
    base.sleep += randomBetween(3, 7);
    spine.discPressure += randomBetween(4, 9);
    spine.pelvis += randomBetween(1, 4);
    reasons.push('کاهش فشار روی دیسک کمر در محاسبه امتیاز حمایت لحاظ شد');
  }

  if (position === 'side') {
    base.comfort += randomBetween(1, 4);
    spine.pelvis += randomBetween(2, 5);
    reasons.push('نتایج متناسب با خواب به پهلو محاسبه شد');
  } else if (position === 'back') {
    base.sleep += randomBetween(1, 4);
    spine.alignment += randomBetween(2, 5);
    reasons.push('نتایج متناسب با خواب به پشت محاسبه شد');
  } else if (position === 'stomach') {
    base.sleep += randomBetween(1, 3);
    spine.alignment -= randomBetween(2, 5);
    spine.pelvis -= randomBetween(1, 4);
    reasons.push('نتایج متناسب با خواب به شکم محاسبه شد');
  }

  return {
    scores: {
      comfort: clampScore(base.comfort),
      sleep: clampScore(base.sleep),
      motion: clampScore(base.motion),
      cooling: clampScore(base.cooling)
    },
    spine: {
      lordosis: clampScore(spine.lordosis),
      discPressure: clampScore(spine.discPressure),
      alignment: clampScore(spine.alignment),
      pelvis: clampScore(spine.pelvis)
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

function recommendMattressFromAnalysis(position, concern) {
  var answers = {
    weight: 'medium',
    position: position,
    backPain: concern === 'back' || concern === 'lordosis' || concern === 'discPressure',
    neckPain: concern === 'neck',
    shoulderPain: concern === 'shoulder',
    budget: 2
  };
  var ranked = recommendMattress(answers);
  return ranked[0];
}

export default function BodyAnalysis() {
  var navigate = useNavigate();

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

  var mattressMatchState = useState(null);
  var mattressMatch = mattressMatchState[0];
  var setMattressMatch = mattressMatchState[1];

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
        setMattressMatch(recommendMattressFromAnalysis(position, concern));
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
    setMattressMatch(null);
  }

  function printReport() {
    playClick();
    window.print();
  }

  var canStart = Boolean(gender && position && concern);

  var scoreCards = result
    ? [
        { value: result.scores.comfort, label: 'امتیاز راحتی', color: '#F4C430' },
        { value: result.scores.sleep, label: 'امتیاز خواب', color: '#00D9FF' },
        { value: result.scores.motion, label: 'جذب حرکت', color: '#F4C430' },
        { value: result.scores.cooling, label: 'خنک‌کنندگی', color: '#00D9FF' },
        { value: result.spine.lordosis, label: 'گودی کمر', color: '#F4C430' },
        { value: result.spine.discPressure, label: 'فشار دیسک کمر', color: '#00D9FF' },
        { value: result.spine.pelvis, label: 'توزیع فشار لگن', color: '#F4C430' },
        { value: result.spine.alignment, label: 'راستای ستون فقرات', color: '#00D9FF' }
      ]
    : [];

  var overallScore = result
    ? Math.round((result.scores.comfort + result.scores.sleep + result.scores.motion + result.scores.cooling) / 4)
    : 0;

  var statusLabel = phase === 'done' ? statusLabelFor(overallScore) : '';

  return (
    <div className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
      <SectionHeading
        eyebrow="تحلیل بدن (تشک اوه)"
        title="نقشه فشار و راحتی بدن سه‌بعدی"
        subtitle="این بخش یک نمایش شوروم است و جایگزین ارزیابی پزشکی یا سنسور واقعی نیست. با انگشت یا ماوس بچرخانید."
      />

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="relative glass rounded-3xl p-4 flex flex-col items-center justify-center gap-4 bg-black/40 overflow-hidden">
          <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl-md z-20" style={{ borderColor: DEVICE_ACCENT }} />
          <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr-md z-20" style={{ borderColor: DEVICE_ACCENT }} />
          <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl-md z-20" style={{ borderColor: DEVICE_ACCENT }} />
          <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br-md z-20" style={{ borderColor: DEVICE_ACCENT }} />

          {phase === 'scanning' ? (
            <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
              <motion.span
                className="w-2.5 h-2.5 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
              <span className="text-xs tracking-widest text-red-400 font-semibold">SCAN</span>
            </div>
          ) : null}

          {phase === 'scanning' ? (
            <div className="absolute top-6 left-6 z-20 text-xs font-mono" style={{ color: DEVICE_ACCENT }}>
              {Math.floor((progress / 100) * 20)}s / 20s
            </div>
          ) : null}

          <div className="relative z-10 w-full flex items-stretch gap-3">
            <div className="flex-1 h-[380px]">
              <BodyScan3D phase={phase} progress={progress} concern={concern} />
            </div>

            <div className="flex flex-col items-center gap-1 w-10 shrink-0">
              <div
                className="w-2.5 flex-1 rounded-full border border-white/10"
                style={{
                  background: 'linear-gradient(to top, #2563eb, #00D9FF, #4ade80, #facc15, #ff9500, #ff3b30, #ffffff)'
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
                var card = scoreCards[i];
                return (
                  <div key={i} className="glass rounded-3xl p-4 flex justify-center min-h-[170px] items-center">
                    {phase === 'done' && card ? (
                      <ScoreRing value={card.value} label={card.label} color={card.color} size={104} />
                    ) : (
                      <span className="text-ash text-xs text-center px-2">
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

              {mattressMatch ? (
                <div className="mb-5">
                  <div className="border-t border-dashed border-white/15 my-4" />
                  <p className="eyebrow mb-2">تشک پیشنهادی برای شما</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black gold-text">{mattressMatch.name}</span>
                    <span className="text-sm text-gold font-semibold">{mattressMatch.score}% تطابق</span>
                  </div>
                  <p className="text-ash text-sm mb-3">{mattressMatch.tagline}</p>
                  <div className="flex flex-col gap-2">
                    {mattressMatch.reasons.map(function (r, i) {
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm text-ivory/85">
                          <FiCheckCircle className="text-gold shrink-0" size={14} />
                          {r}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                {mattressMatch ? (
                  <button
                    onClick={function () {
                      playClick();
                      navigate('/compare');
                    }}
                    className="btn-gold w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <FiShoppingBag /> مشاهده در مقایسه مدل‌ها
                  </button>
                ) : null}
                <button onClick={printReport} className="btn-ghost w-full flex items-center justify-center gap-2 text-sm">
                  <FiPrinter /> چاپ گزارش
                </button>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      <p className="text-center text-ash/60 text-xs mt-10 max-w-xl mx-auto">
        .
      </p>
    </div>
  );
}
