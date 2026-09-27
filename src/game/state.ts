import { CONFIG } from '../data/config';
import type { GameState } from '../types';
import { createBattle } from './battle/battle';

export const SAVE_VERSION = 3;

export function createInitialState(now: number): GameState {
  return {
    version: SAVE_VERSION,
    player: { createdAt: now },
    lastSeen: now,
    gold: CONFIG.initialGold,
    eggs: CONFIG.initialEggs,
    dinos: {},
    clawLevel: 1,
    battle: createBattle(),
    settings: { music: true, sfx: true, narration: true, volume: 0.7 },
  };
}
