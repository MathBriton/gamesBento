import { SpriteDino } from '../../componentes/SpriteDino';
import { BotaoGrande, Confete, Modal } from '../../componentes/ui';
import { ARMADURAS } from '../../dados/armaduras';
import { CONFIG } from '../../dados/config';
import { DINOSSAUROS } from '../../dados/dinossauros';
import type { IdDinossauro } from '../../tipos';

/** Comemoração ao ganhar uma nova armadura (a cada 100 níveis). */
export function ModalArmadura({ id, armadura, aoFechar }: { id: IdDinossauro; armadura: number; aoFechar: () => void }) {
  const nivel = ARMADURAS[armadura];
  return (
    <Modal aoFechar={aoFechar}>
      <div className="nova-armadura">
        <div className="raios" aria-hidden />
        <Confete />
        <div className="nova-armadura__titulo">NOVA ARMADURA!</div>
        <div className="nova-armadura__linha">
          <SpriteDino id={id} armadura={armadura - 1} className="nova-armadura__antes" tamanho={140} />
          <span className="nova-armadura__seta" aria-hidden>➜</span>
          <SpriteDino id={id} armadura={armadura} className="nova-armadura__depois surgir" tamanho={220} />
        </div>
        <h2>
          {DINOSSAUROS[id].nome} · <span className="nova-armadura__nome">Armadura {nivel.nome}</span>
        </h2>
        <div className="linha-premio">⚔️ Dano ×{CONFIG.multiplicadorDanoArmadura}</div>
        <BotaoGrande icone="⚔️" rotulo="Continuar" cor="laranja" aoClicar={aoFechar} />
      </div>
    </Modal>
  );
}
