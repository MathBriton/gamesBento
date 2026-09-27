/** Parâmetros de balanceamento. Ajustar aqui, não nos componentes. */
export const CONFIG = {
  initialGold: 0,
  initialEggs: 1,
  eggTapsToHatch: 3,
  /** Níveis grátis ao tirar um dinossauro repetido. */
  duplicateLevels: 10,

  /* Inimigos */
  enemiesPerStage: 10,
  /** A cada N fases a fase é de chefão. */
  bossEvery: 5,
  bossHpMultiplier: 10,
  bossGoldMultiplier: 5,
  bossTimeMs: 30_000,
  baseEnemyHp: 5,
  enemyHpGrowth: 1.4,
  /** Ouro por inimigo = HP máximo / goldDivisor. */
  goldDivisor: 5,

  /* Dinossauros */
  levelCostGrowth: 1.07,
  /** Dano x2 a cada N níveis. */
  milestoneEvery: 25,
  /** Evolui a cada N níveis. */
  evolutionEvery: 100,
  evolutionDamageMultiplier: 10,

  /* Toque (Garra) */
  clawBaseCost: 5,
  clawBaseDamage: 1,
  /** Parte do DPS do time somada ao toque. */
  tapDpsShare: 0.04,
  critChance: 0.08,
  critMultiplier: 5,

  /* Offline */
  offlineMinMs: 60_000,
  offlineMaxMs: 12 * 60 * 60_000,
  /** Inimigos derrotados por segundo no máximo (limita o ganho offline). */
  maxKillsPerSecond: 3,
} as const;
