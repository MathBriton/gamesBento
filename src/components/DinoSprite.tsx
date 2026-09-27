import { useId, type ReactNode } from 'react';
import { CelPart, ell, mix, OUTLINE } from './Cel';
import { DINOSAURS } from '../data/dinosaurs';
import { EVOLUTIONS } from '../data/evolution';
import type { DinoId } from '../types';

/*
 * Dinossauros em estilo cartoon "chibi" (inspirado em jogos como DDTank):
 * cabeça grande, contorno escuro grosso, sombra "cel" dura, brilho e olhos grandes.
 * Cada parte do corpo é um <Part>, que aplica o sombreado automaticamente.
 */

export type SpriteMode = 'color' | 'silhouette';

interface Props {
  dinoId: DinoId;
  mode?: SpriteMode;
  /** Estágio de evolução (0 = Filhote … 4 = Lendário). */
  evolution?: number;
  className?: string;
  /** Vira o dinossauro para a esquerda. */
  flip?: boolean;
}

interface Palette {
  fill: string;
  shade: string;
  outline: string;
  accent: string;
  accentShade: string;
  mark: string;
  horn: string;
  hornShade: string;
  details: boolean;
  dash?: string;
}

const ALPHA_ACCENT = '#8fe0ff';
const LEGEND_ACCENT = '#ffd23f';

function paletteFor(dinoId: DinoId, mode: SpriteMode, evolution: number): Palette {
  const dino = DINOSAURS[dinoId];
  if (mode === 'silhouette') {
    const c = '#5b6b7a';
    return { fill: c, shade: c, outline: '#445260', accent: c, accentShade: c, mark: c, horn: c, hornShade: c, details: false };
  }
  // Evoluções mais altas têm cores mais intensas e detalhes especiais.
  const fill = evolution >= 2 ? mix(dino.color, evolution >= 3 ? 0.84 : 0.9) : dino.color;
  const accent = evolution >= 4 ? LEGEND_ACCENT : evolution >= 3 ? ALPHA_ACCENT : dino.accent;
  return {
    fill,
    shade: mix(fill, 0.72),
    outline: OUTLINE,
    accent,
    accentShade: mix(accent, 0.85),
    mark: evolution >= 4 ? '#ffb000' : mix(fill, 0.6),
    horn: evolution >= 4 ? '#fff0b0' : '#fff4d8',
    hornShade: evolution >= 4 ? '#e8b93a' : '#e6c98f',
    details: true,
  };
}

/* ---------- Marcas de evolução ---------- */

interface Anchors {
  /** Topo da cabeça: onde ficam a casca do filhote e a coroa. */
  head: [number, number];
  /** Espinhos nas costas: [x, y, ângulo]. Desenhados atrás do corpo. */
  spikes: [number, number, number][];
}

const ANCHORS: Record<DinoId, Anchors> = {
  triceratops: { head: [126, 42], spikes: [[50, 90, -50], [64, 81, -25], [80, 78, -5]] },
  apatosaurus: { head: [152, 14], spikes: [[50, 91, -45], [66, 82, -22], [84, 80, 0], [102, 82, 20]] },
  trex: { head: [148, 19], spikes: [[64, 84, -45], [76, 74, -25], [90, 70, -8]] },
};

