import { ARMADURAS } from '../dados/armaduras';
import { DINOSSAUROS, IDS_DINOSSAUROS } from '../dados/dinossauros';
import { SpriteDino } from '../componentes/SpriteDino';

/**
 * Galeria de arte (ferramenta de desenvolvimento): todas as espécies em todos os níveis de
 * armadura, mais a silhueta. Abrir com `?galeria` na URL.
 */
export function TelaGaleria() {
  return (
    <div className="galeria">
      <h1>Galeria — espécies × armaduras</h1>
      <p>Guia: src/Images/Dinossauros/GUIA_ESTETICO_DINOSSAUROS.md · armaduras: src/dados/armaduras.ts</p>
      <div className="galeria__tabela">
        <div className="galeria__linha galeria__linha--titulo">
          <span className="galeria__rotulo" />
          <span>Silhueta</span>
          {ARMADURAS.map((a) => (
            <span key={a.nivel}>
              Nv {Math.max(1, a.nivel * 100)}
              <br />
              <small>{a.nome}</small>
            </span>
          ))}
        </div>
        {IDS_DINOSSAUROS.map((id) => (
          <div key={id} className="galeria__linha">
            <span className="galeria__rotulo">{DINOSSAUROS[id].nome}</span>
            <SpriteDino id={id} modo="silhueta" className="galeria__sprite" />
            {ARMADURAS.map((a) => (
              <SpriteDino key={a.nivel} id={id} armadura={a.nivel} className="galeria__sprite" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
