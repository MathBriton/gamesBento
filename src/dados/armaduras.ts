/*
 * Armaduras: a cada 100 níveis o dinossauro ganha uma nova armadura (nível 0 = sem armadura,
 * nível 10 = Nv 1000). Os modelos abaixo são provisórios; o visual definitivo de cada armadura
 * será definido depois (por prompt). Para mudar o visual, altere só estes dados e o desenho em
 * componentes/armadura/ — a regra de progressão não depende disso.
 */

export type PecaArmadura = 'capacete' | 'dorso' | 'ombreira' | 'caneleiras' | 'cauda';

export interface Material {
  nome: string;
  cor: string;
  /** Cor de rebites e detalhes. */
  detalhe: string;
}

export interface NivelArmadura {
  /** 0 a 10 (nível do dinossauro / 100). */
  nivel: number;
  nome: string;
  material: Material | null;
  pecas: PecaArmadura[];
  /** Gema no centro das peças (níveis altos). */
  gema: string | null;
  /** Aura em volta do dinossauro. */
  aura: string | null;
  /** Penacho no capacete. */
  penacho: boolean;
  /** Brilhos animados (nível máximo). */
  brilhos: boolean;
}

const COURO: Material = { nome: 'Couro', cor: '#a86b3c', detalhe: '#6b3f1d' };
const BRONZE: Material = { nome: 'Bronze', cor: '#d98c3f', detalhe: '#8a4b12' };
const FERRO: Material = { nome: 'Ferro', cor: '#8d99a6', detalhe: '#4f5a66' };
const ACO: Material = { nome: 'Aço', cor: '#b9c6d2', detalhe: '#5d6b78' };
const PRATA: Material = { nome: 'Prata', cor: '#e3e9f0', detalhe: '#8a96a3' };
const OURO: Material = { nome: 'Ouro', cor: '#ffcc33', detalhe: '#b07d00' };
const ESMERALDA: Material = { nome: 'Esmeralda', cor: '#43d18f', detalhe: '#1b7a4d' };
const SAFIRA: Material = { nome: 'Safira', cor: '#4d8dff', detalhe: '#1f4fb0' };
const RUBI: Material = { nome: 'Rubi', cor: '#ff4d6d', detalhe: '#a3182f' };
const LENDARIA: Material = { nome: 'Lendária', cor: '#9ff0ff', detalhe: '#e0a400' };

const CONJUNTO_COMPLETO: PecaArmadura[] = ['capacete', 'dorso', 'ombreira', 'caneleiras', 'cauda'];

export const ARMADURAS: NivelArmadura[] = [
  { nivel: 0, nome: 'Selvagem', material: null, pecas: [], gema: null, aura: null, penacho: false, brilhos: false },
  { nivel: 1, nome: 'Couro', material: COURO, pecas: ['capacete'], gema: null, aura: null, penacho: false, brilhos: false },
  { nivel: 2, nome: 'Bronze', material: BRONZE, pecas: ['capacete', 'dorso'], gema: null, aura: null, penacho: false, brilhos: false },
  { nivel: 3, nome: 'Ferro', material: FERRO, pecas: ['capacete', 'dorso', 'caneleiras'], gema: null, aura: null, penacho: false, brilhos: false },
  { nivel: 4, nome: 'Aço', material: ACO, pecas: ['capacete', 'dorso', 'ombreira', 'caneleiras'], gema: null, aura: null, penacho: false, brilhos: false },
  { nivel: 5, nome: 'Prata', material: PRATA, pecas: CONJUNTO_COMPLETO, gema: null, aura: null, penacho: true, brilhos: false },
  { nivel: 6, nome: 'Ouro', material: OURO, pecas: CONJUNTO_COMPLETO, gema: '#ff4d6d', aura: null, penacho: true, brilhos: false },
  { nivel: 7, nome: 'Esmeralda', material: ESMERALDA, pecas: CONJUNTO_COMPLETO, gema: '#eafff4', aura: '#43d18f', penacho: true, brilhos: false },
  { nivel: 8, nome: 'Safira', material: SAFIRA, pecas: CONJUNTO_COMPLETO, gema: '#e6f0ff', aura: '#4d8dff', penacho: true, brilhos: false },
  { nivel: 9, nome: 'Rubi', material: RUBI, pecas: CONJUNTO_COMPLETO, gema: '#fff0f3', aura: '#ff4d6d', penacho: true, brilhos: false },
  { nivel: 10, nome: 'Lendária', material: LENDARIA, pecas: CONJUNTO_COMPLETO, gema: '#ffcc33', aura: '#ffc93d', penacho: true, brilhos: true },
];

export const NIVEL_ARMADURA_MAXIMO = ARMADURAS.length - 1;
