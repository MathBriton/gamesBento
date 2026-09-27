export type IdDinossauro = 'triceratops' | 'estegossauro' | 'braquiossauro' | 'anquilossauro' | 'velociraptor' | 'tiranossauro';
export type IdRegiao = 'planicie' | 'selva' | 'costa' | 'montanhas' | 'deserto' | 'vulcao';
export type Dieta = 'herbivoro' | 'carnivoro';
export type TipoInimigo = 'gosma' | 'morcego' | 'golem' | 'planta';

export interface Dinossauro {
  id: IdDinossauro;
  nome: string;
  /** Nome científico. */
  especie: string;
  dieta: Dieta;
  /** Comprimento aproximado em metros, usado na coleção. */
  comprimentoMetros: number;
  /** Cor principal (guia estético, seção 6). */
  cor: string;
  /** Cor de detalhe: barriga, gola, placas, manchas. */
  corDetalhe: string;
  curiosidade: string;
  /** Dano por segundo no nível 1. */
  danoBase: number;
  /** Custo em moedas para subir do nível 1 para o 2. */
  custoBaseNivel: number;
  /** Preço em moedas para comprar (contratar) o dinossauro. */
  precoCompra: number;
}

export interface Regiao {
  id: IdRegiao;
  nome: string;
  icone: string;
  /** Posição na sequência de zonas (0 = primeira). */
  ordem: number;
  /** Fundo CSS da arena nesta zona. */
  fundo: string;
}

export interface Ajustes {
  musica: boolean;
  efeitos: boolean;
  narracao: boolean;
  volume: number; // 0..1
}

export interface DinossauroDoJogador {
  nivel: number;
  obtidoEm: number;
}

export interface EstadoBatalha {
  /** Fase atual (começa em 1). */
  fase: number;
  /** Maior fase já alcançada. */
  faseMaxima: number;
  /** Inimigos derrotados na fase atual. */
  abates: number;
  tipoInimigo: TipoInimigo;
  vidaInimigo: number;
  vidaMaximaInimigo: number;
  ehChefao: boolean;
  /** Momento limite para derrotar o chefão; null fora de chefão. */
  fimChefaoEm: number | null;
  /** Após perder para um chefão, repete a fase anterior até o jogador tentar de novo. */
  treinando: boolean;
}

export interface EstadoJogo {
  versao: number;
  jogador: { criadoEm: number };
  /** Último momento em que o jogo estava aberto, para calcular o ganho offline. */
  vistoPorUltimo: number;
  moedas: number;
  dinossauros: Partial<Record<IdDinossauro, DinossauroDoJogador>>;
  /** Nível da Garra: define o dano do toque. */
  nivelGarra: number;
  batalha: EstadoBatalha;
  ajustes: Ajustes;
}
