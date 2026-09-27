# Ilha dos Dinossauros — referência do projeto

> Mantido atualizado a cada etapa. Para o estado do trabalho em andamento e a passagem
> entre agentes, veja [memory.md](memory.md).

## O que é
Jogo **idle/clicker de batalha** para navegador (estilo Clicker Heroes / Tap Titans 2).
Dinossauros enfrentam **monstros mitológicos em versão infantil** por fases, em **zonas temáticas**
com cenários ilustrados; o jogador toca para causar dano e o time ataca sozinho.
Dinossauros são **comprados com moedas**, sobem até o **nível 1000** e ganham uma **armadura nova
a cada 100 níveis** (visual provisório; o modelo definitivo virá por prompt do usuário).

> ⚠️ `SDD_Ilha_dos_Dinossauros.md` descreve um conceito antigo (jogo educativo) e está
> **desatualizado**. A fonte de verdade da estética dos dinossauros é
> [src/Images/Dinossauros/GUIA_ESTETICO_DINOSSAUROS.md](src/Images/Dinossauros/GUIA_ESTETICO_DINOSSAUROS.md).

## Stack e comandos
React 19 + TypeScript 7 + Vite 8 + Vitest. Sem backend; salva no `localStorage`.

```bash
npm run dev       # servidor de desenvolvimento (http://localhost:5173)
npm test          # testes da lógica do jogo
npm run build     # checagem de tipos + build de produção
npm run simular   # simulação de balanceamento (imprime progresso por tempo de jogo)
```
Galeria de arte (dinos × armaduras, cenários, monstros): `http://localhost:5173/?galeria`.

## Convenções
- **Nomenclatura em PT-BR** para arquivos, pastas, tipos, funções, variáveis e classes CSS
  (ex.: `aplicarDano`, `EstadoJogo`, `nivelArmaduraDe`). Exceções: convenções de framework
  (`App`, `main.tsx`, hooks começam com `use`).
- **Lógica separada da interface**: `src/jogo/` só tem funções puras `(estado, ...) => novoEstado`,
  com `agora` e `aleatorio` injetados (testáveis). Componentes não calculam regras.
- **Orientado a dados**: espécies, armaduras, monstros e zonas em `src/dados/`; números de
  balanceamento só em `src/dados/config.ts`.
- **Estética**: seguir o guia estético (cartoon 2D, contorno forte `#3a2418`, cel shading, olhos
  grandes, cores vibrantes, perspectiva 3/4, amigável para crianças). Monstros: travessos e
  engraçados, nunca assustadores (sem sangue, presinhas arredondadas).
- **Moeda**: o recurso se chama "moedas" e usa o componente `IconeMoeda` (SVG). Evitar emojis
  recentes (ex.: 🪙 não aparece no Windows 10).
- Commits pequenos e frequentes, com push para `origin main` a cada etapa.

## Estrutura (PT-BR)
```
src/
├── tipos/index.ts            Tipos do domínio (EstadoJogo, Dinossauro, EstadoBatalha, Zona…)
├── dados/                    Conteúdo e balanceamento
│   ├── config.ts             Todos os números de balanceamento
│   ├── dinossauros.ts        6 espécies, na ordem de compra (preço, dano, cores do guia)
│   ├── armaduras.ts          11 níveis de armadura (0 = selvagem … 10 = Nv 1000)
│   ├── inimigos.ts           9 monstros mitológicos (nome comum e de chefão)
│   └── zonas.ts              6 zonas temáticas: monstros, chefão, cor da tela
├── jogo/                     Regras (funções puras)
│   ├── estado.ts             Estado inicial e VERSAO_SAVE
│   ├── batalha/formulas.ts   Vida, moedas, dano, custos, nível de armadura
│   ├── batalha/batalha.ts    Inimigos (da zona), dano, avanço de tempo, chefão
│   ├── batalha/zonas.ts      Zona temática da fase (zonaDaFase)
│   ├── batalha/melhorias.ts  Compra de dinossauros, níveis (até 1000) e Garra
│   ├── batalha/offline.ts    Moedas ganhas com o jogo fechado
│   ├── jogo.test.ts          Testes
│   └── simulacao.sim.ts      Simulação de balanceamento (npm run simular)
├── armazenamento/salvamento.ts  localStorage + migração de saves antigos
├── ganchos/useJogo.tsx       Loja do estado (fora do React, useSyncExternalStore), salvamento e offline
├── audio/som.ts              Efeitos (Web Audio), música e narração (só botões 🔊)
├── componentes/
│   ├── ui.tsx                BotaoGrande, BarraTopo, Modal, Avisos, Confete, BarraProgresso
│   ├── Cel.tsx               Primitivas do estilo (contorno, cel shading, misturarCor)
│   ├── IconeMoeda.tsx        Moeda em SVG
│   ├── SpriteDino.tsx        Dinossauro (SVG ou imagem WebP, se existir) + armadura
│   ├── dino/                 especies.tsx (6 desenhos), primitivas.tsx, ancoras.ts, Armadura.tsx
│   ├── SpriteInimigo.tsx     Monstro + coroa de chefão
│   ├── inimigos/             monstros.tsx (9 desenhos), primitivas.tsx (olho, boca, coroa)
│   └── cenarios/             CenarioZona.tsx (6 cenários), elementos.tsx (céu, lua, pinheiro…)
├── telas/
│   ├── navegacao.ts          Tela = abertura | batalha | colecao | ajustes
│   ├── TelaAbertura.tsx, TelaColecao.tsx, TelaAjustes.tsx
│   ├── TelaGaleria.tsx       Galeria de arte (?galeria)
│   └── batalha/              TelaBatalha (arena + cenário + loop 10x/s), PainelTime, ModalArmadura
├── estilos.css               Estilos (classes em PT-BR)
├── utilitarios/              formatar.ts (1.2K, 3.4M…), aleatorio.ts
└── Images/Dinossauros/       Guia estético (+ assets WebP opcionais)
```

