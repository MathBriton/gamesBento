import type { IdRegiao, Regiao } from '../tipos';

export const REGIOES: Record<IdRegiao, Regiao> = {
  planicie: { id: 'planicie', nome: 'Planície', icone: '🌿', ordem: 0, fundo: 'linear-gradient(#bfe9ff, #dff6d8 55%, #9fd98a 56%, #7cc46b)' },
  selva: { id: 'selva', nome: 'Selva', icone: '🌴', ordem: 1, fundo: 'linear-gradient(#a8e6cf, #3f8f5a)' },
  costa: { id: 'costa', nome: 'Costa', icone: '🏖️', ordem: 2, fundo: 'linear-gradient(#9ad7ff, #f7e1a1)' },
  montanhas: { id: 'montanhas', nome: 'Montanhas', icone: '❄️', ordem: 3, fundo: 'linear-gradient(#dbe9ff, #ffffff)' },
  deserto: { id: 'deserto', nome: 'Deserto', icone: '🏜️', ordem: 4, fundo: 'linear-gradient(#ffe0a3, #e8b36a)' },
  vulcao: { id: 'vulcao', nome: 'Vulcão', icone: '🌋', ordem: 5, fundo: 'linear-gradient(#ffb199, #8a3b2e)' },
};

export const ORDEM_REGIOES = (Object.values(REGIOES) as Regiao[])
  .sort((a, b) => a.ordem - b.ordem)
  .map((r) => r.id);