function Spikes({ dinoId, p, big }: { dinoId: DinoId; p: Palette; big: boolean }) {
  const h = big ? 22 : 16;
  return (
    <g>
      {ANCHORS[dinoId].spikes.map(([x, y, a]) => (
        <path
          key={`${x}-${y}`}
          d={`M-8 2 L0 -${h} L8 2 Z`}
          transform={`translate(${x} ${y}) rotate(${a})`}
          fill={p.details ? p.accent : p.fill}
          stroke={p.outline}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function Aura({ color }: { color: string }) {
  const id = `aura${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <g className="dino-aura">
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={color} stopOpacity={0.75} />
          <stop offset="70%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={106} cy={96} rx={110} ry={80} fill={`url(#${id})`} />
    </g>
  );
}

function EggshellCap({ at }: { at: [number, number] }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(-12)`}>
      <path
        d="M-24 2 L-20 -12 Q0 -30 20 -12 L24 2 L16 -5 L8 3 L0 -5 L-8 3 L-16 -5 Z"
        fill="#fff1cc"
        stroke={OUTLINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <ellipse cx={-6} cy={-14} rx={5} ry={4} fill="#7fd36b" stroke={OUTLINE} strokeWidth={2} />
    </g>
  );
}

function Crown({ at }: { at: [number, number] }) {
  return (
    <g transform={`translate(${at[0]} ${at[1] + 4}) rotate(-8)`}>
      <path d="M-20 2 L-23 -20 L-10 -9 L0 -28 L10 -9 L23 -20 L20 2 Z" fill="#ffcc33" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={0} cy={-6} r={4} fill="#ff4d6d" stroke={OUTLINE} strokeWidth={2} />
      <circle cx={-12} cy={-4} r={2.5} fill="#4dc3ff" />
      <circle cx={12} cy={-4} r={2.5} fill="#4dc3ff" />
    </g>
  );
}

function Sparkles() {
  const star = 'M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z';
  return (
    <g fill="#fff6b0" stroke="#e8a800" strokeWidth={1.5}>
      {[[24, 40, 0], [196, 26, 0.6], [16, 132, 1.2], [200, 120, 0.3]].map(([x, y, delay]) => (
        <path key={`${x}-${y}`} d={star} transform={`translate(${x} ${y})`} className="sparkle" style={{ animationDelay: `${delay}s` }} />
      ))}
    </g>
  );
}

/* ---------- Geometria ---------- */

/** Perna curta com base arredondada; o topo fica escondido sob o corpo. */
function leg(x: number, y: number, w: number, h: number): string {
  const r = w * 0.45;
  return `M${x} ${y} L${x + w} ${y} L${x + w + 2} ${y + h - r} Q${x + w + 2} ${y + h} ${x + w - r} ${y + h} L${x + r - 2} ${y + h} Q${x - 2} ${y + h} ${x - 2} ${y + h - r} Z`;
}

/** Círculo com borda ondulada (o escudo do Tricerátops). */
function scallop(cx: number, cy: number, r: number, n: number, bump: number): string {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const p = (a: number, rr: number) => `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    if (i === 0) d += `M${p(a0, r)} `;
    d += `Q${p(am, r + bump)} ${p(a1, r)} `;
  }
  return `${d}Z`;
}

/* ---------- Peça com sombreado cel ---------- */

interface PartProps {
  d: string;
  p: Palette;
  fill?: string;
  shade?: string;
  width?: number;
  /** Brilho: [cx, cy, rx, ry] */
  shine?: [number, number, number, number];
  children?: ReactNode;
}

function Part({ d, p, fill = p.fill, shade = p.shade, width = 5, shine, children }: PartProps) {
  return (
    <CelPart d={d} fill={fill} shade={shade} outline={p.outline} width={width} dash={p.dash} shine={p.details ? shine : undefined}>
      {children}
    </CelPart>
  );
}

/* ---------- Detalhes do rosto ---------- */

function Eye({ x, y, p, scale = 1 }: { x: number; y: number; p: Palette; scale?: number }) {
  if (!p.details) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={12} ry={14} fill="#fff" stroke={OUTLINE} strokeWidth={3} />
      <ellipse cx={3} cy={2} rx={8.5} ry={10.5} fill="#22150d" />
      <ellipse cx={3} cy={7} rx={6} ry={4.5} fill="#7a4b22" />
      <circle cx={6.5} cy={-3} r={4} fill="#fff" />
      <circle cx={0} cy={7} r={1.8} fill="#fff" />
    </g>
  );
}

function Face({ blush, mouth, brow, nostril, p }: { blush: [number, number]; mouth: string; brow?: string; nostril?: [number, number]; p: Palette }) {
  if (!p.details) return null;
  return (
    <g>
      <ellipse cx={blush[0]} cy={blush[1]} rx={7} ry={4} fill="#ff7f96" opacity={0.65} />
      <path d={mouth} fill="none" stroke={OUTLINE} strokeWidth={3.5} strokeLinecap="round" />
      {brow && <path d={brow} fill="none" stroke={OUTLINE} strokeWidth={3.5} strokeLinecap="round" />}
      {nostril && <circle cx={nostril[0]} cy={nostril[1]} r={2.2} fill={OUTLINE} />}
    </g>
  );
}

function Nails({ feet, p }: { feet: [number, number][]; p: Palette }) {
  if (!p.details) return null;
  return (
    <g fill="#fff4d8" stroke={OUTLINE} strokeWidth={2}>
      {feet.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y} rx={3.5} ry={2.5} />
          <ellipse cx={x + 8} cy={y} rx={3.5} ry={2.5} />
        </g>
      ))}
    </g>
  );
}

