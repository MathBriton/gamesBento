# SDD — Ilha dos Dinossauros

**Tipo:** Jogo educativo idle/gacha para navegador  
**Público-alvo:** Crianças a partir de 4 anos  
**Plataforma:** Navegadores desktop, tablet e celular  
**Versão:** 1.0

---

## 1. Visão do Produto

**Ilha dos Dinossauros** é um jogo infantil para navegador baseado em coleção, descoberta e aprendizado.

O jogador encontra ovos, choca dinossauros, coloca-os em habitats, cuida deles, envia-os para expedições e encontra fósseis para completar um museu.

O aprendizado deve acontecer dentro das próprias atividades do jogo, trabalhando principalmente:

- contagem;
- números;
- cores;
- formas;
- tamanhos;
- associação;
- memória;
- nomes de dinossauros.

O jogo não terá dinheiro real, anúncios, loot boxes pagas ou mecânicas de FOMO.

---

## 2. Loop Principal

```text
Encontrar ovo
    ↓
Chocar ovo
    ↓
Descobrir dinossauro
    ↓
Adicionar ao habitat
    ↓
Cuidar / brincar
    ↓
Completar minigames
    ↓
Ganhar estrelas
    ↓
Enviar dinossauro para exploração
    ↓
Encontrar fósseis
    ↓
Completar peças do museu
    ↓
Desbloquear novas regiões
    ↓
Encontrar novos ovos
```

---

# ETAPA 1 — Fundação do jogo

## Objetivo

Criar a aplicação web e a estrutura mínima necessária para suportar o restante do jogo.

## Requisitos

- Aplicação executada diretamente no navegador.
- Interface responsiva para desktop, tablet e celular.
- Interface adequada para touchscreen.
- Botões grandes e facilmente identificáveis.
- Pouco texto em tela.
- Priorizar ícones, imagens, animações e áudio.
- Não exigir cadastro.
- Não exigir backend no MVP.
- Salvar progresso localmente no navegador.

## Telas iniciais

1. Splash Screen.
2. Menu principal.
3. Ilha.
4. Coleção.
5. Configurações.

## Estado inicial

O jogador começa com:

- 1 região desbloqueada: Planície;
- 1 habitat;
- 1 ovo inicial;
- 0 fósseis;
- 0 estrelas ou pequena quantidade inicial configurável.

---

# ETAPA 2 — Sistema de Dinossauros

## Objetivo

Implementar as entidades principais do jogo.

## Modelo conceitual

```ts
Dinosaur {
  id
  name
  species
  rarity
  habitat
  diet
  size
  image
  unlocked
}
```

## Dinossauros iniciais

- Apatossauro
- Tiranossauro Rex
- Tricerátops
- Pteranodonte
- Anquilossauro
- Estegossauro
- Velociraptor
- Espinossauro

## Raridades

```text
Comum
Incomum
Raro
Épico
Lendário
```

A raridade deve servir apenas para coleção e descoberta, nunca para incentivar compras.

---

# ETAPA 3 — Sistema de Ovos

## Objetivo

Criar a principal mecânica de descoberta de novos dinossauros.

## Fluxo

```text
Receber ovo
    ↓
Exibir ovo fechado
    ↓
Jogador toca/clica
    ↓
Animação de rachadura
    ↓
Ovo abre
    ↓
Dinossauro aparece
    ↓
Nome é exibido e narrado
    ↓
Dinossauro entra na coleção
```

## Requisitos

- Animação simples de abertura.
- Som de ovo quebrando.
- Animação especial para primeira descoberta.
- Mostrar nome do dinossauro.
- Opcionalmente reproduzir seu nome por áudio.
- Dinossauros repetidos podem gerar estrelas ou outro recurso simples.

---

# ETAPA 4 — Coleção

## Objetivo

Permitir que a criança visualize os dinossauros encontrados.

## Interface

Grade visual semelhante a um álbum.

```text
[🦕] [🦖] [?]
[🦏] [?]  [?]
```

Dinossauros não encontrados aparecem como silhuetas.

## Tela de detalhes

Ao selecionar um dinossauro mostrar:

- imagem;
- nome;
- tamanho;
- alimentação;
- habitat;
- curiosidade curta;
- botão para ouvir o nome.

Evitar grandes blocos de texto.

---

# ETAPA 5 — Habitats

## Objetivo

Dar aos dinossauros um espaço dentro da ilha.

## Regiões planejadas

