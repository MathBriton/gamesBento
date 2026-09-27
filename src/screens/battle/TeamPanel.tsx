import { playSfx } from '../../audio/audio';
import { DinoSprite } from '../../components/DinoSprite';
import { ProgressBar } from '../../components/ui';
import { CONFIG } from '../../data/config';
import { DINO_IDS, DINOSAURS, RARITY_LABEL } from '../../data/dinosaurs';
import { EVOLUTIONS, MAX_EVOLUTION } from '../../data/evolution';
import { clawDamage, dinoDps, evolutionOf, tapDamage } from '../../game/battle/formulas';
import { buyClawLevels, buyDinoLevels, quoteClaw, quoteDino, type BuyAmount, type PurchaseQuote } from '../../game/battle/upgrades';
import { useGame } from '../../hooks/useGame';
import type { DinoId } from '../../types';
import { formatNumber } from '../../utils/format';

const AMOUNTS: BuyAmount[] = [1, 10, 100, 'max'];

function BuyButton({ q, onBuy }: { q: PurchaseQuote; onBuy: () => void }) {
  return (
    <button type="button" className="buy-btn" disabled={!q.affordable} onClick={onBuy} aria-label={`Subir ${q.levels} níveis por ${formatNumber(q.cost)} de ouro`}>
      <span className="buy-btn__levels">▲ +{q.levels}</span>
      <span className="buy-btn__cost">💰 {formatNumber(q.cost)}</span>
    </button>
  );
}

export function TeamPanel({
  amount,
  onAmount,
  onEvolve,
}: {
  amount: BuyAmount;
  onAmount: (a: BuyAmount) => void;
  onEvolve: (dinoId: DinoId, stage: number) => void;
}) {
  const { state, run, update } = useGame();

  const buyDino = (id: DinoId) => {
    const r = run((s) => buyDinoLevels(s, id, amount) ?? { state: s, levels: 0, evolvedTo: null });
    if (!r.levels) return;
    if (r.evolvedTo !== null) {
      playSfx('evolve');
      onEvolve(id, r.evolvedTo);
    } else {
      playSfx('levelup');
    }
  };

  const buyClaw = () => {
    update((s) => buyClawLevels(s, amount) ?? s);
    playSfx('levelup');
  };

  const claw = quoteClaw(state, amount);

  return (
    <div className="team">
      <div className="amounts" role="radiogroup" aria-label="Quantidade por compra">
        {AMOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            role="radio"
            aria-checked={amount === a}
            className={`amount ${amount === a ? 'amount--on' : ''}`}
            onClick={() => onAmount(a)}
          >
            {a === 'max' ? 'MÁX' : `×${a}`}
          </button>
        ))}
      </div>

      <div className="upgrade-row">
        <span className="upgrade-row__icon upgrade-row__icon--claw" aria-hidden>🐾</span>
        <div className="upgrade-row__info">
          <div className="upgrade-row__name">Garra <span className="lvl-tag">Nv {state.clawLevel}</span></div>
          <div className="upgrade-row__stat">
            👆 {formatNumber(tapDamage(state))} por toque <small>(base {formatNumber(clawDamage(state.clawLevel))})</small>
          </div>
        </div>
        <BuyButton q={claw} onBuy={buyClaw} />
      </div>

      {DINO_IDS.map((id) => {
        const owned = state.dinos[id];
        const dino = DINOSAURS[id];
        if (!owned) {
          return (
            <div key={id} className="upgrade-row upgrade-row--locked">
              <DinoSprite dinoId={id} mode="silhouette" className="upgrade-row__sprite" />
              <div className="upgrade-row__info">
                <div className="upgrade-row__name">???</div>
                <div className="upgrade-row__stat">🥚 Encontre em um ovo · {RARITY_LABEL[dino.rarity]}</div>
              </div>
            </div>
          );
        }
        const evo = evolutionOf(owned.level);
        const q = quoteDino(state, id, amount)!;
        const nextEvoLevel = (evo + 1) * CONFIG.evolutionEvery;
        return (
          <div key={id} className="upgrade-row">
            <DinoSprite dinoId={id} evolution={evo} className="upgrade-row__sprite" />
            <div className="upgrade-row__info">
              <div className="upgrade-row__name">
                {dino.name} <span className="lvl-tag">Nv {owned.level}</span>
              </div>
              <div className="upgrade-row__stat">
                <span className={`evo-badge evo-badge--${evo}`}>{EVOLUTIONS[evo].name}</span> ⚔️ {formatNumber(dinoDps(id, owned.level))}/s
              </div>
              {evo < MAX_EVOLUTION && (
                <div className="evo-progress" title={`Evolui no nível ${nextEvoLevel}`}>
                  <ProgressBar value={(owned.level % CONFIG.evolutionEvery) / CONFIG.evolutionEvery} label="Progresso até a evolução" />
                  <span>⚡ Nv {nextEvoLevel}</span>
                </div>
              )}
            </div>
            <BuyButton q={q} onBuy={() => buyDino(id)} />
          </div>
        );
      })}
    </div>
  );
}