### Assets de imagem (opcional)
Se existir `src/Images/Dinossauros/<id>/armadura_<N>.webp` (ou `_128`/`_256`/`_512` antes da
extensão; `.png` também), o `SpriteDino` usa a imagem no lugar do SVG para aquela espécie e
nível de armadura. `<id>` = id da espécie (`triceratops`, `tiranossauro`…), `<N>` = 0 a 10.

### Desenhar/alterar armaduras
Dados em `src/dados/armaduras.ts` (material, peças, gema, aura, penacho, brilhos por nível);
desenho das peças em `src/componentes/dino/Armadura.tsx`; posição por espécie em
`src/componentes/dino/ancoras.ts`.

### Adicionar monstro ou zona
Monstro: tipo em `tipos/index.ts` (`TipoInimigo`), dados em `dados/inimigos.ts`, desenho em
`componentes/inimigos/monstros.tsx` (`DESENHOS_MONSTROS`). Zona: `IdZona` + `dados/zonas.ts` +
cenário em `componentes/cenarios/CenarioZona.tsx` (`CENARIOS`). Cenários usam caixa 400x300,
chão em y≈200, centro livre para o monstro.

## Regras do jogo (resumo)
- **Fases**: 10 inimigos por fase; a cada 5 fases, um **chefão** com 30 s. Se perder, volta uma
  fase em modo treino até tocar em "Enfrentar chefão".
- **Zonas**: a cada 10 fases muda a zona (cenário, monstros e chefão), em ciclo:
  🌕 Floresta Enluarada · 🏛️ Ruínas Gregas · 🏰 Castelo dos Vampiros · ❄️ Terras Nórdicas ·
  🔥 Submundo Grego · 🌊 Mar de Midgard.
- **Moedas**: por inimigo = vida máxima / 5 (chefão ×5). Compram dinossauros, níveis e a Garra.
- **Dano**: `danoBase × nível × 2^(marcos de 25 níveis) × 10^(armadura)`. Toque = Garra + 4% do
  dano do time; 8% de crítico (×5).
- **Armadura**: `min(10, floor(nível / 100))`. Nível máximo 1000.
- **Offline**: até 12 h, sem avançar fases, com limite de 3 abates/s.
- **Save**: chave `ilha-dos-dinossauros:save`, `VERSAO_SAVE = 5`. v1–v3 (em inglês) são migradas;
  Apatossauro antigo vira Braquiossauro; ovos deixaram de existir; v4 `ouro` → v5 `moedas`;
  monstros que não existem mais são trocados pelo da zona.

## Histórico de etapas
1. MVP educativo (SDD) → descartado.
2. Idle de batalha com ovos e evolução a cada 100 níveis (commit base).
3. Reorganização — PT-BR, compra de dinossauros (sem ovos), 6 espécies do guia, nível máximo
   1000 com armaduras a cada 100 níveis.
4. Moedas (ícone SVG), 9 monstros mitológicos infantis em 6 zonas temáticas e cenários ilustrados.
5. **Próxima etapa:** a definir com o usuário (ver memory.md → Próximos passos).