```text
🌿 Planície
🌴 Selva
❄️ Montanhas
🏜️ Deserto
🌋 Vulcão
🏖️ Costa
```

## Interações

Cada dinossauro poderá receber ações simples:

- alimentar;
- brincar;
- fazer carinho;
- observar.

As ações devem produzir pequenas animações e sons.

---

# ETAPA 6 — Sistema Idle / Expedições

## Objetivo

Permitir progresso passivo sem exigir que a criança permaneça jogando.

## Fluxo

```text
Selecionar dinossauro
    ↓
Selecionar expedição
    ↓
Dinossauro parte
    ↓
Timer é iniciado
    ↓
Jogador pode fechar o jogo
    ↓
Tempo é calculado ao retornar
    ↓
Expedição concluída
    ↓
Receber recompensa
```

## Durações sugeridas

- 1 minuto
- 5 minutos
- 10 minutos
- 30 minutos
- 1 hora

## Recompensas

- fósseis;
- estrelas;
- ovos;
- itens cosméticos.

## Regra técnica

Não depender de um timer JavaScript continuamente ativo.

Salvar um `endTimestamp` da expedição e comparar com o horário atual quando o jogo for aberto novamente.

---

# ETAPA 7 — Museu de Fósseis

## Objetivo

Criar uma segunda coleção ligada às expedições.

Cada espécie possui um conjunto de fósseis.

Exemplo:

```text
TRICERÁTOPS

8 / 10 fósseis
████████░░
```

Ao completar todos os fósseis:

- montar o esqueleto;
- executar animação;
- tocar efeito sonoro;
- desbloquear curiosidade;
- entregar recompensa.

---

# ETAPA 8 — Minigames Educativos

## Objetivo

Integrar aprendizado ao progresso normal do jogo.

### Contagem

```text
Dê 3 maçãs ao Tricerátops.

🍎 🍎 🍎 🍎 🍎
```

### Cores

```text
Encontre o ovo azul.

🔵 🟢 🔴
```

### Tamanhos

```text
Qual dinossauro é maior?
```

### Formas

```text
Qual peça encaixa aqui?

△  ○  □
```

### Associação

```text
Qual alimento combina com este dinossauro?

🌿   🥩
```

### Memória

Cartas simples com pares de dinossauros.

## Regras de UX

- instruções curtas;
- suporte a narração;
- feedback positivo ao acertar;
- permitir nova tentativa ao errar;
- evitar mensagens negativas como "Você perdeu";
- dificuldade progressiva.

---

# ETAPA 9 — Progressão da Ilha

## Objetivo

Transformar as funcionalidades isoladas em uma jornada.

Progressão inicial:

```text
🌿 Planície
    ↓
🌴 Selva
    ↓
🏖️ Costa
    ↓
❄️ Montanhas
    ↓
🏜️ Deserto
    ↓
🌋 Vulcão
```

Cada região desbloqueia:

- novos dinossauros;
- novos ovos;
- novos fósseis;
- novos cenários;
- novas expedições;
- variações dos minigames.

---

# ETAPA 10 — Economia

## Recursos principais

### ⭐ Estrelas

Obtidas por:

- minigames;
- cuidado dos dinossauros;
- expedições;
- completar fósseis.

Utilizadas para:

- desbloquear ovos;
- melhorar habitats;
- liberar elementos cosméticos.

### 🦴 Fósseis

Utilizados exclusivamente no museu.

### 🥚 Ovos

Utilizados para desbloquear novos dinossauros.

## Restrições

Não implementar:

- dinheiro real;
- anúncios;
- energia que impeça a criança de jogar;
- punição por ausência;
- recompensas vinculadas a horários específicos;
- mecânicas de pressão para retornar ao jogo.

---

# ETAPA 11 — Áudio e Acessibilidade

## Áudio

O jogo poderá narrar:

- nomes dos dinossauros;
- números;
- cores;
- instruções dos minigames;
- mensagens importantes.

## Configurações

Permitir:

- ativar/desativar música;
- ativar/desativar efeitos;
- ativar/desativar narração;
- ajustar volume.

## UX infantil

- áreas de toque grandes;
- contraste adequado;
- nenhuma ação importante dependendo apenas de texto;
- evitar menus profundos;
- máximo de poucas escolhas simultâneas.

---

# ETAPA 12 — Persistência

## MVP

Salvar localmente:

```text
player
collection
eggs
stars
fossils
habitats
expeditions
unlockedRegions
settings
```

Pode ser utilizado `localStorage` inicialmente.

Se o estado crescer significativamente, migrar para `IndexedDB`.

