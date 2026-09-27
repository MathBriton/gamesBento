import type { Zona } from '../tipos';

/**
 * Zonas temáticas, em ordem. A zona muda a cada `CONFIG.fasesPorZona` fases e, depois da
 * última, recomeça pela primeira (com inimigos mais fortes). O cenário de cada zona é
 * desenhado em componentes/cenarios/.
 */
export const ZONAS: Zona[] = [
  { id: 'floresta', nome: 'Floresta Enluarada', icone: '🌕', inimigos: ['lobisomem', 'troll'], chefao: 'lobisomem', corTela: '#2f2b5e' },
  { id: 'grecia', nome: 'Ruínas Gregas', icone: '🏛️', inimigos: ['ciclope', 'minotauro', 'medusa'], chefao: 'minotauro', corTela: '#7cc4f0' },
  { id: 'castelo', nome: 'Castelo dos Vampiros', icone: '🏰', inimigos: ['vampiro', 'lobisomem'], chefao: 'vampiro', corTela: '#4a2b5e' },
  { id: 'nordico', nome: 'Terras Nórdicas', icone: '❄️', inimigos: ['troll', 'fenrir'], chefao: 'fenrir', corTela: '#1f3b5c' },
  { id: 'submundo', nome: 'Submundo Grego', icone: '🔥', inimigos: ['cerbero', 'medusa'], chefao: 'cerbero', corTela: '#4a1e1e' },
  { id: 'midgard', nome: 'Mar de Midgard', icone: '🌊', inimigos: ['serpente', 'troll'], chefao: 'serpente', corTela: '#1f5566' },
];
