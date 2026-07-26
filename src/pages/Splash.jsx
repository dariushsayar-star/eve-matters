import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ParticleField from '../components/ParticleField.jsx';

export default function Splash() {
  const navigate = useNavigate();
  const logoRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8, letterSpacing: '0.6em' },
      { opacity: 1, scale: 1, letterSpacing: '0.35em', duration: 1.4, ease: 'power3.out' }
    ).to(glowRef.current, { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=1');

    const timeout = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 3000);

    return () => {
      clearTimeout(timeout);
      tl.kill();
    };
  }, [navigate]);

  return (
    <div className="relative w-full h-full bg-void flex items-center justify-center overflow-hidden">
      <ParticleField density={90} />

      {/* Radial golden glow behind the logo */}
      <div
        ref={glowRef}
        className="absolute w-[600px] h-[600px] rounded-full opacity-0"
        style={{ background: 'radial-gradient(circle, rgba(244,196,48,0.25) 0%, rgba(244,196,48,0) 70%)' }}
      />

      <div className="relative flex flex-col items-center gap-6">
        <h1
          ref={logoRef}
          className="text-6xl md:text-8xl font-black tracking-[0.35em] gold-text opacity-0"
        >
          EVE
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-ash tracking-[0.5em] text-sm md:text-base"
        >
          MATTERS
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-4 w-40 h-[2px] bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ delay: 1.6, duration: 1.4, ease: 'easeInOut' }}
            className="h-full w-full bg-gradient-to-l from-gold-dark via-gold to-gold-light"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-ash/70 text-xs tracking-widest"
        >
          مرکز تجربه محصول
        </motion.p>
      </div>
    </div>
  );
}
