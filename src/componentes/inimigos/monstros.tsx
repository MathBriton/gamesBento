import type { ComponentType } from 'react';
import type { TipoInimigo } from '../../tipos';
import { CONTORNO, elipse, misturarCor, PecaCel } from '../Cel';
import { BocaTravessa, Bochechas, Coroa, OlhoMonstro, perninha } from './primitivas';

/*
 * Monstros mitológicos em versão infantil, no mesmo estilo cartoon dos dinossauros
 * (contorno forte, cel shading, olhos grandes). Caixa ~200x190, chão em y≈184.
 * Cada monstro recebe `chefao` para desenhar a coroa e o olhar de chefão.
 */

interface PropsMonstro {
  chefao: boolean;
}

/* ---------- Lobisomem (clássicos de terror) ---------- */
function Lobisomem({ chefao }: PropsMonstro) {
  const pelo = '#9c7b5b';
  const claro = '#ecd9bf';
  return (
    <g>
      <PecaCel d="M134 150 Q178 142 182 104 Q168 120 160 112 Q158 128 140 130 Z" cor={pelo} />
      <PecaCel d={perninha(72, 158, 24, 26)} cor={misturarCor(pelo, 0.85)} />
      <PecaCel d={perninha(104, 158, 24, 26)} cor={misturarCor(pelo, 0.85)} />
      <PecaCel d={elipse(100, 142, 40, 32)} cor={pelo} brilho={[84, 124, 10, 6]}>
        <ellipse cx={100} cy={150} rx={24} ry={20} fill={claro} />
      </PecaCel>
      <PecaCel d={elipse(60, 140, 12, 18)} cor={pelo} />
      <PecaCel d={elipse(140, 140, 12, 18)} cor={pelo} />
      <PecaCel d="M60 60 L62 16 L90 44 Z" cor={pelo} espessura={4}>
        <path d="M65 48 L66 26 L80 42 Z" fill="#ffb3c1" />
      </PecaCel>
      <PecaCel d="M140 60 L138 16 L110 44 Z" cor={pelo} espessura={4}>
        <path d="M135 48 L134 26 L120 42 Z" fill="#ffb3c1" />
      </PecaCel>
      <PecaCel d="M50 90 Q46 70 60 56 Q100 30 140 56 Q154 70 150 90 L158 96 L148 100 Q140 124 100 126 Q60 124 52 100 L42 96 Z" cor={pelo} brilho={[76, 56, 12, 6]} />
      <PecaCel d={elipse(100, 104, 24, 16)} cor={claro} espessura={3.5} deslocamento={[-3, -4]} />
      <ellipse cx={100} cy={95} rx={8} ry={6} fill={CONTORNO} />
      <ellipse cx={97} cy={93} rx={2.5} ry={1.5} fill="#fff" opacity={0.7} />
      <OlhoMonstro x={80} y={76} iris="#ffcf33" lado="esquerdo" chefao={chefao} />
      <OlhoMonstro x={120} y={76} iris="#ffcf33" lado="direito" chefao={chefao} />
      <BocaTravessa x={100} y={106} largura={20} />
      {chefao && <Coroa x={100} y={40} />}
    </g>
  );
}

/* ---------- Vampiro (clássicos de terror) ---------- */
function Vampiro({ chefao }: PropsMonstro) {
  const pele = '#e8def7';
  const cabelo = '#3b2a5c';
  const capa = '#2b2240';
  const forro = '#d62839';
  return (
    <g>
      <PecaCel d="M40 182 Q36 112 70 104 L130 104 Q164 112 160 182 Q100 170 40 182 Z" cor={capa} sombra="#1c1530" brilho={[60, 130, 6, 14]}>
        <path d="M58 180 Q60 124 80 110 L120 110 Q140 124 142 180 Q100 172 58 180 Z" fill={forro} />
      </PecaCel>
      <PecaCel d="M72 110 L128 110 L122 176 L78 176 Z" cor="#ffffff" sombra="#dcd6e6" espessura={4} />
      <path d="M100 112 L100 170" stroke="#cfc8dc" strokeWidth={2} />
      <PecaCel d="M86 114 L100 122 L86 130 Z M114 114 L100 122 L114 130 Z" cor={forro} espessura={3} deslocamento={[-2, -2]} />
      <PecaCel d="M60 104 L42 56 L86 94 Z" cor={forro} sombra="#a51d2d" espessura={4} />
      <PecaCel d="M140 104 L158 56 L114 94 Z" cor={forro} sombra="#a51d2d" espessura={4} />
      <PecaCel d="M64 76 L50 62 L66 70 Z" cor={pele} espessura={3.5} deslocamento={[-2, -2]} />
      <PecaCel d="M136 76 L150 62 L134 70 Z" cor={pele} espessura={3.5} deslocamento={[-2, -2]} />
      <PecaCel d={elipse(100, 82, 38, 36)} cor={pele} brilho={[84, 70, 8, 5]} />
      <PecaCel d="M62 80 Q60 42 100 40 Q140 42 138 80 Q126 60 112 62 L100 76 L88 62 Q74 60 62 80 Z" cor={cabelo} sombra="#241a3a" espessura={4} brilho={[82, 50, 10, 4]} />
      <OlhoMonstro x={86} y={86} r={10} iris="#e0314a" lado="esquerdo" chefao={chefao} />
      <OlhoMonstro x={114} y={86} r={10} iris="#e0314a" lado="direito" chefao={chefao} />
      <Bochechas pontos={[[76, 102], [124, 102]]} />
      <BocaTravessa x={100} y={104} largura={18} />
      {chefao && <Coroa x={100} y={40} escala={0.9} />}
    </g>
  );
}

