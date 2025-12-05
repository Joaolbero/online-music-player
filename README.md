# 🎧 Online Music Player

[//]: # (Badges)
<p align="center">
  <!-- Ajustar depois com o nome real do repositório -->
  <a href="https://github.com/Joaolbero/online-music-player">
    <img alt="Repo size" src="https://img.shields.io/github/repo-size/Joaolbero/online-music-player?style=for-the-badge">
  </a>
  <a href="https://github.com/Joaolbero/online-music-player">
    <img alt="Last commit" src="https://img.shields.io/github/last-commit/Joaolbero/online-music-player?style=for-the-badge">
  </a>
  <a href="https://github.com/Joaolbero/online-music-player/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/Joaolbero/online-music-player?style=for-the-badge">
  </a>
  <a href="https://github.com/Joaolbero/online-music-player/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/Joaolbero/online-music-player?style=for-the-badge">
  </a>
</p>

---

## 📌 Visão geral · Overview

| 🇧🇷 PT-BR | 🇺🇸 EN |
| --- | --- |
| O **Online Music Player** é um player de música em HTML, CSS e JavaScript, com visual futurista em neon azul, suporte a temas _dark/light_ e carregamento de faixas locais. O usuário pode adicionar arquivos de áudio do próprio computador, controlar a reprodução, volume, atalho de teclado e visualizar a playlist com indicação de faixa atual e próxima. | **Online Music Player** is a music player built with HTML, CSS and JavaScript, featuring a futuristic neon blue look, dark/light themes and local file loading. Users can add audio files from their computer, control playback and volume, use keyboard shortcuts and see the playlist with “now playing” and “up next” indicators. |

---

## 🎼 Funcionalidades · Features

| 🇧🇷 PT-BR | 🇺🇸 EN |
| --- | --- |
| ✅ Reprodução de faixas locais (`input type="file"`) | ✅ Local track playback (`input type="file"`) |
| ✅ Playlist com título, artista, duração e status **Now / Next** | ✅ Playlist with title, artist, duration and **Now / Next** status |
| ✅ Botões: play/pause, próxima, anterior, retroceder/avançar 5s | ✅ Buttons: play/pause, next, previous, seek -5s / +5s |
| ✅ Controles de volume + mute/unmute | ✅ Volume control + mute/unmute |
| ✅ Modos **repeat** (faixa única) e **shuffle** | ✅ **Repeat one** and **shuffle** modes |
| ✅ Disco/Capa girando em sincronia com a música | ✅ Spinning disc/cover synced with playback |
| ✅ Atalhos de teclado (espaço, setas ↑ ↓ ← →) | ✅ Keyboard shortcuts (space, arrow keys ↑ ↓ ← →) |
| ✅ Segurar espaço por 3 segundos: reprodução em 2× enquanto estiver pressionado | ✅ Hold space for 3 seconds: temporary 2× playback speed |
| ✅ Tema **dark/light** com persistência em `localStorage` | ✅ **Dark/light** theme with `localStorage` persistence |
| ✅ Mini player fixo no mobile, sincronizado com o player principal | ✅ Fixed mini player on mobile, synced with main player |

---

## 🧠 Atalhos de teclado · Keyboard shortcuts

| 🇧🇷 PT-BR | 🇺🇸 EN |
| --- | --- |
| **Espaço:** play/pause | **Space:** play/pause |
| **Segurar espaço (3s):** velocidade 2× temporária | **Hold space (3s):** temporary 2× speed |
| **Seta → / ←:** avança/volta 5 segundos | **Arrow → / ←:** seek +5 / -5 seconds |
| **Seta ↑ / ↓:** aumenta/diminui o volume | **Arrow ↑ / ↓:** volume up / down |

---

## 🗂️ Estrutura do projeto · Project structure

| 🇧🇷 PT-BR | 🇺🇸 EN |
| --- | --- |
| Abaixo está um resumo da estrutura de pastas do projeto: | Below is a summary of the project folder structure: |

```text
assets/
  img/
    logo.png          # ícone do player / page icon
    favicon.png       # favicon do navegador
    default-cover.png # capa padrão das músicas
  music/
    .gitkeep          # placeholder para a pasta de músicas locais
index.html
style.css
script.js
README.md
LICENSE
.gitignore

🎵 Músicas e direitos autorais · Music and copyright

| 🇧🇷 PT-BR                                                                                                                                                                                                                                 | 🇺🇸 EN                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Por padrão, a pasta `assets/music/` **não é versionada** (veja o `.gitignore`). As faixas utilizadas nos testes (ex.: Aka Rasta, Leviano, etc.) são apenas para uso pessoal/local e **não devem ser enviadas para o repositório público**. | By default, the `assets/music/` folder is **not versioned** (see `.gitignore`). Tracks used for local tests (e.g. Aka Rasta, Leviano, etc.) are for personal/local use only and **should not be pushed to the public repository**. |
| Ao clonar o projeto, o usuário deve adicionar seus próprios arquivos `.mp3` ou outros formatos suportados dentro de `assets/music/` ou carregá-los pelo botão **“+ Add tracks”** no próprio player.                                        | When cloning the project, users must add their own `.mp3` (or other supported formats) inside `assets/music/` or load them using the **“+ Add tracks”** button in the player interface.                                            |

🚀 Como executar localmente · How to run locally

| 🇧🇷 PT-BR                                                                                                              | 🇺🇸 EN                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1. Clone o repositório:<br>`git clone https://github.com/Joaolbero/online-music-player.git`<br>`cd online-music-player` | 1. Clone the repository:<br>`git clone https://github.com/Joaolbero/online-music-player.git`<br>`cd online-music-player` |
| 2. Opcional: adicione seus `.mp3` em `assets/music/` (apenas local).                                                    | 2. Optional: add your `.mp3` files in `assets/music/` (local only).                                                      |
| 3. Abra o `index.html` no navegador ou use uma extensão de **Live Server** no VS Code.                                  | 3. Open `index.html` in your browser or use a **Live Server** extension in VS Code.                                      |
| 4. Use o botão **“+ Add tracks”** para escolher as músicas do seu computador.                                           | 4. Use the **“+ Add tracks”** button to choose songs from your computer.                                                 |

🌐 Deploy (GitHub Pages)

| 🇧🇷 PT-BR                                                                                                                         | 🇺🇸 EN                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Depois de subir o projeto, você pode publicar via **GitHub Pages** usando a branch `main` como fonte e a pasta raiz como conteúdo. | After pushing the project, you can publish it via **GitHub Pages** using the `main` branch as the source and the root folder as the site content. |

📄 Licença · License

| 🇧🇷 PT-BR                                                                                       | 🇺🇸 EN                                                                                      |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Este projeto está licenciado sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes. | This project is licensed under the **MIT** license. See the `LICENSE` file for more details. |