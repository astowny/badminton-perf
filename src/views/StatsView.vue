<script setup>
import { usePerf } from '../stores/perf'
const s = usePerf()
</script>

<template>
  <div>
    <div class="page-head"><h1>Stats</h1><p>Analyse de tes performances</p></div>

    <div v-if="!s.totalMatches" class="empty">Termine au moins un match pour voir tes stats.</div>

    <template v-else>
      <div class="grid grid-2">
        <div class="card stat accent"><div class="v">{{ s.winRate }}%</div><div class="l">Victoires</div></div>
        <div class="card stat"><div class="v">{{ s.pointsWonPct }}%</div><div class="l">Points gagnés</div></div>
        <div class="card stat"><div class="v">{{ s.winnersVsErrors.gagnants }}</div><div class="l">Coups gagnants</div></div>
        <div class="card stat"><div class="v">{{ s.winnersVsErrors.fautes }}</div><div class="l">Fautes</div></div>
      </div>

      <div class="section-title">Répartition des coups gagnants</div>
      <div class="card">
        <div v-for="row in s.shotDistribution.filter((r) => r.count)" :key="row.shot" style="margin-bottom:13px">
          <div class="between" style="font-size:.85rem;margin-bottom:5px"><span style="font-weight:600">{{ row.shot }}</span><span class="muted">{{ row.count }} ({{ row.pct }}%)</span></div>
          <div class="bar"><span :style="{ width: row.pct + '%' }"></span></div>
        </div>
        <div v-if="!s.shotDistribution.some((r) => r.count)" class="empty">Tague tes coups gagnants pendant les matchs pour voir la répartition.</div>
      </div>
    </template>
  </div>
</template>
