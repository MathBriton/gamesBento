import { ARMADURAS } from '../dados/armaduras';
import { DINOSSAUROS } from '../dados/dinossauros';
import type { IdDinossauro } from '../tipos';
import { CONTORNO, misturarCor } from './Cel';
import { ANCORAS } from './dino/ancoras';
import { Aura, Brilhos, PecasArmadura } from './dino/Armadura';
import { DESENHOS_ESPECIES } from './dino/especies';
import type { Paleta } from './dino/primitivas';

export type ModoSprite = 'cor' | 'silhueta';

interface Props {
  id: IdDinossauro;
  modo?: ModoSprite;
  /** Nível da armadura (0 = sem armadura … 10 = lendária). */
  armadura?: number;
  className?: string;
  /** Vira o dinossauro para a esquerda. */
  espelhar?: boolean;
  /** Largura aproximada em pixels em que será exibido (escolhe o tamanho da imagem, se houver). */
  tamanho?: number;
}

/*
 * Imagens opcionais (guia estético, seções 9 e 10): se existir um arquivo em
 *   src/Images/Dinossauros/<id>/armadura_<N>.webp   (ou .png)
 *   src/Images/Dinossauros/<id>/armadura_<N>_<tamanho>.webp   (ex.: _128, _256, _512)
 * ele substitui o desenho SVG para aquela espécie e nível de armadura.
 */
const IMAGENS = import.meta.glob('../Images/Dinossauros/*/armadura_*.{webp,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function imagemDo(id: IdDinossauro, armadura: number, tamanho: number): string | undefined {
  const prefixo = `../Images/Dinossauros/${id}/armadura_${armadura}`;
  const opcoes = Object.entries(IMAGENS)
    .filter(([caminho]) => caminho.startsWith(prefixo) && /^(_\d+)?\.(webp|png)$/.test(caminho.slice(prefixo.length)))
    .map(([caminho, url]) => ({ url, px: Number(caminho.slice(prefixo.length).match(/_(\d+)/)?.[1] ?? 1024), webp: caminho.endsWith('.webp') }))
    .sort((a, b) => a.px - b.px || Number(b.webp) - Number(a.webp));
  if (!opcoes.length) return undefined;
  // Menor imagem que ainda cobre o tamanho pedido (tela retina: 2x).
  return (opcoes.find((o) => o.px >= tamanho * 2) ?? opcoes[opcoes.length - 1]).url;
}

function paletaDe(id: IdDinossauro, modo: ModoSprite): Paleta {
  if (modo === 'silhueta') {
    const c = '#5b6b7a';
    return { base: c, sombra: c, detalhe: c, detalheSombra: c, marca: c, fundo: c, chifre: c, chifreSombra: c, contorno: '#445260', detalhes: false };
  }
  const d = DINOSSAUROS[id];
  return {
    base: d.cor,
    sombra: misturarCor(d.cor, 0.72),
    detalhe: d.corDetalhe,
    detalheSombra: misturarCor(d.corDetalhe, 0.8),
    marca: misturarCor(d.cor, 0.62),
    fundo: misturarCor(d.cor, 0.82),
    chifre: '#fff4d8',
    chifreSombra: '#e6c98f',
    contorno: CONTORNO,
    detalhes: true,
  };
}

export function SpriteDino({ id, modo = 'cor', armadura = 0, className, espelhar, tamanho = 160 }: Props) {
  const nome = modo === 'silhueta' ? 'Dinossauro misterioso' : DINOSSAUROS[id].nome;
  const estiloEspelho = espelhar ? { transform: 'scaleX(-1)' } : undefined;

  const imagem = imagemDo(id, armadura, tamanho);
  if (imagem) {
    return (
      <img
        src={imagem}
        alt={nome}
        loading="lazy"
        decoding="async"
        className={`sprite-dino-img ${modo === 'silhueta' ? 'sprite-dino-img--silhueta' : ''} ${className ?? ''}`}
        style={estiloEspelho}
      />
    );
  }

  const p = paletaDe(id, modo);
  const nivel = ARMADURAS[Math.max(0, Math.min(armadura, ARMADURAS.length - 1))];
  const ancoras = ANCORAS[id];
  const Desenho = DESENHOS_ESPECIES[id];
  const comDetalhes = modo === 'cor';
  return (
    <svg viewBox="-12 -34 244 206" className={className} role="img" aria-label={nome} style={estiloEspelho}>
      {comDetalhes && nivel.aura && <Aura cor={nivel.aura} centro={ancoras.centro} />}
      <ellipse cx={100} cy={163} rx={76} ry={7} fill="rgba(0,0,0,0.15)" />
      <Desenho p={p} />
      {comDetalhes && <PecasArmadura nivel={nivel} ancoras={ancoras} />}
      {comDetalhes && nivel.brilhos && <Brilhos />}
    </svg>
  );
}
