import type { DinoId, Dinosaur } from '../types';

export const DINOSAURS: Record<DinoId, Dinosaur> = {
  triceratops: {
    id: 'triceratops',
    name: 'Tricerátops',
    species: 'Triceratops horridus',
    rarity: 'common',
    habitat: 'plains',
    diet: 'herbivore',
    size: 'large',
    lengthMeters: 9,
    color: '#6fd35a',
    accent: '#ffd23f',
    curiosity: 'Tinha 3 chifres na cabeça!',
    baseDps: 2,
    baseCost: 10,
  },
  apatosaurus: {
    id: 'apatosaurus',
    name: 'Apatossauro',
    species: 'Apatosaurus ajax',
    rarity: 'uncommon',
    habitat: 'plains',
    diet: 'herbivore',
    size: 'huge',
    lengthMeters: 22,
    color: '#4fa8f7',
    accent: '#d3ecff',
    curiosity: 'Tinha um pescoço muuuito comprido!',
    baseDps: 9,
    baseCost: 60,
  },
  trex: {
    id: 'trex',
    name: 'Tiranossauro Rex',
    species: 'Tyrannosaurus rex',
    rarity: 'rare',
    habitat: 'plains',
    diet: 'carnivore',
    size: 'large',
    lengthMeters: 12,
    color: '#ff7a45',
    accent: '#ffe2b8',
    curiosity: 'Tinha bracinhos bem pequenos!',
    baseDps: 40,
    baseCost: 400,
  },
};

export const DINO_IDS = Object.keys(DINOSAURS) as DinoId[];

export const RARITY_LABEL = {
  common: 'Comum',
  uncommon: 'Incomum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
} as const;

/** Peso de sorteio no ovo por raridade. */
export const RARITY_WEIGHT = {
  common: 50,
  uncommon: 35,
  rare: 15,
  epic: 6,
  legendary: 2,
} as const;

export const SIZE_LABEL = {
  small: 'Pequeno',
  medium: 'Médio',
  large: 'Grande',
  huge: 'Gigante',
} as const;

export const DIET_LABEL = {
  herbivore: 'Plantas',
  carnivore: 'Carne',
} as const;

export const DIET_ICON = {
  herbivore: '🌿',
  carnivore: '🍖',
} as const;