/* ---------- Troll (nórdico) ---------- */
function Troll({ chefao }: PropsMonstro) {
  const pele = '#7cb342';
  return (
    <g>
      <PecaCel d={perninha(70, 162, 28, 22)} cor={misturarCor(pele, 0.85)} />
      <PecaCel d={perninha(104, 162, 28, 22)} cor={misturarCor(pele, 0.85)} />
      <PecaCel d={elipse(100, 132, 54, 44)} cor={pele} brilho={[76, 110, 12, 7]}>
        <path d="M46 150 Q100 170 154 150 L156 176 L44 176 Z" fill="#9c6b3c" />
        <path d="M60 160 L64 176 M84 164 L86 178 M116 164 L114 178 M140 160 L136 176" stroke="#7a5230" strokeWidth={3} />
      </PecaCel>
      <PecaCel d={elipse(44, 150, 14, 13)} cor={pele} />
      <PecaCel d={elipse(156, 150, 14, 13)} cor={pele} />
      <PecaCel d="M56 80 L38 70 L58 92 Z" cor={pele} espessura={4} />
      <PecaCel d="M144 80 L162 70 L142 92 Z" cor={pele} espessura={4} />
      <PecaCel d={elipse(100, 84, 44, 38)} cor={pele} brilho={[82, 62, 10, 5]} />
      {/* Topete arredondado (não pontudo, para não parecer a coroa do chefão). */}
      <PecaCel d="M78 56 Q72 38 86 40 Q88 24 100 32 Q110 22 116 36 Q130 36 124 56 Q100 48 78 56 Z" cor="#ff8a3d" espessura={4} deslocamento={[-3, -3]} brilho={[92, 36, 5, 3]} />
      <OlhoMonstro x={84} y={78} r={9} iris="#5c3b1e" lado="esquerdo" chefao={chefao} />
      <OlhoMonstro x={116} y={78} r={9} iris="#5c3b1e" lado="direito" chefao={chefao} />
      <PecaCel d={elipse(100, 96, 13, 11)} cor={misturarCor(pele, 0.8)} espessura={3.5} deslocamento={[-3, -3]} />
      <path d="M80 108 Q100 122 120 108" fill="none" stroke={CONTORNO} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M84 110 L86 100 L90 111 Z M116 110 L114 100 L110 111 Z" fill="#fff8e1" stroke={CONTORNO} strokeWidth={2} strokeLinejoin="round" />
      <Bochechas pontos={[[70, 96], [130, 96]]} />
      {chefao && <Coroa x={100} y={42} />}
    </g>
  );
}

