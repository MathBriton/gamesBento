import { describe, expect, it } from 'vitest';
import { migrar } from '../armazenamento/salvamento';
import { ARMADURAS } from '../dados/armaduras';
import { CONFIG } from '../dados/config';
import { DINOSSAUROS, IDS_DINOSSAUROS } from '../dados/dinossauros';
import type { EstadoJogo } from '../tipos';
import { formatarNumero } from '../utilitarios/formatar';
import { aplicarDano, avancarTempo, enfrentarChefao } from './batalha/batalha';
import { custoNiveis, danoDinossauro, danoDoTime, maximoCompravel, nivelArmaduraDe, moedasPorInimigo, vidaMaximaInimigo } from './batalha/formulas';
import {
  adicionarNiveis,
  comprarDinossauro,
  comprarNiveisDinossauro,
  comprarNiveisGarra,
  cotar,
  cotarDinossauro,
  podeComprarDinossauro,
} from './batalha/melhorias';
import { aplicarOffline } from './batalha/offline';
import { criarEstadoInicial } from './estado';

const T0 = 1_000_000;
const sequencia = (...valores: number[]) => {
  let i = 0;
  return () => valores[i++ % valores.length];
};
const aleatorio = sequencia(0.3);

function comDino(nivel: number, estado: EstadoJogo = criarEstadoInicial(T0)): EstadoJogo {
  return { ...estado, dinossauros: { ...estado.dinossauros, triceratops: { nivel, obtidoEm: T0 } } };
}

describe('estado inicial', () => {
  it('começa na fase 1, sem dinossauros e sem ovos', () => {
    const e = criarEstadoInicial(T0);
    expect(e.batalha.fase).toBe(1);
    expect(e.dinossauros).toEqual({});
    expect(danoDoTime(e)).toBe(0);
    expect('ovos' in e).toBe(false);
  });
});

describe('compra de dinossauros', () => {
  it('compra com moedas e entra no nível 1', () => {
    const preco = DINOSSAUROS.triceratops.precoCompra;
    const pobre = criarEstadoInicial(T0);
    expect(podeComprarDinossauro(pobre, 'triceratops')).toBe(false);
    expect(comprarDinossauro(pobre, 'triceratops', T0)).toBeNull();

    const rico = { ...pobre, moedas: preco + 5 };
    const e = comprarDinossauro(rico, 'triceratops', T0)!;
    expect(e.dinossauros.triceratops).toEqual({ nivel: 1, obtidoEm: T0 });
    expect(e.moedas).toBe(5);
    // Não compra o mesmo duas vezes.
    expect(comprarDinossauro({ ...e, moedas: 1e9 }, 'triceratops', T0)).toBeNull();
  });

  it('espécies ficam mais caras e mais fortes na ordem de compra', () => {
    for (let i = 1; i < IDS_DINOSSAUROS.length; i++) {
      const antes = DINOSSAUROS[IDS_DINOSSAUROS[i - 1]];
      const depois = DINOSSAUROS[IDS_DINOSSAUROS[i]];
      expect(depois.precoCompra).toBeGreaterThan(antes.precoCompra);
      expect(depois.danoBase).toBeGreaterThan(antes.danoBase);
    }
  });
});

