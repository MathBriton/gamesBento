export interface EvolutionStage {
  name: string;
  /** Cor da aura (null = sem aura). */
  aura: string | null;
  /** Escala do desenho no campo de batalha. */
  scale: number;
}

/** Estágio = floor(nível / 100), limitado ao último. */
export const EVOLUTIONS: EvolutionStage[] = [
  { name: 'Filhote', aura: null, scale: 0.8 },
  { name: 'Jovem', aura: null, scale: 0.9 },
  { name: 'Adulto', aura: null, scale: 1 },
  { name: 'Alfa', aura: '#6ec8ff', scale: 1.08 },
  { name: 'Lendário', aura: '#ffc93d', scale: 1.15 },
];

export const MAX_EVOLUTION = EVOLUTIONS.length - 1;
