import { CONFIG } from '../../data/config';
import { DINO_IDS, DINOSAURS, RARITY_WEIGHT } from '../../data/dinosaurs';
import type { DinoId, GameState } from '../../types';
import { weightedPick, type Rng } from '../../utils/random';
import { addLevels } from '../battle/upgrades';

export interface HatchResult {
  state: GameState;
  dinoId: DinoId;
  isNew: boolean;
  /** Níveis grátis ganhos por repetido (0 se novo). */
  bonusLevels: number;
  evolvedTo: number | null;
}

export function canHatch(state: GameState): boolean {
  return state.eggs > 0;
}

/**
 * Choca um ovo: sorteia um dinossauro ponderado pela raridade (espécies que você
 * ainda não tem têm mais chance). Novo entra no time no nível 1; repetido vira níveis grátis.
 */
export function hatchEgg(state: GameState, rng: Rng, now: number): HatchResult | null {
  if (!canHatch(state)) return null;
  const dinoId = weightedPick(rng, DINO_IDS, (id) => {
    const base = RARITY_WEIGHT[DINOSAURS[id].rarity];
    return state.dinos[id] ? base : base * 3;
  });
  const existing = state.dinos[dinoId];
  const afterEgg: GameState = { ...state, eggs: state.eggs - 1 };

  if (!existing) {
    return {
      dinoId,
      isNew: true,
      bonusLevels: 0,
      evolvedTo: null,
      state: { ...afterEgg, dinos: { ...afterEgg.dinos, [dinoId]: { level: 1, count: 1, discoveredAt: now } } },
    };
  }

  const counted: GameState = {
    ...afterEgg,
    dinos: { ...afterEgg.dinos, [dinoId]: { ...existing, count: existing.count + 1 } },
  };
  const r = addLevels(counted, dinoId, CONFIG.duplicateLevels);
  return { dinoId, isNew: false, bonusLevels: r.levels, evolvedTo: r.evolvedTo, state: r.state };
}
