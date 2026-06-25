# 🏸 BadmintonPerf

Application **mobile** (Capacitor + Vue 3) pour **suivre et analyser les performances** d'un joueur de
badminton : suivi de matchs **en live**, score automatique (21 pts, écart 2, plafond 30, best of 3),
**tag des coups** (smash, amorti, dégagement…) et **statistiques** de progression. 100 % **hors-ligne**.

## ✨ Fonctionnalités
- **Suivi live d'un match** : score en temps réel, sets, deux gros boutons « Mon point / Point adverse ».
- **Détail du point** : nature (Gagnant / Faute) + coup (Smash, Amorti, Dégagement, Drive, Filet, Service).
- **Tableau de bord** : taux de victoire, points gagnés %, fautes/match, forme récente.
- **Stats** : coups gagnants vs fautes, **répartition des coups gagnants**.
- **Profil** joueur (nom, main, niveau, club). Données en **localStorage** (offline).

## 🧱 Stack
Vue 3 (`<script setup>`) · Vite · Pinia · Vue Router · **Capacitor** (iOS / Android).

## 🚀 Démarrer (web / dev)
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de prod dans dist/
```

## 📱 Build mobile (Capacitor)
```bash
npm run build                 # génère dist/
npx cap add android           # (ou: npx cap add ios)   — une seule fois
npx cap sync                  # copie le build web dans le projet natif
npx cap open android          # ouvre Android Studio -> Run sur émulateur/téléphone
```
> Prérequis : Android Studio (Android) ou Xcode (iOS). `capacitor.config.json` est déjà prêt
> (`appId: com.astowny.badmintonperf`).

## 🗺️ Idées d'évolution
- Capteurs du téléphone (Capacitor Motion) : intensité de déplacement / cadence par set.
- Stockage **SQLite** (Capacitor) au lieu de localStorage pour de gros historiques.
- Graphiques d'évolution (taux de victoire / points% par match).
- Heatmap des zones du terrain, minutage des échanges.
- Multi-joueurs / comparaison, export CSV/PDF du match.

## 📁 Structure
```
src/
  components/AppShell.vue   navigation (bottom-nav mobile)
  views/                    Dashboard, Matches, LiveMatch, Stats, Profile
  stores/perf.js            Pinia + logique de score badminton + stats + persistance
  router/index.js           routes (hash history, compatible WebView)
  style.css                 design system
capacitor.config.json       config app native
```
