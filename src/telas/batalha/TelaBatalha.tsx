import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { tocarEfeito } from '../../audio/som';
import { SpriteDino } from '../../componentes/SpriteDino';
import { SpriteInimigo } from '../../componentes/SpriteInimigo';
import { BarraProgresso, BotaoGrande, Modal } from '../../componentes/ui';
import { CONFIG } from '../../dados/config';
import { IDS_DINOSSAUROS } from '../../dados/dinossauros';
import { INIMIGOS } from '../../dados/inimigos';
import { aplicarDano, avancarTempo, enfrentarChefao, podeEnfrentarChefao, type EventoBatalha } from '../../jogo/batalha/batalha';
import { danoDoTime, danoToque, nivelArmaduraDe } from '../../jogo/batalha/formulas';
import type { QuantidadeCompra } from '../../jogo/batalha/melhorias';
import { useJogo } from '../../ganchos/useJogo';
import type { IdDinossauro } from '../../tipos';
import { aleatorioPadrao } from '../../utilitarios/aleatorio';
import { formatarDuracao, formatarNumero } from '../../utilitarios/formatar';
import type { Navegar } from '../navegacao';
import { ModalArmadura } from './ModalArmadura';
import { PainelTime } from './PainelTime';
import { zonaDaFase } from './zona';

const INTERVALO_MS = 100;
const MAXIMO_FLUTUANTES = 14;

interface TextoFlutuante {
  id: number;
  x: number;
  y: number;
  texto: string;
  tipo: 'acerto' | 'critico' | 'ouro';
}