function Spots({ spots, color, p }: { spots: [number, number, number][]; color: string; p: Palette }) {
  if (!p.details) return null;
  return (
    <g fill={color}>
      {spots.map(([x, y, r]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={r} ry={r * 0.8} />
      ))}
    </g>
  );
}

/* ---------- Espécies ---------- */

function Triceratops({ p }: { p: Palette }) {
  return (
    <g>
      <Part d="M50 112 Q22 104 8 124 Q28 134 58 128 Z" p={p} />
      <Part d={leg(72, 118, 24, 38)} p={p} fill={p.shade} shade={mix(p.shade, 0.85)} />
      <Part d={leg(118, 118, 24, 38)} p={p} fill={p.shade} shade={mix(p.shade, 0.85)} />
      <Part d={ell(84, 110, 46, 34)} p={p} shine={[66, 90, 16, 8]}>
        <ellipse cx={88} cy={132} rx={30} ry={11} fill={p.accent} />
      </Part>
      <Spots spots={[[64, 92, 6], [84, 86, 7], [104, 92, 5], [74, 106, 4]]} color={p.mark} p={p} />
      <Part d={leg(52, 120, 26, 38)} p={p} />
      <Part d={leg(98, 120, 26, 38)} p={p} />
      <Nails feet={[[57, 156], [103, 156]]} p={p} />
      <Part d={scallop(132, 74, 40, 11, 9)} p={p} fill={p.accent} shade={p.accentShade}>
        <circle cx={132} cy={74} r={29} fill={p.fill} opacity={p.details ? 0.35 : 0} />
      </Part>
      <Spots spots={[[106, 52, 4], [120, 42, 4], [140, 38, 4], [158, 46, 4]]} color={p.mark} p={p} />
      <Part d={ell(150, 98, 40, 34)} p={p} shine={[136, 78, 14, 7]} />
      <Part d="M180 102 Q208 104 200 124 Q188 126 178 116 Z" p={p} fill={p.details ? '#e8b061' : p.horn} shade={p.details ? '#c98f45' : p.hornShade} width={4} />
      <Part d="M138 72 Q134 40 148 18 Q158 44 156 74 Z" p={p} fill={p.horn} shade={p.hornShade} width={4} />
      <Part d="M164 74 Q170 42 190 28 Q190 56 180 80 Z" p={p} fill={p.horn} shade={p.hornShade} width={4} />
      <Part d="M188 96 Q194 82 206 78 Q204 94 196 104 Z" p={p} fill={p.horn} shade={p.hornShade} width={4} />
      <Eye x={160} y={96} p={p} />
      <Face p={p} blush={[167, 116]} mouth="M170 122 Q178 128 186 121" brow="M148 80 Q159 75 170 81" />
    </g>
  );
}

function Apatosaurus({ p }: { p: Palette }) {
  return (
    <g>
      <Part d="M48 112 Q10 102 4 128 Q2 148 24 144 Q14 132 26 128 Q40 124 56 130 Z" p={p} />
      <Part d={leg(68, 118, 24, 40)} p={p} fill={p.shade} shade={mix(p.shade, 0.85)} />
      <Part d={leg(114, 118, 24, 40)} p={p} fill={p.shade} shade={mix(p.shade, 0.85)} />
      {/* Pescoço antes do corpo: a base fica escondida atrás dele. */}
      <Part d="M110 102 Q124 72 124 44 L160 44 Q158 90 134 126 Z" p={p} shine={[130, 70, 5, 14]}>
        <path d="M150 50 Q148 92 128 120 L140 124 Q162 90 162 50 Z" fill={p.accent} opacity={0.9} />
      </Part>
      <Part d={ell(84, 112, 48, 34)} p={p} shine={[64, 92, 18, 8]}>
        <ellipse cx={88} cy={134} rx={32} ry={11} fill={p.accent} />
      </Part>
      <Spots spots={[[66, 94, 7], [90, 88, 8], [112, 96, 6], [78, 110, 5]]} color={p.mark} p={p} />
      <Spots spots={[[132, 86, 4], [136, 66, 4]]} color={p.mark} p={p} />
      <Part d={leg(50, 120, 26, 40)} p={p} />
      <Part d={leg(96, 120, 26, 40)} p={p} />
      <Nails feet={[[55, 158], [101, 158]]} p={p} />
      <Part d={ell(152, 40, 36, 29)} p={p} shine={[138, 22, 13, 6]} />
      <Spots spots={[[128, 30, 4], [140, 16, 3.5]]} color={p.mark} p={p} />
      <Eye x={160} y={38} p={p} />
      <Face p={p} blush={[176, 52]} mouth="M166 58 Q175 63 184 56" nostril={[182, 30]} />
    </g>
  );
}

