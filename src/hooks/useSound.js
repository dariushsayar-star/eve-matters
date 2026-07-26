import { useCallback, useRef } from 'react';
import { useSettings } from './useSettings.jsx';

/*
  Lightweight, dependency-free "luxury" UI sound designer using the Web Audio API.
  This avoids shipping binary .mp3/.wav assets while still giving the showroom
  app tactile click / hover / transition feedback out of the box.

  To swap in real recorded sound design later, drop files into
  src/assets/sounds/ and replace the play* functions with an <audio> based player.
*/
let sharedCtx = null;
function getCtx() {
  if (!sharedCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    sharedCtx = new AudioCtx();
  }
  return sharedCtx;
}

function tone({ freq = 880, duration = 0.12, type = 'sine', gain = 0.06, glideTo = null }) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (glideTo) {
    osc.frequency.exponentialRampToValueAtTime(glideTo, ctx.currentTime + duration);
  }
  amp.gain.setValueAtTime(gain, ctx.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(amp).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

export function useSound() {
  const { settings } = useSettings();
  const enabled = useRef(settings.soundEnabled);
  enabled.current = settings.soundEnabled;

  const playClick = useCallback(() => {
    if (!enabled.current) return;
    tone({ freq: 720, glideTo: 340, duration: 0.09, type: 'sine', gain: 0.05 });
  }, []);

  const playHover = useCallback(() => {
    if (!enabled.current) return;
    tone({ freq: 1400, duration: 0.05, type: 'sine', gain: 0.02 });
  }, []);

  const playTransition = useCallback(() => {
    if (!enabled.current) return;
    tone({ freq: 260, glideTo: 620, duration: 0.35, type: 'triangle', gain: 0.035 });
  }, []);

  const playChime = useCallback(() => {
    if (!enabled.current) return;
    tone({ freq: 523.25, duration: 0.4, type: 'sine', gain: 0.05 });
    setTimeout(() => tone({ freq: 783.99, duration: 0.5, type: 'sine', gain: 0.04 }), 90);
  }, []);

  return { playClick, playHover, playTransition, playChime };
}
