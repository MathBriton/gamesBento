# memory.md — passagem de trabalho entre agentes

> Leia isto primeiro ao assumir o projeto. Atualize ao fim de cada etapa (o que foi feito,
> o que falta, decisões e armadilhas). Referência estável do projeto: [CLAUDE.md](CLAUDE.md).

## Estado atual (2026-09-27)
- Repositório: `https://github.com/MathBriton/gamesBento.git`, branch `main`.
- Etapa 3 em andamento (ver "Histórico de etapas" no CLAUDE.md).
- **Feito (3.1):** nova camada de lógica em PT-BR em `src/tipos`, `src/dados`, `src/jogo`,
  `src/armazenamento`, `src/utilitarios`, com testes (`src/jogo/jogo.test.ts`) e simulação
  (`npm run simular`).
- **A interface ainda usa o código antigo em inglês** (`src/game`, `src/data`, `src/screens`…).

## Próximos passos
1. **3.2 — Interface em PT-BR** usando a nova lógica:
   - `src/telas/` (TelaAbertura, TelaBatalha, TelaColecao, TelaAjustes), `src/componentes/`,
     `src/ganchos/useJogo.tsx` (store externo com `useSyncExternalStore`), `src/audio/som.ts`.
   - Remover ovos da UI (HatchModal, EggsPanel, Egg). Painel do time: espécies não compradas
     mostram silhueta + preço + botão "Comprar".
   - Modal de evolução vira "Nova armadura!". Botão de nível mostra "MÁX" no Nv 1000.
   - Apagar as pastas antigas em inglês e `src/game/game.test.ts`.
2. **3.3 — Arte**: 6 espécies no guia (Tricerátops azul, Estegossauro verde, Braquiossauro
   amarelo, Anquilossauro roxo, Velociraptor vermelho, T-Rex laranja), perspectiva 3/4
   (truque: dois olhos visíveis, o de trás menor), menos chibi. Armaduras por peça
   (`capacete`, `dorso`, `ombreira`, `caneleiras`, `cauda`) ancoradas por espécie, com cor do
   material de `dados/armaduras.ts`.
   - Suporte opcional a imagens: se existir `src/Images/Dinossauros/<id>/armadura_<N>.webp`,
     usar a imagem; senão, o SVG.
3. Atualizar CLAUDE.md/memory.md, commit e push ao fim de cada subetapa.

## Decisões do usuário (não reverter sem perguntar)
- Jogo é **idle de batalha**, não educativo. Público "criança maior/geral" para os números do
  combate; o **visual dos dinossauros** segue o guia (amigável, 4+).
- **Sem ovos**: dinossauros são comprados com ouro.
- **Nível máximo 1000**; armadura nova a cada 100 níveis; o modelo das armaduras será definido
  depois por prompt (manter o sistema orientado a dados).
- **6 espécies do guia** (Apatossauro foi substituído pelo Braquiossauro).
- **PT-BR** em nomes de código. Narração só em botões 🔊 explícitos (sem narrar a interface).
- Commit e push constantes; manter CLAUDE.md e memory.md atualizados.

## Balanceamento atual (npm run simular, jogador ativo)
1 min → fase 9 · 5 min → fase 25 · ~15 min → 1ª armadura · <1 h → 6 espécies · 1 h → fase 50,
2ª armadura · 4 h → fase 65, 3ª armadura · 8 h → fase 70. Nv 1000 é meta de longo prazo.

## Armadilhas conhecidas
- **TypeScript 7** (nativo) não tem API JS (`require('typescript')` sem `createLanguageService`).
- **Painel do navegador do app** às vezes fica `document.hidden = true`: screenshots ficam velhas
  e o loop de batalha pausa (proposital). Verificar pelo DOM ou trazer a aba para frente.
- Para injetar saves de teste no navegador, o app salva em `pagehide` **e** em
  `visibilitychange`; registre seu listener depois e escreva nos dois eventos.
- Emoji 🪙 não renderiza no Windows 10 → usar 💰.
- Com DPS muito alto o inimigo é trocado a cada tick: animação de entrada deve ser curta e
  nunca invisível (`enemy-in` no CSS).
- Git no Windows: `.gitattributes` força LF.
