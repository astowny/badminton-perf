<script setup>
import { usePerf } from '../stores/perf'
const s = usePerf()
const hands = ['Droitier', 'Gaucher']
function reset() { if (confirm('Effacer tous les matchs et le profil ?')) s.resetAll() }
</script>

<template>
  <div>
    <div class="page-head"><h1>Profil</h1></div>

    <div class="card">
      <div class="field"><label>Nom</label><input class="input" :value="s.profile.name" @input="s.updateProfile({ name: $event.target.value })" /></div>
      <div class="field"><label>Main</label>
        <select class="select" :value="s.profile.hand" @change="s.updateProfile({ hand: $event.target.value })">
          <option v-for="h in hands" :key="h">{{ h }}</option>
        </select>
      </div>
      <div class="field"><label>Niveau / classement</label><input class="input" :value="s.profile.level" @input="s.updateProfile({ level: $event.target.value })" placeholder="ex. D9, P12, N3…" /></div>
      <div class="field" style="margin-bottom:0"><label>Club</label><input class="input" :value="s.profile.club" @input="s.updateProfile({ club: $event.target.value })" /></div>
    </div>

    <button class="btn btn-red" style="margin-top:18px" @click="reset">Réinitialiser les données</button>
    <p class="muted" style="font-size:.78rem;text-align:center;margin-top:12px">Données stockées localement sur ton appareil (hors-ligne).</p>
  </div>
</template>
