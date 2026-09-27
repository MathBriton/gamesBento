import type { Dinossauro, IdDinossauro } from '../tipos';

/*
 * Espécies do jogo, na ordem de compra (da mais barata à mais forte).
 * Cores seguem o guia estético (src/Images/Dinossauros/GUIA_ESTETICO_DINOSSAUROS.md, seção 6).
 */
export const DINOSSAUROS: Record<IdDinossauro, Dinossauro> = {
  triceratops: {
    id: 'triceratops',
    nome: 'Tricerátops',
    especie: 'Triceratops horridus',
    dieta: 'herbivoro',
    comprimentoMetros: 9,
    cor: '#4fa3f7',
    corDetalhe: '#ffd166',
    curiosidade: 'Tinha 3 chifres e uma gola enorme na cabeça!',
    danoBase: 2,
    custoBaseNivel: 10,
    precoCompra: 10,
  },
  estegossauro: {
    id: 'estegossauro',
    nome: 'Estegossauro',
    especie: 'Stegosaurus stenops',
    dieta: 'herbivoro',
    comprimentoMetros: 9,
    cor: '#5cc34d',
    corDetalhe: '#ffb03b',
    curiosidade: 'As placas nas costas podiam ficar coloridas!',
    danoBase: 9,
    custoBaseNivel: 60,
    precoCompra: 150,
  },
  braquiossauro: {
    id: 'braquiossauro',
    nome: 'Braquiossauro',
    especie: 'Brachiosaurus altithorax',
    dieta: 'herbivoro',
    comprimentoMetros: 22,
    cor: '#ffd23f',
    corDetalhe: '#ff9f43',
    curiosidade: 'Alcançava as folhas mais altas das árvores!',
    danoBase: 40,
    custoBaseNivel: 400,
    precoCompra: 2_000,
  },
  anquilossauro: {
    id: 'anquilossauro',
    nome: 'Anquilossauro',
    especie: 'Ankylosaurus magniventris',
    dieta: 'herbivoro',
    comprimentoMetros: 7,
    cor: '#9b6dff',
    corDetalhe: '#e6d6ff',
    curiosidade: 'Tinha uma clava na ponta da cauda!',
    danoBase: 180,
    custoBaseNivel: 2_500,
    precoCompra: 30_000,
  },
  velociraptor: {
    id: 'velociraptor',
    nome: 'Velociraptor',
    especie: 'Velociraptor mongoliensis',
    dieta: 'carnivoro',
    comprimentoMetros: 2,
    cor: '#ff5a4f',
    corDetalhe: '#ffd6a5',
    curiosidade: 'Era do tamanho de um peru e tinha penas!',
    danoBase: 800,
    custoBaseNivel: 16_000,
    precoCompra: 500_000,
  },
  tiranossauro: {
    id: 'tiranossauro',
    nome: 'Tiranossauro Rex',
    especie: 'Tyrannosaurus rex',
    dieta: 'carnivoro',
    comprimentoMetros: 12,
    cor: '#ff7a45',
    corDetalhe: '#ffe2b8',
    curiosidade: 'Tinha bracinhos bem pequenos e uma mordida fortíssima!',
    danoBase: 3_500,
    custoBaseNivel: 100_000,
    precoCompra: 10_000_000,
  },
};

/** Ordem de exibição e de compra. */
export const IDS_DINOSSAUROS = Object.keys(DINOSSAUROS) as IdDinossauro[];

export const ROTULO_DIETA = {
  herbivoro: 'Plantas',
  carnivoro: 'Carne',
} as const;

export const ICONE_DIETA = {
  herbivoro: '🌿',
  carnivoro: '🍖',
} as const;
