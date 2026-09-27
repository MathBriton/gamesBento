import { CONFIG } from '../../dados/config';
import type { EstadoBatalha, EstadoJogo } from '../../tipos';
import { sortear, type Aleatorio } from '../../utilitarios/aleatorio';
import { danoDoTime, ehFaseDeChefao, moedasPorInimigo, vidaMaximaInimigo } from './formulas';
import { zonaDaFase } from './zonas';

export type EventoBatalha =
  | { tipo: 'abate'; moedas: number; chefao: boolean }
  | { tipo: 'fase'; fase: number }
  | { tipo: 'chefaoFalhou' };

export interface ResultadoBatalha {
  estado: EstadoJogo;
  eventos: EventoBatalha[];
}

/** Coloca um novo inimigo na fase indicada: monstro comum da zona ou o chefão dela. */
export function gerarInimigo(batalha: EstadoBatalha, fase: number, agora: number, aleatorio: Aleatorio): EstadoBatalha {
  const chefao = ehFaseDeChefao(fase) && !batalha.treinando;
  const vida = vidaMaximaInimigo(fase, chefao);
  return {
    ...batalha,
    fase,
    faseMaxima: Math.max(batalha.faseMaxima, fase),
    tipoInimigo: chefao ? zonaDaFase(fase).chefao : sortear(aleatorio, zonaDaFase(fase).inimigos),
    vidaInimigo: vida,
    vidaMaximaInimigo: vida,
    ehChefao: chefao,
    fimChefaoEm: chefao ? agora + CONFIG.tempoChefaoMs : null,
  };
}

export function criarBatalha(): EstadoBatalha {
  const vida = vidaMaximaInimigo(1, false);
  return {
    fase: 1,
    faseMaxima: 1,
    abates: 0,
    tipoInimigo: zonaDaFase(1).inimigos[0],
    vidaInimigo: vida,
    vidaMaximaInimigo: vida,
    ehChefao: false,
    fimChefaoEm: null,
    treinando: false,
  };
}

/** Aplica dano ao inimigo atual; o excesso de dano é descartado. */
export function aplicarDano(estado: EstadoJogo, dano: number, agora: number, aleatorio: Aleatorio): ResultadoBatalha {
  const b = estado.batalha;
  if (dano <= 0) return { estado, eventos: [] };
  if (b.vidaInimigo - dano > 0) {
    return { estado: { ...estado, batalha: { ...b, vidaInimigo: b.vidaInimigo - dano } }, eventos: [] };
  }

  const moedas = moedasPorInimigo(b.fase, b.ehChefao);
  const eventos: EventoBatalha[] = [{ tipo: 'abate', moedas, chefao: b.ehChefao }];
  let proxima: EstadoBatalha;

  if (b.ehChefao) {
    proxima = gerarInimigo({ ...b, abates: 0 }, b.fase + 1, agora, aleatorio);
    eventos.push({ tipo: 'fase', fase: b.fase + 1 });
  } else {
    const abates = b.abates + 1;
    if (abates < CONFIG.inimigosPorFase) {
      proxima = gerarInimigo({ ...b, abates }, b.fase, agora, aleatorio);
    } else if (b.treinando) {
      proxima = gerarInimigo({ ...b, abates: 0 }, b.fase, agora, aleatorio);
    } else {
      proxima = gerarInimigo({ ...b, abates: 0 }, b.fase + 1, agora, aleatorio);
      eventos.push({ tipo: 'fase', fase: b.fase + 1 });
    }
  }

  return { estado: { ...estado, moedas: estado.moedas + moedas, batalha: proxima }, eventos };
}

/** Avança o tempo: dano automático do time e o relógio do chefão. */
export function avancarTempo(estado: EstadoJogo, segundos: number, agora: number, aleatorio: Aleatorio): ResultadoBatalha {
  const b = estado.batalha;
  if (b.ehChefao && b.fimChefaoEm !== null && agora >= b.fimChefaoEm) {
    // Não venceu a tempo: volta uma fase e fica treinando até tentar de novo.
    const anterior = gerarInimigo({ ...b, abates: 0, treinando: true }, Math.max(1, b.fase - 1), agora, aleatorio);
    return { estado: { ...estado, batalha: anterior }, eventos: [{ tipo: 'chefaoFalhou' }] };
  }
  return aplicarDano(estado, danoDoTime(estado) * segundos, agora, aleatorio);
}

export function podeEnfrentarChefao(estado: EstadoJogo): boolean {
  return estado.batalha.treinando;
}

/** Sai do modo treino e vai direto para o chefão. */
export function enfrentarChefao(estado: EstadoJogo, agora: number, aleatorio: Aleatorio): EstadoJogo {
  if (!podeEnfrentarChefao(estado)) return estado;
  const b = estado.batalha;
  return { ...estado, batalha: gerarInimigo({ ...b, treinando: false, abates: 0 }, b.fase + 1, agora, aleatorio) };
}
