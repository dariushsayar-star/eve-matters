// Shared GSAP animation presets used across the app for consistent motion language.
export const fadeUp = (target, opts = {}) => ({
  targets: target,
  opacity: [0, 1],
  y: [24, 0],
  duration: 0.8,
  ease: 'power3.out',
  ...opts
});

export const goldGlowPulse = {
  boxShadow: '0 0 0px rgba(244,196,48,0)',
  repeat: -1,
  yoyo: true,
  duration: 2.4,
  ease: 'sine.inOut'
};

/** Ripple effect helper: expands and fades a circular element from a click point. */
export function ripple(gsap, element) {
  gsap.fromTo(
    element,
    { scale: 0, opacity: 0.5 },
    { scale: 3, opacity: 0, duration: 0.6, ease: 'power2.out' }
  );
}

/** Standard page/section reveal timeline used by GSAP-driven pages. */
export function revealTimeline(gsap, elements, opts = {}) {
  return gsap.timeline(opts).from(elements, {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out'
  });
}
