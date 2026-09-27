import { CONFIG } from '../../dados/config';
import type { EstadoJogo } from '../../tipos';
import { danoDoTime, ouroPorInimigo, vidaMaximaInimigo } from './formulas';

export interface ResultadoOffline {
  estado: EstadoJogo;
  ouro: number;
  tempoMs: number;
}

/**
 * Ouro ganho enquanto o jogo esteve fechado: o time continua derrotando inimigos
 * comuns da fase atual (sem avançar fases), com limite de tempo e de velocidade.
 * Não depende de timer ativo — só da diferença entre `vistoPorUltimo` e agora.
 */
export function aplicarOffline(estado: EstadoJogo, agora: number): ResultadoOffline {
  const tempoMs = Math.min(agora - estado.vistoPorUltimo, CONFIG.offlineMaximoMs);
  const dano = danoDoTime(estado);
  if (tempoMs < CONFIG.offlineMinimoMs || dano <= 0) {
    return { estado: { ...estado, vistoPorUltimo: agora }, ouro: 0, tempoMs: 0 };
  }
  const fase = Math.max(1, estado.batalha.ehChefao ? estado.batalha.fase - 1 : estado.batalha.fase);
  const abatesPorSegundo = Math.min(dano / vidaMaximaInimigo(fase, false), CONFIG.abatesMaximosPorSegundo);
  const ouro = Math.floor(abatesPorSegundo * ouroPorInimigo(fase, false) * (tempoMs / 1000));
  return { estado: { ...estado, ouro: estado.ouro + ouro, vistoPorUltimo: agora }, ouro, tempoMs };
}
