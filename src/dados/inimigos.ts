import type { TipoInimigo } from '../tipos';

export interface DefinicaoInimigo {
  tipo: TipoInimigo;
  nome: string;
  nomeChefao: string;
  mitologia: 'grega' | 'nórdica' | 'clássicos de terror';
}

/** Monstros em versão infantil: travessos e engraçados, nunca assustadores. */
export const INIMIGOS: Record<TipoInimigo, DefinicaoInimigo> = {
  lobisomem: { tipo: 'lobisomem', nome: 'Lobisomem', nomeChefao: 'Lobisomem Uivante', mitologia: 'clássicos de terror' },
  vampiro: { tipo: 'vampiro', nome: 'Vampiro', nomeChefao: 'Conde Vampiro', mitologia: 'clássicos de terror' },
  troll: { tipo: 'troll', nome: 'Troll', nomeChefao: 'Troll da Montanha', mitologia: 'nórdica' },
  fenrir: { tipo: 'fenrir', nome: 'Lobo do Gelo', nomeChefao: 'Fenrir', mitologia: 'nórdica' },
  serpente: { tipo: 'serpente', nome: 'Serpente do Mar', nomeChefao: 'Jörmungandr', mitologia: 'nórdica' },
  ciclope: { tipo: 'ciclope', nome: 'Ciclope', nomeChefao: 'Ciclope Gigante', mitologia: 'grega' },
  minotauro: { tipo: 'minotauro', nome: 'Minotauro', nomeChefao: 'Rei Minotauro', mitologia: 'grega' },
  medusa: { tipo: 'medusa', nome: 'Medusa', nomeChefao: 'Rainha Medusa', mitologia: 'grega' },
  cerbero: { tipo: 'cerbero', nome: 'Cérbero', nomeChefao: 'Cérbero Guardião', mitologia: 'grega' },
};

export const TIPOS_INIMIGO = Object.keys(INIMIGOS) as TipoInimigo[];
