import { CONFIG } from '../../dados/config';
import { ZONAS } from '../../dados/zonas';
import type { Zona } from '../../tipos';

export function indiceDaZona(fase: number): number {
  return Math.floor((fase - 1) / CONFIG.fasesPorZona);
}

/** Zona temática da fase (em ciclo pelas zonas). */
export function zonaDaFase(fase: number): Zona {
  return ZONAS[indiceDaZona(fase) % ZONAS.length];
}
