export type DinoId = 'triceratops' | 'trex' | 'apatosaurus';
export type RegionId = 'plains' | 'jungle' | 'coast' | 'mountains' | 'desert' | 'volcano';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type Diet = 'herbivore' | 'carnivore';
export type Size = 'small' | 'medium' | 'large' | 'huge';
export type EnemyKind = 'slime' | 'bat' | 'golem' | 'plant';

export interface Dinosaur {
  id: DinoId;
  name: string;
  species: string;
  rarity: Rarity;
  habitat: RegionId;
  diet: Diet;
  size: Size;
  /** Comprimento aproximado em metros, usado na tela de detalhes. */
  lengthMeters: number;
  color: string;
  accent: string;
  curiosity: string;
  /** Dano por segundo no nível 1. */
  baseDps: number;
  /** Custo em ouro para subir do nível 1 para o 2. */
  baseCost: number;
}

export interface Region {
  id: RegionId;
  name: string;
  icon: string;
  /** Posição na progressão (0 = primeira região). */
  order: number;
  background: string;
}

export interface Settings {
  music: boolean;
  sfx: boolean;
  narration: boolean;
  volume: number; // 0..1
}

export interface OwnedDino {
  level: number;
  /** Quantas vezes saiu do ovo (repetidos viram níveis grátis). */
  count: number;
  discoveredAt: number;
}

export interface BattleState {
  /** Fase atual (começa em 1). */
  stage: number;
  /** Maior fase já alcançada. */
  maxStage: number;
  /** Inimigos derrotados na fase atual. */
  kills: number;
  enemyKind: EnemyKind;
  enemyHp: number;
  enemyMaxHp: number;
  isBoss: boolean;
  /** Timestamp limite para derrotar o chefão; null fora de chefão. */
  bossEndsAt: number | null;
  /** Após perder para um chefão, fica repetindo a fase anterior até o jogador tentar de novo. */
  farming: boolean;
  /** Maior fase de chefão já vencida (o primeiro vencimento dá ovo). */
  bossRecord: number;
}

export interface GameState {
  version: number;
  player: { createdAt: number };
  /** Último momento em que o jogo estava aberto, para calcular o ganho offline. */
  lastSeen: number;
  gold: number;
  eggs: number;
  dinos: Partial<Record<DinoId, OwnedDino>>;
  /** Nível da Garra: define o dano do toque. */
  clawLevel: number;
  battle: BattleState;
  settings: Settings;
}
