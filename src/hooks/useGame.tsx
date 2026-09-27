import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { applyAudioSettings } from '../audio/audio';
import { applyOffline } from '../game/battle/offline';
import { loadGame, resetGame, saveGame } from '../storage/save';
import type { GameState } from '../types';

/*
 * Estado do jogo fora do React: o loop de batalha (10x por segundo) e os toques
 * leem sempre o estado mais recente de forma síncrona, sem perder atualizações.
 * O React só se inscreve para renderizar. O salvamento é limitado (a cada 2 s)
 * e forçado ao esconder/fechar a página.
 */

const SAVE_THROTTLE_MS = 2000;

interface Store {
  get: () => GameState;
  set: (next: GameState) => void;
  subscribe: (listener: () => void) => () => void;
  saveNow: () => void;
}

function createStore(initial: GameState): Store {
  let state = initial;
  const listeners = new Set<() => void>();
  let saveTimer: number | null = null;

  const saveNow = () => {
    if (saveTimer !== null) {
      window.clearTimeout(saveTimer);
      saveTimer = null;
    }
    saveGame({ ...state, lastSeen: Date.now() });
  };

  return {
    get: () => state,
    set: (next) => {
      if (next === state) return;
      state = next;
      listeners.forEach((l) => l());
      if (saveTimer === null) saveTimer = window.setTimeout(saveNow, SAVE_THROTTLE_MS);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    saveNow,
  };
}

export interface Popup {
  id: number;
  text: string;
}

export interface OfflineReport {
  gold: number;
  elapsedMs: number;
}

interface GameContextValue {
  state: GameState;
  /** Aplica uma transição pura de estado. */
  update: (fn: (s: GameState) => GameState) => void;
  /** Aplica uma transição que também devolve dados (eventos, resultado) e retorna esses dados. */
  run: <R extends { state: GameState }>(fn: (s: GameState) => R) => R;
  popups: Popup[];
  showPopup: (text: string) => void;
  resetProgress: () => void;
  offline: OfflineReport | null;
  dismissOffline: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function loadWithOffline(): { state: GameState; report: OfflineReport | null } {
  const now = Date.now();
  const r = applyOffline(loadGame(now), now);
  return { state: r.state, report: r.gold > 0 ? { gold: r.gold, elapsedMs: r.elapsedMs } : null };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [boot] = useState(loadWithOffline);
  const [store, setStore] = useState(() => createStore(boot.state));
  const [offline, setOffline] = useState<OfflineReport | null>(boot.report);
  const state = useSyncExternalStore(store.subscribe, store.get);
  const [popups, setPopups] = useState<Popup[]>([]);
  const nextId = useRef(1);

  useEffect(() => applyAudioSettings(state.settings), [state.settings]);

  // Aba escondida por muito tempo conta como "offline"; ao esconder, salva na hora.
  useEffect(() => {
    let hiddenAt: number | null = null;
    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt = Date.now();
        store.saveNow();
      } else if (hiddenAt !== null) {
        const r = applyOffline({ ...store.get(), lastSeen: hiddenAt }, Date.now());
        store.set(r.state);
        if (r.gold > 0) setOffline({ gold: r.gold, elapsedMs: r.elapsedMs });
        hiddenAt = null;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', store.saveNow);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', store.saveNow);
    };
  }, [store]);

  const update = useCallback((fn: (s: GameState) => GameState) => store.set(fn(store.get())), [store]);

  const run = useCallback(<R extends { state: GameState }>(fn: (s: GameState) => R): R => {
    const r = fn(store.get());
    store.set(r.state);
    return r;
  }, [store]);

  const showPopup = useCallback((text: string) => {
    const id = nextId.current++;
    setPopups((p) => [...p.slice(-3), { id, text }]);
    window.setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 1600);
  }, []);

  const resetProgress = useCallback(() => {
    resetGame();
    const fresh = createStore(loadGame(Date.now()));
    fresh.saveNow();
    setStore(fresh);
    setOffline(null);
  }, []);

  const value = useMemo(
    () => ({ state, update, run, popups, showPopup, resetProgress, offline, dismissOffline: () => setOffline(null) }),
    [state, update, run, popups, showPopup, resetProgress, offline],
  );
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame precisa estar dentro de <GameProvider>');
  return ctx;
}
