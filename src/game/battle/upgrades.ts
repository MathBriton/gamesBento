import { CONFIG } from '../../data/config';
import type { DinoId, GameState } from '../../types';
import { dinoBaseCost, evolutionOf, levelCost, maxAffordable } from './formulas';

/** Quantidade de níveis por compra escolhida no painel. */
export type BuyAmount = 1 | 10 | 100 | 'max';

export interface PurchaseQuote {
  levels: number;
  cost: number;
  affordable: boolean;
}

/** Quanto custa a compra no modo escolhido. No modo "max", pelo menos 1 nível é cotado. */
export function quote(base: number, level: number, gold: number, amount: BuyAmount): PurchaseQuote {
  const levels = amount === 'max' ? Math.max(1, maxAffordable(base, level, gold)) : amount;
  const cost = levelCost(base, level, levels);
  return { levels, cost, affordable: gold >= cost };
}

export function quoteDino(state: GameState, dinoId: DinoId, amount: BuyAmount): PurchaseQuote | null {
  const owned = state.dinos[dinoId];
  if (!owned) return null;
  return quote(dinoBaseCost(dinoId), owned.level, state.gold, amount);
}

export function quoteClaw(state: GameState, amount: BuyAmount): PurchaseQuote {
  return quote(CONFIG.clawBaseCost, state.clawLevel, state.gold, amount);
}

export interface LevelUpResult {
  state: GameState;
  levels: number;
  /** Novo estágio de evolução, se a compra fez o dinossauro evoluir. */
  evolvedTo: number | null;
}

/** Soma níveis a um dinossauro (compra ou presente) e informa se houve evolução. */
export function addLevels(state: GameState, dinoId: DinoId, levels: number): LevelUpResult {
  const owned = state.dinos[dinoId];
  if (!owned || levels <= 0) return { state, levels: 0, evolvedTo: null };
  const before = evolutionOf(owned.level);
  const level = owned.level + levels;
  const after = evolutionOf(level);
  return {
    levels,
    evolvedTo: after > before ? after : null,
    state: { ...state, dinos: { ...state.dinos, [dinoId]: { ...owned, level } } },
  };
}

export function buyDinoLevels(state: GameState, dinoId: DinoId, amount: BuyAmount): LevelUpResult | null {
  const q = quoteDino(state, dinoId, amount);
  if (!q || !q.affordable) return null;
  return addLevels({ ...state, gold: state.gold - q.cost }, dinoId, q.levels);
}

export function buyClawLevels(state: GameState, amount: BuyAmount): GameState | null {
  const q = quoteClaw(state, amount);
  if (!q.affordable) return null;
  return { ...state, gold: state.gold - q.cost, clawLevel: state.clawLevel + q.levels };
}
