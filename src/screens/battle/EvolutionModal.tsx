import { DinoSprite } from '../../components/DinoSprite';
import { BigButton, Confetti, Modal } from '../../components/ui';
import { CONFIG } from '../../data/config';
import { DINOSAURS } from '../../data/dinosaurs';
import { EVOLUTIONS } from '../../data/evolution';
import type { DinoId } from '../../types';

export function EvolutionModal({ dinoId, stage, onClose }: { dinoId: DinoId; stage: number; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="evolve">
        <div className="rays" aria-hidden />
        <Confetti />
        <div className="evolve__title">EVOLUIU!</div>
        <div className="evolve__row">
          <DinoSprite dinoId={dinoId} evolution={stage - 1} className="evolve__before" />
          <span className="evolve__arrow" aria-hidden>➜</span>
          <DinoSprite dinoId={dinoId} evolution={stage} className="evolve__after pop-in" />
        </div>
        <h2>
          {DINOSAURS[dinoId].name} <span className="evo-name">{EVOLUTIONS[stage].name}</span>
        </h2>
        <div className="reward-line">⚔️ Dano ×{CONFIG.evolutionDamageMultiplier}</div>
        <BigButton icon="⚔️" label="Continuar" color="orange" onClick={onClose} />
      </div>
    </Modal>
  );
}
