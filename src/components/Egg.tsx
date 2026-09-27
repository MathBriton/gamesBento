import { CelPart, mix, OUTLINE } from './Cel';

interface Props {
  /** 0 = inteiro; cada número adiciona uma rachadura. */
  cracks?: number;
  color?: string;
  spotColor?: string;
  className?: string;
  label?: string;
}

const SHELL = 'M100 12 C150 12 182 100 182 142 C182 186 146 206 100 206 C54 206 18 186 18 142 C18 100 50 12 100 12 Z';

const CRACKS = [
  'M70 60 L84 74 L74 84 L90 94',
  'M132 70 L118 86 L130 96 L114 108',
  'M58 112 L80 104 L96 118 L118 108 L144 120',
];

const SPOTS: [number, number, number, number][] = [
  [68, 132, 15, 12],
  [136, 152, 19, 15],
  [116, 60, 11, 9],
  [80, 178, 9, 7],
  [160, 104, 8, 10],
];

/** Ovo no mesmo estilo cartoon dos dinossauros: contorno grosso, sombra cel e brilho. */
export function Egg({ cracks = 0, color = '#fff1cc', spotColor = '#7fd36b', className, label = 'Ovo' }: Props) {
  return (
    <svg viewBox="0 0 200 220" className={className} role="img" aria-label={label}>
      <ellipse cx="100" cy="210" rx="62" ry="8" fill="rgba(0,0,0,0.15)" />
      <CelPart d={SHELL} fill={color} shade={mix(color, 0.8)} width={6} offset={[-9, -10]}>
        <g fill={spotColor} stroke={OUTLINE} strokeWidth={3}>
          {SPOTS.map(([cx, cy, rx, ry]) => (
            <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} />
          ))}
        </g>
        <ellipse cx="66" cy="62" rx="12" ry="24" fill="#fff" opacity={0.7} transform="rotate(20 66 62)" />
        <circle cx="82" cy="36" r="5" fill="#fff" opacity={0.8} />
      </CelPart>
      {CRACKS.slice(0, cracks).map((d) => (
        <path key={d} d={d} fill="none" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
