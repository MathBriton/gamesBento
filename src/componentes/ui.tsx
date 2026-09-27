import type { ReactNode } from 'react';
import { tocarEfeito } from '../audio/som';
import { useJogo } from '../ganchos/useJogo';
import { formatarNumero } from '../utilitarios/formatar';

type CorBotao = 'verde' | 'azul' | 'laranja' | 'rosa' | 'roxo' | 'cinza';

interface BotaoGrandeProps {
  icone: ReactNode;
  rotulo?: string;
  aoClicar: () => void;
  cor?: CorBotao;
  tamanho?: 'medio' | 'grande';
  desativado?: boolean;
  pulsar?: boolean;
  rotuloAcessivel?: string;
}

/** Botão grande de estilo cartoon, com ícone como informação principal. */
export function BotaoGrande({ icone, rotulo, aoClicar, cor = 'verde', tamanho = 'grande', desativado, pulsar, rotuloAcessivel }: BotaoGrandeProps) {
  return (
    <button
      type="button"
      className={`botao botao--${cor} botao--${tamanho}${pulsar ? ' pulsar' : ''}`}
      disabled={desativado}
      aria-label={rotuloAcessivel ?? rotulo}
      onClick={() => {
        tocarEfeito('toque');
        aoClicar();
      }}
    >
      <span className="botao__icone" aria-hidden>{icone}</span>
      {rotulo && <span className="botao__rotulo">{rotulo}</span>}
    </button>
  );
}

/** Barra superior das telas secundárias: voltar, título e ouro. */
export function BarraTopo({ aoVoltar, titulo }: { aoVoltar: () => void; titulo?: ReactNode }) {
  const { estado } = useJogo();
  return (
    <header className="barra-topo">
      <button type="button" className="botao-icone" aria-label="Voltar" onClick={aoVoltar}>
        ⬅️
      </button>
      {titulo && <div className="barra-topo__titulo">{titulo}</div>}
      <span className="recurso recurso--ouro" title="Ouro">💰 {formatarNumero(estado.ouro)}</span>
    </header>
  );
}

export function Modal({ children, aoFechar }: { children: ReactNode; aoFechar?: () => void }) {
  return (
    <div className="modal-fundo" onClick={aoFechar}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {aoFechar && (
          <button type="button" className="modal__fechar" aria-label="Fechar" onClick={aoFechar}>
            ✖
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function Avisos() {
  const { avisos } = useJogo();
  return (
    <div className="avisos" aria-live="polite">
      {avisos.map((a) => (
        <div key={a.id} className="aviso">{a.texto}</div>
      ))}
    </div>
  );
}

const CORES_CONFETE = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff'];

export function Confete({ pedacos = 30 }: { pedacos?: number }) {
  return (
    <div className="confete" aria-hidden>
      {Array.from({ length: pedacos }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            background: CORES_CONFETE[i % CORES_CONFETE.length],
            animationDelay: `${(i % 10) * 0.08}s`,
            animationDuration: `${1.4 + (i % 5) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export function BarraProgresso({ valor, rotulo }: { valor: number; rotulo?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, valor)) * 100);
  return (
    <div className="progresso" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={rotulo}>
      <div className="progresso__preenchido" style={{ width: `${pct}%` }} />
    </div>
  );
}
