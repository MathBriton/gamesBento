import { describe, expect, it } from 'vitest';
import { CONFIG } from '../data/config';
import { migrate } from '../storage/save';
import type { GameState } from '../types';
import { formatNumber } from '../utils/format';
import { applyDamage, challengeBoss, tick } from './battle/battle';
import { dinoDps, enemyMaxHp, evolutionOf, goldFor, levelCost, maxAffordable, teamDps } from './battle/formulas';
import { applyOffline } from './battle/offline';
import { addLevels, buyClawLevels, buyDinoLevels, quote } from './battle/upgrades';
import { hatchEgg } from './eggs/eggs';
import { createInitialState } from './state';

const T0 = 1_000_000;
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};
const rng = seq(0.3);

function withDino(level: number, s: GameState = createInitialState(T0)): GameState {
  return { ...s, dinos: { ...s.dinos, triceratops: { level, count: 1, discoveredAt: T0 } } };
}

describe('estado inicial', () => {
  it('começa na fase 1 com 1 ovo e sem dinossauros', () => {
    const s = createInitialState(T0);
    expect(s.battle.stage).toBe(1);
    expect(s.eggs).toBe(1);
    expect(teamDps(s)).toBe(0);
  });
});

describe('ovos', () => {
  it('dinossauro novo entra no time no nível 1', () => {
    const r = hatchEgg(createInitialState(T0), seq(0), T0)!;
    expect(r.isNew).toBe(true);
    expect(r.state.eggs).toBe(0);
    expect(r.state.dinos[r.dinoId]?.level).toBe(1);
  });

  it('repetido vira níveis grátis e pode evoluir', () => {
    const entry = { level: 95, count: 1, discoveredAt: T0 };
    const s: GameState = { ...createInitialState(T0), dinos: { triceratops: entry, trex: entry, apatosaurus: entry } };
    const r = hatchEgg(s, seq(0.5), T0)!;
    expect(r.isNew).toBe(false);
    expect(r.bonusLevels).toBe(CONFIG.duplicateLevels);
    expect(r.state.dinos[r.dinoId]?.level).toBe(95 + CONFIG.duplicateLevels);
    expect(r.state.dinos[r.dinoId]?.count).toBe(2);
    expect(r.evolvedTo).toBe(1);
  });
});

describe('fórmulas', () => {
  it('evolui a cada 100 níveis até o último estágio', () => {
    expect(evolutionOf(1)).toBe(0);
    expect(evolutionOf(99)).toBe(0);
    expect(evolutionOf(100)).toBe(1);
    expect(evolutionOf(250)).toBe(2);
    expect(evolutionOf(10_000)).toBe(4);
  });

  it('dano dobra nos marcos e multiplica ao evoluir', () => {
    expect(dinoDps('triceratops', 25) / dinoDps('triceratops', 24)).toBeCloseTo((25 / 24) * 2);
    expect(dinoDps('triceratops', 100) / dinoDps('triceratops', 99)).toBeCloseTo((100 / 99) * CONFIG.evolutionDamageMultiplier);
  });

  it('custo acumulado bate com a soma nível a nível e com o máximo comprável', () => {
    let sum = 0;
    for (let l = 1; l <= 10; l++) sum += levelCost(10, l, 1);
    expect(levelCost(10, 1, 10)).toBeGreaterThanOrEqual(sum - 10);
    expect(levelCost(10, 1, 10)).toBeLessThanOrEqual(sum + 10);
    const n = maxAffordable(10, 1, 1000);
    expect(levelCost(10, 1, n)).toBeLessThanOrEqual(1000);
    expect(levelCost(10, 1, n + 1)).toBeGreaterThan(1000);
  });

  it('chefão tem mais vida e dá mais ouro', () => {
    expect(enemyMaxHp(5, true)).toBe(enemyMaxHp(5, false) * CONFIG.bossHpMultiplier);
    expect(goldFor(5, true)).toBeGreaterThan(goldFor(5, false));
  });

  it('formata números grandes', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(1250)).toBe('1.25K');
    expect(formatNumber(34_500_000)).toBe('34.5M');
    expect(formatNumber(120e9)).toBe('120B');
  });
});

