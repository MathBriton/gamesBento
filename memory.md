# memory.md — passagem de trabalho entre agentes

> Leia isto primeiro ao assumir o projeto. Atualize ao fim de cada etapa (o que foi feito,
> o que falta, decisões e armadilhas). Referência estável do projeto: [CLAUDE.md](CLAUDE.md).

## Estado atual (2026-09-27)
- Repositório: `https://github.com/MathBriton/gamesBento.git`, branch `main` (tudo commitado e enviado).
- **Etapa 4 concluída**:
  - Moedas: ícone SVG (`IconeMoeda`) no lugar do 💰; campo `ouro` → `moedas` (save v5).
  - 9 monstros mitológicos infantis: lobisomem, vampiro, troll, lobo do gelo/Fenrir,
    serpente do mar/Jörmungandr, ciclope, minotauro, medusa, cérbero (chefão = coroa + olhar determinado).
  - 6 zonas temáticas (a cada 10 fases), cada uma com monstros, chefão e cenário ilustrado.
  - Tudo revisável em `?galeria`.
- Verificado no navegador (celular 375x812) com o save real do usuário (migrou para v5 sem perdas).
- `npm test` (23 testes), `npm run build` e `npx tsc -b` passam.

## Próximos passos (sugestões — confirmar com o usuário)
1. **Modelo definitivo das armaduras**: o usuário vai descrever por prompt. Mudar dados em
   `src/dados/armaduras.ts`, desenho em `src/componentes/dino/Armadura.tsx`, posições em
   `src/componentes/dino/ancoras.ts`. Revisar em `?galeria`.
2. Mais monstros/zonas (ver "Adicionar monstro ou zona" no CLAUDE.md).
3. **Assets de imagem** (opcional): WebP em `src/Images/Dinossauros/<id>/armadura_<N>.webp`.
4. **Renascimento/prestígio**: o progresso desacelera depois de ~4 h; Nv 1000 é meta de longo prazo.
5. **Habilidades ativas** (ex.: Fúria, Chuva de moedas). PWA para instalar no celular.

## Decisões do usuário (não reverter sem perguntar)
- Jogo é **idle de batalha**, não educativo. Números de combate para "criança maior/geral";
  **visual** amigável (guia estético, 4+). O SDD na raiz está desatualizado.
- **Sem ovos**: dinossauros são comprados com moedas, em ordem de preço.
- **Nível máximo 1000**; armadura nova a cada 100 níveis; modelo definitivo virá por prompt.
- **6 espécies do guia** (Apatossauro virou Braquiossauro; saves antigos migram).
- **Monstros**: mitologia grega, nórdica, vampiros e lobisomens — sempre "infantilizados".
- **Recurso = "moedas"**, com ícone de moeda (não saco de dinheiro).
- **PT-BR** em nomes de código e classes CSS (exceto convenções: `App`, `main.tsx`, `use*`).
- Narração só em botões 🔊 explícitos (nada de narrar a interface).
- Commit e push constantes; manter CLAUDE.md e memory.md atualizados a cada etapa.

## Balanceamento atual (npm run simular, jogador ativo)
1 min → fase 9 · 5 min → fase 25 · ~15 min → 1ª armadura · <1 h → 6 espécies · 1 h → fase 50,
2ª armadura · 4 h → fase 65, 3ª armadura · 8 h → fase 70. (Zonas não mudam o balanceamento.)

## Armadilhas conhecidas
- **O usuário joga no painel do navegador do app**: não apague nem injete dados no save sem pedir.
- **TypeScript 7** (nativo) não tem API JS (`require('typescript')` sem language service).
- **Painel do navegador** às vezes fica `document.hidden = true`: screenshots ficam velhas e o loop
  de batalha pausa (proposital). Verifique pelo DOM; tente o screenshot de novo.
- A ferramenta de JS do navegador às vezes **reexecuta** scripts; prefira scripts idempotentes.
- Para injetar saves de teste, o app salva em `pagehide` **e** `visibilitychange`; registre seu
  listener depois e escreva nos dois eventos antes de `location.reload()`.
- No Bash, crases (\`) dentro de `node -e "..."` são interpretadas pelo shell e somem do texto:
  use a ferramenta Edit/Write para trechos com crase.
- Com dano alto o inimigo é trocado a cada tick: animação de entrada curta e nunca invisível.
- Números passam de 10^60 no Nv 1000: `formatarNumero` tem sufixos até `Vg` e depois usa `e`.
- Git no Windows: `.gitattributes` força LF.