## Futuro

Backend poderá ser adicionado posteriormente para:

- sincronização entre dispositivos;
- perfis;
- backup do progresso;
- painel dos pais.

O funcionamento básico do jogo não deverá depender de conexão constante com a internet.

---

# ETAPA 13 — PWA

## Objetivo

Permitir experiência semelhante a um aplicativo mantendo o jogo como aplicação web.

Implementar posteriormente:

- Web App Manifest;
- Service Worker;
- cache dos assets;
- funcionamento offline;
- instalação na tela inicial;
- ícone próprio;
- splash screen.

---

# ETAPA 14 — Arquitetura sugerida

## Stack

```text
Frontend
├── React
├── TypeScript
├── Vite
├── CSS / Tailwind CSS
└── Web APIs

Persistência
├── localStorage (MVP)
└── IndexedDB (evolução)

PWA
├── Web App Manifest
└── Service Worker

Backend
└── Não necessário inicialmente
```

## Organização conceitual

```text
src/
├── components/
├── screens/
├── game/
│   ├── dinosaurs/
│   ├── eggs/
│   ├── habitats/
│   ├── expeditions/
│   ├── fossils/
│   ├── minigames/
│   └── progression/
├── data/
├── audio/
├── assets/
├── storage/
├── hooks/
├── types/
└── utils/
```

A lógica do jogo deve permanecer separada dos componentes visuais sempre que possível.

---

# ETAPA 15 — MVP

O primeiro MVP **não deve implementar o jogo inteiro**.

## Escopo do MVP

```text
1 região: Planície
1 habitat
3 dinossauros
1 tipo de ovo
Sistema de abertura de ovos
Coleção
Alimentação
Estrelas
1 minigame de contagem
1 expedição
Sistema idle
3 tipos de fósseis
Persistência local
Áudio básico
```

## Dinossauros do MVP

- Tricerátops
- Tiranossauro Rex
- Apatossauro

## Critério de conclusão

O MVP estará completo quando for possível executar todo este ciclo:

```text
Abrir jogo
→ receber ovo
→ chocar ovo
→ descobrir dinossauro
→ colocar no habitat
→ alimentar
→ completar minigame
→ receber estrelas
→ iniciar expedição
→ fechar o navegador
→ retornar posteriormente
→ receber fósseis
→ visualizar coleção/museu
→ progresso continuar salvo
```

---

# ETAPA 16 — Roadmap de Desenvolvimento

```text
FASE 1 — Protótipo
├── Estrutura web
├── Ilha
├── Habitat
├── 3 dinossauros
└── Persistência

FASE 2 — Core Gameplay
├── Ovos
├── Coleção
├── Alimentação
├── Estrelas
└── Animações

FASE 3 — Educação
├── Contagem
├── Cores
├── Formas
├── Tamanhos
└── Associação

FASE 4 — Idle
├── Expedições
├── Timers persistentes
├── Recompensas
└── Retorno offline

FASE 5 — Museu
├── Fósseis
├── Esqueletos
├── Coleção
└── Curiosidades

FASE 6 — Mundo
├── Novas regiões
├── Novos habitats
├── Novos dinossauros
└── Progressão

FASE 7 — Polimento
├── Áudio
├── Narração
├── Animações
├── Responsividade
├── Touch
└── Acessibilidade

FASE 8 — PWA
├── Offline
├── Instalação
├── Cache
└── Ícones / Splash
```

---

# 17. Princípios do Projeto

1. A criança deve conseguir navegar sem saber ler.
2. Cada ação importante deve possuir representação visual clara.
3. Aprendizado deve fazer parte da brincadeira.
4. Erros devem permitir tentativa novamente sem punição.
5. O jogo deve funcionar em sessões curtas.
6. O progresso idle nunca deve punir ausência.
7. Nenhuma funcionalidade infantil dependerá de pagamento.
8. O MVP deve permanecer pequeno antes da expansão do conteúdo.
9. Conteúdo e regras do jogo devem ser orientados por dados para facilitar a inclusão de novos dinossauros e regiões.
10. O jogo deverá priorizar funcionamento local e rápido no navegador.

---

# 18. Objetivo de Longo Prazo

Evoluir gradualmente de um pequeno jogo de três dinossauros para uma ilha completa contendo dezenas de espécies, múltiplos habitats, museu, expedições e atividades educativas, mantendo a arquitetura simples o suficiente para que novas funcionalidades sejam adicionadas sem reescrever o núcleo do jogo.
