import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function ScoreRing({ value = 80, label = '', color = '#F4C430', size = 130 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 60, damping: 18 });
  const dashOffset = useTransform(spring, (v) => circumference - (v / 100) * circumference);
  const displayValue = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) progress.set(value);
  }, [isInView, value, progress]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffset, filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span className="text-2xl font-black text-ivory">{displayValue}</motion.span>
        </div>
      </div>
      <span className="text-sm text-ash text-center">{label}</span>
    </div>
  );
}