describe('níveis e armaduras', () => {
  it('ganha uma armadura a cada 100 níveis, até a 10ª no Nv 1000', () => {
    expect(nivelArmaduraDe(1)).toBe(0);
    expect(nivelArmaduraDe(99)).toBe(0);
    expect(nivelArmaduraDe(100)).toBe(1);
    expect(nivelArmaduraDe(550)).toBe(5);
    expect(nivelArmaduraDe(1000)).toBe(10);
    expect(ARMADURAS).toHaveLength(11);
  });

  it('não passa do nível máximo', () => {
    const e = comDino(995);
    const r = adicionarNiveis(e, 'triceratops', 50);
    expect(r.estado.dinossauros.triceratops?.nivel).toBe(CONFIG.nivelMaximo);
    expect(r.niveis).toBe(5);
    expect(r.novaArmadura).toBe(10);
    const cota = cotarDinossauro({ ...r.estado, moedas: 1e300 }, 'triceratops', 10)!;
    expect(cota.noMaximo).toBe(true);
    expect(cota.podePagar).toBe(false);
  });

  it('cotação respeita o limite de níveis restantes', () => {
    const c = cotar(10, 995, 1e300, 100, CONFIG.nivelMaximo);
    expect(c.niveis).toBe(5);
  });

  it('comprar níveis gasta moedas e informa nova armadura', () => {
    const e = { ...comDino(99), moedas: 1e12 };
    const r = comprarNiveisDinossauro(e, 'triceratops', 1)!;
    expect(r.estado.dinossauros.triceratops?.nivel).toBe(100);
    expect(r.novaArmadura).toBe(1);
    expect(r.estado.moedas).toBeLessThan(e.moedas);
    expect(comprarNiveisDinossauro({ ...comDino(5), moedas: 0 }, 'triceratops', 1)).toBeNull();
  });

  it('dano dobra nos marcos e multiplica a cada armadura', () => {
    expect(danoDinossauro('triceratops', 25) / danoDinossauro('triceratops', 24)).toBeCloseTo((25 / 24) * 2);
    expect(danoDinossauro('triceratops', 100) / danoDinossauro('triceratops', 99)).toBeCloseTo((100 / 99) * CONFIG.multiplicadorDanoArmadura);
    expect(Number.isFinite(danoDinossauro('tiranossauro', CONFIG.nivelMaximo))).toBe(true);
  });

  it('custo acumulado é consistente com o máximo comprável', () => {
    const n = maximoCompravel(10, 1, 1000);
    expect(custoNiveis(10, 1, n)).toBeLessThanOrEqual(1000);
    expect(custoNiveis(10, 1, n + 1)).toBeGreaterThan(1000);
  });

  it('garra aumenta o nível do toque', () => {
    expect(comprarNiveisGarra({ ...criarEstadoInicial(T0), moedas: 1000 }, 10)!.nivelGarra).toBe(11);
  });
});

describe('batalha', () => {
  it('derrotar 10 inimigos avança de fase e dá moedas', () => {
    let e = criarEstadoInicial(T0);
    for (let i = 0; i < CONFIG.inimigosPorFase; i++) e = aplicarDano(e, e.batalha.vidaInimigo, T0, aleatorio).estado;
    expect(e.batalha.fase).toBe(2);
    expect(e.moedas).toBe(moedasPorInimigo(1, false) * CONFIG.inimigosPorFase);
  });

  it('chefão tem mais vida e dá mais moedas', () => {
    expect(vidaMaximaInimigo(5, true)).toBe(vidaMaximaInimigo(5, false) * CONFIG.multiplicadorVidaChefao);
    expect(moedasPorInimigo(5, true)).toBeGreaterThan(moedasPorInimigo(5, false));
  });

  it('perder para o chefão volta uma fase em treino; dá para tentar de novo', () => {
    let e = criarEstadoInicial(T0);
    e = { ...e, batalha: { ...e.batalha, fase: 4, abates: 9 } };
    e = aplicarDano(e, e.batalha.vidaInimigo, T0, aleatorio).estado;
    expect(e.batalha.ehChefao).toBe(true);
    const falha = avancarTempo(e, 0.1, T0 + CONFIG.tempoChefaoMs + 1, aleatorio);
    expect(falha.eventos).toEqual([{ tipo: 'chefaoFalhou' }]);
    expect(falha.estado.batalha.fase).toBe(4);
    expect(falha.estado.batalha.treinando).toBe(true);

    let treino = falha.estado;
    for (let i = 0; i < CONFIG.inimigosPorFase; i++) treino = aplicarDano(treino, treino.batalha.vidaInimigo, T0, aleatorio).estado;
    expect(treino.batalha.fase).toBe(4);

    const denovo = enfrentarChefao(treino, T0, aleatorio);
    expect(denovo.batalha.fase).toBe(5);
    expect(denovo.batalha.ehChefao).toBe(true);
  });

  it('o time causa dano com o tempo', () => {
    const e = comDino(10);
    const r = avancarTempo(e, 0.1, T0, aleatorio);
    expect(r.estado.batalha.vidaInimigo).toBeCloseTo(e.batalha.vidaInimigo - danoDinossauro('triceratops', 10) * 0.1);
  });
});

