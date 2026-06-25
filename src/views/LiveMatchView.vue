<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePerf, scoreboard, SHOTS, KINDS } from '../stores/perf'

const s = usePerf()
const route = useRoute()
const router = useRouter()
const m = computed(() => s.matchById(route.params.id))
const sb = computed(() => (m.value ? scoreboard(m.value.points, m.value.target) : null))
const lastPoint = computed(() => m.value?.points[m.value.points.length - 1] || null)

const point = (w) => s.addPoint(route.params.id, w)
function tag(field, val) {
  const p = lastPoint.value
  if (!p) return
  s.tagLastPoint(route.params.id, { [field]: p[field] === val ? null : val })
}
function remove() {
  if (confirm('Supprimer définitivement ce match ?')) { s.deleteMatch(route.params.id); router.push('/matchs') }
}
</script>

<template>
  <div v-if="m">
    <div class="between" style="margin-bottom:10px">
      <button class="btn btn-ghost btn-sm" @click="router.back()">‹ Retour</button>
      <span v-if="m.status === 'live'" class="badge live">LIVE</span>
      <span v-else class="badge" :class="m.result">{{ m.result === 'win' ? 'Victoire' : 'Défaite' }}</span>
    </div>

    <div class="card scorecard">
      <div style="text-align:center;font-size:.85rem;color:#b9e6cf">vs {{ m.opponent }} · {{ m.target }} pts</div>
      <div class="sets">
        <div class="side"><div class="name">Moi</div><div class="score">{{ sb.currentSet.me }}</div><div class="setswon">Sets {{ sb.setsWon.me }}</div></div>
        <div class="vs">–</div>
        <div class="side"><div class="name">{{ m.opponent }}</div><div class="score">{{ sb.currentSet.opp }}</div><div class="setswon">Sets {{ sb.setsWon.opp }}</div></div>
      </div>
      <div class="setline" v-if="sb.sets.length > 1">
        <span v-for="(st, i) in sb.sets" :key="i" class="setpill">{{ st.me }}-{{ st.opp }}</span>
      </div>
    </div>

    <template v-if="m.status === 'live'">
      <div class="grid grid-2" style="margin-top:14px">
        <button class="btn bigpt me" @click="point('me')">＋<br />Mon point</button>
        <button class="btn bigpt opp" @click="point('opp')">＋<br />Point adverse</button>
      </div>
      <button class="btn btn-ghost btn-sm" style="margin-top:10px;width:100%" :disabled="!m.points.length" @click="s.undoLastPoint(route.params.id)">↶ Annuler le dernier point</button>

      <template v-if="lastPoint">
        <div class="section-title">Détail du dernier point ({{ lastPoint.winner === 'me' ? 'Moi' : m.opponent }})</div>
        <div class="card">
          <div class="muted" style="font-size:.78rem;margin-bottom:8px">Nature</div>
          <div class="row gap-sm wrap" style="margin-bottom:14px">
            <button v-for="k in KINDS" :key="k" class="chip" :class="{ active: lastPoint.kind === k }" @click="tag('kind', k)">{{ k }}</button>
          </div>
          <div class="muted" style="font-size:.78rem;margin-bottom:8px">Coup</div>
          <div class="row gap-sm wrap">
            <button v-for="sh in SHOTS" :key="sh" class="chip" :class="{ active: lastPoint.shot === sh }" @click="tag('shot', sh)">{{ sh }}</button>
          </div>
        </div>
      </template>
    </template>

    <template v-else>
      <div class="card" style="margin-top:14px;text-align:center">
        <div style="font-size:1.05rem;font-weight:800">{{ m.result === 'win' ? '🏆 Match gagné !' : 'Match perdu' }}</div>
        <button class="btn" style="margin-top:12px" @click="router.push('/stats')">Voir mes stats</button>
      </div>
    </template>

    <button class="btn btn-red btn-sm" style="margin-top:22px;width:100%" @click="remove">Supprimer ce match</button>
  </div>
  <div v-else class="empty">Match introuvable.</div>
</template>

<style scoped>
.scorecard { background: var(--green-900); color: #fff; border: none; }
.sets { display: flex; align-items: center; justify-content: space-around; margin-top: 8px; }
.side { text-align: center; flex: 1; }
.name { font-size: .85rem; color: #b9e6cf; font-weight: 600; }
.score { font-size: 3.4rem; font-weight: 800; line-height: 1.05; }
.setswon { font-size: .72rem; color: #8fcfb0; }
.vs { font-size: 1.5rem; color: #4f8a72; }
.setline { display: flex; gap: 6px; justify-content: center; margin-top: 10px; flex-wrap: wrap; }
.setpill { background: rgba(255, 255, 255, .12); padding: 3px 9px; border-radius: 999px; font-size: .74rem; font-weight: 700; }
.bigpt { padding: 22px 10px; font-size: 1.02rem; line-height: 1.2; }
.bigpt.me { background: var(--green-600); }
.bigpt.opp { background: #475569; }
</style>
