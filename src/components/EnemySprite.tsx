import { CelPart, ell, mix, OUTLINE } from './Cel';
import { ENEMIES } from '../data/enemies';
import type { EnemyKind } from '../types';

interface Props {
  kind: EnemyKind;
  color: string;
  boss?: boolean;
  className?: string;
}

/** Olho bravo: branco, pupila e sobrancelha inclinada para o centro. */
function AngryEye({ x, y, left, boss, r = 11 }: { x: number; y: number; left: boolean; boss: boolean; r?: number }) {
  const dir = left ? 1 : -1;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 1.1} fill={boss ? '#ffe066' : '#fff'} stroke={OUTLINE} strokeWidth={3} />
      <circle cx={x + dir * 3} cy={y + 2} r={r * 0.5} fill={boss ? '#d62828' : '#22150d'} />
      <circle cx={x + dir * 5} cy={y - 1} r={r * 0.18} fill="#fff" />
      <path
        d={`M${x - r * 1.2} ${y - r * (left ? 1.5 : 0.9)} L${x + r * 1.2} ${y - r * (left ? 0.9 : 1.5)}`}
        stroke={OUTLINE}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </g>
  );
}

function Teeth({ y, from, to, count }: { y: number; from: number; to: number; count: number }) {
  const w = (to - from) / count;
  return (
    <g fill="#fff" stroke={OUTLINE} strokeWidth={2} strokeLinejoin="round">
      {Array.from({ length: count }, (_, i) => (
        <path key={i} d={`M${from + i * w} ${y} l${w / 2} 9 l${w / 2} -9 Z`} />
      ))}
    </g>
  );
}

function BossHorns({ y }: { y: number }) {
  return (
    <g>
      <CelPart d={`M62 ${y} Q46 ${y - 30} 58 ${y - 52} Q70 ${y - 30} 80 ${y - 6} Z`} fill="#f4ecdc" width={4} offset={[-3, -4]} />
      <CelPart d={`M138 ${y} Q154 ${y - 30} 142 ${y - 52} Q130 ${y - 30} 120 ${y - 6} Z`} fill="#f4ecdc" width={4} offset={[-3, -4]} />
    </g>
  );
}

function Slime({ c, boss }: { c: string; boss: boolean }) {
  return (
    <g>
      {boss && <BossHorns y={66} />}
      <CelPart d="M28 168 Q14 110 56 74 Q100 38 144 74 Q186 110 172 168 Q100 184 28 168 Z" fill={c} shine={[70, 88, 14, 9]} offset={[-9, -10]}>
        <path d="M40 168 Q44 150 52 168 M140 168 Q146 146 154 168" stroke={mix(c, 0.7)} strokeWidth={8} fill="none" />
      </CelPart>
      <AngryEye x={78} y={112} left boss={boss} />
      <AngryEye x={124} y={112} left={false} boss={boss} />
      <path d="M78 142 Q101 156 124 142 Z" fill="#5a1f2e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Teeth y={143} from={84} to={118} count={4} />
    </g>
  );
}

function Bat({ c, boss }: { c: string; boss: boolean }) {
  const wing = mix(c, 0.8);
  return (
    <g>
      <CelPart d="M72 100 Q34 58 6 76 Q22 88 16 108 Q32 100 36 120 Q50 106 72 122 Z" fill={wing} width={4} />
      <CelPart d="M128 100 Q166 58 194 76 Q178 88 184 108 Q168 100 164 120 Q150 106 128 122 Z" fill={wing} width={4} />
      <CelPart d="M72 70 L64 34 L90 60 Z" fill={c} width={4} offset={[-3, -4]} />
      <CelPart d="M128 70 L136 34 L110 60 Z" fill={c} width={4} offset={[-3, -4]} />
      {boss && <BossHorns y={62} />}
      <CelPart d={ell(100, 104, 44, 42)} fill={c} shine={[82, 82, 12, 8]} />
      <ellipse cx={100} cy={124} rx={26} ry={16} fill={mix(c, 1.35)} />
      <AngryEye x={82} y={98} left boss={boss} r={10} />
      <AngryEye x={118} y={98} left={false} boss={boss} r={10} />
      <path d="M86 124 Q100 132 114 124" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
      <path d="M90 126 l4 10 l4 -9 Z M102 126 l4 9 l4 -10 Z" fill="#fff" stroke={OUTLINE} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
}

function Golem({ c, boss }: { c: string; boss: boolean }) {
  const rock = mix(c, 0.55);
  const stone = '#9a8f86';
  return (
    <g>
      <CelPart d={ell(30, 128, 20, 26)} fill={stone} width={4} />
      <CelPart d={ell(170, 128, 20, 26)} fill={stone} width={4} />
      {boss && <BossHorns y={60} />}
      <CelPart d="M42 176 L32 96 L62 54 L138 50 L170 92 L160 176 Z" fill={stone} shine={[70, 72, 14, 8]} offset={[-8, -9]}>
        <path d="M60 110 L80 124 L72 140 M132 70 L120 88 L134 100" stroke={mix(stone, 0.6)} strokeWidth={4} fill="none" />
      </CelPart>
      <path d="M70 156 L130 156" stroke={rock} strokeWidth={8} strokeLinecap="round" />
      {/* Olhos brilhantes na cor da zona */}
      <path d="M62 98 L92 106 L88 116 L64 110 Z" fill={boss ? '#ff3b3b' : c} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      <path d="M138 98 L108 106 L112 116 L136 110 Z" fill={boss ? '#ff3b3b' : c} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      <path d="M78 136 L122 136" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

function Plant({ c, boss }: { c: string; boss: boolean }) {
  const leaf = '#3fa34d';
  return (
    <g>
      <CelPart d="M92 186 Q86 150 98 120 L108 120 Q112 150 108 186 Z" fill={leaf} width={4} />
      <CelPart d="M98 176 Q54 170 40 142 Q76 140 100 164 Z" fill={leaf} width={4} />
      <CelPart d="M102 176 Q146 170 160 142 Q124 140 100 164 Z" fill={leaf} width={4} />
      {boss && <BossHorns y={50} />}
      <CelPart d={ell(100, 80, 58, 50)} fill={c} shine={[72, 52, 14, 8]} offset={[-8, -9]}>
        {[[70, 50], [128, 56], [100, 34], [140, 92]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={6} fill={mix(c, 1.4)} />
        ))}
      </CelPart>
      {/* Boca aberta com dentes */}
      <path d="M52 92 Q100 140 148 92 Q100 108 52 92 Z" fill="#5a1f2e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Teeth y={96} from={62} to={138} count={6} />
      <AngryEye x={80} y={66} left boss={boss} r={10} />
      <AngryEye x={120} y={66} left={false} boss={boss} r={10} />
    </g>
  );
}

export function EnemySprite({ kind, color, boss = false, className }: Props) {
  const c = boss ? mix(color, 0.85) : color;
  const def = ENEMIES[kind];
  return (
    <svg viewBox="-4 -10 208 204" className={className} role="img" aria-label={boss ? def.bossName : def.name}>
      <ellipse cx={100} cy={184} rx={70} ry={8} fill="rgba(0,0,0,0.2)" />
      {kind === 'slime' && <Slime c={c} boss={boss} />}
      {kind === 'bat' && <Bat c={c} boss={boss} />}
      {kind === 'golem' && <Golem c={c} boss={boss} />}
      {kind === 'plant' && <Plant c={c} boss={boss} />}
    </svg>
  );
}
