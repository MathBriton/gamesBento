import type { ComponentType } from 'react';
import type { IdZona } from '../../tipos';
import { CONTORNO } from '../Cel';
import { ArvoreRedonda, Brilho, Ceu, Chao, Estrelas, Lua, Nuvem, Particulas, Pinheiro, Tufos } from './elementos';

/*
 * Cenários ilustrados das zonas (fundo da arena). Caixa 400x300 ancorada embaixo
 * (preserveAspectRatio xMidYMax slice): o chão (y≈200) sempre aparece; o topo do céu
 * pode ser cortado em telas baixas. O centro fica livre para o monstro.
 */

/* ---------- 🌕 Floresta Enluarada ---------- */
function Floresta() {
  return (
    <g>
      <Ceu cores={['#1c1b4a', '#3b2f7a', '#7a5fb3']} />
      <Estrelas />
      <Lua x={318} y={70} r={36} />
      <path d="M0 196 Q60 150 124 172 Q196 132 266 168 Q334 142 400 170 L400 300 L0 300 Z" fill="#2b2b62" />
      <path d="M0 206 Q80 178 160 196 Q250 176 330 194 Q370 186 400 196 L400 300 L0 300 Z" fill="#253f4f" />
      <Pinheiro x={22} y={206} escala={1.25} cor="#1d3f33" />
      <Pinheiro x={64} y={210} escala={0.95} cor="#1d3f33" />
      <ArvoreRedonda x={350} y={210} escala={1.1} cor="#23553d" />
      <Pinheiro x={392} y={212} escala={1.05} cor="#1d3f33" />
      <Chao d="M0 212 Q100 202 200 208 Q300 214 400 204 L400 300 L0 300 Z" cor="#3f7a4f" sombra="#2c5a3a" />
      <Tufos pontos={[[36, 226], [120, 236], [288, 232], [372, 240]]} cor="#6fb07a" />
      {/* Cogumelos brilhantes */}
      {[[84, 224, 1], [326, 230, 0.8]].map(([x, y, e]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${e})`}>
          <Brilho x={0} y={-6} r={22} cor="#ff9ec7" opacidade={0.4} />
          <rect x={-3} y={-8} width={6} height={10} rx={2} fill="#fff4e0" stroke={CONTORNO} strokeWidth={2} />
          <path d="M-12 -8 Q0 -26 12 -8 Z" fill="#ff5f8f" stroke={CONTORNO} strokeWidth={2} strokeLinejoin="round" />
          <circle cx={-4} cy={-14} r={2} fill="#fff" />
          <circle cx={5} cy={-12} r={1.6} fill="#fff" />
        </g>
      ))}
      <Particulas pontos={[[70, 170], [130, 150], [262, 160], [310, 182], [180, 176]]} cor="#fff27a" classe="cenario__vagalume" />
    </g>
  );
}

/* ---------- 🏛️ Ruínas Gregas ---------- */
function Coluna({ x, y, altura, quebrada = false }: { x: number; y: number; altura: number; quebrada?: boolean }) {
  const topo = y - altura;
  return (
    <g stroke={CONTORNO} strokeWidth={2.5} strokeLinejoin="round">
      <rect x={x - 12} y={y - 6} width={24} height={6} fill="#e3dccb" />
      <path d={quebrada ? `M${x - 9} ${y - 6} L${x - 9} ${topo + 8} L${x - 2} ${topo} L${x + 4} ${topo + 6} L${x + 9} ${topo + 2} L${x + 9} ${y - 6} Z` : `M${x - 9} ${y - 6} L${x - 9} ${topo + 6} L${x + 9} ${topo + 6} L${x + 9} ${y - 6} Z`} fill="#f6f1e4" />
      {!quebrada && <rect x={x - 13} y={topo} width={26} height={7} fill="#e3dccb" />}
      <path d={`M${x - 3} ${y - 8} L${x - 3} ${topo + 12} M${x + 3} ${y - 8} L${x + 3} ${topo + 12}`} stroke="#d2c8b2" strokeWidth={2} />
    </g>
  );
}

function Grecia() {
  return (
    <g>
      <Ceu cores={['#58b4f0', '#a9dcfb', '#e6f6ff']} />
      <Brilho x={62} y={58} r={70} cor="#fff3a0" opacidade={0.6} />
      <circle cx={62} cy={58} r={24} fill="#ffe066" stroke="#f0b400" strokeWidth={3} />
      <Nuvem x={170} y={46} escala={1.1} />
      <Nuvem x={290} y={28} escala={0.8} />
      <Nuvem x={380} y={74} escala={0.9} />
      <path d="M0 178 L400 178 L400 210 L0 210 Z" fill="#3f9ad8" />
      <path d="M40 186 Q52 182 64 186 M150 192 Q162 188 174 192 M250 184 Q262 180 274 184" stroke="#dff3ff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M200 180 Q222 160 246 172 Q262 164 276 180 Z" fill="#8fbf9a" />
      {/* Templo à direita */}
      <g>
        <path d="M296 136 L352 112 L408 136 Z" fill="#f6f1e4" stroke={CONTORNO} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M322 130 L352 118 L382 130 Z" fill="#7fb6d8" />
        <rect x={294} y={136} width={116} height={8} fill="#e3dccb" stroke={CONTORNO} strokeWidth={2.5} />
        {[306, 330, 354, 378, 402].map((x) => (
          <Coluna key={x} x={x} y={206} altura={62} />
        ))}
      </g>
      {/* Ruínas e oliveira à esquerda */}
      <Coluna x={34} y={208} altura={46} quebrada />
      <Coluna x={70} y={210} altura={26} quebrada />
      <ArvoreRedonda x={112} y={212} escala={0.8} cor="#8aa35a" tronco="#7a5a3a" />
      <Chao d="M0 206 L400 204 L400 300 L0 300 Z" cor="#ead9ad" sombra="#cdb983" />
      <path d="M0 236 L400 234 M60 206 L54 300 M150 206 L148 300 M250 205 L254 300 M340 204 L348 300" stroke="#d3bf8d" strokeWidth={2} />
      <g stroke={CONTORNO} strokeWidth={2.5}>
        <ellipse cx={150} cy={224} rx={16} ry={7} fill="#f6f1e4" />
        <ellipse cx={150} cy={222} rx={9} ry={4} fill="#e3dccb" />
      </g>
    </g>
  );
}

/* ---------- 🏰 Castelo dos Vampiros ---------- */
function Torre({ x, y, largura, altura }: { x: number; y: number; largura: number; altura: number }) {
  const l = largura / 2;
  return (
    <g>
      <rect x={x - l} y={y - altura} width={largura} height={altura} fill="#3a2150" />
      <path d={`M${x - l - 4} ${y - altura} L${x} ${y - altura - largura * 1.2} L${x + l + 4} ${y - altura} Z`} fill="#2a1638" />
      <rect x={x - 3} y={y - altura + 14} width={6} height={10} rx={3} fill="#ffd166" className="cenario__janela" />
    </g>
  );
}

function Castelo() {
  return (
    <g>
      <Ceu cores={['#241235', '#5b2566', '#c0607f', '#f0a48a']} />
      <Estrelas ate={70} />
      <Lua x={86} y={72} r={34} cor="#fde8f0" crateras="#f2cfe0" />
      {/* Castelo ao fundo, à direita */}
      <g>
        <Torre x={268} y={190} largura={22} altura={70} />
        <Torre x={352} y={190} largura={26} altura={96} />
        <Torre x={392} y={190} largura={18} altura={60} />
        <rect x={276} y={140} width={70} height={50} fill="#3a2150" />
        {[282, 298, 314, 330].map((x) => (
          <rect key={x} x={x} y={132} width={10} height={10} fill="#3a2150" />
        ))}
        <rect x={304} y={150} width={7} height={11} rx={3.5} fill="#ffd166" className="cenario__janela" />
      </g>
      {/* Morcegos */}
      {[[200, 56, 1], [236, 84, 0.7], [160, 96, 0.6]].map(([x, y, e], i) => (
        <g key={x} className="cenario__morcego" style={{ animationDelay: `${i * 0.6}s` }}>
          <path transform={`translate(${x} ${y}) scale(${e})`} d="M-16 0 Q-10 -8 -4 -2 Q0 -6 4 -2 Q10 -8 16 0 Q8 -2 4 4 Q0 2 -4 4 Q-8 -2 -16 0 Z" fill="#1c0f28" />
        </g>
      ))}
      <path d="M0 200 Q100 186 200 196 Q300 186 400 198 L400 300 L0 300 Z" fill="#2e1d3e" />
      {/* Árvores secas nas laterais */}
      <g fill="none" stroke={CONTORNO} strokeLinecap="round">
        <path d="M30 212 L30 150 M30 176 L12 156 M30 164 L48 146 M48 146 L56 150 M12 156 L6 150" strokeWidth={7} />
        <path d="M30 212 L30 150 M30 176 L12 156 M30 164 L48 146 M48 146 L56 150 M12 156 L6 150" stroke="#4a2f5c" strokeWidth={4} />
      </g>
      <Chao d="M0 210 Q100 202 200 208 Q300 212 400 204 L400 300 L0 300 Z" cor="#5c4670" sombra="#46345a" />
      {/* Abóboras sorridentes */}
      {[[70, 226], [336, 230]].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <Brilho x={0} y={0} r={24} cor="#ffb347" opacidade={0.45} />
          <ellipse cx={0} cy={0} rx={15} ry={12} fill="#ff8c1a" stroke={CONTORNO} strokeWidth={2.5} />
          <path d="M0 -12 L1 -18" stroke="#3f7a4f" strokeWidth={3} strokeLinecap="round" />
          <path d="M-7 -3 L-4 -7 L-1 -3 Z M1 -3 L4 -7 L7 -3 Z M-7 3 Q0 9 7 3 Q0 6 -7 3 Z" fill="#ffe066" stroke={CONTORNO} strokeWidth={1.2} />
        </g>
      ))}
    </g>
  );
}

/* ---------- ❄️ Terras Nórdicas ---------- */
function Nordico() {
  return (
    <g>
      <Ceu cores={['#081a33', '#123a5c', '#2d6a8a']} />
      <Estrelas ate={80} />
      {/* Aurora boreal */}
      <g className="cenario__aurora">
        <path d="M-10 70 Q60 30 130 62 Q200 92 270 48 Q340 12 410 50 L410 76 Q340 40 270 76 Q200 116 130 86 Q60 58 -10 96 Z" fill="#4dffb4" opacity={0.28} />
        <path d="M-10 96 Q80 60 160 90 Q240 118 320 80 Q370 60 410 72 L410 90 Q370 80 320 100 Q240 136 160 108 Q80 80 -10 112 Z" fill="#8a7dff" opacity={0.22} />
      </g>
      <path d="M0 196 L60 126 L96 160 L150 100 L210 170 L250 132 L300 176 L350 118 L400 170 L400 300 L0 300 Z" fill="#5f84ab" />
      <path d="M60 126 L74 142 L64 140 L54 146 Z M150 100 L168 122 L154 118 L140 126 Z M350 118 L366 136 L352 134 L340 140 Z" fill="#eef7ff" />
      <path d="M0 206 Q100 184 200 200 Q300 184 400 202 L400 300 L0 300 Z" fill="#9ec1de" />
      <Pinheiro x={24} y={210} escala={1.2} cor="#1e4d3c" neve />
      <Pinheiro x={62} y={214} escala={0.85} cor="#1e4d3c" neve />
      <Pinheiro x={348} y={212} escala={1} cor="#1e4d3c" neve />
      <Pinheiro x={388} y={210} escala={1.25} cor="#1e4d3c" neve />
      {/* Pedra rúnica */}
      <g>
        <Brilho x={316} y={208} r={26} cor="#6ff3ff" opacidade={0.35} />
        <path d="M304 222 L300 190 Q316 180 330 190 L328 222 Z" fill="#8a96a3" stroke={CONTORNO} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M312 196 L312 214 M312 202 L320 196 M312 208 L320 214" stroke="#6ff3ff" strokeWidth={2.5} strokeLinecap="round" fill="none" />
      </g>
      <Chao d="M0 214 Q100 206 200 212 Q300 216 400 208 L400 300 L0 300 Z" cor="#eef7ff" sombra="#bcd6ec" />
      <path d="M40 240 Q60 236 80 240 M250 246 Q270 242 290 246" stroke="#c9dff0" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Particulas pontos={[[30, 40], [90, 20], [150, 60], [220, 30], [280, 70], [340, 20], [380, 90], [120, 110], [250, 120]]} cor="#ffffff" r={2} classe="cenario__neve" />
    </g>
  );
}

/* ---------- 🔥 Submundo Grego ---------- */
function Submundo() {
  return (
    <g>
      <Ceu cores={['#120707', '#3a1212', '#7a2b16']} />
      {/* Estalactites */}
      <path d="M0 0 L400 0 L400 22 L380 58 L362 20 L340 44 L318 16 L290 70 L266 18 L240 36 L214 14 L190 50 L168 16 L140 40 L116 12 L92 62 L70 18 L48 40 L26 14 L0 46 Z" fill="#2a1414" stroke={CONTORNO} strokeWidth={3} strokeLinejoin="round" />
      <Brilho x={200} y={196} r={180} cor="#ff7a1a" opacidade={0.35} />
      {/* Colunas gregas escuras no fundo */}
      {[70, 330].map((x) => (
        <g key={x} fill="#4a2020">
          <rect x={x - 12} y={120} width={24} height={80} />
          <rect x={x - 16} y={114} width={32} height={8} />
        </g>
      ))}
      {/* Rio de lava */}
      <path d="M0 184 Q100 176 200 184 Q300 192 400 182 L400 206 Q300 214 200 206 Q100 198 0 206 Z" fill="#ff8c1a" stroke={CONTORNO} strokeWidth={3} />
      <path d="M30 192 Q50 188 70 192 M160 196 Q180 192 200 196 M290 194 Q310 190 330 194" stroke="#ffe066" strokeWidth={3} fill="none" strokeLinecap="round" className="cenario__lava" />
      {/* Barquinho do barqueiro */}
      <g transform="translate(250 184)">
        <path d="M-22 0 Q0 12 22 0 L18 -6 L-18 -6 Z" fill="#6b4226" stroke={CONTORNO} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M4 -6 L4 -26" stroke={CONTORNO} strokeWidth={2.5} />
        <circle cx={4} cy={-28} r={3} fill="#9ff0ff" />
      </g>
      <Chao d="M0 212 Q100 204 200 210 Q300 216 400 206 L400 300 L0 300 Z" cor="#4a2a2a" sombra="#301818" />
      <path d="M40 232 L60 240 L78 236 M200 250 L220 244 L236 252 M320 236 L340 244 L356 238" stroke="#ff8c1a" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Rochas nas laterais */}
      <path d="M-4 214 Q4 170 30 176 Q52 180 50 214 Z" fill="#3a1d1d" stroke={CONTORNO} strokeWidth={3} strokeLinejoin="round" />
      <path d="M404 214 Q396 164 366 172 Q344 180 350 214 Z" fill="#3a1d1d" stroke={CONTORNO} strokeWidth={3} strokeLinejoin="round" />
      <Particulas pontos={[[60, 200], [120, 210], [180, 204], [240, 212], [300, 200], [360, 208]]} cor="#ffb347" r={2} classe="cenario__brasa" />
    </g>
  );
}

/* ---------- 🌊 Mar de Midgard ---------- */
function Midgard() {
  return (
    <g>
      <Ceu cores={['#2c5f7a', '#5a9bb3', '#b9e3e8']} />
      <Nuvem x={80} y={40} escala={1.2} cor="#e3eef2" sombra="#aac3cf" />
      <Nuvem x={260} y={30} escala={1} cor="#e3eef2" sombra="#aac3cf" />
      <Nuvem x={370} y={70} escala={0.8} cor="#e3eef2" sombra="#aac3cf" />
      <path d="M0 150 L400 150 L400 220 L0 220 Z" fill="#2f7fa8" />
      {/* Navio viking ao longe */}
      <g transform="translate(96 150)">
        <path d="M-26 0 Q0 10 26 0 L30 -6 L-30 -6 Z" fill="#6b4226" />
        <path d="M0 -6 L0 -34" stroke="#3a2418" strokeWidth={2} />
        <path d="M-12 -32 L12 -32 L12 -12 L-12 -12 Z" fill="#fff" />
        <path d="M-12 -26 L12 -26 M-12 -18 L12 -18" stroke="#e63946" strokeWidth={3} />
      </g>
      <path d="M0 168 Q25 160 50 168 Q75 176 100 168 Q125 160 150 168 Q175 176 200 168 Q225 160 250 168 Q275 176 300 168 Q325 160 350 168 Q375 176 400 168 L400 220 L0 220 Z" fill="#3f9fc8" className="cenario__onda" />
      <path d="M0 186 Q25 178 50 186 Q75 194 100 186 Q125 178 150 186 Q175 194 200 186 Q225 178 250 186 Q275 194 300 186 Q325 178 350 186 Q375 194 400 186 L400 220 L0 220 Z" fill="#5ab8dc" />
      <path d="M20 180 Q30 176 40 180 M180 184 Q190 180 200 184 M320 180 Q330 176 340 180" stroke="#ffffff" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Gaivotas */}
      <path d="M190 78 q6 -6 12 0 q6 -6 12 0 M300 96 q5 -5 10 0 q5 -5 10 0" stroke={CONTORNO} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* Rochas nas laterais */}
      <path d="M-6 212 Q0 150 34 156 Q62 164 60 212 Z" fill="#7b8a91" stroke={CONTORNO} strokeWidth={3} strokeLinejoin="round" />
      <path d="M406 212 Q398 140 362 150 Q336 160 342 212 Z" fill="#7b8a91" stroke={CONTORNO} strokeWidth={3} strokeLinejoin="round" />
      <path d="M14 172 Q24 166 34 170 M366 162 Q378 156 388 162" stroke="#a9b8bf" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Chao d="M0 212 Q100 204 200 210 Q300 214 400 206 L400 300 L0 300 Z" cor="#e6cf98" sombra="#c9ae72" />
      {[[70, 232], [300, 238], [180, 250]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx={9} ry={5} fill="#b9a67a" stroke={CONTORNO} strokeWidth={2} />
      ))}
    </g>
  );
}

const CENARIOS: Record<IdZona, ComponentType> = {
  floresta: Floresta,
  grecia: Grecia,
  castelo: Castelo,
  nordico: Nordico,
  submundo: Submundo,
  midgard: Midgard,
};

export function CenarioZona({ zona, className }: { zona: IdZona; className?: string }) {
  const Cenario = CENARIOS[zona];
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <Cenario />
    </svg>
  );
}
