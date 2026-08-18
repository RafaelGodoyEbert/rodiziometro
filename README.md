# 🍕 Rodiziômetro

> **O placar definitivo e contador competitivo em tempo real para rodízios de pizza, sushi, hambúrguer, churrasco e muito mais!**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## 📖 Sobre o Projeto

O **Rodiziômetro** nasceu para resolver a maior rivalidade entre amigos e familiares: **quem realmente comeu mais no rodízio?** 

Chega de discussões, anotações em guardanapo ou contas de cabeça. Com o Rodiziômetro, basta criar uma mesa, convidar os amigos via **QR Code** ou **link de convite**, e cada um registra o que come com apenas 1 toque. Tudo é sincronizado **em tempo real** via Server-Sent Events (SSE).

---

## ✨ Principais Funcionalidades

### ⚡ Contador Rápido e Otimista
- **1-Tap Increment**: Adicione fatias, peças de sushi, hambúrgueres ou bebidas instantaneamente.
- **Feedback & Desfazer Rápido (Undo)**: Toast com opção de desfazer imediato para evitar cliques errados.
- **Catálogo Inteligente**: Itens pré-configurados para Rodízios de Pizza, Sushi, Carnes/Churrasco, Hambúrguer, Massas e Doces.
- **Itens Customizados**: Adicione qualquer prato ou item especial daquele restaurante com emojis e pontos personalizados.

### 🏆 Batalha da Mesa & Placar em Tempo Real
- **Leaderboard ao Vivo**: Veja a posição de cada integrante mudando a cada mordida.
- **Coroas Temáticas**: Títulos dinâmicos como *"Rei da Pizza 🍕"*, *"Rei do Sushi 🍣"*, *"Rei da Carne 🥩"*, *"Rei do Doce 🍰"*.
- **Sistema de Conquistas (Badges)**:
  - 🍕 *Aquecimento Concluído* (10 itens)
  - 🍣 *Agora Começou* (20 itens)
  - 🔥 *Alerta na Cozinha* (30 itens)
  - 💀 *Falência Técnica do Restaurante* (50 itens)
  - 🌟 *Provador Profissional* (Variedade de pratos)
  - 🍰 *Espaço Reserva* (Sobremesas)

### 📊 Curiosidades & Nutrição Estimada
- **Estimativa de Calorias**: Faixa estimada de kcal totais da mesa e por pessoa.
- **Macronutrientes**: Cálculo aproximado de Proteínas, Carboidratos, Gorduras e Peso total consumido em Kg.
- **Ritmo de Consumo**: Medição do tempo médio por item (segundos/item) e streaks de consumo (janela de 15 minutos).
- **Prato Favorito**: Identificação automática do item mais consumido pela mesa.

### 👥 Multijogador & Modo Solo
- **Mesas com Código & QR Code**: Crie uma sala em 2 segundos e compartilhe a câmera para que amigos entrem instantaneamente.
- **Modo Solo / Offline**: Vai ao rodízio sozinho ou está sem sinal? Use o modo local com persistência de recordes no dispositivo.
- **Resumo Final & Recordes Pessoais**: Encerre a mesa com um relatório completo das estatísticas e salve seu recorde pessoal.

### 📱 PWA (Progressive Web App)
- Instale diretamente no celular (iOS/Android) como um app nativo, sem necessidade de baixar pela App Store ou Google Play.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Ferramenta / Biblioteca |
|---|---|
| **Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animações & Ícones** | [Motion (Framer Motion)](https://motion.dev/), [Lucide React](https://lucide.dev/) |
| **Compartilhamento** | [QRCode](https://www.npmjs.com/package/qrcode) |
| **Backend & Realtime** | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), Server-Sent Events (SSE) |
| **Tooling & Build** | [Vite](https://vitejs.dev/), [esbuild](https://esbuild.github.io/), [tsx](https://github.com/privatenumber/tsx) |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- `npm`, `pnpm` ou `bun`

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/rodiziometro.git
   cd rodiziometro
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no seu navegador:**
   ```text
   http://localhost:3000
   ```

---

## 📦 Scripts Disponíveis

- `npm run dev`: Inicia o servidor Express + Vite em modo de desenvolvimento (Porta `3000`).
- `npm run build`: Compila o frontend React para `dist/` e empacota o backend com esbuild em `dist/server.cjs`.
- `npm run start`: Executa o build de produção a partir de `dist/server.cjs`.
- `npm run lint`: Executa a checagem de tipos do TypeScript sem emitir arquivos (`tsc --noEmit`).

---

## 📂 Estrutura de Pastas

```text
├── public/                # Manifesto PWA, Service Worker e ícones estáticos
├── server.ts              # Servidor Express, endpoints de salas e streaming SSE
├── src/
│   ├── components/
│   │   ├── battle/        # Tab de Batalha (Leaderboard, Coroas e Conquistas)
│   │   ├── common/        # Header, Bottom Navigation e componentes base
│   │   ├── counter/       # Tab do Contador, botões de incremento e modal de comida customizada
│   │   ├── curiosities/   # Tab de Estatísticas, Nutrição (Kcal, Kg) e Curiosidades
│   │   ├── home/          # Tela inicial (Criar mesa, Entrar, Modo Solo, Recordes)
│   │   ├── pwa/           # Banner de instalação PWA
│   │   ├── room/          # Gerenciamento de mesa, QR Code e convites
│   │   └── summary/       # Tela de resumo e encerramento de rodízio
│   ├── domain/
│   │   ├── eventStore.ts      # Armazenamento local (localStorage), IDs e persistência
│   │   ├── foodCatalog.ts     # Catálogo padrão de alimentos e pontuações
│   │   └── statsCalculator.ts # Algoritmos de ranking, coroas, streaks e métricas
│   ├── types/
│   │   └── index.ts       # Definições de tipos TypeScript do projeto
│   ├── App.tsx            # Componente raiz da aplicação e sincronização de estado
│   ├── main.tsx           # Ponto de entrada do React
│   └── index.css          # Estilos globais e Tailwind CSS
├── package.json           # Dependências e scripts
├── tsconfig.json          # Configuração do TypeScript
└── vite.config.ts         # Configuração do Vite
```

---

## 💡 Ideias Futuras / Roadmap

- [ ] Exportação de recibo/card em imagem para compartilhar no Instagram Stories / WhatsApp
- [ ] Modo "Calculadora de Divisão de Conta" (quem comeu menos paga menos?)
- [ ] Histórico de rodízios anteriores com gráficos de evolução
- [ ] Ranking global de restaurantes avaliados pela comunidade

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<p align="center">
  Desenvolvido com 🍕 e 🍣 para quem não tem medo de rodízio!
</p>
