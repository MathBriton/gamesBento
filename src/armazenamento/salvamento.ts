import { CONFIG } from '../dados/config';
import { INIMIGOS } from '../dados/inimigos';
import { zonaDaFase } from '../jogo/batalha/zonas';
import { criarEstadoInicial, VERSAO_SAVE } from '../jogo/estado';
import type { EstadoJogo, IdDinossauro } from '../tipos';

const CHAVE = 'ilha-dos-dinossauros:save';

/**
 * Persistência local. Toda leitura/escrita passa por aqui para que a
 * troca futura por IndexedDB ou backend não afete o resto do jogo.
 */
export function carregarJogo(agora: number): EstadoJogo {
  const novo = criarEstadoInicial(agora);
  try {
    const texto = localStorage.getItem(CHAVE);
    if (!texto) return novo;
    return migrar(JSON.parse(texto) as SaveQualquer, novo);
  } catch {
    return novo;
  }
}

export function salvarJogo(estado: EstadoJogo): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // Armazenamento indisponível (modo privado, cota cheia): o jogo segue funcionando na sessão.
  }
}

export function apagarJogo(): void {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    // ignorado
  }
}

/* ---------- Migração de versões antigas ---------- */

/** Ids antigos (v1–v3, em inglês) → ids atuais. O Apatossauro virou Braquiossauro. */
const IDS_ANTIGOS: Record<string, IdDinossauro> = {
  triceratops: 'triceratops',
  trex: 'tiranossauro',
  apatosaurus: 'braquiossauro',
};

interface SaveAntigo {
  /** v4 (renomeado para `moedas` na v5) */
  ouro?: number;
  version?: number;
  gold?: number;
  clawLevel?: number;
  lastSeen?: number;
  player?: { createdAt?: number };
  settings?: { music?: boolean; sfx?: boolean; narration?: boolean; volume?: number };
  /** v1/v2 (jogo educativo) */
  collection?: Record<string, { discoveredAt?: number } | undefined>;
  /** v3 (idle com ovos) */
  dinos?: Record<string, { level?: number; discoveredAt?: number } | undefined>;
  battle?: { stage?: number; maxStage?: number };
}

type SaveQualquer = Partial<EstadoJogo> & SaveAntigo;

export function migrar(salvo: SaveQualquer, novo: EstadoJogo): EstadoJogo {
  // v1–v3 não tinham o campo `versao` (usavam `version`, em inglês).
  if (salvo.versao === undefined) return migrarDeVersaoEmIngles(salvo, novo);
  const resultado: EstadoJogo & { ouro?: number } = {
    ...novo,
    ...salvo,
    versao: VERSAO_SAVE,
    // v4 → v5: `ouro` passou a se chamar `moedas`.
    moedas: salvo.moedas ?? salvo.ouro ?? novo.moedas,
    jogador: { ...novo.jogador, ...salvo.jogador },
    ajustes: { ...novo.ajustes, ...salvo.ajustes },
    batalha: corrigirInimigo({ ...novo.batalha, ...salvo.batalha }),
    dinossauros: salvo.dinossauros ?? {},
  };
  delete resultado.ouro;
  return resultado;
}

/** Monstros de versões antigas (gosma, morcego…) não existem mais: troca pelo monstro da zona. */
function corrigirInimigo(batalha: EstadoJogo['batalha']): EstadoJogo['batalha'] {
  if (batalha.tipoInimigo in INIMIGOS) return batalha;
  const zona = zonaDaFase(batalha.fase);
  return { ...batalha, tipoInimigo: batalha.ehChefao ? zona.chefao : zona.inimigos[0] };
}

/** v1–v3: nomes em inglês. Mantém dinossauros (e níveis na v3), moedas e ajustes; ovos deixam de existir. */
function migrarDeVersaoEmIngles(salvo: SaveAntigo, novo: EstadoJogo): EstadoJogo {
  const dinossauros: EstadoJogo['dinossauros'] = {};
  const origem = salvo.dinos ?? salvo.collection ?? {};
  for (const [idAntigo, dado] of Object.entries(origem)) {
    const id = IDS_ANTIGOS[idAntigo];
    if (!id || !dado) continue;
    const nivel = 'level' in dado && typeof dado.level === 'number' ? dado.level : 1;
    dinossauros[id] = { nivel: Math.min(CONFIG.nivelMaximo, Math.max(1, nivel)), obtidoEm: dado.discoveredAt ?? novo.jogador.criadoEm };
  }
  const s = salvo.settings ?? {};
  return {
    ...novo,
    moedas: salvo.version === 3 ? salvo.gold ?? 0 : novo.moedas,
    nivelGarra: salvo.version === 3 ? salvo.clawLevel ?? 1 : novo.nivelGarra,
    dinossauros,
    ajustes: {
      musica: s.music ?? novo.ajustes.musica,
      efeitos: s.sfx ?? novo.ajustes.efeitos,
      narracao: s.narration ?? novo.ajustes.narracao,
      volume: s.volume ?? novo.ajustes.volume,
    },
  };
}
