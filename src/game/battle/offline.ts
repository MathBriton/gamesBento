import { CONFIG } from '../../data/config';
import type { GameState } from '../../types';
import { enemyMaxHp, goldFor, teamDps } from './formulas';

export interface OfflineResult {
  state: GameState;
  gold: number;
  elapsedMs: number;
}

/**
 * Ouro ganho enquanto o jogo esteve fechado: o time continua derrotando inimigos
 * comuns da fase atual (sem avançar fases), com limite de tempo e de velocidade.
 * Não depende de timer ativo — só da diferença entre `lastSeen` e agora.
 */
export function applyOffline(state: GameState, now: number): OfflineResult {
  const elapsedMs = Math.min(now - state.lastSeen, CONFIG.offlineMaxMs);
  const dps = teamDps(state);
  if (elapsedMs < CONFIG.offlineMinMs || dps <= 0) {
    return { state: { ...state, lastSeen: now }, gold: 0, elapsedMs: 0 };
  }
  const stage = Math.max(1, state.battle.isBoss ? state.battle.stage - 1 : state.battle.stage);
  const killsPerSecond = Math.min(dps / enemyMaxHp(stage, false), CONFIG.maxKillsPerSecond);
  const gold = Math.floor(killsPerSecond * goldFor(stage, false) * (elapsedMs / 1000));
  return { state: { ...state, gold: state.gold + gold, lastSeen: now }, gold, elapsedMs };
}
