<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

const TABS = [
  { to: '/', label: 'Accueil', icon: 'home' },
  { to: '/matchs', label: 'Matchs', icon: 'list' },
  { to: '/stats', label: 'Stats', icon: 'chart' },
  { to: '/profil', label: 'Profil', icon: 'user' }
]
const ICONS = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  chart: '<path d="M3 3v18h18M8 17V9M13 17V5M18 17v-6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>'
}
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand"><span class="logo">🏸</span> BadmintonPerf</div>
      <div class="topbar-title">{{ route.meta.title }}</div>
    </header>

    <main class="content"><slot /></main>

    <nav class="bottomnav">
      <router-link v-for="t in TABS" :key="t.to" :to="t.to" class="bn-item">
        <svg viewBox="0 0 24 24" class="ic" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[t.icon]" />
        <span>{{ t.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.shell { display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: calc(env(safe-area-inset-top) + 12px) 18px 12px;
  background: var(--green-900); color: #fff; position: sticky; top: 0; z-index: 10;
}
.brand { font-weight: 800; letter-spacing: -0.01em; display: flex; align-items: center; gap: 7px; }
.logo { font-size: 1.15rem; }
.topbar-title { font-size: 0.85rem; color: #b9e6cf; font-weight: 600; }
.content { flex: 1; padding: 16px 16px calc(86px + env(safe-area-inset-bottom)); max-width: 720px; width: 100%; margin: 0 auto; }
.bottomnav {
  display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
  justify-content: space-around; padding: 8px 6px calc(8px + env(safe-area-inset-bottom));
  background: #fff; border-top: 1px solid var(--line);
}
.bn-item {
  display: flex; flex-direction: column; align-items: center; gap: 3px; flex: 1;
  color: var(--muted); font-size: 0.66rem; font-weight: 600; padding: 4px;
}
.bn-item .ic { width: 23px; height: 23px; }
.bn-item.router-link-active { color: var(--green-600); }
</style>
