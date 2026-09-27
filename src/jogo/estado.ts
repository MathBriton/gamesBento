import { CONFIG } from '../dados/config';
import type { EstadoJogo } from '../tipos';
import { criarBatalha } from './batalha/batalha';

export const VERSAO_SAVE = 5;

export function criarEstadoInicial(agora: number): EstadoJogo {
  return {
    versao: VERSAO_SAVE,
    jogador: { criadoEm: agora },
    vistoPorUltimo: agora,
    moedas: CONFIG.moedasIniciais,
    dinossauros: {},
    nivelGarra: 1,
    batalha: criarBatalha(),
    ajustes: { musica: true, efeitos: true, narracao: true, volume: 0.7 },
  };
}
