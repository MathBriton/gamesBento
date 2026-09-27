import { createInitialState, SAVE_VERSION } from '../game/state';
import type { DinoId, GameState, OwnedDino, Settings } from '../types';

const STORAGE_KEY = 'ilha-dos-dinossauros:save';

/**
 * Persistência local. Toda leitura/escrita passa por aqui para que a
 * troca futura por IndexedDB ou backend não afete o resto do jogo.
 */
export function loadGame(now: number): GameState {
  const fresh = createInitialState(now);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    return migrate(JSON.parse(raw) as LegacySave, fresh);
  } catch {
    return fresh;
  }
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Armazenamento indisponível (modo privado, cota cheia): o jogo continua funcionando na sessão.
  }
}

export function resetGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignorado
  }
}

/** Formato salvo por versões antigas (v1/v2: jogo educativo com "collection"). */
type LegacySave = Partial<GameState> & {
  collection?: Partial<Record<DinoId, { discoveredAt: number; count: number }>>;
  settings?: Partial<Settings>;
};

export function migrate(saved: LegacySave, fresh: GameState): GameState {
  if ((saved.version ?? 1) < 3) {
    // v1/v2 → v3: o jogo virou idle de batalha. Mantém dinossauros descobertos, ovos e ajustes.
    const dinos: GameState['dinos'] = {};
    for (const [id, entry] of Object.entries(saved.collection ?? {})) {
      if (entry) dinos[id as DinoId] = { level: 1, count: entry.count, discoveredAt: entry.discoveredAt } satisfies OwnedDino;
    }
    return {
      ...fresh,
      dinos,
      eggs: Math.max(fresh.eggs, saved.eggs ?? 0),
      settings: { ...fresh.settings, ...saved.settings },
    };
  }
  return {
    ...fresh,
    ...saved,
    version: SAVE_VERSION,
    player: { ...fresh.player, ...saved.player },
    settings: { ...fresh.settings, ...saved.settings },
    battle: { ...fresh.battle, ...saved.battle },
    dinos: saved.dinos ?? {},
  };
}