/* ---------- Ciclope (grego) ---------- */
function Ciclope({ chefao }: PropsMonstro) {
  const pele = '#f4a261';
  return (
    <g>
      <PecaCel d={perninha(74, 160, 24, 24)} cor={misturarCor(pele, 0.85)} />
      <PecaCel d={perninha(104, 160, 24, 24)} cor={misturarCor(pele, 0.85)} />
      <PecaCel d={elipse(100, 140, 42, 34)} cor={pele} brilho={[84, 124, 10, 6]}>
        <path d="M58 118 L142 150 L142 176 L58 176 Z" fill="#f4f8ff" />
        <path d="M58 118 L142 150" stroke="#4d8dff" strokeWidth={6} />
      </PecaCel>
      <PecaCel d={elipse(58, 138, 12, 17)} cor={pele} />
      <PecaCel d={elipse(142, 138, 12, 17)} cor={pele} />
      <PecaCel d={elipse(100, 80, 48, 44)} cor={pele} brilho={[78, 56, 12, 6]} />
      <PecaCel d="M92 40 L100 16 L108 40 Z" cor="#fff4d8" sombra="#e6c98f" espessura={4} deslocamento={[-2, -3]} />
      <OlhoMonstro x={100} y={78} r={21} iris="#4d8dff" lado="esquerdo" chefao={chefao} unico />
      <Bochechas pontos={[[70, 100], [130, 100]]} />
      <BocaTravessa x={100} y={108} largura={22} presas={1} />
      {chefao && <Coroa x={100} y={36} />}
    </g>
  );
}

/* ---------- Minotauro (grego) ---------- */
function Minotauro({ chefao }: PropsMonstro) {
  const pelo = '#b86b3a';
  const claro = '#f0c9a0';
  return (
    <g>
      <PecaCel d={perninha(74, 160, 24, 24)} cor={pelo} />
      <PecaCel d={perninha(104, 160, 24, 24)} cor={pelo} />
      <rect x={72} y={176} width={28} height={8} rx={3} fill={CONTORNO} />
      <rect x={102} y={176} width={28} height={8} rx={3} fill={CONTORNO} />
      <PecaCel d={elipse(100, 142, 42, 34)} cor={pelo} brilho={[84, 124, 10, 6]}>
        <path d="M58 150 L142 150 L140 176 L60 176 Z" fill="#d62839" />
        {[66, 82, 98, 114, 130].map((x) => (
          <path key={x} d={`M${x} 150 L${x} 176`} stroke="#ffcc33" strokeWidth={3} />
        ))}
        <ellipse cx={100} cy={132} rx={22} ry={14} fill={claro} />
      </PecaCel>
      <PecaCel d={elipse(56, 138, 13, 18)} cor={pelo} />
      <PecaCel d={elipse(144, 138, 13, 18)} cor={pelo} />
      <PecaCel d="M62 70 Q30 64 30 30 Q44 50 70 58 Z" cor="#fff4d8" sombra="#e6c98f" espessura={4} deslocamento={[-3, -3]} />
      <PecaCel d="M138 70 Q170 64 170 30 Q156 50 130 58 Z" cor="#fff4d8" sombra="#e6c98f" espessura={4} deslocamento={[-3, -3]} />
      <PecaCel d={elipse(58, 84, 12, 7)} cor={pelo} espessura={3.5} deslocamento={[-2, -2]} />
      <PecaCel d={elipse(142, 84, 12, 7)} cor={pelo} espessura={3.5} deslocamento={[-2, -2]} />
      <PecaCel d={elipse(100, 84, 42, 38)} cor={pelo} brilho={[82, 62, 10, 5]} />
      <PecaCel d="M88 50 Q94 36 100 50 Q106 36 112 50 Z" cor={misturarCor(pelo, 0.7)} espessura={3} deslocamento={[-2, -2]} />
      <PecaCel d={elipse(100, 104, 26, 17)} cor={claro} espessura={4} deslocamento={[-3, -4]} />
      <ellipse cx={91} cy={102} rx={3.5} ry={4.5} fill={CONTORNO} />
      <ellipse cx={109} cy={102} rx={3.5} ry={4.5} fill={CONTORNO} />
      <circle cx={100} cy={116} r={7} fill="none" stroke="#ffcc33" strokeWidth={4} />
      <circle cx={100} cy={116} r={7} fill="none" stroke={CONTORNO} strokeWidth={1.2} />
      <OlhoMonstro x={84} y={78} r={10} iris="#5c3b1e" lado="esquerdo" chefao={chefao} />
      <OlhoMonstro x={116} y={78} r={10} iris="#5c3b1e" lado="direito" chefao={chefao} />
      {chefao && <Coroa x={100} y={44} />}
    </g>
  );
}

