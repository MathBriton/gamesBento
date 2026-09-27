import { useId } from 'react';
import type { Material, NivelArmadura } from '../../dados/armaduras';
import { CONTORNO, misturarCor, PecaCel } from '../Cel';
import type { Ancoras, Posicao } from './ancoras';

/*
 * Peças de armadura (visual provisório — o modelo definitivo será definido por prompt).
 * Cada peça é desenhada em coordenadas locais centradas em (0,0) e posicionada pelas âncoras
 * da espécie. Cores vêm do material do nível de armadura (dados/armaduras.ts).
 */

function transformar([x, y, rotacao, escala]: Posicao): string {
  return `translate(${x} ${y}) rotate(${rotacao}) scale(${escala})`;
}

function Rebites({ pontos, cor }: { pontos: [number, number][]; cor: string }) {
  return (
    <g fill={cor} stroke={CONTORNO} strokeWidth={1.2}>
      {pontos.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} />
      ))}
    </g>
  );
}

function Gema({ x, y, cor, r = 5 }: { x: number; y: number; cor: string; r?: number }) {
  return (
    <g>
      <path d={`M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`} fill={cor} stroke={CONTORNO} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.28} fill="#fff" opacity={0.8} />
    </g>
  );
}

function Capacete({ pos, m, nivel }: { pos: Posicao; m: Material; nivel: NivelArmadura }) {
  const cupula = 'M-24 6 Q-24 -24 0 -26 Q24 -24 24 6 Z';
  return (
    <g transform={transformar(pos)}>
      {nivel.penacho && (
        <PecaCel d="M-4 -22 Q6 -50 32 -44 Q16 -36 8 -20 Z" cor={nivel.gema ?? '#ff4d6d'} espessura={3.5} deslocamento={[-3, -3]} />
      )}
      <PecaCel d={cupula} cor={m.cor} espessura={4.5} deslocamento={[-5, -6]} brilho={[-10, -14, 6, 4]} />
      <path d="M0 -25 L0 4" stroke={misturarCor(m.cor, 0.75)} strokeWidth={4} />
      <PecaCel d="M-27 1 Q0 -5 27 1 L27 10 Q0 4 -27 10 Z" cor={misturarCor(m.cor, 0.85)} espessura={3.5} deslocamento={[-2, -2]} />
      <Rebites pontos={[[-17, 5], [0, 2], [17, 5]]} cor={m.detalhe} />
      {nivel.gema && <Gema x={0} y={-12} cor={nivel.gema} />}
    </g>
  );
}

function Dorso({ dados, m, nivel }: { dados: Ancoras['dorso']; m: Material; nivel: NivelArmadura }) {
  const [x, y, l, a, rot] = dados;
  const r = a / 2;
  const d = `M${-l / 2 + r} ${-a / 2} H${l / 2 - r} Q${l / 2} ${-a / 2} ${l / 2} 0 Q${l / 2} ${a / 2} ${l / 2 - r} ${a / 2} H${-l / 2 + r} Q${-l / 2} ${a / 2} ${-l / 2} 0 Q${-l / 2} ${-a / 2} ${-l / 2 + r} ${-a / 2} Z`;
  const divisorias = [-l / 6, l / 6];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <PecaCel d={d} cor={m.cor} espessura={4} deslocamento={[-4, -5]} brilho={[-l / 4, -a / 5, l / 7, a / 7]}>
        {divisorias.map((dx) => (
          <path key={dx} d={`M${dx} ${-a / 2} Q${dx + 3} 0 ${dx} ${a / 2}`} stroke={misturarCor(m.cor, 0.7)} strokeWidth={3} fill="none" />
        ))}
      </PecaCel>
      <Rebites pontos={[[-l / 2 + r, 0], [l / 2 - r, 0]]} cor={m.detalhe} />
      {nivel.gema && <Gema x={0} y={0} cor={nivel.gema} />}
    </g>
  );
}

