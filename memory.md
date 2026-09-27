# memory.md — passagem de trabalho entre agentes

> Leia isto primeiro ao assumir o projeto. Atualize ao fim de cada etapa (o que foi feito,
> o que falta, decisões e armadilhas). Referência estável do projeto: [CLAUDE.md](CLAUDE.md).

## Estado atual (2026-09-27)
- Repositório: `https://github.com/MathBriton/gamesBento.git`, branch `main` (tudo commitado e enviado).
- **Etapa 3 concluída**: todo o código em PT-BR; dinossauros comprados com ouro (sem ovos);
  6 espécies do guia estético; nível máximo 1000; armadura nova a cada 100 níveis.
- Verificado no navegador (celular 375x812): compra, subir nível, "Nova armadura!" no Nv 100,
  "MÁX" no Nv 1000, coleção com linha de armaduras, migração de save v3 → v4.
- `npm test` (19 testes), `npm run build` e `npx tsc -b` passam.

## Próximos passos (sugestões — confirmar com o usuário)
1. **Modelo definitivo das armaduras**: o usuário vai descrever por prompt. Mudar dados em
   `src/dados/armaduras.ts`, desenho em `src/componentes/dino/Armadura.tsx`, posições em
   `src/componentes/dino/ancoras.ts`. Revisar tudo em `?galeria`.
2. **Assets de imagem** (opcional): WebP em `src/Images/Dinossauros/<id>/armadura_<N>.webp`
   substituem o SVG automaticamente (ver CLAUDE.md).
3. **Renascimento/prestígio**: pelo balanceamento, o progresso desacelera depois de ~4 h;
   Nv 1000 é meta de muito longo prazo sem prestígio.
4. **Habilidades ativas** (ex.: Fúria, Chuva de ouro).
5. PWA (manifest + service worker) para instalar no celular.

## Decisões do usuário (não reverter sem perguntar)
- Jogo é **idle de batalha**, não educativo. Números de combate para "criança maior/geral";
  **visual dos dinossauros** segue o guia (amigável, 4+). O SDD na raiz está desatualizado.
- **Sem ovos**: dinossauros são comprados com ouro, em ordem de preço.
- **Nível máximo 1000**; armadura nova a cada 100 níveis; modelo definitivo virá por prompt.
- **6 espécies do guia** (Apatossauro virou Braquiossauro; saves antigos migram).
- **PT-BR** em nomes de código e classes CSS (exceto convenções: `App`, `main.tsx`, `use*`).
- Narração só em botões 🔊 explícitos (nada de narrar a interface).
- Commit e push constantes; manter CLAUDE.md e memory.md atualizados a cada etapa.

## Balanceamento atual (npm run simular, jogador ativo)
1 min → fase 9 · 5 min → fase 25 · ~15 min → 1ª armadura · <1 h → 6 espécies · 1 h → fase 50,
2ª armadura · 4 h → fase 65, 3ª armadura · 8 h → fase 70.

## Armadilhas conhecidas
- **TypeScript 7** (nativo) não tem API JS (`require('typescript')` sem language service).
- **Painel do navegador do app** às vezes fica `document.hidden = true`: screenshots ficam
  velhas e o loop de batalha pausa (proposital). Verifique pelo DOM; tente de novo depois.
- A ferramenta de JS do navegador às vezes **reexecuta** scripts; prefira scripts idempotentes.
- Para injetar saves de teste, o app salva em `pagehide` **e** `visibilitychange`; registre seu
  listener depois e escreva nos dois eventos antes de `location.reload()`.
- Emoji 🪙 não renderiza no Windows 10 → usar 💰. Evite emojis muito novos.
- Com dano alto o inimigo é trocado a cada tick: animação de entrada curta e nunca invisível.
- Números passam de 10^60 no Nv 1000: `formatarNumero` tem sufixos até `Vg` e depois usa `e`.
- Git no Windows: `.gitattributes` força LF.
