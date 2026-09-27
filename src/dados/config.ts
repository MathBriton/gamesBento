/** Parâmetros de balanceamento. Ajustar aqui, não nos componentes. */
export const CONFIG = {
  moedasIniciais: 0,

  /* Inimigos */
  inimigosPorFase: 10,
  /** A zona temática (cenário e monstros) muda a cada N fases. */
  fasesPorZona: 10,
  /** A cada N fases a fase é de chefão. */
  chefaoACada: 5,
  multiplicadorVidaChefao: 10,
  multiplicadorMoedasChefao: 5,
  tempoChefaoMs: 30_000,
  vidaInimigoBase: 5,
  crescimentoVidaInimigo: 1.4,
  /** Moedas por inimigo = vida máxima / divisorMoedas. */
  divisorMoedas: 5,

  /* Dinossauros */
  nivelMaximo: 1000,
  crescimentoCustoNivel: 1.07,
  /** Dano x2 a cada N níveis. */
  marcoACada: 25,
  /** Ganha uma nova armadura a cada N níveis. */
  niveisPorArmadura: 100,
  multiplicadorDanoArmadura: 10,

  /* Toque (Garra) */
  custoBaseGarra: 5,
  danoBaseGarra: 1,
  /** Parte do dano por segundo do time somada ao toque. */
  parcelaDoTimeNoToque: 0.04,
  chanceCritico: 0.08,
  multiplicadorCritico: 5,

  /* Offline */
  offlineMinimoMs: 60_000,
  offlineMaximoMs: 12 * 60 * 60_000,
  /** Limite de inimigos derrotados por segundo no cálculo offline. */
  abatesMaximosPorSegundo: 3,
} as const;