describe('offline e salvamento', () => {
  it('ganha moedas enquanto fechado, com limite de tempo', () => {
    const e = { ...comDino(50), vistoPorUltimo: T0 };
    expect(aplicarOffline(e, T0 + 60 * 60_000).moedas).toBeGreaterThan(0);
    expect(aplicarOffline(e, T0 + 7 * 24 * 60 * 60_000).tempoMs).toBe(CONFIG.offlineMaximoMs);
    expect(aplicarOffline(e, T0 + 1000).moedas).toBe(0);
  });

  it('migra save v3 (inglês, com ovos) mantendo níveis, moedas e ajustes', () => {
    const v3 = {
      version: 3,
      gold: 500,
      eggs: 4,
      clawLevel: 12,
      dinos: { trex: { level: 150, count: 2, discoveredAt: 7 }, apatosaurus: { level: 3, count: 1, discoveredAt: 8 } },
      settings: { music: false, sfx: true, narration: false, volume: 0.3 },
    } as unknown as Parameters<typeof migrar>[0];
    const e = migrar(v3, criarEstadoInicial(T0));
    expect(e.dinossauros.tiranossauro).toEqual({ nivel: 150, obtidoEm: 7 });
    expect(e.dinossauros.braquiossauro?.nivel).toBe(3);
    expect(e.moedas).toBe(500);
    expect(e.nivelGarra).toBe(12);
    expect(e.ajustes).toEqual({ musica: false, efeitos: true, narracao: false, volume: 0.3 });
    expect('ovos' in e).toBe(false);
  });

  it('migra save v2 (jogo educativo) mantendo a coleção no nível 1', () => {
    const v2 = { version: 2, collection: { triceratops: { discoveredAt: 5, count: 1 } }, stars: 40 } as unknown as Parameters<typeof migrar>[0];
    const e = migrar(v2, criarEstadoInicial(T0));
    expect(e.dinossauros.triceratops).toEqual({ nivel: 1, obtidoEm: 5 });
    expect(e.moedas).toBe(0);
  });

  it('migra save v4 (campo ouro) para moedas', () => {
    const v4 = { ...criarEstadoInicial(T0), versao: 4, ouro: 777 } as unknown as Parameters<typeof migrar>[0];
    delete (v4 as { moedas?: number }).moedas;
    const e = migrar(v4, criarEstadoInicial(T0));
    expect(e.moedas).toBe(777);
    expect('ouro' in e).toBe(false);
  });

  it('save atual sobrevive a salvar e carregar', () => {
    const e = { ...comDino(42), moedas: 123 };
    const volta = migrar(JSON.parse(JSON.stringify(e)), criarEstadoInicial(T0));
    expect(volta.dinossauros.triceratops?.nivel).toBe(42);
    expect(volta.moedas).toBe(123);
  });
});

describe('formatação', () => {
  it('formata números grandes', () => {
    expect(formatarNumero(999)).toBe('999');
    expect(formatarNumero(1250)).toBe('1.25K');
    expect(formatarNumero(34_500_000)).toBe('34.5M');
    expect(formatarNumero(120e9)).toBe('120B');
    expect(formatarNumero(1e45)).toBe('1.00Qad');
    expect(formatarNumero(1e70)).toBe('1.00e70');
  });
});
