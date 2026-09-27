import { falar, tocarEfeito } from '../audio/som';
import { BarraTopo, BotaoGrande } from '../componentes/ui';
import { useJogo } from '../ganchos/useJogo';
import type { Ajustes } from '../tipos';
import type { Navegar } from './navegacao';

const INTERRUPTORES: { chave: 'musica' | 'efeitos' | 'narracao'; icone: string; rotulo: string }[] = [
  { chave: 'musica', icone: '🎵', rotulo: 'Música' },
  { chave: 'efeitos', icone: '🔔', rotulo: 'Sons' },
  { chave: 'narracao', icone: '🗣️', rotulo: 'Narração (botões 🔊)' },
];

export function TelaAjustes({ navegar }: { navegar: Navegar }) {
  const { estado, atualizar, apagarProgresso } = useJogo();
  const a = estado.ajustes;
  const alterar = (mudanca: Partial<Ajustes>) => atualizar((e) => ({ ...e, ajustes: { ...e.ajustes, ...mudanca } }));

  const confirmarApagar = () => {
    // Ação destrutiva: confirmação por texto, pensada para o adulto.
    if (window.confirm('Apagar todo o progresso do jogo? Esta ação não pode ser desfeita.')) {
      apagarProgresso();
      navegar('abertura');
    }
  };

  return (
    <div className="tela ajustes">
      <BarraTopo aoVoltar={() => navegar('batalha')} titulo="⚙️ Ajustes" />
      <div className="ajustes__lista">
        {INTERRUPTORES.map((i) => (
          <button
            key={i.chave}
            type="button"
            role="switch"
            aria-checked={a[i.chave]}
            aria-label={i.rotulo}
            className={`interruptor ${a[i.chave] ? 'interruptor--ligado' : ''}`}
            onClick={() => {
              alterar({ [i.chave]: !a[i.chave] });
              tocarEfeito('toque');
            }}
          >
            <span className="interruptor__icone" aria-hidden>{i.icone}</span>
            <span className="interruptor__rotulo">{i.rotulo}</span>
            <span className="interruptor__estado" aria-hidden>{a[i.chave] ? '✅' : '⛔'}</span>
          </button>
        ))}
        <label className="volume">
          <span aria-hidden>🔈</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={a.volume}
            aria-label="Volume"
            onChange={(ev) => alterar({ volume: Number(ev.target.value) })}
            onPointerUp={() => tocarEfeito('moeda')}
          />
          <span aria-hidden>🔊</span>
        </label>
        <button type="button" className="interruptor" onClick={() => falar('Olá! Este é o teste da narração.')}>
          <span className="interruptor__icone" aria-hidden>🔊</span>
          <span className="interruptor__rotulo">Testar narração</span>
        </button>
      </div>
      <div className="ajustes__perigo">
        <BotaoGrande icone="🗑️" rotulo="Apagar progresso" cor="cinza" tamanho="medio" aoClicar={confirmarApagar} />
      </div>
    </div>
  );
}
