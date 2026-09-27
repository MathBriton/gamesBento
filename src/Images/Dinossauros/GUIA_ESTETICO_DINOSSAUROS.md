# Guia Estético de Dinossauros — Ilha dos Dinossauros

## 1. Direção visual
Estilo oficial: **Cartoon 2D infantil com contorno forte e cel shading**.

- Formas arredondadas e silhueta facilmente reconhecível.
- Cores fortes, alegres e bem separadas.
- Contorno externo escuro e evidente.
- Sombras simples e marcadas (cel shading).
- Expressões amigáveis e bastante legíveis.
- Proporções levemente exageradas.
- Aparência de personagem de jogo casual, não de ilustração científica.

## 2. Público
O jogo é destinado principalmente a crianças a partir de aproximadamente 4 anos.

Evitar aparência assustadora, sangue, ferimentos, anatomia grotesca e dentes excessivamente realistas. Mesmo predadores devem parecer divertidos e carismáticos.

## 3. Proporções
- Cabeça ligeiramente maior que a proporção real.
- Olhos grandes e expressivos.
- Corpo compacto.
- Patas relativamente grandes.
- Características próprias da espécie bem evidentes.
- Cauda claramente visível.
- Não exagerar ao ponto de virar chibi extremo.

## 4. Contorno
Todo personagem deve possuir contorno externo escuro e forte. Detalhes internos podem utilizar linhas mais finas. Evitar linhas muito finas e excesso de pequenos detalhes.

## 5. Sombreamento
Utilizar **cel shading**:
- uma cor base;
- uma região principal de sombra;
- opcionalmente um highlight simples.

Evitar iluminação fotorealista, gradientes complexos e dezenas de níveis de sombra.

## 6. Cores
Usar cores vibrantes e infantis. Não é obrigatório seguir reconstruções científicas de cores.

Exemplos:
- T-Rex: laranja;
- Tricerátops: azul;
- Estegossauro: verde;
- Velociraptor: vermelho;
- Braquiossauro: amarelo;
- Anquilossauro: roxo.

Variações poderão futuramente representar skins e raridades.

## 7. Olhos e expressão
Olhos relativamente grandes, pupila claramente visível, pequeno brilho e alta expressividade.

Expressões possíveis: feliz, curioso, determinado, surpreso, sonolento e brincalhão.

A expressão padrão deve ser amigável.

## 8. Pose
Asset principal:
- visão 3/4;
- corpo inteiro;
- personagem centralizado;
- cabeça parcialmente voltada para o jogador;
- patas e cauda visíveis;
- pose dinâmica, mas simples.

Evitar perspectivas extremas.

## 9. Fundo e formato
Assets principais devem possuir **fundo transparente**.

Master recomendado: `1024x1024`.

Exportações para o jogo:
- `512x512`;
- `256x256`;
- `128x128`.

Formato web preferencial: **WebP transparente**. PNG pode ser mantido como master/intermediário.

## 10. Performance web
Não incorporar cenários aos assets principais. Carregar imagens conforme necessário (lazy loading). Utilizar versões menores em cards e listas.

Animações iniciais podem ser feitas com CSS sobre o asset estático:
- idle: pequeno movimento vertical;
- respiração: escala muito sutil;
- clique: squash/stretch;
- felicidade: salto curto;
- dano: deslocamento lateral;
- sono: movimento lento e partículas Z.

Não depender inicialmente de GIF ou vídeo.

## 11. Identidade das espécies
Cada espécie precisa manter seus elementos reconhecíveis.

### T-Rex
Cabeça grande, braços pequenos, pernas fortes e cauda robusta.

### Tricerátops
Três chifres, grande gola óssea e corpo robusto.

### Estegossauro
Placas dorsais grandes, corpo baixo e cauda com espinhos.

### Braquiossauro
Pescoço muito longo, cabeça pequena e corpo grande.

### Anquilossauro
Corpo baixo, armadura evidente e cauda com clava.

### Velociraptor
Corpo fino e ágil, cauda longa e expressão esperta.

O estilo cartoon nunca deve eliminar os elementos que permitem reconhecer a espécie.

## 12. Consistência
Todos os dinossauros devem parecer pertencentes ao mesmo jogo.

Manter consistentes:
- espessura do contorno;
- estilo dos olhos;
- nível de detalhamento;
- cel shading;
- direção da iluminação;
- proporções gerais;
- saturação;
- perspectiva;
- qualidade visual.

Não misturar o conjunto principal com pixel art, 3D, low-poly, semi-realismo, pintura realista, anime ou flat minimalista.

## 13. Prompt-base para novos assets

```text
Criar [ESPÉCIE] para um jogo infantil de navegador.

Estilo:
- cartoon 2D;
- desenho animado infantil;
- contorno externo escuro e forte;
- cel shading;
- cores vibrantes;
- formas arredondadas;
- aparência amigável;
- olhos grandes e expressivos;
- proporções cartoon;
- espécie facilmente reconhecível;
- corpo inteiro;
- perspectiva 3/4;
- pose levemente dinâmica;
- iluminação simples e consistente;
- poucos detalhes pequenos;
- excelente legibilidade em tamanho reduzido;
- fundo transparente.

Evitar:
- realismo e semi-realismo;
- aparência assustadora;
- violência;
- texturas fotográficas;
- iluminação complexa;
- excesso de detalhes;
- cenário incorporado ao personagem.
```

## 14. Checklist de aprovação
- [ ] Parece pertencer ao mesmo jogo que os demais?
- [ ] A espécie é reconhecível imediatamente?
- [ ] O contorno está forte e consistente?
- [ ] Utiliza cel shading?
- [ ] As cores são vibrantes?
- [ ] Os olhos são expressivos?
- [ ] É amigável para uma criança?
- [ ] Continua legível em tamanho pequeno?
- [ ] O corpo inteiro está visível?
- [ ] A silhueta é clara?
- [ ] O fundo está transparente?
- [ ] Não há detalhes desnecessariamente complexos?

## 15. Prioridades para agentes
Ao gerar, selecionar ou implementar assets, seguir esta ordem:

1. Consistência visual.
2. Reconhecimento da espécie.
3. Legibilidade.
4. Aparência infantil e amigável.
5. Expressividade.
6. Performance web.
7. Detalhamento.

Quando detalhamento conflitar com legibilidade, **legibilidade vence**.

Quando realismo conflitar com a identidade visual, **Cartoon 2D vence**.

## 16. Regra de ouro
A identidade oficial dos dinossauros é:

**Cartoon 2D + contorno forte + cel shading + cores vibrantes + olhos expressivos + silhueta reconhecível + corpo inteiro + perspectiva 3/4 + fundo transparente.**

Este documento deve ser tratado como a **fonte de verdade da direção estética dos personagens** do projeto.
