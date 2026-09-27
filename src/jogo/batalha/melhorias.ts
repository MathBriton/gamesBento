import { CONFIG } from '../../dados/config';
import { DINOSSAUROS } from '../../dados/dinossauros';
import type { EstadoJogo, IdDinossauro } from '../../tipos';
import { custoNiveis, maximoCompravel, nivelArmaduraDe } from './formulas';

/* ---------- Compra de dinossauros ---------- */

export function precoDinossauro(id: IdDinossauro): number {
  return DINOSSAUROS[id].precoCompra;
}

export function podeComprarDinossauro(estado: EstadoJogo, id: IdDinossauro): boolean {
  return !estado.dinossauros[id] && estado.moedas >= precoDinossauro(id);
}

/** Compra (contrata) um dinossauro: entra no time no nível 1. */
export function comprarDinossauro(estado: EstadoJogo, id: IdDinossauro, agora: number): EstadoJogo | null {
  if (!podeComprarDinossauro(estado, id)) return null;
  return {
    ...estado,
    moedas: estado.moedas - precoDinossauro(id),
    dinossauros: { ...estado.dinossauros, [id]: { nivel: 1, obtidoEm: agora } },
  };
}

/* ---------- Subir de nível ---------- */

/** Quantidade de níveis por compra escolhida no painel. */
export type QuantidadeCompra = 1 | 10 | 100 | 'max';

export interface Cotacao {
  niveis: number;
  custo: number;
  podePagar: boolean;
  /** Já está no nível máximo (nada a comprar). */
  noMaximo: boolean;
}

/**
 * Quanto custa a compra no modo escolhido, respeitando o nível máximo.
 * No modo "max", pelo menos 1 nível é cotado (para mostrar o preço do próximo).
 */
export function cotar(base: number, nivel: number, moedas: number, quantidade: QuantidadeCompra, nivelMaximo = Infinity): Cotacao {
  const restante = nivelMaximo - nivel;
  if (restante <= 0) return { niveis: 0, custo: 0, podePagar: false, noMaximo: true };
  const pedido = quantidade === 'max' ? Math.max(1, maximoCompravel(base, nivel, moedas)) : quantidade;
  const niveis = Math.min(pedido, restante);
  const custo = custoNiveis(base, nivel, niveis);
  return { niveis, custo, podePagar: moedas >= custo, noMaximo: false };
}

export function cotarDinossauro(estado: EstadoJogo, id: IdDinossauro, quantidade: QuantidadeCompra): Cotacao | null {
  const dino = estado.dinossauros[id];
  if (!dino) return null;
  return cotar(DINOSSAUROS[id].custoBaseNivel, dino.nivel, estado.moedas, quantidade, CONFIG.nivelMaximo);
}

export function cotarGarra(estado: EstadoJogo, quantidade: QuantidadeCompra): Cotacao {
  return cotar(CONFIG.custoBaseGarra, estado.nivelGarra, estado.moedas, quantidade);
}

export interface ResultadoNiveis {
  estado: EstadoJogo;
  niveis: number;
  /** Nova armadura conquistada com a compra (null se não mudou). */
  novaArmadura: number | null;
}

/** Soma níveis a um dinossauro (limitado ao nível máximo) e informa se ganhou armadura. */
export function adicionarNiveis(estado: EstadoJogo, id: IdDinossauro, niveis: number): ResultadoNiveis {
  const dino = estado.dinossauros[id];
  if (!dino || niveis <= 0) return { estado, niveis: 0, novaArmadura: null };
  const nivel = Math.min(CONFIG.nivelMaximo, dino.nivel + niveis);
  const antes = nivelArmaduraDe(dino.nivel);
  const depois = nivelArmaduraDe(nivel);
  return {
    niveis: nivel - dino.nivel,
    novaArmadura: depois > antes ? depois : null,
    estado: { ...estado, dinossauros: { ...estado.dinossauros, [id]: { ...dino, nivel } } },
  };
}

export function comprarNiveisDinossauro(estado: EstadoJogo, id: IdDinossauro, quantidade: QuantidadeCompra): ResultadoNiveis | null {
  const c = cotarDinossauro(estado, id, quantidade);
  if (!c || !c.podePagar) return null;
  return adicionarNiveis({ ...estado, moedas: estado.moedas - c.custo }, id, c.niveis);
}

export function comprarNiveisGarra(estado: EstadoJogo, quantidade: QuantidadeCompra): EstadoJogo | null {
  const c = cotarGarra(estado, quantidade);
  if (!c.podePagar) return null;
  return { ...estado, moedas: estado.moedas - c.custo, nivelGarra: estado.nivelGarra + c.niveis };
}
