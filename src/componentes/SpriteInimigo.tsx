import { INIMIGOS } from '../dados/inimigos';
import type { TipoInimigo } from '../tipos';
import { CONTORNO, elipse, misturarCor, PecaCel } from './Cel';

interface Props {
  tipo: TipoInimigo;
  cor: string;
  chefao?: boolean;
  className?: string;
}

/** Olho bravo (mas cartoon): branco, pupila e sobrancelha inclinada para o centro. */
function OlhoBravo({ x, y, esquerdo, chefao, r = 11 }: { x: number; y: number; esquerdo: boolean; chefao: boolean; r?: number }) {
  const lado = esquerdo ? 1 : -1;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 1.1} fill={chefao ? '#ffe066' : '#fff'} stroke={CONTORNO} strokeWidth={3} />
      <circle cx={x + lado * 3} cy={y + 2} r={r * 0.5} fill={chefao ? '#d62828' : '#22150d'} />
      <circle cx={x + lado * 5} cy={y - 1} r={r * 0.18} fill="#fff" />
      <path
        d={`M${x - r * 1.2} ${y - r * (esquerdo ? 1.5 : 0.9)} L${x + r * 1.2} ${y - r * (esquerdo ? 0.9 : 1.5)}`}
        stroke={CONTORNO}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </g>
  );
}

function Dentes({ y, de, ate, quantidade }: { y: number; de: number; ate: number; quantidade: number }) {
  const l = (ate - de) / quantidade;
  return (
    <g fill="#fff" stroke={CONTORNO} strokeWidth={2} strokeLinejoin="round">
      {Array.from({ length: quantidade }, (_, i) => (
        <path key={i} d={`M${de + i * l} ${y} l${l / 2} 8 l${l / 2} -8 Z`} />
      ))}
    </g>
  );
}

function ChifresChefao({ y }: { y: number }) {
  return (
    <g>
      <PecaCel d={`M62 ${y} Q46 ${y - 30} 58 ${y - 52} Q70 ${y - 30} 80 ${y - 6} Z`} cor="#f4ecdc" espessura={4} deslocamento={[-3, -4]} />
      <PecaCel d={`M138 ${y} Q154 ${y - 30} 142 ${y - 52} Q130 ${y - 30} 120 ${y - 6} Z`} cor="#f4ecdc" espessura={4} deslocamento={[-3, -4]} />
    </g>
  );
}

function Gosma({ c, chefao }: { c: string; chefao: boolean }) {
  return (
    <g>
      {chefao && <ChifresChefao y={66} />}
      <PecaCel d="M28 168 Q14 110 56 74 Q100 38 144 74 Q186 110 172 168 Q100 184 28 168 Z" cor={c} brilho={[70, 88, 14, 9]} deslocamento={[-9, -10]}>
        <path d="M40 168 Q44 150 52 168 M140 168 Q146 146 154 168" stroke={misturarCor(c, 0.7)} strokeWidth={8} fill="none" />
      </PecaCel>
      <OlhoBravo x={78} y={112} esquerdo chefao={chefao} />
      <OlhoBravo x={124} y={112} esquerdo={false} chefao={chefao} />
      <path d="M78 142 Q101 156 124 142 Z" fill="#5a1f2e" stroke={CONTORNO} strokeWidth={4} strokeLinejoin="round" />
      <Dentes y={143} de={84} ate={118} quantidade={4} />
    </g>
  );
}

