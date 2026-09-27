import { Egg } from '../../components/Egg';
import { BigButton } from '../../components/ui';
import { CONFIG } from '../../data/config';
import { useGame } from '../../hooks/useGame';

export function EggsPanel({ onHatch }: { onHatch: () => void }) {
  const { state } = useGame();
  const b = state.battle;
  // Próximo chefão ainda não vencido: ele dá um ovo na primeira vitória.
  const nextEggBoss = (Math.floor(b.bossRecord / CONFIG.bossEvery) + 1) * CONFIG.bossEvery;
  return (
    <div className="eggs-panel">
      <Egg className={`eggs-panel__egg ${state.eggs > 0 ? 'wobble' : 'faded'}`} />
      <div className="eggs-panel__info">
        <div className="eggs-panel__count">🥚 × {state.eggs}</div>
        <BigButton icon="🐣" label="Chocar" color="orange" disabled={state.eggs === 0} pulse={state.eggs > 0} onClick={onHatch} />
        <p className="eggs-panel__hint">
          👑 Vença o chefão da <b>fase {nextEggBoss}</b> para ganhar um ovo.
          <br />
          Repetido = <b>+{CONFIG.duplicateLevels} níveis</b> grátis.
        </p>
      </div>
    </div>
  );
}
