import { it } from 'vitest';
import { IDS_DINOSSAUROS } from '../dados/dinossauros';
import type { EstadoJogo } from '../tipos';
import { aplicarDano, avancarTempo, enfrentarChefao } from './batalha/batalha';
import { danoDinossauro, danoDoTime, danoGarra, danoToque, nivelArmaduraDe } from './batalha/formulas';
import { comprarDinossauro, comprarNiveisDinossauro, comprarNiveisGarra, cotarDinossauro, cotarGarra, precoDinossauro } from './batalha/melhorias';
import { criarEstadoInicial } from './estado';

// Simulação de balanceamento: ~3 toques/s, compra espécie nova assim que pode e depois a melhoria
// com melhor dano por ouro. Rodar com `npm run simular` (fora dos testes normais).
it('simulacao', () => {
  let e: EstadoJogo = criarEstadoInicial(0);
  const marcas = [1, 5, 15, 30, 60, 120, 240, 480].map((m) => m * 60);
  let treinoDesde = -1;
  for (let t = 0; t <= marcas[marcas.length - 1] * 10; t++) {
    const agora = t * 100;
    e = avancarTempo(e, 0.1, agora, Math.random).estado;
    if (t % 3 === 0) e = aplicarDano(e, danoToque(e), agora, Math.random).estado;
    if (e.batalha.treinando) {
      if (treinoDesde < 0) treinoDesde = agora;
      if (agora - treinoDesde > 60_000) { e = enfrentarChefao(e, agora, Math.random); treinoDesde = -1; }
    }
    if (t % 10 === 0) {
      for (let k = 0; k < 60; k++) {
        let melhor: { ganho: number; comprar: () => EstadoJogo } | null = null;
        const g = cotarGarra(e, 1);
        if (g.podePagar) melhor = { ganho: ((danoGarra(e.nivelGarra + 1) - danoGarra(e.nivelGarra)) * 4) / g.custo, comprar: () => comprarNiveisGarra(e, 1)! };
        for (const id of IDS_DINOSSAUROS) {
          const d = e.dinossauros[id];
          if (!d) {
            if (e.ouro >= precoDinossauro(id)) {
              const ganho = Infinity; // jogador real compra espécie nova assim que pode
              if (!melhor || ganho > melhor.ganho) melhor = { ganho, comprar: () => comprarDinossauro(e, id, agora)! };
            }
            continue;
          }
          const c = cotarDinossauro(e, id, 1)!;
          if (!c.podePagar) continue;
          const ganho = (danoDinossauro(id, d.nivel + 1) - danoDinossauro(id, d.nivel)) / c.custo;
          if (!melhor || ganho > melhor.ganho) melhor = { ganho, comprar: () => comprarNiveisDinossauro(e, id, 1)!.estado };
        }
        if (!melhor) break;
        e = melhor.comprar();
      }
    }
    const s = t / 10;
    if (t % 10 === 0 && marcas.includes(s)) {
      const time = IDS_DINOSSAUROS.filter((id) => e.dinossauros[id]).map((id) => `${id.slice(0, 5)}:${e.dinossauros[id]!.nivel}(a${nivelArmaduraDe(e.dinossauros[id]!.nivel)})`).join(' ');
      console.log(`${s / 60}min fase=${e.batalha.faseMaxima} dps=${danoDoTime(e).toExponential(1)} garra=${e.nivelGarra} ${time}`);
    }
  }
}, 300_000);
