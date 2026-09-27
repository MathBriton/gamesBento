import { useState } from 'react';
import { playSfx, speak } from '../audio/audio';
import { DinoSprite } from '../components/DinoSprite';
import { Modal, TopBar } from '../components/ui';
import { CONFIG } from '../data/config';
import { DIET_ICON, DIET_LABEL, DINO_IDS, DINOSAURS, RARITY_LABEL, SIZE_LABEL } from '../data/dinosaurs';
import { EVOLUTIONS } from '../data/evolution';
import { dinoDps, evolutionOf } from '../game/battle/formulas';
import { useGame } from '../hooks/useGame';
import type { DinoId } from '../types';
import { formatNumber } from '../utils/format';
import type { Navigate } from './navigation';

export function CollectionScreen({ navigate }: { navigate: Navigate }) {
  const { state } = useGame();
  const [selected, setSelected] = useState<DinoId | null>(null);
  const found = DINO_IDS.filter((id) => state.dinos[id]).length;

  return (
    <div className="screen collection">
      <TopBar onHome={() => navigate('battle')} title={`📖 ${found} / ${DINO_IDS.length}`} />
      <div className="album">
        {DINO_IDS.map((id) => {
          const owned = state.dinos[id];
          const evo = owned ? evolutionOf(owned.level) : 1;
          return (
            <button
              key={id}
              type="button"
              className={`album-card album-card--${DINOSAURS[id].rarity} ${owned ? '' : 'album-card--locked'}`}
              aria-label={owned ? DINOSAURS[id].name : 'Dinossauro misterioso'}
              onClick={() => {
                playSfx(owned ? 'tap' : 'soft');
                if (owned) setSelected(id);
              }}
            >
              <DinoSprite dinoId={id} evolution={evo} mode={owned ? 'color' : 'silhouette'} />
              <span className="album-card__name">{owned ? DINOSAURS[id].name : '?'}</span>
              {owned && (
                <span className="album-card__meta">
                  Nv {owned.level} · {EVOLUTIONS[evo].name}
                </span>
              )}
              {owned && owned.count > 1 && <span className="badge">×{owned.count}</span>}
            </button>
          );
        })}
      </div>
      {selected && <DinoDetails dinoId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function DinoDetails({ dinoId, onClose }: { dinoId: DinoId; onClose: () => void }) {
  const { state } = useGame();
  const dino = DINOSAURS[dinoId];
  const level = state.dinos[dinoId]?.level ?? 1;
  const evo = evolutionOf(level);
  return (
    <Modal onClose={onClose}>
      <div className="details">
        <DinoSprite dinoId={dinoId} evolution={evo} className="details__dino bob" />
        <h2 className="dino-name">
          {dino.name}
          <button type="button" className="speak-btn" aria-label="Ouvir o nome" onClick={() => speak(dino.name)}>🔊</button>
        </h2>
        <div className={`rarity rarity--${dino.rarity}`}>{RARITY_LABEL[dino.rarity]}</div>
        <div className="facts">
          <div className="fact">
            <span className="fact__icon" aria-hidden>⭐</span>
            <span>Nv {level}</span>
          </div>
          <div className="fact">
            <span className="fact__icon" aria-hidden>⚔️</span>
            <span>{formatNumber(dinoDps(dinoId, level))}/s</span>
          </div>
          <div className="fact" title={SIZE_LABEL[dino.size]}>
            <span className="fact__icon" aria-hidden>📏</span>
            <span>{dino.lengthMeters} m</span>
          </div>
          <div className="fact">
            <span className="fact__icon" aria-hidden>{DIET_ICON[dino.diet]}</span>
            <span>{DIET_LABEL[dino.diet]}</span>
          </div>
        </div>

        <div className="evo-line" aria-label="Linha evolutiva">
          {EVOLUTIONS.map((stage, i) => {
            const reached = i <= evo;
            return (
              <div key={stage.name} className={`evo-line__step ${reached ? 'evo-line__step--on' : ''} ${i === evo ? 'evo-line__step--current' : ''}`}>
                <DinoSprite dinoId={dinoId} evolution={i} mode={reached ? 'color' : 'silhouette'} />
                <span className="evo-line__name">{stage.name}</span>
                <span className="evo-line__lvl">Nv {Math.max(1, i * CONFIG.evolutionEvery)}</span>
              </div>
            );
          })}
        </div>

        <button type="button" className="curiosity" onClick={() => speak(dino.curiosity)}>
          💡 {dino.curiosity} <span aria-hidden>🔊</span>
        </button>
      </div>
    </Modal>
  );
}
