import { useId, type ReactNode } from 'react';

/*
 * Primitivas do estilo cartoon do jogo: contorno escuro grosso e sombra "cel"
 * (a forma é pintada na cor da sombra e coberta por uma cópia deslocada na cor base,
 * deixando uma borda escura embaixo/à direita).
 */

export const OUTLINE = '#3a2418';

/** Escurece (factor < 1) ou clareia (factor > 1) uma cor hex. */
export function mix(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(factor < 1 ? v * factor : v + (255 - v) * (factor - 1));
  const r = f(n >> 16), g = f((n >> 8) & 0xff), b = f(n & 0xff);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function ell(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
}

interface CelPartProps {
  d: string;
  fill: string;
  shade?: string;
  outline?: string;
  width?: number;
  dash?: string;
  /** Deslocamento da cor base; controla a espessura da sombra. */
  offset?: [number, number];
  /** Brilho: [cx, cy, rx, ry] */
  shine?: [number, number, number, number];
  children?: ReactNode;
}

export function CelPart({ d, fill, shade = mix(fill, 0.72), outline = OUTLINE, width = 5, dash, offset = [-7, -9], shine, children }: CelPartProps) {
  const id = `clip${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={shade} />
      <g clipPath={`url(#${id})`}>
        <path d={d} fill={fill} transform={`translate(${offset[0]} ${offset[1]})`} />
        {children}
        {shine && <ellipse cx={shine[0]} cy={shine[1]} rx={shine[2]} ry={shine[3]} fill="#fff" opacity={0.45} />}
      </g>
      <path d={d} fill="none" stroke={outline} strokeWidth={width} strokeLinejoin="round" strokeDasharray={dash} />
    </g>
  );
}