describe('batalha', () => {
  it('derrotar 10 inimigos avança de fase e dá ouro', () => {
    let s = createInitialState(T0);
    for (let i = 0; i < CONFIG.enemiesPerStage; i++) {
      s = applyDamage(s, s.battle.enemyHp, T0, rng).state;
    }
    expect(s.battle.stage).toBe(2);
    expect(s.battle.kills).toBe(0);
    expect(s.gold).toBe(goldFor(1, false) * CONFIG.enemiesPerStage);
  });

  it('chefão dá ovo só na primeira vitória', () => {
    let s = createInitialState(T0);
    s = { ...s, battle: { ...s.battle, stage: 4, kills: 9 } };
    s = applyDamage(s, s.battle.enemyHp, T0, rng).state; // entra no chefão da fase 5
    expect(s.battle.isBoss).toBe(true);
    const eggs = s.eggs;
    const r = applyDamage(s, s.battle.enemyHp, T0, rng);
    expect(r.events.some((e) => e.type === 'egg')).toBe(true);
    expect(r.state.eggs).toBe(eggs + 1);
    expect(r.state.battle.stage).toBe(6);
    expect(r.state.battle.bossRecord).toBe(5);
  });

  it('perder para o chefão volta uma fase em modo treino; dá para tentar de novo', () => {
    let s = createInitialState(T0);
    s = { ...s, battle: { ...s.battle, stage: 4, kills: 9 } };
    s = applyDamage(s, s.battle.enemyHp, T0, rng).state;
    const fail = tick(s, 0.1, T0 + CONFIG.bossTimeMs + 1, rng);
    expect(fail.events).toEqual([{ type: 'bossFail' }]);
    expect(fail.state.battle.stage).toBe(4);
    expect(fail.state.battle.farming).toBe(true);
    // Em treino, completar a fase não avança.
    let farm = fail.state;
    for (let i = 0; i < CONFIG.enemiesPerStage; i++) farm = applyDamage(farm, farm.battle.enemyHp, T0, rng).state;
    expect(farm.battle.stage).toBe(4);
    const retry = challengeBoss(farm, T0, rng);
    expect(retry.battle.stage).toBe(5);
    expect(retry.battle.isBoss).toBe(true);
    expect(retry.battle.farming).toBe(false);
  });

  it('o time causa dano com o tempo', () => {
    const s = withDino(10);
    const r = tick(s, 0.1, T0, rng);
    expect(r.state.battle.enemyHp).toBeCloseTo(s.battle.enemyHp - dinoDps('triceratops', 10) * 0.1);
  });
});

describe('melhorias', () => {
  it('comprar níveis gasta ouro e informa evolução', () => {
    let s = { ...withDino(99), gold: 1e12 };
    const r = buyDinoLevels(s, 'triceratops', 1)!;
    expect(r.state.dinos.triceratops?.level).toBe(100);
    expect(r.evolvedTo).toBe(1);
    expect(r.state.gold).toBeLessThan(s.gold);
    s = { ...withDino(5), gold: 0 };
    expect(buyDinoLevels(s, 'triceratops', 1)).toBeNull();
  });

  it('modo MÁX cota pelo menos 1 nível e compra o máximo possível', () => {
    expect(quote(10, 1, 0, 'max').levels).toBe(1);
    const q = quote(10, 1, 5000, 'max');
    expect(q.affordable).toBe(true);
    expect(levelCost(10, 1, q.levels + 1)).toBeGreaterThan(5000);
  });

  it('garra aumenta o nível do toque', () => {
    const s = buyClawLevels({ ...createInitialState(T0), gold: 1000 }, 10)!;
    expect(s.clawLevel).toBe(11);
  });

  it('addLevels não altera dinossauro que o jogador não tem', () => {
    const s = createInitialState(T0);
    expect(addLevels(s, 'trex', 10).state).toBe(s);
  });
});

describe('offline e save', () => {
  it('ganha ouro enquanto fechado, com limite de tempo', () => {
    const s = { ...withDino(50), lastSeen: T0 };
    const hour = applyOffline(s, T0 + 60 * 60_000);
    expect(hour.gold).toBeGreaterThan(0);
    const week = applyOffline(s, T0 + 7 * 24 * 60 * 60_000);
    expect(week.elapsedMs).toBe(CONFIG.offlineMaxMs);
    expect(applyOffline(s, T0 + 1000).gold).toBe(0);
  });

  it('migra save do jogo educativo mantendo dinossauros e ajustes', () => {
    const legacy = {
      version: 2,
      collection: { trex: { discoveredAt: 5, count: 2 } },
      eggs: 3,
      settings: { music: false },
      stars: 40,
    } as unknown as Parameters<typeof migrate>[0];
    const s = migrate(legacy, createInitialState(T0));
    expect(s.dinos.trex).toEqual({ level: 1, count: 2, discoveredAt: 5 });
    expect(s.eggs).toBe(3);
    expect(s.settings.music).toBe(false);
    expect(s.battle.stage).toBe(1);
  });

  it('save da versão atual sobrevive a salvar e carregar', () => {
    const s = { ...withDino(42), gold: 123 };
    const back = migrate(JSON.parse(JSON.stringify(s)), createInitialState(T0));
    expect(back.dinos.triceratops?.level).toBe(42);
    expect(back.gold).toBe(123);
  });
});
