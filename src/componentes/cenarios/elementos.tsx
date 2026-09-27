import { useId } from 'react';
import { CONTORNO } from '../Cel';

/*
 * Elementos reutilizáveis dos cenários (caixa 400x300, chão por volta de y=200).
 * Camadas distantes sem contorno e mais claras (profundidade); camadas próximas com
 * contorno, no mesmo estilo cartoon dos personagens.
 */

/** Gradiente vertical do céu (ou teto da caverna). */
export function Ceu({ cores }: { cores: string[] }) {
  const id = `ceu${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {cores.map((c, i) => (
            <stop key={i} offset={`${(i / (cores.length - 1)) * 100}%`} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={400} height={300} fill={`url(#${id})`} />
    </g>
  );
}

/** Brilho suave em volta de um astro (lua, sol, lava). */
export function Brilho({ x, y, r, cor, opacidade = 0.35 }: { x: number; y: number; r: number; cor: string; opacidade?: number }) {
  const id = `brilho${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={cor} stopOpacity={opacidade} />
          <stop offset="100%" stopColor={cor} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  );
}

const POSICOES_ESTRELAS: [number, number, number][] = [
  [20, 20, 1.6], [58, 44, 1.2], [96, 16, 1.8], [132, 58, 1.1], [170, 28, 1.5], [214, 12, 1.2], [238, 50, 1.7],
  [270, 26, 1.1], [352, 22, 1.4], [380, 58, 1.2], [30, 84, 1.1], [150, 96, 1.3], [200, 76, 1], [390, 110, 1.3],
];

export function Estrelas({ ate = 110 }: { ate?: number }) {
  return (
    <g fill="#fffbe0">
      {POSICOES_ESTRELAS.filter(([, y]) => y <= ate).map(([x, y, r], i) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="cenario__piscar" style={{ animationDelay: `${(i % 5) * 0.5}s` }} />
      ))}
    </g>
  );
}

export function Lua({ x, y, r, cor = '#fff4c2', crateras = '#f0dc94' }: { x: number; y: number; r: number; cor?: string; crateras?: string }) {
  return (
    <g>
      <Brilho x={x} y={y} r={r * 2.4} cor={cor} />
      <circle cx={x} cy={y} r={r} fill={cor} />
      <circle cx={x - r * 0.35} cy={y - r * 0.2} r={r * 0.22} fill={crateras} />
      <circle cx={x + r * 0.3} cy={y + r * 0.3} r={r * 0.16} fill={crateras} />
      <circle cx={x + r * 0.15} cy={y - r * 0.45} r={r * 0.1} fill={crateras} />
    </g>
  );
}

export function Nuvem({ x, y, escala = 1, cor = '#ffffff', sombra = '#cfe6f5', animar = true }: { x: number; y: number; escala?: number; cor?: string; sombra?: string; animar?: boolean }) {
  return (
    <g className={animar ? 'cenario__nuvem' : undefined}>
      <g transform={`translate(${x} ${y}) scale(${escala})`}>
        <path d="M-30 8 Q-34 -6 -18 -8 Q-14 -22 2 -18 Q12 -30 26 -18 Q40 -18 38 -4 Q48 2 38 10 Z" fill={sombra} transform="translate(2 4)" />
        <path d="M-30 8 Q-34 -6 -18 -8 Q-14 -22 2 -18 Q12 -30 26 -18 Q40 -18 38 -4 Q48 2 38 10 Z" fill={cor} />
      </g>
    </g>
  );
}

/** Pinheiro com contorno (camada do meio). `neve` coloca neve nas pontas. */
export function Pinheiro({ x, y, escala = 1, cor = '#1f4d3a', neve = false }: { x: number; y: number; escala?: number; cor?: string; neve?: boolean }) {
  const camadas = [
    'M-26 0 L0 -34 L26 0 Z',
    'M-21 -22 L0 -54 L21 -22 Z',
    'M-15 -42 L0 -70 L15 -42 Z',
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <rect x={-5} y={-2} width={10} height={14} fill="#6b4226" stroke={CONTORNO} strokeWidth={2.5} />
      {camadas.map((d) => (
        <path key={d} d={d} fill={cor} stroke={CONTORNO} strokeWidth={2.5} strokeLinejoin="round" />
      ))}
      {neve && (
        <g fill="#f4fbff" stroke={CONTORNO} strokeWidth={1.5} strokeLinejoin="round">
          <path d="M-8 -60 L0 -70 L8 -60 Q4 -56 0 -60 Q-4 -56 -8 -60 Z" />
          <path d="M-12 -40 L0 -54 L12 -40 Q6 -36 0 -40 Q-6 -36 -12 -40 Z" />
          <path d="M-14 -18 L0 -34 L14 -18 Q7 -14 0 -18 Q-7 -14 -14 -18 Z" />
        </g>
      )}
    </g>
  );
}

/** Árvore redonda (copa em bolhas). */
export function ArvoreRedonda({ x, y, escala = 1, cor = '#2f6b45', tronco = '#6b4226' }: { x: number; y: number; escala?: number; cor?: string; tronco?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <path d="M-6 0 L-4 -30 L4 -30 L6 0 Z" fill={tronco} stroke={CONTORNO} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-30 -34 Q-36 -58 -16 -60 Q-14 -80 6 -76 Q24 -84 30 -62 Q46 -52 32 -34 Q0 -24 -30 -34 Z" fill={cor} stroke={CONTORNO} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-18 -56 Q-10 -66 2 -64" fill="none" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** Chão com contorno na borda de cima. */
export function Chao({ d, cor, sombra, borda = CONTORNO }: { d: string; cor: string; sombra: string; borda?: string }) {
  return (
    <g>
      <path d={d} fill={sombra} transform="translate(0 6)" />
      <path d={d} fill={cor} stroke={borda} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
}

export function Tufos({ pontos, cor }: { pontos: [number, number][]; cor: string }) {
  return (
    <g fill="none" stroke={cor} strokeWidth={3} strokeLinecap="round">
      {pontos.map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x - 6} ${y} Q${x - 4} ${y - 8} ${x - 2} ${y} M${x} ${y} Q${x + 1} ${y - 11} ${x + 3} ${y} M${x + 4} ${y} Q${x + 7} ${y - 7} ${x + 8} ${y}`} />
      ))}
    </g>
  );
}

/** Partículas animadas (vaga-lumes, neve, brasas). */
export function Particulas({ pontos, cor, r = 2.2, classe }: { pontos: [number, number][]; cor: string; r?: number; classe: string }) {
  return (
    <g fill={cor}>
      {pontos.map(([x, y], i) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className={classe} style={{ animationDelay: `${(i * 0.7) % 4}s` }} />
      ))}
    </g>
  );
}
