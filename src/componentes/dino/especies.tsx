import type { ComponentType } from 'react';
import type { IdDinossauro } from '../../tipos';
import { CONTORNO, elipse, elipseGirada, misturarCor } from '../Cel';
import { Espinho, Manchas, Olho, Peca, perna, PernaFundo, Rosto, Unhas, type Paleta } from './primitivas';

/*
 * As 6 espécies do guia estético, em perspectiva 3/4: corpo de lado, cabeça voltada para o
 * jogador (dois olhos visíveis, o de trás menor). Coordenadas em uma caixa ~220x170, chão em y≈162.
 * Cada espécie mantém os elementos que a tornam reconhecível (guia, seção 11).
 */

/** Círculo com borda ondulada (gola do Tricerátops). */
function recortado(cx: number, cy: number, r: number, n: number, onda: number): string {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const pt = (a: number, rr: number) => `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    if (i === 0) d += `M${pt(a0, r)} `;
    d += `Q${pt(am, r + onda)} ${pt(a1, r)} `;
  }
  return `${d}Z`;
}

/** Placa dorsal arredondada (Estegossauro). */
function placa(x: number, y: number, altura: number, largura = 11): string {
  return `M${x - largura} ${y} Q${x - largura - 2} ${y - altura * 0.55} ${x} ${y - altura} Q${x + largura + 2} ${y - altura * 0.55} ${x + largura} ${y} Z`;
}

/* ---------- Tricerátops: três chifres, grande gola óssea, corpo robusto ---------- */
function Triceratops({ p }: { p: Paleta }) {
  return (
    <g>
      <Peca d="M46 116 Q18 108 4 126 Q24 136 54 130 Z" p={p} />
      <PernaFundo d={perna(76, 122, 24, 36)} p={p} />
      <PernaFundo d={perna(124, 122, 24, 36)} p={p} />
      <Peca d={elipse(86, 112, 50, 34)} p={p} brilho={[66, 92, 16, 8]}>
        <ellipse cx={90} cy={136} rx={32} ry={10} fill={p.detalhe} />
      </Peca>
      <Manchas manchas={[[62, 96, 6], [84, 88, 7], [106, 94, 5], [74, 110, 4]]} cor={p.marca} p={p} />
      <Peca d={perna(54, 124, 28, 38)} p={p} />
      <Peca d={perna(102, 124, 28, 38)} p={p} />
      <Unhas patas={[[60, 160], [108, 160]]} p={p} />
      <Peca d={recortado(138, 80, 36, 11, 8)} p={p} cor={p.detalhe} sombra={p.detalheSombra}>
        <circle cx={138} cy={80} r={26} fill={p.base} opacity={0.35} />
      </Peca>
      <Peca d={elipse(156, 102, 34, 29)} p={p} brilho={[142, 84, 12, 6]} />
      <Peca d="M180 108 Q204 112 196 128 Q186 130 176 120 Z" p={p} cor={p.detalhes ? '#e8b061' : p.chifre} sombra={p.detalhes ? '#c98f45' : p.chifreSombra} espessura={4} />
      <Espinho d="M142 80 Q138 50 150 30 Q158 52 157 82 Z" p={p} />
      <Espinho d="M166 80 Q174 54 190 40 Q190 64 179 84 Z" p={p} />
      <Espinho d="M188 100 Q194 88 204 84 Q202 98 196 106 Z" p={p} />
      <Olho x={150} y={100} p={p} />
      <Olho x={174} y={97} p={p} escala={0.78} />
      <Rosto p={p} bochecha={[148, 118]} boca="M162 122 Q171 128 181 121" sobrancelhas={['M140 84 Q150 80 159 85', 'M168 84 Q175 81 181 85']} />
    </g>
  );
}

/* ---------- Estegossauro: placas dorsais grandes, corpo baixo, cauda com espinhos ---------- */
function Estegossauro({ p }: { p: Paleta }) {
  const placasFrente: [number, number, number][] = [[58, 94, 22], [76, 88, 32], [96, 86, 38], [116, 88, 32], [134, 94, 22]];
  return (
    <g>
      {/* Fileira de trás (3/4): um pouco deslocada e mais escura. */}
      {placasFrente.map(([x, y, a]) => (
        <Peca key={`t${x}`} d={placa(x + 9, y - 3, a * 0.85, 9)} p={p} cor={p.detalheSombra} sombra={misturarCor(p.detalheSombra, 0.85)} espessura={4} />
      ))}
      {placasFrente.map(([x, y, a]) => (
        <Peca key={`f${x}`} d={placa(x, y, a)} p={p} cor={p.detalhe} sombra={p.detalheSombra} espessura={4} />
      ))}
      <Peca d="M50 110 Q18 104 4 116 Q22 128 54 128 Z" p={p} />
      <Espinho d="M16 114 L2 98 L24 110 Z" p={p} />
      <Espinho d="M28 110 L22 92 L36 108 Z" p={p} />
      <PernaFundo d={perna(84, 122, 22, 36)} p={p} />
      <PernaFundo d={perna(130, 122, 22, 36)} p={p} />
      <Peca d={elipse(96, 114, 54, 32)} p={p} brilho={[74, 96, 16, 7]}>
        <ellipse cx={100} cy={137} rx={36} ry={9} fill={misturarCor(p.base, 1.35)} />
      </Peca>
      <Manchas manchas={[[70, 108, 5], [92, 102, 6], [114, 108, 5]]} cor={p.marca} p={p} />
      <Peca d={perna(62, 124, 28, 38)} p={p} />
      <Peca d={perna(112, 124, 26, 38)} p={p} />
      <Unhas patas={[[68, 160], [117, 160]]} p={p} />
      <Peca d="M136 106 Q156 106 164 114 L154 132 Q144 130 132 126 Z" p={p} />
      <Peca d={elipse(170, 122, 24, 19)} p={p} brilho={[160, 110, 8, 4]} />
      <Olho x={165} y={118} p={p} escala={0.8} />
      <Olho x={182} y={116} p={p} escala={0.64} />
      <Rosto p={p} bochecha={[164, 132]} boca="M175 132 Q181 136 188 131" sobrancelhas={['M157 106 Q165 103 172 107']} />
    </g>
  );
}

/* ---------- Braquiossauro: pescoço muito longo, cabeça pequena, corpo grande ---------- */
function Braquiossauro({ p }: { p: Paleta }) {
  return (
    <g>
      <Peca d="M46 124 Q16 120 4 138 Q22 144 50 136 Z" p={p} />
      <PernaFundo d={perna(64, 120, 22, 42)} p={p} />
      <PernaFundo d={perna(114, 108, 22, 54)} p={p} />
      <Peca d="M110 100 Q124 64 128 30 L154 30 Q154 72 136 118 Z" p={p} brilho={[132, 60, 4, 14]}>
        <path d="M146 36 Q146 80 128 116 L138 120 Q158 78 156 36 Z" fill={misturarCor(p.base, 1.35)} />
      </Peca>
      <Peca d={elipseGirada(86, 112, 50, 32, -10)} p={p} brilho={[68, 96, 16, 7]}>
        <ellipse cx={90} cy={134} rx={32} ry={9} fill={misturarCor(p.base, 1.35)} transform="rotate(-10 90 134)" />
      </Peca>
      <Manchas manchas={[[68, 104, 7], [88, 96, 8], [108, 98, 6], [80, 118, 5], [140, 70, 5], [142, 50, 4]]} cor={p.marca} p={p} />
      <Peca d={perna(50, 124, 26, 40)} p={p} />
      <Peca d={perna(100, 112, 26, 52)} p={p} />
      <Unhas patas={[[55, 162], [105, 162]]} p={p} />
      <Peca d={elipse(142, 12, 13, 10)} p={p} />
      <Peca d={elipse(148, 28, 26, 20)} p={p} brilho={[138, 16, 8, 4]} />
      <Olho x={146} y={26} p={p} escala={0.78} />
      <Olho x={164} y={24} p={p} escala={0.62} />
      <Rosto p={p} bochecha={[144, 40]} boca="M155 40 Q163 44 170 38" narina={[151, 9]} />
    </g>
  );
}

/* ---------- Anquilossauro: corpo baixo, armadura evidente, cauda com clava ---------- */
function Anquilossauro({ p }: { p: Paleta }) {
  const osteodermos: [number, number][] = [[64, 96], [84, 92], [104, 92], [124, 96], [54, 112], [74, 110], [94, 108], [114, 110], [134, 112]];
  const espinhosLaterais = [44, 66, 90, 114, 138];
  return (
    <g>
      <Peca d="M46 122 Q26 118 18 122 Q24 134 50 132 Z" p={p} />
      <Peca d={elipse(14, 126, 15, 12)} p={p} cor={p.detalheSombra} sombra={misturarCor(p.detalheSombra, 0.8)}>
        <circle cx={8} cy={120} r={3} fill="#fff" opacity={0.4} />
      </Peca>
      <PernaFundo d={perna(80, 124, 24, 32)} p={p} />
      <PernaFundo d={perna(126, 124, 24, 32)} p={p} />
      <Peca d="M38 128 Q36 82 96 78 Q156 82 156 128 Q96 140 38 128 Z" p={p} brilho={[72, 90, 18, 7]} />
      {p.detalhes && (
        <g fill={p.detalhe} stroke={CONTORNO} strokeWidth={2}>
          {osteodermos.map(([x, y]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={7} ry={5} />
          ))}
        </g>
      )}
      {espinhosLaterais.map((x, i) => (
        <Espinho key={x} d={`M${x - 6} ${128 + (i % 2) * 3} L${x} ${140 + (i % 2) * 3} L${x + 6} ${128 + (i % 2) * 3} Z`} p={p} />
      ))}
      <Peca d={perna(58, 126, 28, 34)} p={p} />
      <Peca d={perna(110, 126, 28, 34)} p={p} />
      <Unhas patas={[[64, 158], [116, 158]]} p={p} />
      <Espinho d="M150 100 L140 84 L160 96 Z" p={p} />
      <Espinho d="M172 98 L170 80 L182 96 Z" p={p} />
      <Peca d={elipse(168, 114, 26, 20)} p={p} brilho={[156, 102, 8, 4]} />
      <Olho x={165} y={110} p={p} escala={0.8} />
      <Olho x={182} y={108} p={p} escala={0.64} />
      <Rosto p={p} bochecha={[162, 125]} boca="M173 126 Q180 130 188 125" sobrancelhas={['M157 99 Q165 96 172 100']} />
    </g>
  );
}

function PecaGarra({ p }: { p: Paleta }) {
  return <Espinho d="M101 158 Q111 152 107 141 Q102 150 96 153 Z" p={p} />;
}

/* ---------- Velociraptor: corpo fino e ágil, cauda longa, expressão esperta ---------- */
function Velociraptor({ p }: { p: Paleta }) {
  const pena = misturarCor(p.base, 0.72);
  return (
    <g>
      <Peca d="M88 98 Q46 84 6 86 Q30 104 90 114 Z" p={p}>
        <path d="M6 86 Q20 90 30 96 L24 100 Q12 94 6 86 Z" fill={pena} />
      </Peca>
      <PernaFundo d={perna(110, 116, 14, 44)} p={p} />
      <Peca d={elipseGirada(102, 100, 40, 25, -15)} p={p} brilho={[86, 88, 12, 6]}>
        <ellipse cx={110} cy={112} rx={24} ry={11} fill={p.detalhe} transform="rotate(-15 110 112)" />
      </Peca>
      {p.detalhes && (
        <g fill={p.marca}>
          <path d="M74 96 L84 90 L82 102 Z" />
          <path d="M88 88 L98 83 L96 94 Z" />
        </g>
      )}
      <Peca d={perna(86, 120, 17, 40)} p={p} />
      <Peca d={elipse(95, 112, 16, 18)} p={p} brilho={[90, 104, 5, 4]} />
      {/* Garra em foice no pé (marca registrada do Velociraptor), sem parecer ameaçadora. */}
      <PecaGarra p={p} />
      <Unhas patas={[[88, 158]]} p={p} />
      <Peca d="M122 104 Q136 104 140 114 Q132 118 122 112 Z" p={p} espessura={4} />
      <Peca d="M118 94 Q124 76 132 70 L144 80 Q136 90 128 102 Z" p={p} />
      <Peca d="M128 50 Q118 36 124 24 Q130 40 140 44 Z" p={p} cor={pena} sombra={misturarCor(pena, 0.8)} espessura={3.5} />
      <Peca d="M138 44 Q134 28 142 18 Q144 34 148 42 Z" p={p} cor={pena} sombra={misturarCor(pena, 0.8)} espessura={3.5} />
      <Peca d="M124 64 C124 46 142 38 162 40 C184 42 200 50 200 62 C200 74 184 80 162 80 C142 80 126 76 124 64 Z" p={p} brilho={[142, 48, 12, 5]}>
        <path d="M130 74 Q164 86 200 64 L202 84 L126 84 Z" fill={p.detalhe} />
      </Peca>
      <Olho x={152} y={56} p={p} escala={0.8} />
      <Olho x={171} y={54} p={p} escala={0.64} />
      <Rosto
        p={p}
        bochecha={[150, 70]}
        boca="M164 70 Q180 75 194 66"
        sobrancelhas={['M142 44 Q152 40 161 46', 'M165 45 Q171 42 177 46']}
        narina={[194, 55]}
        dentes={[[176, 72], [185, 70]]}
      />
    </g>
  );
}

/* ---------- Tiranossauro: cabeça grande, braços pequenos, pernas fortes, cauda robusta ---------- */
function Tiranossauro({ p }: { p: Paleta }) {
  return (
    <g>
      <Peca d="M74 100 Q34 90 6 108 Q30 128 84 124 Z" p={p} />
      <PernaFundo d={perna(106, 118, 26, 42)} p={p} />
      <Peca d={elipse(98, 106, 40, 36)} p={p} brilho={[82, 86, 14, 8]}>
        <ellipse cx={108} cy={120} rx={24} ry={18} fill={p.detalhe} />
      </Peca>
      {p.detalhes && (
        <g fill={p.marca}>
          <path d="M66 88 L78 82 L74 96 Z" />
          <path d="M78 76 L92 72 L86 86 Z" />
          <path d="M40 102 L52 98 L48 110 Z" />
        </g>
      )}
      <Peca d={perna(74, 116, 30, 44)} p={p} />
      <Unhas patas={[[81, 158]]} p={p} />
      <Peca d="M124 112 Q144 108 150 120 Q142 126 126 124 Z" p={p} espessura={4} />
      <Peca d="M108 62 C106 34 130 20 158 22 C186 24 204 38 204 60 C204 80 186 92 158 92 C130 92 110 86 108 62 Z" p={p} brilho={[132, 34, 16, 7]}>
        <path d="M122 82 Q160 98 204 70 L206 96 L112 96 Z" fill={p.detalhe} />
      </Peca>
      {p.detalhes && (
        <g fill={p.marca}>
          <path d="M122 32 L132 24 L134 38 Z" />
          <path d="M138 24 L150 18 L150 32 Z" />
        </g>
      )}
      <Olho x={150} y={50} p={p} />
      <Olho x={175} y={46} p={p} escala={0.78} />
      <Rosto
        p={p}
        bochecha={[146, 70]}
        boca="M150 78 Q176 86 198 72"
        sobrancelhas={['M137 34 Q150 29 162 36', 'M166 32 Q175 28 184 33']}
        narina={[196, 42]}
        dentes={[[166, 81], [180, 79]]}
      />
    </g>
  );
}

export const DESENHOS_ESPECIES: Record<IdDinossauro, ComponentType<{ p: Paleta }>> = {
  triceratops: Triceratops,
  estegossauro: Estegossauro,
  braquiossauro: Braquiossauro,
  anquilossauro: Anquilossauro,
  velociraptor: Velociraptor,
  tiranossauro: Tiranossauro,
};
