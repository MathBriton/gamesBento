import type { Ajustes } from '../tipos';

/*
 * Áudio sem arquivos: efeitos sintetizados com Web Audio, uma melodia de fundo simples
 * e narração via Speech Synthesis (pt-BR), usada só em botões 🔊 explícitos.
 */

export type Efeito = 'toque' | 'suave' | 'acerto' | 'critico' | 'moeda' | 'chefao' | 'nivel' | 'compra' | 'armadura' | 'falha';

let contexto: AudioContext | null = null;
let volumeGeral: GainNode | null = null;
let relogioMusica: number | null = null;
let ajustes: Ajustes = { musica: true, efeitos: true, narracao: true, volume: 0.7 };

function garantirContexto(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!contexto) {
    const Construtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Construtor) return null;
    contexto = new Construtor();
    volumeGeral = contexto.createGain();
    volumeGeral.gain.value = ajustes.volume;
    volumeGeral.connect(contexto.destination);
  }
  if (contexto.state === 'suspended') void contexto.resume();
  return contexto;
}

/** Deve ser chamado a partir de um gesto do usuário (toque/clique) para liberar o áudio. */
export function liberarAudio(): void {
  garantirContexto();
  sincronizarMusica();
}

export function aplicarAjustesDeAudio(novos: Ajustes): void {
  ajustes = novos;
  if (volumeGeral) volumeGeral.gain.value = novos.volume;
  if (!novos.narracao && typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  sincronizarMusica();
}

function nota(freq: number, inicio: number, duracao: number, onda: OscillatorType = 'sine', ganho = 0.3, deslizarPara?: number) {
  const c = contexto;
  if (!c || !volumeGeral) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = onda;
  const t0 = c.currentTime + inicio;
  osc.frequency.setValueAtTime(freq, t0);
  if (deslizarPara) osc.frequency.exponentialRampToValueAtTime(deslizarPara, t0 + duracao);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(ganho, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duracao);
  osc.connect(g).connect(volumeGeral);
  osc.start(t0);
  osc.stop(t0 + duracao + 0.05);
}

function ruido(inicio: number, duracao: number, ganho = 0.3) {
  const c = contexto;
  if (!c || !volumeGeral) return;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * duracao), c.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < dados.length; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / dados.length);
  const fonte = c.createBufferSource();
  const g = c.createGain();
  g.gain.value = ganho;
  fonte.buffer = buffer;
  fonte.connect(g).connect(volumeGeral);
  fonte.start(c.currentTime + inicio);
}

export function tocarEfeito(efeito: Efeito): void {
  if (!ajustes.efeitos || !garantirContexto()) return;
  switch (efeito) {
    case 'toque':
      nota(660, 0, 0.08, 'triangle', 0.2);
      break;
    case 'suave':
      nota(440, 0, 0.15, 'sine', 0.15);
      break;
    case 'acerto':
      ruido(0, 0.05, 0.18);
      nota(180, 0, 0.07, 'square', 0.08, 90);
      break;
    case 'critico':
      ruido(0, 0.1, 0.35);
      nota(880, 0, 0.12, 'square', 0.12, 1760);
      break;
    case 'moeda':
      nota(1319, 0, 0.06, 'square', 0.07);
      nota(1760, 0.05, 0.12, 'square', 0.07);
      break;
    case 'chefao':
      [196, 185, 175, 165].forEach((f, i) => nota(f, i * 0.18, 0.3, 'sawtooth', 0.1));
      break;
    case 'nivel':
      [523, 784].forEach((f, i) => nota(f, i * 0.06, 0.12, 'triangle', 0.18));
      break;
    case 'compra':
      [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.08, 0.22, 'triangle', 0.2));
      break;
    case 'armadura':
      [262, 330, 392, 523, 659, 784, 1047, 1319].forEach((f, i) => nota(f, i * 0.08, 0.35, 'triangle', 0.2));
      ruido(0.6, 0.4, 0.3);
      break;
    case 'falha':
      [392, 330, 262].forEach((f, i) => nota(f, i * 0.15, 0.25, 'triangle', 0.18));
      break;
  }
}

/* Melodia de fundo: pentatônica suave, em loop enquanto a música estiver ligada. */
const MELODIA = [392, 440, 523, 587, 659, 587, 523, 440, 392, 330, 392, 440];

function sincronizarMusica() {
  const tocar = ajustes.musica && contexto !== null;
  if (tocar && relogioMusica === null) {
    let passo = 0;
    const tocarPasso = () => {
      if (contexto?.state === 'running') {
        nota(MELODIA[passo % MELODIA.length], 0, 0.45, 'sine', 0.05);
        if (passo % 4 === 0) nota(MELODIA[passo % MELODIA.length] / 2, 0, 0.9, 'triangle', 0.04);
      }
      passo++;
    };
    tocarPasso();
    relogioMusica = window.setInterval(tocarPasso, 500);
  } else if (!tocar && relogioMusica !== null) {
    window.clearInterval(relogioMusica);
    relogioMusica = null;
  }
}

/** Narração (só para botões 🔊). */
export function falar(texto: string): void {
  if (!ajustes.narracao || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const sintese = window.speechSynthesis;
  sintese.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 0.95;
  fala.pitch = 1.1;
  fala.volume = ajustes.volume;
  const voz = sintese.getVoices().find((v) => v.lang.toLowerCase().startsWith('pt'));
  if (voz) fala.voice = voz;
  sintese.speak(fala);
}
