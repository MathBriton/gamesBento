import { ARMADURAS } from '../dados/armaduras';
import { DINOSSAUROS, IDS_DINOSSAUROS } from '../dados/dinossauros';
import { SpriteDino } from '../componentes/SpriteDino';
import { CenarioZona } from '../componentes/cenarios/CenarioZona';
import { SpriteInimigo } from '../componentes/SpriteInimigo';
import { INIMIGOS, TIPOS_INIMIGO } from '../dados/inimigos';
import { ZONAS } from '../dados/zonas';

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

      <h1>Cenários das zonas (com o chefão)</h1>
      <p>Desenhos: src/componentes/cenarios/CenarioZona.tsx · zonas: src/dados/zonas.ts</p>
      <div className="galeria__cenarios">
        {ZONAS.map((z) => (
          <div key={z.id} className="galeria__cenario">
            <CenarioZona zona={z.id} className="cenario" />
            <SpriteInimigo tipo={z.chefao} chefao className="galeria__cenario-monstro" />
            <span className="galeria__cenario-nome">{z.icone} {z.nome}</span>
          </div>
        ))}
      </div>

      <h1>Monstros (comum e chefão) por zona</h1>
      <p>Dados: src/dados/inimigos.ts e src/dados/zonas.ts · desenhos: src/componentes/inimigos/monstros.tsx</p>
      <div className="galeria__monstros">
        {TIPOS_INIMIGO.map((tipo) => (
          <div key={tipo} className="galeria__monstro">
            <SpriteInimigo tipo={tipo} className="galeria__sprite" />
            <SpriteInimigo tipo={tipo} chefao className="galeria__sprite" />
            <span>
              {INIMIGOS[tipo].nome} / {INIMIGOS[tipo].nomeChefao}
              <br />
              <small>{ZONAS.filter((z) => z.inimigos.includes(tipo) || z.chefao === tipo).map((z) => z.icone).join(' ')}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
