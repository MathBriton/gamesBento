import { CONFIG } from '../../data/config';
import { DINO_IDS, DINOSAURS } from '../../data/dinosaurs';
import { MAX_EVOLUTION } from '../../data/evolution';
import type { DinoId, GameState } from '../../types';

/*
 * Fórmulas de progressão no estilo clicker:
 * HP dos inimigos cresce exponencialmente por fase; o dano dos dinossauros cresce
 * linearmente por nível, dobra a cada 25 níveis e multiplica ao evoluir (a cada 100).
 */

export function isBossStage(stage: number): boolean {
  return stage % CONFIG.bossEvery === 0;
}

export function enemyMaxHp(stage: number, boss: boolean): number {
  const base = Math.ceil(CONFIG.baseEnemyHp * CONFIG.enemyHpGrowth ** (stage - 1));
  return base * (boss ? CONFIG.bossHpMultiplier : 1);
}

export function goldFor(stage: number, boss: boolean): number {
  const base = enemyMaxHp(stage, false) / CONFIG.goldDivisor;
  return Math.max(1, Math.ceil(base * (boss ? CONFIG.bossGoldMultiplier : 1)));
}

/** Estágio de evolução (0 = Filhote) a partir do nível. */
export function evolutionOf(level: number): number {
  return Math.min(MAX_EVOLUTION, Math.floor(level / CONFIG.evolutionEvery));
}

/** Quantos dobros de "marco" o nível tem (marcos que coincidem com evolução não contam). */
function milestonesOf(level: number): number {
  return Math.floor(level / CONFIG.milestoneEvery) - evolutionOf(level);
}

export function dinoDps(dinoId: DinoId, level: number): number {
  if (level <= 0) return 0;
  return DINOSAURS[dinoId].baseDps * level * 2 ** milestonesOf(level) * CONFIG.evolutionDamageMultiplier ** evolutionOf(level);
}

export function teamDps(state: GameState): number {
  return DINO_IDS.reduce((sum, id) => sum + dinoDps(id, state.dinos[id]?.level ?? 0), 0);
}

export function clawDamage(clawLevel: number): number {
  return CONFIG.clawBaseDamage * clawLevel * 2 ** Math.floor(clawLevel / CONFIG.milestoneEvery);
}

export function tapDamage(state: GameState): number {
  return clawDamage(state.clawLevel) + teamDps(state) * CONFIG.tapDpsShare;
}

/** Custo para subir `n` níveis a partir de `level` (do nível 1 para o 2 custa `base`). */
export function levelCost(base: number, level: number, n: number): number {
  const g = CONFIG.levelCostGrowth;
  return Math.ceil((base * g ** (level - 1) * (g ** n - 1)) / (g - 1));
}

/** Máximo de níveis que dá para comprar com o ouro disponível. */
export function maxAffordable(base: number, level: number, gold: number): number {
  const g = CONFIG.levelCostGrowth;
  const first = base * g ** (level - 1);
  if (gold < first) return 0;
  let n = Math.floor(Math.log((gold * (g - 1)) / first + 1) / Math.log(g));
  // Corrige arredondamentos de ponto flutuante.
  while (n > 0 && levelCost(base, level, n) > gold) n--;
  return n;
}

export function dinoBaseCost(dinoId: DinoId): number {
  return DINOSAURS[dinoId].baseCost;
}
