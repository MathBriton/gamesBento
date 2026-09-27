/** Gerador de números aleatórios em [0, 1). Injetável para testes. */
export type Aleatorio = () => number;

export const aleatorioPadrao: Aleatorio = Math.random;

export function inteiroAleatorio(aleatorio: Aleatorio, min: number, max: number): number {
  return min + Math.floor(aleatorio() * (max - min + 1));
}

export function sortear<T>(aleatorio: Aleatorio, itens: readonly T[]): T {
  return itens[Math.floor(aleatorio() * itens.length)];
}
