import type { TipoInimigo } from '../tipos';

export interface DefinicaoInimigo {
  tipo: TipoInimigo;
  nome: string;
  nomeChefao: string;
}

export const INIMIGOS: Record<TipoInimigo, DefinicaoInimigo> = {
  gosma: { tipo: 'gosma', nome: 'Gosma', nomeChefao: 'Rei Gosma' },
  morcego: { tipo: 'morcego', nome: 'Morcego', nomeChefao: 'Morcegão Sombrio' },
  golem: { tipo: 'golem', nome: 'Golem de Pedra', nomeChefao: 'Golem Colossal' },
  planta: { tipo: 'planta', nome: 'Planta Carnívora', nomeChefao: 'Rainha das Plantas' },
};

export const TIPOS_INIMIGO = Object.keys(INIMIGOS) as TipoInimigo[];

/** Cor dos inimigos por zona (a zona muda a cada 10 fases e se repete). */
export const CORES_INIMIGO_POR_ZONA = ['#b46cff', '#ff5f7e', '#8a7a6a', '#3fbf8f', '#ff8c1a', '#4d7cff'];