function Morcego({ c, chefao }: { c: string; chefao: boolean }) {
  const asa = misturarCor(c, 0.8);
  return (
    <g>
      <PecaCel d="M72 100 Q34 58 6 76 Q22 88 16 108 Q32 100 36 120 Q50 106 72 122 Z" cor={asa} espessura={4} />
      <PecaCel d="M128 100 Q166 58 194 76 Q178 88 184 108 Q168 100 164 120 Q150 106 128 122 Z" cor={asa} espessura={4} />
      <PecaCel d="M72 70 L64 34 L90 60 Z" cor={c} espessura={4} deslocamento={[-3, -4]} />
      <PecaCel d="M128 70 L136 34 L110 60 Z" cor={c} espessura={4} deslocamento={[-3, -4]} />
      {chefao && <ChifresChefao y={62} />}
      <PecaCel d={elipse(100, 104, 44, 42)} cor={c} brilho={[82, 82, 12, 8]} />
      <ellipse cx={100} cy={124} rx={26} ry={16} fill={misturarCor(c, 1.35)} />
      <OlhoBravo x={82} y={98} esquerdo chefao={chefao} r={10} />
      <OlhoBravo x={118} y={98} esquerdo={false} chefao={chefao} r={10} />
      <path d="M86 124 Q100 132 114 124" fill="none" stroke={CONTORNO} strokeWidth={4} strokeLinecap="round" />
      <path d="M90 126 l4 9 l4 -8 Z M102 126 l4 8 l4 -9 Z" fill="#fff" stroke={CONTORNO} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
}

function Golem({ c, chefao }: { c: string; chefao: boolean }) {
  const pedra = '#9a8f86';
  return (
    <g>
      <PecaCel d={elipse(30, 128, 20, 26)} cor={pedra} espessura={4} />
      <PecaCel d={elipse(170, 128, 20, 26)} cor={pedra} espessura={4} />
      {chefao && <ChifresChefao y={60} />}
      <PecaCel d="M42 176 L32 96 L62 54 L138 50 L170 92 L160 176 Z" cor={pedra} brilho={[70, 72, 14, 8]} deslocamento={[-8, -9]}>
        <path d="M60 110 L80 124 L72 140 M132 70 L120 88 L134 100" stroke={misturarCor(pedra, 0.6)} strokeWidth={4} fill="none" />
      </PecaCel>
      <path d="M70 156 L130 156" stroke={misturarCor(c, 0.55)} strokeWidth={8} strokeLinecap="round" />
      {/* Olhos brilhantes na cor da zona */}
      <path d="M62 98 L92 106 L88 116 L64 110 Z" fill={chefao ? '#ff3b3b' : c} stroke={CONTORNO} strokeWidth={3} strokeLinejoin="round" />
      <path d="M138 98 L108 106 L112 116 L136 110 Z" fill={chefao ? '#ff3b3b' : c} stroke={CONTORNO} strokeWidth={3} strokeLinejoin="round" />
      <path d="M78 136 L122 136" stroke={CONTORNO} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

function Planta({ c, chefao }: { c: string; chefao: boolean }) {
  const folha = '#3fa34d';
  return (
    <g>
      <PecaCel d="M92 186 Q86 150 98 120 L108 120 Q112 150 108 186 Z" cor={folha} espessura={4} />
      <PecaCel d="M98 176 Q54 170 40 142 Q76 140 100 164 Z" cor={folha} espessura={4} />
      <PecaCel d="M102 176 Q146 170 160 142 Q124 140 100 164 Z" cor={folha} espessura={4} />
      {chefao && <ChifresChefao y={50} />}
      <PecaCel d={elipse(100, 80, 58, 50)} cor={c} brilho={[72, 52, 14, 8]} deslocamento={[-8, -9]}>
        {[[70, 50], [128, 56], [100, 34], [140, 92]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={6} fill={misturarCor(c, 1.4)} />
        ))}
      </PecaCel>
      <path d="M52 92 Q100 140 148 92 Q100 108 52 92 Z" fill="#5a1f2e" stroke={CONTORNO} strokeWidth={4} strokeLinejoin="round" />
      <Dentes y={96} de={62} ate={138} quantidade={6} />
      <OlhoBravo x={80} y={66} esquerdo chefao={chefao} r={10} />
      <OlhoBravo x={120} y={66} esquerdo={false} chefao={chefao} r={10} />
    </g>
  );
}

const DESENHOS = { gosma: Gosma, morcego: Morcego, golem: Golem, planta: Planta } as const;

export function SpriteInimigo({ tipo, cor, chefao = false, className }: Props) {
  const c = chefao ? misturarCor(cor, 0.85) : cor;
  const def = INIMIGOS[tipo];
  const Desenho = DESENHOS[tipo];
  return (
    <svg viewBox="-4 -10 208 204" className={className} role="img" aria-label={chefao ? def.nomeChefao : def.nome}>
      <ellipse cx={100} cy={184} rx={70} ry={8} fill="rgba(0,0,0,0.2)" />
      <Desenho c={c} chefao={chefao} />
    </svg>
  );
}
