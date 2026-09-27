import { CONFIG } from '../../data/config';
import { ENEMY_KINDS } from '../../data/enemies';
import type { BattleState, GameState } from '../../types';
import { pick, type Rng } from '../../utils/random';
import { enemyMaxHp, goldFor, isBossStage, teamDps } from './formulas';

export type BattleEvent =
  | { type: 'kill'; gold: number; boss: boolean }
  | { type: 'stage'; stage: number }
  | { type: 'egg' }
  | { type: 'bossFail' };

export interface BattleResult {
  state: GameState;
  events: BattleEvent[];
}

/** Coloca um novo inimigo na fase indicada. */
export function spawnEnemy(battle: BattleState, stage: number, now: number, rng: Rng): BattleState {
  const boss = isBossStage(stage) && !battle.farming;
  const hp = enemyMaxHp(stage, boss);
  return {
    ...battle,
    stage,
    maxStage: Math.max(battle.maxStage, stage),
    enemyKind: pick(rng, ENEMY_KINDS),
    enemyHp: hp,
    enemyMaxHp: hp,
    isBoss: boss,
    bossEndsAt: boss ? now + CONFIG.bossTimeMs : null,
  };
}

export function createBattle(): BattleState {
  const hp = enemyMaxHp(1, false);
  return {
    stage: 1,
    maxStage: 1,
    kills: 0,
    enemyKind: 'slime',
    enemyHp: hp,
    enemyMaxHp: hp,
    isBoss: false,
    bossEndsAt: null,
    farming: false,
    bossRecord: 0,
  };
}

/** Aplica dano ao inimigo atual; o excesso de dano é descartado. */
export function applyDamage(state: GameState, amount: number, now: number, rng: Rng): BattleResult {
  const b = state.battle;
  if (amount <= 0) return { state, events: [] };
  if (b.enemyHp - amount > 0) {
    return { state: { ...state, battle: { ...b, enemyHp: b.enemyHp - amount } }, events: [] };
  }

  const gold = goldFor(b.stage, b.isBoss);
  const events: BattleEvent[] = [{ type: 'kill', gold, boss: b.isBoss }];
  let eggs = state.eggs;
  let next: BattleState;

  if (b.isBoss) {
    let bossRecord = b.bossRecord;
    if (b.stage > b.bossRecord) {
      // Primeira vitória contra este chefão: ganha um ovo.
      eggs += 1;
      bossRecord = b.stage;
      events.push({ type: 'egg' });
    }
    next = spawnEnemy({ ...b, kills: 0, bossRecord }, b.stage + 1, now, rng);
    events.push({ type: 'stage', stage: b.stage + 1 });
  } else {
    const kills = b.kills + 1;
    if (kills < CONFIG.enemiesPerStage) {
      next = spawnEnemy({ ...b, kills }, b.stage, now, rng);
    } else if (b.farming) {
      next = spawnEnemy({ ...b, kills: 0 }, b.stage, now, rng);
    } else {
      next = spawnEnemy({ ...b, kills: 0 }, b.stage + 1, now, rng);
      events.push({ type: 'stage', stage: b.stage + 1 });
    }
  }

  return { state: { ...state, gold: state.gold + gold, eggs, battle: next }, events };
}

/** Avança o tempo: dano automático do time e o relógio do chefão. */
export function tick(state: GameState, dtSec: number, now: number, rng: Rng): BattleResult {
  const b = state.battle;
  if (b.isBoss && b.bossEndsAt !== null && now >= b.bossEndsAt) {
    // Não venceu a tempo: volta uma fase e fica treinando até tentar de novo.
    const back = spawnEnemy({ ...b, kills: 0, farming: true }, Math.max(1, b.stage - 1), now, rng);
    return { state: { ...state, battle: back }, events: [{ type: 'bossFail' }] };
  }
  return applyDamage(state, teamDps(state) * dtSec, now, rng);
}

export function canChallengeBoss(state: GameState): boolean {
  return state.battle.farming;
}

/** Sai do modo treino e vai direto para o chefão. */
export function challengeBoss(state: GameState, now: number, rng: Rng): GameState {
  if (!canChallengeBoss(state)) return state;
  const b = state.battle;
  return { ...state, battle: spawnEnemy({ ...b, farming: false, kills: 0 }, b.stage + 1, now, rng) };
}
