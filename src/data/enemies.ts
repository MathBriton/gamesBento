import type { EnemyKind } from '../types';

export interface EnemyDef {
  kind: EnemyKind;
  name: string;
  bossName: string;
}

export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  slime: { kind: 'slime', name: 'Gosma', bossName: 'Rei Gosma' },
  bat: { kind: 'bat', name: 'Morcego', bossName: 'Morcegão Sombrio' },
  golem: { kind: 'golem', name: 'Golem de Pedra', bossName: 'Golem Colossal' },
  plant: { kind: 'plant', name: 'Planta Carnívora', bossName: 'Rainha das Plantas' },
};

export const ENEMY_KINDS = Object.keys(ENEMIES) as EnemyKind[];

/** Paleta de inimigos por zona (a zona muda a cada 10 fases e se repete). */
export const ZONE_ENEMY_COLORS = ['#b46cff', '#ff5f7e', '#8a7a6a', '#3fbf8f', '#ff8c1a', '#4d7cff'];
