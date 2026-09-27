import { playSfx } from '../audio/audio';
import { BigButton, TopBar } from '../components/ui';
import { useGame } from '../hooks/useGame';
import type { Settings } from '../types';
import type { Navigate } from './navigation';

const TOGGLES: { key: 'music' | 'sfx' | 'narration'; icon: string; label: string }[] = [
  { key: 'music', icon: '🎵', label: 'Música' },
  { key: 'sfx', icon: '🔔', label: 'Sons' },
  { key: 'narration', icon: '🗣️', label: 'Narração' },
];

export function SettingsScreen({ navigate }: { navigate: Navigate }) {
  const { state, update, resetProgress } = useGame();
  const s = state.settings;
  const set = (patch: Partial<Settings>) => update((g) => ({ ...g, settings: { ...g.settings, ...patch } }));

  const confirmReset = () => {
    // Ação destrutiva: pede confirmação textual, pensada para o adulto.
    if (window.confirm('Apagar todo o progresso do jogo? Esta ação não pode ser desfeita.')) {
      resetProgress();
      navigate('splash');
    }
  };

  return (
    <div className="screen settings">
      <TopBar onHome={() => navigate('battle')} title="⚙️" />
      <div className="settings__list">
        {TOGGLES.map((t) => (
          <button
            key={t.key}
            type="button"
            role="switch"
            aria-checked={s[t.key]}
            aria-label={t.label}
            className={`toggle ${s[t.key] ? 'toggle--on' : ''}`}
            onClick={() => {
              set({ [t.key]: !s[t.key] });
              playSfx('tap');
            }}
          >
            <span className="toggle__icon" aria-hidden>{t.icon}</span>
            <span className="toggle__label">{t.label}</span>
            <span className="toggle__state" aria-hidden>{s[t.key] ? '✅' : '⛔'}</span>
          </button>
        ))}
        <label className="volume">
          <span aria-hidden>🔈</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={s.volume}
            aria-label="Volume"
            onChange={(e) => set({ volume: Number(e.target.value) })}
            onPointerUp={() => playSfx('star')}
          />
          <span aria-hidden>🔊</span>
        </label>
      </div>
      <div className="settings__danger">
        <BigButton icon="🗑️" label="Apagar progresso" color="gray" size="md" onClick={confirmReset} />
      </div>
    </div>
  );
}