function TRex({ p }: { p: Palette }) {
  return (
    <g>
      <Part d="M72 98 Q34 88 6 108 Q28 128 82 124 Z" p={p} />
      <Part d={leg(102, 116, 26, 40)} p={p} fill={p.shade} shade={mix(p.shade, 0.85)} />
      <Part d={ell(96, 104, 38, 36)} p={p} shine={[80, 84, 14, 8]}>
        <ellipse cx={106} cy={118} rx={24} ry={18} fill={p.accent} />
      </Part>
      {p.details && (
        <g fill={p.mark}>
          <path d="M66 86 L78 80 L74 94 Z" />
          <path d="M76 74 L90 70 L84 84 Z" />
          <path d="M40 100 L52 96 L48 108 Z" />
        </g>
      )}
      <Part d={leg(72, 114, 30, 44)} p={p} />
      <Nails feet={[[78, 156]]} p={p} />
      <Part d="M120 108 Q142 104 148 116 Q140 124 124 122 Z" p={p} width={4} />
      {p.details && (
        <g fill="#fff4d8" stroke={OUTLINE} strokeWidth={2}>
          <path d="M146 112 l6 1 l-4 4 Z" />
          <path d="M146 118 l5 3 l-5 2 Z" />
        </g>
      )}
      <Part d="M102 60 C100 30 126 14 156 16 C186 18 206 34 206 58 C206 80 188 94 156 94 C126 94 104 86 102 60 Z" p={p} shine={[128, 32, 18, 8]}>
        <path d="M120 84 Q160 102 204 70 L206 96 L110 96 Z" fill={p.accent} />
      </Part>
      {p.details && (
        <g fill={p.mark}>
          <path d="M118 30 L128 22 L130 36 Z" />
          <path d="M134 22 L146 16 L146 30 Z" />
        </g>
      )}
      {p.details && (
        <g fill="#fff" stroke={OUTLINE} strokeWidth={2} strokeLinejoin="round">
          <path d="M160 80 l4 8 l4 -8 Z" />
          <path d="M174 80 l4 8 l4 -8 Z" />
          <path d="M188 76 l4 7 l3 -8 Z" />
        </g>
      )}
      <Eye x={152} y={50} p={p} scale={1.05} />
      <Face p={p} blush={[170, 68]} mouth="M148 80 Q176 86 200 72" brow="M136 34 Q151 28 166 36" nostril={[196, 42]} />
    </g>
  );
}

export function DinoSprite({ dinoId, mode = 'color', evolution = 1, className, flip }: Props) {
  const p = paletteFor(dinoId, mode, evolution);
  const name = DINOSAURS[dinoId].name;
  const aura = p.details ? EVOLUTIONS[evolution]?.aura : null;
  const head = ANCHORS[dinoId].head;
  return (
    <svg
      viewBox="-6 -14 224 184"
      className={className}
      role="img"
      aria-label={mode === 'silhouette' ? 'Dinossauro misterioso' : name}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {aura && <Aura color={aura} />}
      <ellipse cx={100} cy={160} rx={70} ry={7} fill="rgba(0,0,0,0.15)" />
      {evolution >= 2 && <Spikes dinoId={dinoId} p={p} big={evolution >= 3} />}
      {dinoId === 'triceratops' && <Triceratops p={p} />}
      {dinoId === 'apatosaurus' && <Apatosaurus p={p} />}
      {dinoId === 'trex' && <TRex p={p} />}
      {p.details && evolution === 0 && <EggshellCap at={head} />}
      {p.details && evolution >= 4 && <Crown at={head} />}
      {p.details && evolution >= 4 && <Sparkles />}
    </svg>
  );
}
