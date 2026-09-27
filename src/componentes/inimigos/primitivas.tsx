import { CONTORNO, PecaCel } from '../Cel';

/*
 * Peças comuns dos monstros (versão infantil): olhos grandes e travessos, sorriso com
 * presinhas arredondadas, nada de sangue ou dentes realistas. O chefão ganha coroa e
 * olhar mais "determinado" (íris vermelha e sobrancelha mais grossa).
 */

interface OlhoProps {
  x: number;
  y: number;
  r?: number;
  iris: string;
  /** Lado do rosto: define a inclinação da sobrancelha travessa. */
  lado: 'esquerdo' | 'direito';
  chefao: boolean;
  /** Olho único do Ciclope: sem sobrancelha inclinada. */
  unico?: boolean;
}

export function OlhoMonstro({ x, y, r = 11, iris, lado, chefao, unico }: OlhoProps) {
  const s = lado === 'esquerdo' ? 1 : -1;
  const corIris = chefao ? '#e63946' : iris;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 1.12} fill="#fff" stroke={CONTORNO} strokeWidth={3} />
      <ellipse cx={x + s * r * 0.18} cy={y + r * 0.15} rx={r * 0.62} ry={r * 0.72} fill={corIris} />
      <ellipse cx={x + s * r * 0.18} cy={y + r * 0.2} rx={r * 0.34} ry={r * 0.42} fill="#22150d" />
      <circle cx={x + s * r * 0.35} cy={y - r * 0.2} r={r * 0.24} fill="#fff" />
      <circle cx={x - s * r * 0.1} cy={y + r * 0.45} r={r * 0.1} fill="#fff" />
      {unico ? (
        <path d={`M${x - r * 1.1} ${y - r * 1.35} Q${x} ${y - r * (chefao ? 1.2 : 1.7)} ${x + r * 1.1} ${y - r * 1.35}`} fill="none" stroke={CONTORNO} strokeWidth={chefao ? 6 : 4.5} strokeLinecap="round" />
      ) : (
        <path
          d={`M${x - r * 1.05} ${y - r * (s > 0 ? 1.55 : 1.2)} Q${x} ${y - r * 1.6} ${x + r * 1.05} ${y - r * (s > 0 ? 1.2 : 1.55)}`}
          fill="none"
          stroke={CONTORNO}
          strokeWidth={chefao ? 5.5 : 4}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

interface BocaProps {
  x: number;
  y: number;
  largura: number;
  presas?: 0 | 1 | 2;
  /** Cor de dentro da boca (aberta). */
  aberta?: boolean;
}

/** Sorriso travesso com presinhas arredondadas. */
export function BocaTravessa({ x, y, largura, presas = 2, aberta = false }: BocaProps) {
  const l = largura / 2;
  return (
    <g>
      {aberta ? (
        <path d={`M${x - l} ${y} Q${x} ${y + l * 0.9} ${x + l} ${y} Q${x} ${y + l * 0.25} ${x - l} ${y} Z`} fill="#6b2a3a" stroke={CONTORNO} strokeWidth={3.5} strokeLinejoin="round" />
      ) : (
        <path d={`M${x - l} ${y} Q${x} ${y + l * 0.7} ${x + l} ${y}`} fill="none" stroke={CONTORNO} strokeWidth={3.5} strokeLinecap="round" />
      )}
      {presas >= 1 && <path d={`M${x - l * 0.45} ${y + l * 0.22} q2.5 7 5 0 Z`} fill="#fff" stroke={CONTORNO} strokeWidth={1.8} strokeLinejoin="round" />}
      {presas === 2 && <path d={`M${x + l * 0.45 - 5} ${y + l * 0.22} q2.5 7 5 0 Z`} fill="#fff" stroke={CONTORNO} strokeWidth={1.8} strokeLinejoin="round" />}
    </g>
  );
}

export function Bochechas({ pontos }: { pontos: [number, number][] }) {
  return (
    <g fill="#ff7f96" opacity={0.55}>
      {pontos.map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={7} ry={4} />
      ))}
    </g>
  );
}

/** Coroa do chefão. */
export function Coroa({ x, y, escala = 1 }: { x: number; y: number; escala?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala}) rotate(-6)`}>
      <PecaCel d="M-22 4 L-25 -20 L-11 -8 L0 -28 L11 -8 L25 -20 L22 4 Z" cor="#ffcc33" espessura={4} deslocamento={[-3, -4]} brilho={[-10, -8, 4, 3]} />
      <circle cx={0} cy={-5} r={4.5} fill="#ff4d6d" stroke={CONTORNO} strokeWidth={2} />
      <circle cx={-13} cy={-2} r={2.8} fill="#4dc3ff" stroke={CONTORNO} strokeWidth={1.5} />
      <circle cx={13} cy={-2} r={2.8} fill="#4dc3ff" stroke={CONTORNO} strokeWidth={1.5} />
    </g>
  );
}

/** Perninha curta com base arredondada. */
export function perninha(x: number, y: number, largura: number, altura: number): string {
  const r = largura / 2;
  return `M${x} ${y} L${x + largura} ${y} L${x + largura} ${y + altura - r} Q${x + largura} ${y + altura} ${x + r} ${y + altura} Q${x} ${y + altura} ${x} ${y + altura - r} Z`;
}
