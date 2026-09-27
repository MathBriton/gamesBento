import { liberarAudio } from '../audio/som';
import { SpriteDino } from '../componentes/SpriteDino';
import type { Navegar } from './navegacao';

export function TelaAbertura({ navegar }: { navegar: Navegar }) {
  const comecar = () => {
    // O áudio só pode ser liberado a partir de um gesto do jogador.
    liberarAudio();
    navegar('batalha');
  };
  return (
    <button type="button" className="tela abertura" onClick={comecar} aria-label="Começar">
      <h1 className="logo">
        <span>Ilha dos</span>
        <span className="logo__grande">Dinossauros</span>
      </h1>
      <div className="abertura__dinos">
        <SpriteDino id="triceratops" className="abertura__dino balancar" tamanho={220} />
        <SpriteDino id="tiranossauro" className="abertura__dino balancar balancar--lento" tamanho={220} espelhar />
      </div>
      <span className="abertura__jogar" aria-hidden>▶</span>
    </button>
  );
}
