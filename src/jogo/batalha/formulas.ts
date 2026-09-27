import { CONFIG } from '../../dados/config';
import { NIVEL_ARMADURA_MAXIMO } from '../../dados/armaduras';
import { DINOSSAUROS, IDS_DINOSSAUROS } from '../../dados/dinossauros';
import type { EstadoJogo, IdDinossauro } from '../../tipos';

/*
 * Fórmulas de progressão no estilo clicker:
 * a vida dos inimigos cresce exponencialmente por fase; o dano dos dinossauros cresce
 * linearmente por nível, dobra a cada 25 níveis e multiplica a cada nova armadura (100 níveis).
 */

export function ehFaseDeChefao(fase: number): boolean {
  return fase % CONFIG.chefaoACada === 0;
}

export function vidaMaximaInimigo(fase: number, chefao: boolean): number {
  const base = Math.ceil(CONFIG.vidaInimigoBase * CONFIG.crescimentoVidaInimigo ** (fase - 1));
  return base * (chefao ? CONFIG.multiplicadorVidaChefao : 1);
}

export function moedasPorInimigo(fase: number, chefao: boolean): number {
  const base = vidaMaximaInimigo(fase, false) / CONFIG.divisorMoedas;
  return Math.max(1, Math.ceil(base * (chefao ? CONFIG.multiplicadorMoedasChefao : 1)));
}

/** Nível da armadura (0 = sem armadura … 10 = Nv 1000). */
export function nivelArmaduraDe(nivel: number): number {
  return Math.min(NIVEL_ARMADURA_MAXIMO, Math.floor(nivel / CONFIG.niveisPorArmadura));
}

/** Quantos "marcos" (dano x2) o nível tem; marcos que coincidem com armadura não contam. */
function marcosDe(nivel: number): number {
  return Math.floor(nivel / CONFIG.marcoACada) - nivelArmaduraDe(nivel);
}

export function danoDinossauro(id: IdDinossauro, nivel: number): number {
  if (nivel <= 0) return 0;
  return DINOSSAUROS[id].danoBase * nivel * 2 ** marcosDe(nivel) * CONFIG.multiplicadorDanoArmadura ** nivelArmaduraDe(nivel);
}

export function danoDoTime(estado: EstadoJogo): number {
  return IDS_DINOSSAUROS.reduce((soma, id) => soma + danoDinossauro(id, estado.dinossauros[id]?.nivel ?? 0), 0);
}

export function danoGarra(nivelGarra: number): number {
  return CONFIG.danoBaseGarra * nivelGarra * 2 ** Math.floor(nivelGarra / CONFIG.marcoACada);
}

export function danoToque(estado: EstadoJogo): number {
  return danoGarra(estado.nivelGarra) + danoDoTime(estado) * CONFIG.parcelaDoTimeNoToque;
}

/** Custo para subir `n` níveis a partir de `nivel` (do nível 1 para o 2 custa `base`). */
export function custoNiveis(base: number, nivel: number, n: number): number {
  const g = CONFIG.crescimentoCustoNivel;
  return Math.ceil((base * g ** (nivel - 1) * (g ** n - 1)) / (g - 1));
}

/** Máximo de níveis que dá para comprar com as moedas disponíveis. */
export function maximoCompravel(base: number, nivel: number, moedas: number): number {
  const g = CONFIG.crescimentoCustoNivel;
  const primeiro = base * g ** (nivel - 1);
  if (moedas < primeiro) return 0;
  let n = Math.floor(Math.log((moedas * (g - 1)) / primeiro + 1) / Math.log(g));
  // Corrige arredondamentos de ponto flutuante.
  while (n > 0 && custoNiveis(base, nivel, n) > moedas) n--;
  return n;
}
