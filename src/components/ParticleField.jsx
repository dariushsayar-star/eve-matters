import { useEffect, useRef } from 'react';

export default function ParticleField({ density = 50, color = '244,196,48', className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf;
    let width, height;
    let particles = [];
    let running = true;

    function resize() {
      width = canvas.width = canvas.offsetWidth * pixelRatio;
      height = canvas.height = canvas.offsetHeight * pixelRatio;
    }

    function init() {
      resize();
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 * pixelRatio + 0.4,
        vy: (Math.random() * 0.35 + 0.08) * pixelRatio,
        vx: (Math.random() - 0.5) * 0.15 * pixelRatio,
        alpha: Math.random() * 0.6 + 0.15,
        pulse: Math.random() * Math.PI * 2
      }));
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.vy;
        p.x += p.vx;
        p.pulse += 0.02;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.fillStyle = rgba(${color},${a});
        ctx.shadowBlur = 6 * pixelRatio;
        ctx.shadowColor = rgba(${color},0.8);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    function handleVisibility() {
      running = document.visibilityState === 'visible';
      if (running) draw();
      else cancelAnimationFrame(raf);
    }

    init();
    draw();
    window.addEventListener('resize', init);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', init);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [density, color]);

  return <canvas ref={canvasRef} className={absolute inset-0 w-full h-full pointer-events-none ${className}} />;
}
