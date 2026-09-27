import { useId, type ReactNode } from 'react';

/*
 * Primitivas do estilo cartoon (guia estético, seções 4 e 5): contorno escuro forte e
 * cel shading com uma cor base, uma sombra principal e um brilho simples.
 * A forma é pintada na cor da sombra e coberta por uma cópia deslocada na cor base,
 * deixando uma borda de sombra embaixo/à direita (luz vindo de cima/esquerda).
 */

export const CONTORNO = '#3a2418';

/** Escurece (fator < 1) ou clareia (fator > 1) uma cor hex. */
export function misturarCor(hex: string, fator: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(fator < 1 ? v * fator : v + (255 - v) * (fator - 1));
  const r = f(n >> 16), g = f((n >> 8) & 0xff), b = f(n & 0xff);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function elipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
}

/** Elipse girada em `graus` (para corpos inclinados). */
export function elipseGirada(cx: number, cy: number, rx: number, ry: number, graus: number): string {
  const a = (graus * Math.PI) / 180;
  const dx = rx * Math.cos(a);
  const dy = rx * Math.sin(a);
  return `M${cx - dx} ${cy - dy} A${rx} ${ry} ${graus} 1 0 ${cx + dx} ${cy + dy} A${rx} ${ry} ${graus} 1 0 ${cx - dx} ${cy - dy} Z`;
}

interface PecaCelProps {
  d: string;
  cor: string;
  sombra?: string;
  contorno?: string;
  espessura?: number;
  tracejado?: string;
  /** Deslocamento da cor base; controla a largura da sombra. */
  deslocamento?: [number, number];
  /** Brilho: [cx, cy, rx, ry] */
  brilho?: [number, number, number, number];
  children?: ReactNode;
}

export function PecaCel({ d, cor, sombra = misturarCor(cor, 0.72), contorno = CONTORNO, espessura = 5, tracejado, deslocamento = [-7, -9], brilho, children }: PecaCelProps) {
  const id = `recorte${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={sombra} />
      <g clipPath={`url(#${id})`}>
        <path d={d} fill={cor} transform={`translate(${deslocamento[0]} ${deslocamento[1]})`} />
        {children}
        {brilho && <ellipse cx={brilho[0]} cy={brilho[1]} rx={brilho[2]} ry={brilho[3]} fill="#fff" opacity={0.45} />}
      </g>
      <path d={d} fill="none" stroke={contorno} strokeWidth={espessura} strokeLinejoin="round" strokeDasharray={tracejado} />
    </g>
  );
}
