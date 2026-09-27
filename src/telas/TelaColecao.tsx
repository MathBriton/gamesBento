import { useState } from 'react';
import { falar, tocarEfeito } from '../audio/som';
import { SpriteDino } from '../componentes/SpriteDino';
import { BarraTopo, Modal } from '../componentes/ui';
import { ARMADURAS } from '../dados/armaduras';
import { CONFIG } from '../dados/config';
import { DINOSSAUROS, ICONE_DIETA, IDS_DINOSSAUROS, ROTULO_DIETA } from '../dados/dinossauros';
import { danoDinossauro, nivelArmaduraDe } from '../jogo/batalha/formulas';
import { useJogo } from '../ganchos/useJogo';
import type { IdDinossauro } from '../tipos';
import { formatarNumero } from '../utilitarios/formatar';
import type { Navegar } from './navegacao';
import { IconeMoeda } from '../componentes/IconeMoeda';

export function TelaColecao({ navegar }: { navegar: Navegar }) {
  const { estado } = useJogo();
  const [selecionado, setSelecionado] = useState<IdDinossauro | null>(null);
  const encontrados = IDS_DINOSSAUROS.filter((id) => estado.dinossauros[id]).length;

  return (
    <div className="tela colecao">
      <BarraTopo aoVoltar={() => navegar('batalha')} titulo={`📖 ${encontrados} / ${IDS_DINOSSAUROS.length}`} />
      <div className="album">
        {IDS_DINOSSAUROS.map((id) => {
          const dino = estado.dinossauros[id];
          const armadura = dino ? nivelArmaduraDe(dino.nivel) : 0;
          return (
            <button
              key={id}
              type="button"
              className={`cartao-album ${dino ? '' : 'cartao-album--bloqueado'}`}
              aria-label={dino ? DINOSSAUROS[id].nome : `${DINOSSAUROS[id].nome} (não comprado)`}
              onClick={() => {
                tocarEfeito(dino ? 'toque' : 'suave');
                if (dino) setSelecionado(id);
              }}
            >
              <SpriteDino id={id} armadura={armadura} modo={dino ? 'cor' : 'silhueta'} tamanho={180} />
              <span className="cartao-album__nome">{DINOSSAUROS[id].nome}</span>
              <span className="cartao-album__meta">
                {dino ? `Nv ${dino.nivel} · ${ARMADURAS[armadura].nome}` : <><IconeMoeda /> {formatarNumero(DINOSSAUROS[id].precoCompra)}</>}
              </span>
            </button>
          );
        })}
      </div>
      {selecionado && <DetalhesDino id={selecionado} aoFechar={() => setSelecionado(null)} />}
    </div>
  );
}

function DetalhesDino({ id, aoFechar }: { id: IdDinossauro; aoFechar: () => void }) {
  const { estado } = useJogo();
  const dino = DINOSSAUROS[id];
  const nivel = estado.dinossauros[id]?.nivel ?? 1;
  const armadura = nivelArmaduraDe(nivel);
  return (
    <Modal aoFechar={aoFechar}>
      <div className="detalhes">
        <SpriteDino id={id} armadura={armadura} className="detalhes__dino balancar" tamanho={300} />
        <h2 className="nome-dino">
          {dino.nome}
          <button type="button" className="botao-falar" aria-label="Ouvir o nome" onClick={() => falar(dino.nome)}>🔊</button>
        </h2>
        <div className="detalhes__especie">{dino.especie}</div>
        <div className="fatos">
          <div className="fato">
            <span className="fato__icone" aria-hidden>⭐</span>
            <span>Nv {nivel}</span>
          </div>
          <div className="fato">
            <span className="fato__icone" aria-hidden>⚔️</span>
            <span>{formatarNumero(danoDinossauro(id, nivel))}/s</span>
          </div>
          <div className="fato">
            <span className="fato__icone" aria-hidden>📏</span>
            <span>{dino.comprimentoMetros} m</span>
          </div>
          <div className="fato">
            <span className="fato__icone" aria-hidden>{ICONE_DIETA[dino.dieta]}</span>
            <span>{ROTULO_DIETA[dino.dieta]}</span>
          </div>
        </div>

        <div className="linha-armaduras" aria-label="Armaduras">
          {ARMADURAS.map((a) => {
            const conquistada = a.nivel <= armadura;
            return (
              <div
                key={a.nivel}
                className={`linha-armaduras__item ${conquistada ? 'linha-armaduras__item--conquistada' : ''} ${a.nivel === armadura ? 'linha-armaduras__item--atual' : ''}`}
              >
                <SpriteDino id={id} armadura={a.nivel} modo={conquistada ? 'cor' : 'silhueta'} tamanho={64} />
                <span className="linha-armaduras__nome">{a.nome}</span>
                <span className="linha-armaduras__nivel">Nv {Math.max(1, a.nivel * CONFIG.niveisPorArmadura)}</span>
              </div>
            );
          })}
        </div>

        <button type="button" className="curiosidade" onClick={() => falar(dino.curiosidade)}>
          💡 {dino.curiosidade} <span aria-hidden>🔊</span>
        </button>
      </div>
    </Modal>
  );
}