export function TelaBatalha({ navegar }: { navegar: Navegar }) {
  const { estado, executar, atualizar, mostrarAviso, offline, fecharOffline } = useJogo();
  const [quantidade, setQuantidade] = useState<QuantidadeCompra>(1);
  const [flutuantes, setFlutuantes] = useState<TextoFlutuante[]>([]);
  const [novaArmadura, setNovaArmadura] = useState<{ id: IdDinossauro; armadura: number } | null>(null);
  const [agora, setAgora] = useState(() => Date.now());
  const refInimigo = useRef<HTMLDivElement>(null);
  const proximoId = useRef(1);

  const b = estado.batalha;
  const zona = zonaDaFase(b.fase);
  const inimigo = INIMIGOS[b.tipoInimigo];
  const time = IDS_DINOSSAUROS.filter((id) => estado.dinossauros[id]);

  const adicionarFlutuante = (f: Omit<TextoFlutuante, 'id'>) => {
    const id = proximoId.current++;
    setFlutuantes((lista) => [...lista.slice(-(MAXIMO_FLUTUANTES - 1)), { ...f, id }]);
    window.setTimeout(() => setFlutuantes((lista) => lista.filter((x) => x.id !== id)), 900);
  };

  const tratarEventos = (eventos: EventoBatalha[], doToque: boolean) => {
    for (const ev of eventos) {
      if (ev.tipo === 'abate') {
        if (doToque || ev.chefao) tocarEfeito('moeda');
        adicionarFlutuante({ x: 50 + (Math.random() * 20 - 10), y: 30, texto: `+${formatarNumero(ev.ouro)} 💰`, tipo: 'ouro' });
      } else if (ev.tipo === 'chefaoFalhou') {
        tocarEfeito('falha');
        mostrarAviso('⏱️ Tempo esgotado!');
      }
    }
  };
  // O loop usa sempre a versão mais recente do tratador de eventos.
  const refTratarEventos = useRef(tratarEventos);
  refTratarEventos.current = tratarEventos;

  // Loop de batalha: dano automático do time com o tempo real decorrido.
  useEffect(() => {
    let ultimo = performance.now();
    const id = window.setInterval(() => {
      const t = performance.now();
      const segundos = Math.min((t - ultimo) / 1000, 1);
      ultimo = t;
      // Aba escondida: pausa; o tempo fora é pago pelo cálculo offline ao voltar.
      if (document.hidden) return;
      const r = executar((e) => avancarTempo(e, segundos, Date.now(), aleatorioPadrao));
      if (r.eventos.length) refTratarEventos.current(r.eventos, false);
      setAgora(Date.now());
    }, INTERVALO_MS);
    return () => window.clearInterval(id);
  }, [executar]);

  // Som de chefão ao entrar na fase dele.
  useEffect(() => {
    if (b.ehChefao) tocarEfeito('chefao');
  }, [b.ehChefao, b.fase]);

  const aoTocar = (ev: PointerEvent<HTMLDivElement>) => {
    const caixa = ev.currentTarget.getBoundingClientRect();
    const critico = aleatorioPadrao() < CONFIG.chanceCritico;
    const dano = danoToque(estado) * (critico ? CONFIG.multiplicadorCritico : 1);
    const r = executar((e) => aplicarDano(e, dano, Date.now(), aleatorioPadrao));
    tratarEventos(r.eventos, true);
    tocarEfeito(critico ? 'critico' : 'acerto');
    adicionarFlutuante({
      x: ((ev.clientX - caixa.left) / caixa.width) * 100,
      y: ((ev.clientY - caixa.top) / caixa.height) * 100,
      texto: critico ? `CRÍTICO! ${formatarNumero(dano)}` : formatarNumero(dano),
      tipo: critico ? 'critico' : 'acerto',
    });
    refInimigo.current?.animate(
      [{ transform: 'translateX(0) scale(1)' }, { transform: 'translateX(6px) scale(0.94)', filter: 'brightness(1.8)' }, { transform: 'translateX(0) scale(1)' }],
      { duration: 140 },
    );
  };

  const tempoChefao = b.fimChefaoEm !== null ? Math.max(0, b.fimChefaoEm - agora) : 0;

  return (
    <div className="tela tela-batalha" style={{ background: zona.regiao.fundo }}>
      <header className="batalha-topo">
        <span className="recurso recurso--ouro" title="Ouro">💰 {formatarNumero(estado.ouro)}</span>
        <span className="recurso" title="Dano por segundo do time">⚔️ {formatarNumero(danoDoTime(estado))}/s</span>
        <div className="batalha-topo__botoes">
          <button type="button" className="botao-icone" aria-label="Coleção" onClick={() => navegar('colecao')}>📖</button>
          <button type="button" className="botao-icone" aria-label="Ajustes" onClick={() => navegar('ajustes')}>⚙️</button>
        </div>
      </header>

      <div className="barra-fase">
        <div className="barra-fase__titulo">
          {zona.regiao.icone} Fase {b.fase}
          {b.faseMaxima > b.fase && <small> (recorde {b.faseMaxima})</small>}
        </div>
        {b.ehChefao ? (
          <div className="barra-fase__chefao">👑 CHEFÃO · ⏱️ {Math.ceil(tempoChefao / 1000)}s</div>
        ) : (
          <div className="pontos" aria-label={`${b.abates} de ${CONFIG.inimigosPorFase} inimigos`}>
            {Array.from({ length: CONFIG.inimigosPorFase }, (_, i) => (
              <span key={i} className={i < b.abates ? 'ponto ponto--ativo' : 'ponto'} />
            ))}
          </div>
        )}
      </div>

      <div className={`arena ${b.ehChefao ? 'arena--chefao' : ''}`} onPointerDown={aoTocar} role="button" aria-label="Atacar o inimigo">
        <div className="info-inimigo">
          <div className="info-inimigo__nome">{b.ehChefao ? `👑 ${inimigo.nomeChefao}` : inimigo.nome}</div>
          <div className="barra-vida" role="progressbar" aria-valuemin={0} aria-valuemax={b.vidaMaximaInimigo} aria-valuenow={Math.ceil(b.vidaInimigo)}>
            <div className="barra-vida__preenchida" style={{ width: `${(b.vidaInimigo / b.vidaMaximaInimigo) * 100}%` }} />
            <span className="barra-vida__texto">{formatarNumero(Math.ceil(b.vidaInimigo))} / {formatarNumero(b.vidaMaximaInimigo)}</span>
          </div>
          {b.ehChefao && (
            <div className="tempo-chefao">
              <BarraProgresso valor={tempoChefao / CONFIG.tempoChefaoMs} rotulo="Tempo do chefão" />
            </div>
          )}
        </div>

        <div className="inimigo" ref={refInimigo}>
          <SpriteInimigo key={`${b.fase}-${b.abates}-${b.ehChefao}`} tipo={b.tipoInimigo} cor={zona.corInimigo} chefao={b.ehChefao} className="inimigo__sprite" />
        </div>

        <div className="fila-time">
          {time.length === 0 ? (
            <div className="fila-time__vazia">👆 Toque no inimigo e compre seu primeiro dinossauro!</div>
          ) : (
            time.map((id, i) => (
              <div key={id} className="fila-time__dino" style={{ animationDelay: `${i * 0.23}s`, width: `${Math.min(28, 96 / time.length)}%` }}>
                <SpriteDino id={id} armadura={nivelArmaduraDe(estado.dinossauros[id]!.nivel)} tamanho={110} />
              </div>
            ))
          )}
        </div>

        {flutuantes.map((f) => (
          <span key={f.id} className={`flutuante flutuante--${f.tipo}`} style={{ left: `${f.x}%`, top: `${f.y}%` }}>
            {f.texto}
          </span>
        ))}

        {podeEnfrentarChefao(estado) && (
          <button
            type="button"
            className="botao-chefao pulsar"
            onPointerDown={(ev) => ev.stopPropagation()}
            onClick={() => atualizar((e) => enfrentarChefao(e, Date.now(), aleatorioPadrao))}
          >
            👑 Enfrentar chefão
          </button>
        )}
      </div>

      <section className="painel" aria-label="Time">
        <div className="painel__titulo">🦖 Time</div>
        <div className="painel__corpo">
          <PainelTime quantidade={quantidade} aoMudarQuantidade={setQuantidade} aoGanharArmadura={(id, armadura) => setNovaArmadura({ id, armadura })} />
        </div>
      </section>

      {novaArmadura && <ModalArmadura id={novaArmadura.id} armadura={novaArmadura.armadura} aoFechar={() => setNovaArmadura(null)} />}
      {offline && !novaArmadura && (
        <Modal aoFechar={fecharOffline}>
          <div className="offline">
            <div className="offline__icone">🌙</div>
            <h2>Bem-vindo de volta!</h2>
            <p>Seu time lutou por <b>{formatarDuracao(offline.tempoMs)}</b> enquanto você estava fora.</p>
            <div className="linha-premio">+{formatarNumero(offline.ouro)} 💰</div>
            <BotaoGrande icone="⚔️" rotulo="Coletar" cor="laranja" aoClicar={fecharOffline} />
          </div>
        </Modal>
      )}
    </div>
  );
}
