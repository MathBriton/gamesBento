import { ZONE_ENEMY_COLORS } from '../../data/enemies';
import { REGION_ORDER, REGIONS } from '../../data/regions';
import type { Region } from '../../types';

export const STAGES_PER_ZONE = 10;

export interface Zone {
  index: number;
  region: Region;
  enemyColor: string;
}

/** Cenário e cor dos inimigos mudam a cada 10 fases, em ciclo pelas regiões. */
export function zoneFor(stage: number): Zone {
  const index = Math.floor((stage - 1) / STAGES_PER_ZONE);
  return {
    index,
    region: REGIONS[REGION_ORDER[index % REGION_ORDER.length]],
    enemyColor: ZONE_ENEMY_COLORS[index % ZONE_ENEMY_COLORS.length],
  };
}
