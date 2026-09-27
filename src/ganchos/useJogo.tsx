import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { apagarJogo, carregarJogo, salvarJogo } from '../armazenamento/salvamento';
import { aplicarAjustesDeAudio } from '../audio/som';
import { aplicarOffline } from '../jogo/batalha/offline';
import type { EstadoJogo } from '../tipos';

/*
 * Estado do jogo fora do React: o loop de batalha (10x por segundo) e os toques
 * leem sempre o estado mais recente de forma síncrona, sem perder atualizações.
 * O React só se inscreve para renderizar. O salvamento é limitado (a cada 2 s)
 * e forçado ao esconder/fechar a página.
 */

const INTERVALO_SALVAMENTO_MS = 2000;

interface Loja {
  ler: () => EstadoJogo;
  gravar: (novo: EstadoJogo) => void;
  inscrever: (ouvinte: () => void) => () => void;
  salvarAgora: () => void;
}

function criarLoja(inicial: EstadoJogo): Loja {
  let estado = inicial;
  const ouvintes = new Set<() => void>();
  let relogio: number | null = null;

  const salvarAgora = () => {
    if (relogio !== null) {
      window.clearTimeout(relogio);
      relogio = null;
    }
    salvarJogo({ ...estado, vistoPorUltimo: Date.now() });
  };

  return {
    ler: () => estado,
    gravar: (novo) => {
      if (novo === estado) return;
      estado = novo;
      ouvintes.forEach((o) => o());
      if (relogio === null) relogio = window.setTimeout(salvarAgora, INTERVALO_SALVAMENTO_MS);
    },
    inscrever: (ouvinte) => {
      ouvintes.add(ouvinte);
      return () => ouvintes.delete(ouvinte);
    },
    salvarAgora,
  };
}

export interface Aviso {
  id: number;
  texto: string;
}

export interface RelatorioOffline {
  ouro: number;
  tempoMs: number;
}

interface ValorJogo {
  estado: EstadoJogo;
  /** Aplica uma transição pura de estado. */
  atualizar: (transicao: (e: EstadoJogo) => EstadoJogo) => void;
  /** Aplica uma transição que também devolve dados (eventos, resultado) e retorna esses dados. */
  executar: <R extends { estado: EstadoJogo }>(transicao: (e: EstadoJogo) => R) => R;
  avisos: Aviso[];
  mostrarAviso: (texto: string) => void;
  apagarProgresso: () => void;
  offline: RelatorioOffline | null;
  fecharOffline: () => void;
}

const ContextoJogo = createContext<ValorJogo | null>(null);

function carregarComOffline(): { estado: EstadoJogo; relatorio: RelatorioOffline | null } {
  const agora = Date.now();
  const r = aplicarOffline(carregarJogo(agora), agora);
  return { estado: r.estado, relatorio: r.ouro > 0 ? { ouro: r.ouro, tempoMs: r.tempoMs } : null };
}

export function ProvedorJogo({ children }: { children: ReactNode }) {
  const [inicio] = useState(carregarComOffline);
  const [loja, setLoja] = useState(() => criarLoja(inicio.estado));
  const [offline, setOffline] = useState<RelatorioOffline | null>(inicio.relatorio);
  const estado = useSyncExternalStore(loja.inscrever, loja.ler);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const proximoId = useRef(1);

  useEffect(() => aplicarAjustesDeAudio(estado.ajustes), [estado.ajustes]);

  // Aba escondida por muito tempo conta como "offline"; ao esconder, salva na hora.
  useEffect(() => {
    let escondidaEm: number | null = null;
    const aoMudarVisibilidade = () => {
      if (document.hidden) {
        escondidaEm = Date.now();
        loja.salvarAgora();
      } else if (escondidaEm !== null) {
        const r = aplicarOffline({ ...loja.ler(), vistoPorUltimo: escondidaEm }, Date.now());
        loja.gravar(r.estado);
        if (r.ouro > 0) setOffline({ ouro: r.ouro, tempoMs: r.tempoMs });
        escondidaEm = null;
      }
    };
    document.addEventListener('visibilitychange', aoMudarVisibilidade);
    window.addEventListener('pagehide', loja.salvarAgora);
    return () => {
      document.removeEventListener('visibilitychange', aoMudarVisibilidade);
      window.removeEventListener('pagehide', loja.salvarAgora);
    };
  }, [loja]);

  const atualizar = useCallback((transicao: (e: EstadoJogo) => EstadoJogo) => loja.gravar(transicao(loja.ler())), [loja]);

  const executar = useCallback(<R extends { estado: EstadoJogo }>(transicao: (e: EstadoJogo) => R): R => {
    const r = transicao(loja.ler());
    loja.gravar(r.estado);
    return r;
  }, [loja]);

  const mostrarAviso = useCallback((texto: string) => {
    const id = proximoId.current++;
    setAvisos((lista) => [...lista.slice(-3), { id, texto }]);
    window.setTimeout(() => setAvisos((lista) => lista.filter((a) => a.id !== id)), 1600);
  }, []);

  const apagarProgresso = useCallback(() => {
    apagarJogo();
    const nova = criarLoja(carregarJogo(Date.now()));
    nova.salvarAgora();
    setLoja(nova);
    setOffline(null);
  }, []);

  const valor = useMemo(
    () => ({ estado, atualizar, executar, avisos, mostrarAviso, apagarProgresso, offline, fecharOffline: () => setOffline(null) }),
    [estado, atualizar, executar, avisos, mostrarAviso, apagarProgresso, offline],
  );
  return <ContextoJogo.Provider value={valor}>{children}</ContextoJogo.Provider>;
}

export function useJogo(): ValorJogo {
  const ctx = useContext(ContextoJogo);
  if (!ctx) throw new Error('useJogo precisa estar dentro de <ProvedorJogo>');
  return ctx;
}
