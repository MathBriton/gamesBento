import { tocarEfeito } from '../../audio/som';
import { SpriteDino } from '../../componentes/SpriteDino';
import { BarraProgresso } from '../../componentes/ui';
import { ARMADURAS, NIVEL_ARMADURA_MAXIMO } from '../../dados/armaduras';
import { CONFIG } from '../../dados/config';
import { DINOSSAUROS, IDS_DINOSSAUROS } from '../../dados/dinossauros';
import { danoDinossauro, danoGarra, danoToque, nivelArmaduraDe } from '../../jogo/batalha/formulas';
import {
  comprarDinossauro,
  comprarNiveisDinossauro,
  comprarNiveisGarra,
  cotarDinossauro,
  cotarGarra,
  podeComprarDinossauro,
  type Cotacao,
  type QuantidadeCompra,
} from '../../jogo/batalha/melhorias';
import { useJogo } from '../../ganchos/useJogo';
import type { IdDinossauro } from '../../tipos';
import { formatarNumero } from '../../utilitarios/formatar';

const QUANTIDADES: QuantidadeCompra[] = [1, 10, 100, 'max'];

function BotaoNiveis({ cotacao, aoComprar }: { cotacao: Cotacao; aoComprar: () => void }) {
  if (cotacao.noMaximo) {
    return (
      <span className="botao-compra botao-compra--maximo" aria-label="Nível máximo">
        <span className="botao-compra__niveis">MÁX</span>
        <span className="botao-compra__custo">Nv {CONFIG.nivelMaximo}</span>
      </span>
    );
  }
  return (
    <button
      type="button"
      className="botao-compra"
      disabled={!cotacao.podePagar}
      onClick={aoComprar}
      aria-label={`Subir ${cotacao.niveis} níveis por ${formatarNumero(cotacao.custo)} de ouro`}
    >
      <span className="botao-compra__niveis">▲ +{cotacao.niveis}</span>
      <span className="botao-compra__custo">💰 {formatarNumero(cotacao.custo)}</span>
    </button>
  );
}

export function PainelTime({
  quantidade,
  aoMudarQuantidade,
  aoGanharArmadura,
}: {
  quantidade: QuantidadeCompra;
  aoMudarQuantidade: (q: QuantidadeCompra) => void;
  aoGanharArmadura: (id: IdDinossauro, armadura: number) => void;
}) {
  const { estado, executar, atualizar, mostrarAviso } = useJogo();

  const subirNivel = (id: IdDinossauro) => {
    const r = executar((e) => comprarNiveisDinossauro(e, id, quantidade) ?? { estado: e, niveis: 0, novaArmadura: null });
    if (!r.niveis) return;
    if (r.novaArmadura !== null) {
      tocarEfeito('armadura');
      aoGanharArmadura(id, r.novaArmadura);
    } else {
      tocarEfeito('nivel');
    }
  };

  const comprar = (id: IdDinossauro) => {
    atualizar((e) => comprarDinossauro(e, id, Date.now()) ?? e);
    tocarEfeito('compra');
    mostrarAviso(`🦖 ${DINOSSAUROS[id].nome} entrou no time!`);
  };

  const subirGarra = () => {
    atualizar((e) => comprarNiveisGarra(e, quantidade) ?? e);
    tocarEfeito('nivel');
  };

  return (
    <div className="time">
      <div className="quantidades" role="radiogroup" aria-label="Quantidade de níveis por compra">
        {QUANTIDADES.map((q) => (
          <button
            key={q}
            type="button"
            role="radio"
            aria-checked={quantidade === q}
            className={`quantidade ${quantidade === q ? 'quantidade--ativa' : ''}`}
            onClick={() => aoMudarQuantidade(q)}
          >
            {q === 'max' ? 'MÁX' : `×${q}`}
          </button>
        ))}
      </div>

      <div className="linha-melhoria">
        <span className="linha-melhoria__icone" aria-hidden>🐾</span>
        <div className="linha-melhoria__info">
          <div className="linha-melhoria__nome">Garra <span className="etiqueta-nivel">Nv {estado.nivelGarra}</span></div>
          <div className="linha-melhoria__dado">
            👆 {formatarNumero(danoToque(estado))} por toque <small>(base {formatarNumero(danoGarra(estado.nivelGarra))})</small>
          </div>
        </div>
        <BotaoNiveis cotacao={cotarGarra(estado, quantidade)} aoComprar={subirGarra} />
      </div>

      {IDS_DINOSSAUROS.map((id) => {
        const especie = DINOSSAUROS[id];
        const dino = estado.dinossauros[id];

        if (!dino) {
          const pode = podeComprarDinossauro(estado, id);
          return (
            <div key={id} className={`linha-melhoria linha-melhoria--loja ${pode ? '' : 'linha-melhoria--bloqueada'}`}>
              <SpriteDino id={id} modo={pode ? 'cor' : 'silhueta'} className="linha-melhoria__sprite" tamanho={72} />
              <div className="linha-melhoria__info">
                <div className="linha-melhoria__nome">{especie.nome}</div>
                <div className="linha-melhoria__dado">⚔️ {formatarNumero(danoDinossauro(id, 1))}/s no Nv 1</div>
              </div>
              <button
                type="button"
                className="botao-compra botao-compra--comprar"
                disabled={!pode}
                onClick={() => comprar(id)}
                aria-label={`Comprar ${especie.nome} por ${formatarNumero(especie.precoCompra)} de ouro`}
              >
                <span className="botao-compra__niveis">Comprar</span>
                <span className="botao-compra__custo">💰 {formatarNumero(especie.precoCompra)}</span>
              </button>
            </div>
          );
        }

        const armadura = nivelArmaduraDe(dino.nivel);
        const proxima = (armadura + 1) * CONFIG.niveisPorArmadura;
        const material = ARMADURAS[armadura].material;
        return (
          <div key={id} className="linha-melhoria">
            <SpriteDino id={id} armadura={armadura} className="linha-melhoria__sprite" tamanho={72} />
            <div className="linha-melhoria__info">
              <div className="linha-melhoria__nome">
                {especie.nome} <span className="etiqueta-nivel">Nv {dino.nivel}</span>
              </div>
              <div className="linha-melhoria__dado">
                <span className="selo-armadura" style={material ? { background: material.cor } : undefined}>
                  🛡️ {ARMADURAS[armadura].nome}
                </span>
                ⚔️ {formatarNumero(danoDinossauro(id, dino.nivel))}/s
              </div>
              {armadura < NIVEL_ARMADURA_MAXIMO && (
                <div className="progresso-armadura" title={`Nova armadura no nível ${proxima}`}>
                  <BarraProgresso valor={(dino.nivel % CONFIG.niveisPorArmadura) / CONFIG.niveisPorArmadura} rotulo="Progresso até a próxima armadura" />
                  <span>🛡️ Nv {proxima}</span>
                </div>
              )}
            </div>
            <BotaoNiveis cotacao={cotarDinossauro(estado, id, quantidade)!} aoComprar={() => subirNivel(id)} />
          </div>
        );
      })}
    </div>
  );
}