/* ---------- Medusa (grega) ---------- */
function Cobrinha({ x, y, angulo, cor }: { x: number; y: number; angulo: number; cor: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angulo})`}>
      <path d="M0 26 Q-12 14 0 4 Q10 -4 0 -14" fill="none" stroke={CONTORNO} strokeWidth={13} strokeLinecap="round" />
      <path d="M0 26 Q-12 14 0 4 Q10 -4 0 -14" fill="none" stroke={cor} strokeWidth={8} strokeLinecap="round" />
      <ellipse cx={0} cy={-18} rx={9} ry={8} fill={cor} stroke={CONTORNO} strokeWidth={3} />
      <circle cx={-3.5} cy={-19} r={2} fill={CONTORNO} />
      <circle cx={3.5} cy={-19} r={2} fill={CONTORNO} />
      <path d="M0 -11 L0 -6 M0 -6 L-2 -3 M0 -6 L2 -3" stroke="#ff4d6d" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

function Medusa({ chefao }: PropsMonstro) {
  const pele = '#9bd18a';
  const cobras: [number, number, number, string][] = [
    [58, 66, -50, '#5cc34d'],
    [70, 44, -25, '#3fa34d'],
    [100, 34, 0, '#5cc34d'],
    [130, 44, 25, '#3fa34d'],
    [142, 66, 50, '#5cc34d'],
  ];
  return (
    <g>
      <PecaCel d="M62 182 Q68 128 100 120 Q132 128 138 182 Q100 176 62 182 Z" cor="#8e6fd6" brilho={[80, 140, 6, 12]}>
        <path d="M70 146 Q100 154 130 146 L131 154 Q100 162 69 154 Z" fill="#ffcc33" />
      </PecaCel>
      <PecaCel d={elipse(64, 142, 10, 16)} cor={pele} />
      <PecaCel d={elipse(136, 142, 10, 16)} cor={pele} />
      {cobras.map(([x, y, a, c]) => (
        <Cobrinha key={`${x}-${y}`} x={x} y={y} angulo={a} cor={c} />
      ))}
      <PecaCel d={elipse(100, 86, 40, 38)} cor={pele} brilho={[84, 66, 10, 5]} />
      <OlhoMonstro x={86} y={86} r={10} iris="#8e6fd6" lado="esquerdo" chefao={chefao} />
      <OlhoMonstro x={114} y={86} r={10} iris="#8e6fd6" lado="direito" chefao={chefao} />
      <Bochechas pontos={[[76, 102], [124, 102]]} />
      <BocaTravessa x={100} y={104} largura={16} presas={0} />
      <circle cx={62} cy={100} r={4} fill="#ffcc33" stroke={CONTORNO} strokeWidth={1.5} />
      <circle cx={138} cy={100} r={4} fill="#ffcc33" stroke={CONTORNO} strokeWidth={1.5} />
      {chefao && <Coroa x={100} y={48} escala={0.85} />}
    </g>
  );
}

/* ---------- Fenrir / Lobo do Gelo (nórdico) ---------- */
function Fenrir({ chefao }: PropsMonstro) {
  const pelo = '#8fb3d9';
  const claro = '#eaf4ff';
  return (
    <g>
      <PecaCel d="M140 170 Q186 164 184 120 Q172 136 164 128 Q164 150 142 154 Z" cor={pelo} />
      <PecaCel d={elipse(104, 150, 46, 34)} cor={pelo} brilho={[86, 132, 10, 6]}>
        <ellipse cx={100} cy={156} rx={26} ry={22} fill={claro} />
      </PecaCel>
      <PecaCel d={perninha(74, 146, 20, 38)} cor={misturarCor(pelo, 0.9)} />
      <PecaCel d={perninha(106, 146, 20, 38)} cor={misturarCor(pelo, 0.9)} />
      {[[80, 182], [112, 182]].map(([x, y]) => (
        <g key={x} fill="#fff4d8" stroke={CONTORNO} strokeWidth={1.5}>
          <ellipse cx={x} cy={y} rx={3} ry={2} />
          <ellipse cx={x + 7} cy={y} rx={3} ry={2} />
        </g>
      ))}
      <PecaCel d="M60 62 L60 18 L90 46 Z" cor={pelo} espessura={4}>
        <path d="M64 50 L64 28 L80 44 Z" fill="#c9e2ff" />
      </PecaCel>
      <PecaCel d="M140 62 L140 18 L110 46 Z" cor={pelo} espessura={4}>
        <path d="M136 50 L136 28 L120 44 Z" fill="#c9e2ff" />
      </PecaCel>
      <PecaCel d="M52 92 Q46 64 72 50 Q100 38 128 50 Q154 64 148 92 Q142 122 100 124 Q58 122 52 92 Z" cor={pelo} brilho={[76, 60, 12, 5]} />
      <path d="M92 50 L100 42 L108 50 L100 58 Z" fill={claro} stroke={CONTORNO} strokeWidth={2} />
      <PecaCel d={elipse(100, 104, 22, 15)} cor={claro} espessura={3.5} deslocamento={[-3, -4]} />
      <ellipse cx={100} cy={96} rx={8} ry={6} fill={CONTORNO} />
      <OlhoMonstro x={80} y={80} iris="#3fa9f5" lado="esquerdo" chefao={chefao} />
      <OlhoMonstro x={120} y={80} iris="#3fa9f5" lado="direito" chefao={chefao} />
      <BocaTravessa x={100} y={106} largura={18} />
      {/* Corrente mágica (Gleipnir) partida no pescoço */}
      <g fill="none" stroke={CONTORNO} strokeWidth={6}>
        {[66, 82, 98, 114, 130].map((x, i) => (
          <ellipse key={x} cx={x} cy={124 + (i % 2) * 2} rx={8} ry={5} />
        ))}
      </g>
      <g fill="none" stroke="#b8c2cc" strokeWidth={3}>
        {[66, 82, 98, 114, 130].map((x, i) => (
          <ellipse key={x} cx={x} cy={124 + (i % 2) * 2} rx={8} ry={5} />
        ))}
      </g>
      <path d="M140 126 Q150 132 148 142" fill="none" stroke="#b8c2cc" strokeWidth={4} strokeLinecap="round" strokeDasharray="6 5" />
      {chefao && <Coroa x={100} y={40} />}
    </g>
  );
}

/* ---------- Serpente do Mar / Jörmungandr (nórdico) ---------- */
function Serpente({ chefao }: PropsMonstro) {
  const escama = '#3fbfa0';
  const barriga = '#ffe7a3';
  const barbatana = '#ff8fb1';
  return (
    <g>
      <PecaCel d="M8 176 Q14 132 44 132 Q72 132 76 176 Z" cor={escama} brilho={[30, 146, 8, 5]}>
        <path d="M22 176 Q26 150 44 150 Q60 150 62 176 Z" fill={barriga} />
      </PecaCel>
      <PecaCel d="M34 138 L28 122 L44 134 Z" cor={barbatana} espessura={3} deslocamento={[-2, -2]} />
      <PecaCel d="M86 180 Q84 140 100 116 Q118 90 112 70 L150 64 Q160 104 136 136 Q122 156 126 180 Z" cor={escama} brilho={[108, 108, 5, 12]}>
        <path d="M100 180 Q98 146 114 124 Q132 100 128 72 L140 70 Q146 104 128 132 Q116 152 118 180 Z" fill={barriga} />
      </PecaCel>
      <PecaCel d="M146 90 L164 84 L150 102 Z" cor={barbatana} espessura={3} deslocamento={[-2, -2]} />
      <PecaCel d="M90 50 L78 26 L100 40 Z" cor={barbatana} espessura={3.5} deslocamento={[-2, -2]} />
      <PecaCel d="M150 44 L166 24 L160 50 Z" cor={barbatana} espessura={3.5} deslocamento={[-2, -2]} />
      <PecaCel d="M82 72 Q80 40 118 38 Q160 38 168 64 Q172 88 140 94 L108 94 Q84 92 82 72 Z" cor={escama} brilho={[104, 48, 12, 5]} />
      <g fill={misturarCor(escama, 0.75)}>
        {[[112, 52], [126, 48], [140, 52], [100, 62]].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={4} ry={3} />
        ))}
      </g>
      <OlhoMonstro x={112} y={68} r={10} iris="#ffcc33" lado="esquerdo" chefao={chefao} />
      <OlhoMonstro x={140} y={66} r={10} iris="#ffcc33" lado="direito" chefao={chefao} />
      <path d="M150 86 Q160 92 168 84" fill="none" stroke={CONTORNO} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M166 86 L178 90 M178 90 L182 86 M178 90 L182 94" stroke="#ff4d6d" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={162} cy={74} r={2} fill={CONTORNO} />
      {/* Ondas na frente do corpo */}
      <PecaCel d="M-4 176 Q12 166 28 176 Q44 186 60 176 Q76 166 92 176 Q108 186 124 176 Q140 166 156 176 Q172 186 188 176 Q198 170 206 176 L206 194 L-4 194 Z" cor="#4d9de0" sombra="#2f6fb0" espessura={4} deslocamento={[0, -3]}>
        <path d="M10 184 Q20 180 30 184 M70 186 Q80 182 90 186 M140 184 Q150 180 160 184" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />
      </PecaCel>
      {chefao && <Coroa x={122} y={38} />}
    </g>
  );
}

/* ---------- Cérbero (grego): filhotinho de três cabeças ---------- */
function CabecaCachorro({ x, y, r, chefao, lingua }: { x: number; y: number; r: number; chefao: boolean; lingua: boolean }) {
  const pelo = '#7d74a3';
  const claro = '#c3bce0';
  return (
    <g>
      <PecaCel d={`M${x - r * 0.9} ${y - r * 0.4} Q${x - r * 1.35} ${y + r * 0.2} ${x - r * 1.05} ${y + r * 0.75} Q${x - r * 0.75} ${y + r * 0.2} ${x - r * 0.55} ${y - r * 0.2} Z`} cor={misturarCor(pelo, 0.8)} espessura={3.5} />
      <PecaCel d={`M${x + r * 0.9} ${y - r * 0.4} Q${x + r * 1.35} ${y + r * 0.2} ${x + r * 1.05} ${y + r * 0.75} Q${x + r * 0.75} ${y + r * 0.2} ${x + r * 0.55} ${y - r * 0.2} Z`} cor={misturarCor(pelo, 0.8)} espessura={3.5} />
      <PecaCel d={elipse(x, y, r, r * 0.92)} cor={pelo} brilho={[x - r * 0.4, y - r * 0.5, r * 0.25, r * 0.13]} />
      <PecaCel d={elipse(x, y + r * 0.42, r * 0.5, r * 0.34)} cor={claro} espessura={3} deslocamento={[-2, -3]} />
      <ellipse cx={x} cy={y + r * 0.25} rx={r * 0.18} ry={r * 0.13} fill={CONTORNO} />
      {lingua && <path d={`M${x - 4} ${y + r * 0.62} Q${x} ${y + r * 1.05} ${x + 4} ${y + r * 0.62} Z`} fill="#ff7f96" stroke={CONTORNO} strokeWidth={2} />}
      <OlhoMonstro x={x - r * 0.38} y={y - r * 0.12} r={r * 0.3} iris="#ffcc33" lado="esquerdo" chefao={chefao} />
      <OlhoMonstro x={x + r * 0.38} y={y - r * 0.12} r={r * 0.3} iris="#ffcc33" lado="direito" chefao={chefao} />
      {/* Coleira vermelha com pinos redondos */}
      <PecaCel d={`M${x - r * 0.7} ${y + r * 0.85} Q${x} ${y + r * 1.1} ${x + r * 0.7} ${y + r * 0.85} L${x + r * 0.7} ${y + r * 1.05} Q${x} ${y + r * 1.3} ${x - r * 0.7} ${y + r * 1.05} Z`} cor="#e63946" espessura={3} deslocamento={[-1, -2]} />
      {[-0.4, 0, 0.4].map((d) => (
        <circle key={d} cx={x + r * d} cy={y + r * (1.04 + (d === 0 ? 0.08 : 0))} r={2.4} fill="#ffcc33" stroke={CONTORNO} strokeWidth={1} />
      ))}
    </g>
  );
}

function Cerbero({ chefao }: PropsMonstro) {
  const pelo = '#7d74a3';
  return (
    <g>
      <PecaCel d="M144 168 Q176 160 172 134 Q162 148 150 146 Z" cor={pelo} />
      <PecaCel d={elipse(100, 154, 50, 30)} cor={pelo} brilho={[80, 138, 10, 5]} />
      <PecaCel d={perninha(74, 156, 22, 28)} cor={misturarCor(pelo, 1.15)} />
      <PecaCel d={perninha(106, 156, 22, 28)} cor={misturarCor(pelo, 1.15)} />
      <CabecaCachorro x={52} y={100} r={28} chefao={chefao} lingua={false} />
      <CabecaCachorro x={148} y={100} r={28} chefao={chefao} lingua={false} />
      <CabecaCachorro x={100} y={78} r={34} chefao={chefao} lingua />
      {chefao && <Coroa x={100} y={42} />}
    </g>
  );
}

export const DESENHOS_MONSTROS: Record<TipoInimigo, ComponentType<PropsMonstro>> = {
  lobisomem: Lobisomem,
  vampiro: Vampiro,
  troll: Troll,
  fenrir: Fenrir,
  serpente: Serpente,
  ciclope: Ciclope,
  minotauro: Minotauro,
  medusa: Medusa,
  cerbero: Cerbero,
};
