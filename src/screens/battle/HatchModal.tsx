import { useState } from 'react';
import { playSfx, speak } from '../../audio/audio';
import { DinoSprite } from '../../components/DinoSprite';
import { Egg } from '../../components/Egg';
import { BigButton, Confetti, Modal } from '../../components/ui';
import { CONFIG } from '../../data/config';
import { DINOSAURS, RARITY_LABEL } from '../../data/dinosaurs';
import { EVOLUTIONS } from '../../data/evolution';
import { evolutionOf } from '../../game/battle/formulas';
import { hatchEgg, type HatchResult } from '../../game/eggs/eggs';
import { useGame } from '../../hooks/useGame';
import { defaultRng } from '../../utils/random';

type Revealed = Omit<HatchResult, 'state'> & { level: number };

export function HatchModal({ onDone }: { onDone: (evolved: { dinoId: HatchResult['dinoId']; stage: number } | null) => void }) {
  const { run } = useGame();
  const [taps, setTaps] = useState(0);
  const [result, setResult] = useState<Revealed | null>(null);
  const [shake, setShake] = useState(0);

  const tapEgg = () => {
    if (result) return;
    const nextTaps = taps + 1;
    setShake((s) => s + 1);
    if (nextTaps < CONFIG.eggTapsToHatch) {
      playSfx('crack');
      setTaps(nextTaps);
      return;
    }
    const r = run((s) => hatchEgg(s, defaultRng, Date.now()) ?? { state: s, missing: true as const });
    if ('missing' in r) return onDone(null);
    setTaps(nextTaps);
    setResult({ dinoId: r.dinoId, isNew: r.isNew, bonusLevels: r.bonusLevels, evolvedTo: r.evolvedTo, level: r.state.dinos[r.dinoId]?.level ?? 1 });
    playSfx(r.isNew ? 'fanfare' : 'hatch');
    speak(DINOSAURS[r.dinoId].name);
  };

  const finish = () => onDone(result && result.evolvedTo !== null ? { dinoId: result.dinoId, stage: result.evolvedTo } : null);

  if (!result) {
    return (
      <Modal onClose={taps === 0 ? () => onDone(null) : undefined}>
        <div className="hatch">
          <button type="button" className="hatch__egg-btn" onClick={tapEgg} aria-label="Tocar no ovo">
            <Egg key={shake} cracks={taps} className={`hatch__egg ${shake ? 'shake' : 'wobble'}`} />
          </button>
          <div className="hatch__hint" aria-hidden>
            {Array.from({ length: CONFIG.eggTapsToHatch }, (_, i) => (
              <span key={i} className={i < taps ? 'dot dot--on' : 'dot'}>👆</span>
            ))}
          </div>
        </div>
      </Modal>
    );
  }

  const dino = DINOSAURS[result.dinoId];
  const evo = evolutionOf(result.level);
  return (
    <Modal>
      <div className={`hatch hatch--reveal ${result.isNew ? 'hatch--new' : ''}`}>
        {result.isNew && <div className="rays" aria-hidden />}
        {result.isNew && <Confetti />}
        <div className="new-tag">{result.isNew ? '✨ NOVO ✨' : 'REPETIDO'}</div>
        <DinoSprite dinoId={result.dinoId} evolution={evo} className="hatch__dino pop-in" />
        <h2 className="dino-name">
          {dino.name}
          <button type="button" className="speak-btn" aria-label="Ouvir o nome" onClick={() => speak(dino.name)}>🔊</button>
        </h2>
        <div className={`rarity rarity--${dino.rarity}`}>{RARITY_LABEL[dino.rarity]}</div>
        {!result.isNew && (
          <div className="reward-line">
            +{result.bonusLevels} níveis → Nv {result.level}
          </div>
        )}
        {result.evolvedTo !== null && <div className="reward-line">⚡ Evoluiu para {EVOLUTIONS[result.evolvedTo].name}!</div>}
        <BigButton icon="⚔️" label={result.isNew ? 'Para o time!' : 'Continuar'} color="green" onClick={finish} />
      </div>
    </Modal>
  );
}
