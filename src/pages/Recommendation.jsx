import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheck, FiRefreshCw } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { recommendMattress } from '../utils/recommendation.js';
import { useSound } from '../hooks/useSound.js';

const steps = [
  {
    key: 'position',
    question: 'حالت خواب شما معمولاً چگونه است؟',
    options: [
      { value: 'back', label: 'به پشت' },
      { value: 'side', label: 'به پهلو' },
      { value: 'stomach', label: 'به شکم' }
    ]
  },
  {
    key: 'weight',
    question: 'محدوده وزن بدن شما؟',
    options: [
      { value: 'light', label: 'کمتر از ۶۰ کیلوگرم' },
      { value: 'medium', label: '۶۰ تا ۹۰ کیلوگرم' },
      { value: 'heavy', label: 'بیش از ۹۰ کیلوگرم' }
    ]
  },
  {
    key: 'backPain',
    question: 'آیا از درد کمر رنج می‌برید؟',
    options: [
      { value: true, label: 'بله' },
      { value: false, label: 'خیر' }
    ]
  },
  {
    key: 'neckPain',
    question: 'آیا از درد گردن رنج می‌برید؟',
    options: [
      { value: true, label: 'بله' },
      { value: false, label: 'خیر' }
    ]
  },
  {
    key: 'shoulderPain',
    question: 'آیا از درد شانه رنج می‌برید؟',
    options: [
      { value: true, label: 'بله' },
      { value: false, label: 'خیر' }
    ]
  },
  {
    key: 'budget',
    question: 'بودجه مدنظر شما؟',
    options: [
      { value: 1, label: 'اقتصادی' },
      { value: 2, label: 'متوسط' },
      { value: 3, label: 'بالا' },
      { value: 4, label: 'لوکس' }
    ]
  }
];

export default function Recommendation() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const { playClick, playChime } = useSound();

  const currentStep = steps[stepIndex];
  const progress = ((stepIndex) / steps.length) * 100;

  const selectOption = (value) => {
    playClick();
    const nextAnswers = { ...answers, [currentStep.key]: value };
    setAnswers(nextAnswers);

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      const ranked = recommendMattress(nextAnswers);
      setResult(ranked);
      playChime();
    }
  };

  const goBack = () => {
    playClick();
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const restart = () => {
    playClick();
    setStepIndex(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="px-6 md:px-12 pb-20 max-w-4xl mx-auto">
      <SectionHeading
        eyebrow="پیشنهاد هوشمند"
        title="تشک ایده‌آل شما"
        subtitle="با پاسخ به چند سؤال ساده، بهترین مدل EVE Matters متناسب با بدن و سبک خواب شما پیشنهاد می‌شود."
      />

      {!result && (
        <>
          <div className="w-full h-1.5 rounded-full bg-white/10 mb-10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-l from-gold-dark via-gold to-gold-light"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.key}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{currentStep.question}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {currentStep.options.map((opt) => (
                  <GlassCard
                    key={String(opt.value)}
                    onClick={() => selectOption(opt.value)}
                    className="text-center py-8"
                  >
                    <span className="text-lg font-semibold">{opt.label}</span>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {stepIndex > 0 && (
            <button
              onClick={goBack}
              className="mt-10 flex items-center gap-2 text-ash hover:text-gold transition-colors mx-auto"
            >
              <FiArrowRight /> بازگشت
            </button>
          )}
        </>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="glass-gold rounded-3xl p-8 md:p-12 text-center mb-8">
            <span className="eyebrow">پیشنهاد ویژه شما</span>
            <h2 className="heading-lg mt-3 gold-text">{result[0].name}</h2>
            <p className="text-ash mt-2">{result[0].tagline}</p>
            <div className="mt-6 w-32 h-32 mx-auto rounded-full border-4 border-gold/30 flex items-center justify-center relative">
              <span className="text-3xl font-black text-gold">{result[0].score}%</span>
            </div>
            <div className="mt-8 flex flex-col gap-3 max-w-md mx-auto text-right">
              {result[0].reasons.map((r) => (
                <div key={r} className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                  <FiCheck className="text-gold shrink-0" />
                  <span className="text-sm text-ivory/90">{r}</span>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-bold mb-4 text-center text-ash">سایر پیشنهادها</h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {result.slice(1).map((m) => (
              <GlassCard key={m.id} className="text-center">
                <h4 className="font-bold">{m.name}</h4>
                <p className="text-ash text-xs mt-1">{m.tagline}</p>
                <span className="block mt-3 text-gold font-bold">{m.score}%</span>
              </GlassCard>
            ))}
          </div>

          <button onClick={restart} className="btn-ghost flex items-center gap-2 mx-auto">
            <FiRefreshCw /> شروع دوباره
          </button>
        </motion.div>
      )}
    </div>
  );
}
