import type { Region, RegionId } from '../types';

export const REGIONS: Record<RegionId, Region> = {
  plains: { id: 'plains', name: 'Planície', icon: '🌿', order: 0, background: 'linear-gradient(#bfe9ff, #dff6d8 55%, #9fd98a 56%, #7cc46b)' },
  jungle: { id: 'jungle', name: 'Selva', icon: '🌴', order: 1, background: 'linear-gradient(#a8e6cf, #3f8f5a)' },
  coast: { id: 'coast', name: 'Costa', icon: '🏖️', order: 2, background: 'linear-gradient(#9ad7ff, #f7e1a1)' },
  mountains: { id: 'mountains', name: 'Montanhas', icon: '❄️', order: 3, background: 'linear-gradient(#dbe9ff, #ffffff)' },
  desert: { id: 'desert', name: 'Deserto', icon: '🏜️', order: 4, background: 'linear-gradient(#ffe0a3, #e8b36a)' },
  volcano: { id: 'volcano', name: 'Vulcão', icon: '🌋', order: 5, background: 'linear-gradient(#ffb199, #8a3b2e)' },
};

export const REGION_ORDER = (Object.values(REGIONS) as Region[])
  .sort((a, b) => a.order - b.order)
  .map((r) => r.id);