function Ombreira({ pos, m, nivel }: { pos: Posicao; m: Material; nivel: NivelArmadura }) {
  return (
    <g transform={transformar(pos)}>
      <PecaCel d="M-18 8 Q-20 -14 0 -18 Q20 -14 18 8 Q0 2 -18 8 Z" cor={m.cor} espessura={4} deslocamento={[-4, -5]} brilho={[-6, -8, 5, 3]}>
        <path d="M-12 2 Q0 -12 12 2" stroke={misturarCor(m.cor, 0.7)} strokeWidth={3} fill="none" />
      </PecaCel>
      {nivel.gema ? <Gema x={0} y={-7} cor={nivel.gema} r={4} /> : <Rebites pontos={[[0, -8]]} cor={m.detalhe} />}
    </g>
  );
}

function Caneleira({ x, y, largura, m }: { x: number; y: number; largura: number; m: Material }) {
  const l = largura / 2;
  const d = `M${-l} -8 Q0 -11 ${l} -8 L${l} 8 Q0 5 ${-l} 8 Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <PecaCel d={d} cor={m.cor} espessura={3.5} deslocamento={[-3, -3]}>
        <path d={`M${-l} 0 Q0 -3 ${l} 0`} stroke={misturarCor(m.cor, 0.72)} strokeWidth={2.5} fill="none" />
      </PecaCel>
      <Rebites pontos={[[-l + 5, -2], [l - 5, -2]]} cor={m.detalhe} />
    </g>
  );
}

function Cauda({ pos, m }: { pos: Posicao; m: Material }) {
  return (
    <g transform={transformar(pos)}>
      <PecaCel d="M-10 -14 Q0 -17 10 -14 L12 12 Q0 16 -12 12 Z" cor={m.cor} espessura={3.5} deslocamento={[-3, -4]}>
        <path d="M-11 -1 Q0 2 11 -1" stroke={misturarCor(m.cor, 0.72)} strokeWidth={2.5} fill="none" />
      </PecaCel>
      <Rebites pontos={[[0, -8], [0, 7]]} cor={m.detalhe} />
    </g>
  );
}

/** Peças de armadura (desenhadas por cima do dinossauro). */
export function PecasArmadura({ nivel, ancoras }: { nivel: NivelArmadura; ancoras: Ancoras }) {
  const m = nivel.material;
  if (!m) return null;
  const tem = (peca: NivelArmadura['pecas'][number]) => nivel.pecas.includes(peca);
  return (
    <g className="armadura">
      {tem('cauda') && <Cauda pos={ancoras.cauda} m={m} />}
      {tem('caneleiras') && ancoras.caneleiras.map(([x, y, l]) => <Caneleira key={`${x}-${y}`} x={x} y={y} largura={l} m={m} />)}
      {tem('dorso') && <Dorso dados={ancoras.dorso} m={m} nivel={nivel} />}
      {tem('ombreira') && <Ombreira pos={ancoras.ombreira} m={m} nivel={nivel} />}
      {tem('capacete') && <Capacete pos={ancoras.capacete} m={m} nivel={nivel} />}
    </g>
  );
}

/** Aura atrás do dinossauro (níveis altos). */
export function Aura({ cor, centro }: { cor: string; centro: [number, number] }) {
  const id = `aura${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <g className="dino-aura">
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={cor} stopOpacity={0.75} />
          <stop offset="70%" stopColor={cor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={cor} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={centro[0]} cy={centro[1]} rx={118} ry={88} fill={`url(#${id})`} />
    </g>
  );
}

/** Brilhos animados (armadura lendária). */
export function Brilhos() {
  const estrela = 'M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z';
  return (
    <g fill="#fff6b0" stroke="#e8a800" strokeWidth={1.5}>
      {[[16, 30, 0], [204, 16, 0.6], [8, 136, 1.2], [210, 128, 0.3]].map(([x, y, atraso]) => (
        <path key={`${x}-${y}`} d={estrela} transform={`translate(${x} ${y})`} className="brilho" style={{ animationDelay: `${atraso}s` }} />
      ))}
    </g>
  );
}
