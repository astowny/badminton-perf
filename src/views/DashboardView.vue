<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePerf, scoreboard } from '../stores/perf'

const s = usePerf()
const router = useRouter()
const newMatch = () => { const id = s.startMatch({ opponent: 'Adversaire' }); router.push('/live/' + id) }
const last = computed(() => s.done[0] || null)
const lastScore = computed(() => (last.value ? scoreboard(last.value.points, last.value.target).setsWon : null))
</script>

<template>
  <div>
    <div class="page-head"><h1>Salut {{ s.profile.name }} 🏸</h1><p>Tes performances au badminton</p></div>

    <button class="btn" @click="newMatch">＋ Démarrer un match</button>

    <div class="grid grid-2" style="margin-top:14px">
      <div class="card stat accent"><div class="v">{{ s.winRate === null ? '—' : s.winRate + '%' }}</div><div class="l">Taux de victoire</div></div>
      <div class="card stat"><div class="v">{{ s.totalMatches }}</div><div class="l">Matchs joués</div></div>
      <div class="card stat"><div class="v">{{ s.pointsWonPct === null ? '—' : s.pointsWonPct + '%' }}</div><div class="l">Points gagnés</div></div>
      <div class="card stat"><div class="v">{{ s.errorsPerMatch === null ? '—' : s.errorsPerMatch }}</div><div class="l">Fautes / match</div></div>
    </div>

    <div class="section-title">Forme récente</div>
    <div class="card">
      <div class="row gap-sm" v-if="s.recentForm.length">
        <span v-for="(r, i) in s.recentForm" :key="i" class="formdot" :class="r">{{ r === 'win' ? 'V' : 'D' }}</span>
      </div>
      <div class="empty" v-else>Aucun match terminé. Lance ton premier match !</div>
    </div>

    <template v-if="last">
      <div class="section-title">Dernier match</div>
      <router-link :to="'/live/' + last.id" class="card between">
        <div><strong>vs {{ last.opponent }}</strong><div class="muted" style="font-size:.82rem">{{ last.date }}</div></div>
        <div class="row gap-sm">
          <strong>{{ lastScore.me }}–{{ lastScore.opp }}</strong>
          <span class="badge" :class="last.result">{{ last.result === 'win' ? 'Victoire' : 'Défaite' }}</span>
        </div>
      </router-link>
    </template>
  </div>
</template>

<style scoped>
.formdot { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: .8rem; color: #fff; background: var(--muted); }
.formdot.win { background: var(--green-600); }
.formdot.loss { background: var(--red); }
</style>
