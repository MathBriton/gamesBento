import type { IdDinossauro } from '../../tipos';

/** Posição de uma peça: [x, y, rotação em graus, escala]. */
export type Posicao = [x: number, y: number, rotacao: number, escala: number];

/** Onde cada peça de armadura fica em cada espécie (coordenadas do desenho em especies.tsx). */
export interface Ancoras {
  capacete: Posicao;
  /** Placa sobre as costas: centro, largura, altura, rotação. */
  dorso: [x: number, y: number, largura: number, altura: number, rotacao: number];
  ombreira: Posicao;
  /** Caneleiras nas pernas da frente (do lado do jogador): [x, y, largura]. */
  caneleiras: [x: number, y: number, largura: number][];
  cauda: Posicao;
  /** Centro da aura. */
  centro: [x: number, y: number];
}

export const ANCORAS: Record<IdDinossauro, Ancoras> = {
  triceratops: {
    capacete: [153, 80, -6, 0.85],
    dorso: [82, 86, 60, 20, -2],
    ombreira: [118, 106, 8, 0.9],
    caneleiras: [[69, 146, 32], [117, 146, 32]],
    cauda: [30, 121, 22, 0.8],
    centro: [104, 98],
  },
  estegossauro: {
    capacete: [170, 106, -8, 0.7],
    dorso: [94, 108, 60, 16, 0],
    ombreira: [134, 114, 10, 0.8],
    caneleiras: [[77, 146, 32], [126, 146, 30]],
    cauda: [34, 116, 15, 0.8],
    centro: [100, 100],
  },
  braquiossauro: {
    capacete: [146, 8, -6, 0.72],
    dorso: [84, 94, 58, 18, -10],
    ombreira: [118, 104, 0, 0.9],
    caneleiras: [[64, 150, 30], [114, 150, 30]],
    cauda: [28, 129, 18, 0.8],
    centro: [100, 86],
  },
  anquilossauro: {
    capacete: [168, 98, -6, 0.75],
    dorso: [96, 86, 72, 18, 0],
    ombreira: [138, 108, 10, 0.85],
    caneleiras: [[73, 148, 32], [125, 148, 32]],
    cauda: [36, 125, 8, 0.75],
    centro: [100, 104],
  },
  velociraptor: {
    capacete: [158, 42, -6, 0.78],
    dorso: [100, 88, 46, 15, -15],
    ombreira: [124, 102, -10, 0.7],
    caneleiras: [[95, 146, 24], [117, 146, 20]],
    cauda: [52, 98, 8, 0.7],
    centro: [110, 94],
  },
  tiranossauro: {
    capacete: [154, 25, -6, 1],
    dorso: [92, 80, 46, 18, -12],
    ombreira: [126, 106, 0, 0.8],
    caneleiras: [[90, 146, 34], [120, 146, 28]],
    cauda: [42, 106, 10, 0.8],
    centro: [110, 92],
  },
};
