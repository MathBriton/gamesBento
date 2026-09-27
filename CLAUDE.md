# Ilha dos Dinossauros — referência do projeto

> Mantido atualizado a cada etapa. Para o estado do trabalho em andamento e a passagem
> entre agentes, veja [memory.md](memory.md).

## O que é
Jogo **idle/clicker de batalha** para navegador (estilo Clicker Heroes / Tap Titans 2).
Dinossauros derrotam inimigos por fases; o jogador toca para causar dano e o time ataca sozinho.
Dinossauros são **comprados com ouro**, sobem até o **nível 1000** e ganham uma **armadura nova a
cada 100 níveis** (visual provisório; o modelo definitivo virá por prompt do usuário).

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

## Convenções
- **Nomenclatura em PT-BR** para arquivos, pastas, tipos, funções, variáveis e classes CSS novas
  (ex.: `aplicarDano`, `EstadoJogo`, `nivelArmaduraDe`). Exceções: convenções de framework
  (`App`, `main.tsx`, hooks começam com `use`).
- **Lógica separada da interface**: `src/jogo/` só tem funções puras `(estado, ...) => novoEstado`,
  com `agora` e `aleatorio` injetados (testáveis). Componentes não calculam regras.
- **Orientado a dados**: espécies, armaduras, inimigos e regiões em `src/dados/`; números de
  balanceamento só em `src/dados/config.ts`.
- **Estética**: seguir o guia estético (cartoon 2D, contorno forte `#3a2418`, cel shading, olhos
  grandes, cores vibrantes, perspectiva 3/4, amigável para crianças).
- **Emojis**: evitar emojis recentes (ex.: 🪙 não aparece no Windows 10). Ouro = 💰.
- Commits pequenos e frequentes, com push para `origin main` a cada etapa.

## Estrutura (PT-BR)
```
src/
├── tipos/index.ts            Tipos do domínio (EstadoJogo, Dinossauro, EstadoBatalha…)
├── dados/                    Conteúdo e balanceamento
│   ├── config.ts             Todos os números de balanceamento
│   ├── dinossauros.ts        6 espécies, na ordem de compra (preço, dano, cores do guia)
│   ├── armaduras.ts          11 níveis de armadura (0 = selvagem … 10 = Nv 1000)
│   ├── inimigos.ts           Tipos de inimigo e cores por zona
│   └── regioes.ts            Zonas/cenários (mudam a cada 10 fases)
├── jogo/                     Regras (funções puras)
│   ├── estado.ts             Estado inicial e VERSAO_SAVE
│   ├── batalha/formulas.ts   Vida, ouro, dano, custos, nível de armadura
│   ├── batalha/batalha.ts    Inimigos, dano, avanço de tempo, chefão
│   ├── batalha/melhorias.ts  Compra de dinossauros, níveis (até 1000) e Garra
│   ├── batalha/offline.ts    Ouro ganho com o jogo fechado
│   ├── jogo.test.ts          Testes
│   └── simulacao.sim.ts      Simulação de balanceamento (npm run simular)
├── armazenamento/salvamento.ts  localStorage + migração de saves antigos
├── utilitarios/              formatar.ts (1.2K, 3.4M…), aleatorio.ts
└── Images/Dinossauros/       Guia estético (+ futuros assets WebP)
```
**Em transição (etapa 2):** as pastas antigas em inglês (`src/game`, `src/data`, `src/types`,
`src/screens`, `src/components`, `src/hooks`, `src/storage`, `src/utils`) ainda alimentam a
interface e serão substituídas pela interface em PT-BR.

## Regras do jogo (resumo)
- **Fases**: 10 inimigos por fase; a cada 5 fases, um **chefão** com 30 s. Se perder, volta uma
  fase em modo treino até tocar em "Enfrentar chefão".
- **Ouro**: por inimigo = vida máxima / 5 (chefão ×5). Compra dinossauros, níveis e a Garra.
- **Dano**: `danoBase × nível × 2^(marcos de 25 níveis) × 10^(armadura)`. Toque = Garra + 4% do
  dano do time; 8% de crítico (×5).
- **Armadura**: `min(10, floor(nível / 100))`. Nível máximo 1000.
- **Offline**: até 12 h, sem avançar fases, com limite de 3 abates/s.
- **Save**: chave `ilha-dos-dinossauros:save`, `VERSAO_SAVE = 4`. v1–v3 (em inglês) são migradas;
  Apatossauro antigo vira Braquiossauro; ovos deixaram de existir.

## Histórico de etapas
1. MVP educativo (SDD) → descartado.
2. Idle de batalha com ovos e evolução a cada 100 níveis (commit base).
3. **Etapa atual:** reorganização — PT-BR, compra de dinossauros (sem ovos), 6 espécies do guia,
   nível máximo 1000 com armaduras a cada 100 níveis.
   - 3.1 ✅ Camada de lógica em PT-BR + testes + simulação.
   - 3.2 ⏳ Interface em PT-BR ligada à nova lógica (remove código antigo).
   - 3.3 ⏳ Arte das 6 espécies conforme o guia + visual das armaduras.
