import type { ReactNode } from 'react';
import { CONTORNO, PecaCel } from '../Cel';

/** Cores usadas no desenho de uma espécie (derivadas da cor do guia ou cinza na silhueta). */
export interface Paleta {
  base: string;
  sombra: string;
  detalhe: string;
  detalheSombra: string;
  /** Manchas e listras. */
  marca: string;
  /** Pernas do lado de trás (mais escuras, dão profundidade 3/4). */
  fundo: string;
  chifre: string;
  chifreSombra: string;
  contorno: string;
  /** false na silhueta: sem olhos, manchas, brilhos. */
  detalhes: boolean;
}

interface PecaProps {
  d: string;
  p: Paleta;
  cor?: string;
  sombra?: string;
  espessura?: number;
  brilho?: [number, number, number, number];
  children?: ReactNode;
}

/** Parte do corpo com cel shading nas cores da paleta. */
export function Peca({ d, p, cor = p.base, sombra = p.sombra, espessura = 5, brilho, children }: PecaProps) {
  return (
    <PecaCel d={d} cor={cor} sombra={sombra} contorno={p.contorno} espessura={espessura} brilho={p.detalhes ? brilho : undefined}>
      {p.detalhes && children}
    </PecaCel>
  );
}

/** Perna com a base arredondada (patas relativamente grandes, guia seção 3). O topo fica sob o corpo. */
export function perna(x: number, y: number, largura: number, altura: number): string {
  const r = largura * 0.45;
  const l = largura;
  const a = altura;
  return `M${x} ${y} L${x + l} ${y} L${x + l + 3} ${y + a - r} Q${x + l + 3} ${y + a} ${x + l - r} ${y + a} L${x + r - 3} ${y + a} Q${x - 3} ${y + a} ${x - 3} ${y + a - r} Z`;
}

/** Perna do lado de trás: mais escura. */
export function PernaFundo({ d, p }: { d: string; p: Paleta }) {
  return <Peca d={d} p={p} cor={p.fundo} sombra={p.sombra} />;
}

/**
 * Olho grande e amigável (guia seção 7): branco, pupila visível e dois brilhos.
 * Na visão 3/4 o olho de trás é desenhado menor (escala ~0.78).
 */
export function Olho({ x, y, p, escala = 1 }: { x: number; y: number; p: Paleta; escala?: number }) {
  if (!p.detalhes) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <ellipse cx={0} cy={0} rx={11} ry={13} fill="#fff" stroke={CONTORNO} strokeWidth={3} />
      <ellipse cx={2.5} cy={2} rx={7.5} ry={9.5} fill="#22150d" />
      <ellipse cx={2.5} cy={6.5} rx={5.5} ry={4} fill="#7a4b22" />
      <circle cx={5.5} cy={-3} r={3.6} fill="#fff" />
      <circle cx={-0.5} cy={6.5} r={1.6} fill="#fff" />
    </g>
  );
}

interface RostoProps {
  p: Paleta;
  bochecha: [number, number];
  boca: string;
  sobrancelhas?: string[];
  narina?: [number, number];
  /** Dentinhos arredondados (carnívoros), sempre discretos (guia seção 2). */
  dentes?: [number, number][];
}

export function Rosto({ p, bochecha, boca, sobrancelhas = [], narina, dentes = [] }: RostoProps) {
  if (!p.detalhes) return null;
  return (
    <g>
      <ellipse cx={bochecha[0]} cy={bochecha[1]} rx={7} ry={4} fill="#ff7f96" opacity={0.6} />
      {dentes.map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x - 3.5} ${y} Q${x} ${y + 8} ${x + 3.5} ${y} Z`} fill="#fff" stroke={CONTORNO} strokeWidth={1.8} strokeLinejoin="round" />
      ))}
      <path d={boca} fill="none" stroke={CONTORNO} strokeWidth={3.5} strokeLinecap="round" />
      {sobrancelhas.map((d) => (
        <path key={d} d={d} fill="none" stroke={CONTORNO} strokeWidth={3.2} strokeLinecap="round" />
      ))}
      {narina && <circle cx={narina[0]} cy={narina[1]} r={2.2} fill={CONTORNO} />}
    </g>
  );
}

/** Unhas claras na frente das patas. */
export function Unhas({ patas, p }: { patas: [number, number][]; p: Paleta }) {
  if (!p.detalhes) return null;
  return (
    <g fill="#fff4d8" stroke={CONTORNO} strokeWidth={2}>
      {patas.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y} rx={3.5} ry={2.5} />
          <ellipse cx={x + 8} cy={y} rx={3.5} ry={2.5} />
        </g>
      ))}
    </g>
  );
}

export function Manchas({ manchas, cor, p }: { manchas: [number, number, number][]; cor: string; p: Paleta }) {
  if (!p.detalhes) return null;
  return (
    <g fill={cor}>
      {manchas.map(([x, y, r]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={r} ry={r * 0.8} />
      ))}
    </g>
  );
}

/** Espinho/chifre simples com contorno (para caudas, costas, cabeça). */
export function Espinho({ d, p }: { d: string; p: Paleta }) {
  return <PecaCel d={d} cor={p.chifre} sombra={p.chifreSombra} contorno={p.contorno} espessura={3.5} deslocamento={[-3, -4]} />;
}
