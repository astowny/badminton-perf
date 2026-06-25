<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePerf, scoreboard } from '../stores/perf'

const s = usePerf()
const router = useRouter()
const show = ref(false)
const opp = ref('')
const target = ref(21)
const list = computed(() => s.matches)
const sb = (m) => scoreboard(m.points, m.target).setsWon
function create() {
  const id = s.startMatch({ opponent: opp.value.trim() || 'Adversaire', target: Number(target.value) })
  show.value = false; opp.value = ''
  router.push('/live/' + id)
}
</script>

<template>
  <div>
    <div class="page-head between"><h1>Matchs</h1><button class="btn btn-sm" @click="show = true">＋ Nouveau</button></div>

    <div class="grid">
      <router-link v-for="m in list" :key="m.id" :to="'/live/' + m.id" class="card between">
        <div><strong>vs {{ m.opponent }}</strong><div class="muted" style="font-size:.82rem">{{ m.date }} · {{ m.target }} pts</div></div>
        <div class="row gap-sm">
          <strong>{{ sb(m).me }}–{{ sb(m).opp }}</strong>
          <span v-if="m.status === 'live'" class="badge live">LIVE</span>
          <span v-else class="badge" :class="m.result">{{ m.result === 'win' ? 'V' : 'D' }}</span>
        </div>
      </router-link>
      <div v-if="!list.length" class="empty">Aucun match. Clique « Nouveau » pour commencer.</div>
    </div>

    <div v-if="show" class="sheet-bg" @click.self="show = false">
      <div class="sheet">
        <h2 style="font-size:1.1rem;font-weight:800;margin-bottom:14px">Nouveau match</h2>
        <div class="field"><label>Adversaire</label><input v-model="opp" class="input" placeholder="Nom de l'adversaire" /></div>
        <div class="field"><label>Format</label>
          <select v-model="target" class="select">
            <option :value="21">21 points</option><option :value="15">15 points</option><option :value="11">11 points</option>
          </select>
        </div>
        <button class="btn" @click="create">Démarrer le match</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sheet-bg { position: fixed; inset: 0; z-index: 100; background: rgba(20, 24, 26, .4); display: flex; align-items: flex-end; }
.sheet { background: #fff; width: 100%; border-radius: 18px 18px 0 0; padding: 20px 18px calc(20px + env(safe-area-inset-bottom)); animation: up .2s ease; }
@keyframes up { from { transform: translateY(40px); opacity: .6; } to { transform: none; opacity: 1; } }
</style>
