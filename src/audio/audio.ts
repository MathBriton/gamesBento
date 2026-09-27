import type { Settings } from '../types';

/*
 * Áudio básico sem arquivos: efeitos sintetizados com Web Audio,
 * uma melodia de fundo simples e narração via Speech Synthesis (pt-BR).
 */

export type Sfx =
  | 'tap' | 'crack' | 'hatch' | 'success' | 'star' | 'munch' | 'boing' | 'love' | 'fanfare' | 'soft'
  | 'hit' | 'crit' | 'coin' | 'boss' | 'levelup' | 'evolve' | 'fail';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicTimer: number | null = null;
let settings: Settings = { music: true, sfx: true, narration: true, volume: 0.7 };

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = settings.volume;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Deve ser chamado a partir de um gesto do usuário (toque/clique) para liberar o áudio. */
export function unlockAudio(): void {
  ensureContext();
  syncMusic();
}

export function applyAudioSettings(next: Settings): void {
  settings = next;
  if (master) master.gain.value = next.volume;
  if (!next.narration && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  syncMusic();
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', gain = 0.3, slideTo?: number) {
  const c = ctx;
  if (!c || !master) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  const t0 = c.currentTime + start;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function noise(start: number, duration: number, gain = 0.3) {
  const c = ctx;
  if (!c || !master) return;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * duration), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  const g = c.createGain();
  g.gain.value = gain;
  src.buffer = buffer;
  src.connect(g).connect(master);
  src.start(c.currentTime + start);
}

export function playSfx(name: Sfx): void {
  if (!settings.sfx || !ensureContext()) return;
  switch (name) {
    case 'tap':
      tone(660, 0, 0.08, 'triangle', 0.2);
      break;
    case 'soft':
      tone(440, 0, 0.15, 'sine', 0.15);
      break;
    case 'crack':
      noise(0, 0.12, 0.4);
      tone(300, 0, 0.1, 'square', 0.08, 150);
      break;
    case 'hatch':
      noise(0, 0.25, 0.5);
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.1 + i * 0.09, 0.25, 'triangle', 0.25));
      break;
    case 'success':
      [523, 659, 784].forEach((f, i) => tone(f, i * 0.1, 0.2, 'triangle', 0.25));
      break;
    case 'star':
      tone(988, 0, 0.1, 'sine', 0.2);
      tone(1319, 0.08, 0.2, 'sine', 0.2);
      break;
    case 'munch':
      [0, 0.12, 0.24].forEach((t) => noise(t, 0.07, 0.25));
      break;
    case 'boing':
      tone(200, 0, 0.3, 'sine', 0.3, 600);
      break;
    case 'love':
      tone(784, 0, 0.15, 'sine', 0.2);
      tone(1047, 0.12, 0.3, 'sine', 0.2);
      break;
    case 'fanfare':
      [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.28, 'square', 0.12));
      break;
    case 'hit':
      noise(0, 0.05, 0.18);
      tone(180, 0, 0.07, 'square', 0.08, 90);
      break;
    case 'crit':
      noise(0, 0.1, 0.35);
      tone(880, 0, 0.12, 'square', 0.12, 1760);
      break;
    case 'coin':
      tone(1319, 0, 0.06, 'square', 0.07);
      tone(1760, 0.05, 0.12, 'square', 0.07);
      break;
    case 'boss':
      [196, 185, 175, 165].forEach((f, i) => tone(f, i * 0.18, 0.3, 'sawtooth', 0.1));
      break;
    case 'levelup':
      [523, 784].forEach((f, i) => tone(f, i * 0.06, 0.12, 'triangle', 0.18));
      break;
    case 'evolve':
      [262, 330, 392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.08, 0.35, 'triangle', 0.2));
      noise(0.6, 0.4, 0.3);
      break;
    case 'fail':
      [392, 330, 262].forEach((f, i) => tone(f, i * 0.15, 0.25, 'triangle', 0.18));
      break;
  }
}

/* Melodia de fundo: pentatônica suave, gerada em loop enquanto a música estiver ligada. */
const MELODY = [392, 440, 523, 587, 659, 587, 523, 440, 392, 330, 392, 440];

function syncMusic() {
  const shouldPlay = settings.music && ctx !== null;
  if (shouldPlay && musicTimer === null) {
    let step = 0;
    const playStep = () => {
      if (ctx?.state === 'running') {
        tone(MELODY[step % MELODY.length], 0, 0.45, 'sine', 0.05);
        if (step % 4 === 0) tone(MELODY[step % MELODY.length] / 2, 0, 0.9, 'triangle', 0.04);
      }
      step++;
    };
    playStep();
    musicTimer = window.setInterval(playStep, 500);
  } else if (!shouldPlay && musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}

export function speak(text: string): void {
  if (!settings.narration || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.rate = 0.9;
  utter.pitch = 1.2;
  utter.volume = settings.volume;
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('pt'));
  if (voice) utter.voice = voice;
  synth.speak(utter);
}

const NUMBER_WORDS = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];

export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}
