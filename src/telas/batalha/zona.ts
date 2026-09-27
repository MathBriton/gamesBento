import { CORES_INIMIGO_POR_ZONA } from '../../dados/inimigos';
import { ORDEM_REGIOES, REGIOES } from '../../dados/regioes';
import type { Regiao } from '../../tipos';

export const FASES_POR_ZONA = 10;

export interface Zona {
  indice: number;
  regiao: Regiao;
  corInimigo: string;
}

/** Cenário e cor dos inimigos mudam a cada 10 fases, em ciclo pelas regiões. */
export function zonaDaFase(fase: number): Zona {
  const indice = Math.floor((fase - 1) / FASES_POR_ZONA);
  return {
    indice,
    regiao: REGIOES[ORDEM_REGIOES[indice % ORDEM_REGIOES.length]],
    corInimigo: CORES_INIMIGO_POR_ZONA[indice % CORES_INIMIGO_POR_ZONA.length],
  };
}
