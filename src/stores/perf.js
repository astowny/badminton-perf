import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const KEY = 'badminton-perf-v1'
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))
const today = () => new Date().toISOString().slice(0, 10)

// Types de coups & nature du point
export const SHOTS = ['Smash', 'Amorti', 'Dégagement', 'Drive', 'Filet', 'Service', 'Autre']
export const KINDS = ['Gagnant', 'Faute']

// Rejoue les points et calcule le tableau de score (règles badminton : 21 pts, écart 2, plafond 30, best of 3)
export function scoreboard(points, target = 21) {
  const cap = target + 9
  const sets = [{ me: 0, opp: 0, done: false, winner: null }]
  const won = { me: 0, opp: 0 }
  let matchWinner = null
  for (const p of points) {
    if (matchWinner) break
    let s = sets[sets.length - 1]
    if (s.done) { s = { me: 0, opp: 0, done: false, winner: null }; sets.push(s) }
    s[p.winner]++
    const hi = Math.max(s.me, s.opp)
    const lead = Math.abs(s.me - s.opp)
    if ((hi >= target && lead >= 2) || hi >= cap) {
      s.done = true
      s.winner = s.me > s.opp ? 'me' : 'opp'
      won[s.winner]++
      if (won.me === 2 || won.opp === 2) matchWinner = won.me === 2 ? 'me' : 'opp'
    }
  }
  return { sets, setsWon: won, matchWinner, currentSet: sets[sets.length - 1] }
}

function defaultSeed() {
  return {
    profile: { name: 'Moi', hand: 'Droitier', level: 'D9', club: '' },
    matches: []
  }
}

export const usePerf = defineStore('perf', () => {
  const persisted = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null } })()
  const seed = persisted || defaultSeed()

  const profile = ref(seed.profile)
  const matches = ref(seed.matches)

  watch([profile, matches], () => {
    localStorage.setItem(KEY, JSON.stringify({ profile: profile.value, matches: matches.value }))
  }, { deep: true })

  // ── Matchs ───────────────────────────────────────────────
  const matchById = (id) => matches.value.find((m) => m.id === id)

  function startMatch({ opponent = 'Adversaire', target = 21 } = {}) {
    const m = { id: uid(), date: today(), opponent, target, points: [], status: 'live', result: null }
    matches.value.unshift(m)
    return m.id
  }

  function addPoint(id, winner) {
    const m = matchById(id)
    if (!m || m.status === 'done') return
    m.points.push({ winner, shot: null, kind: null })
    const sb = scoreboard(m.points, m.target)
    if (sb.matchWinner) { m.status = 'done'; m.result = sb.matchWinner === 'me' ? 'win' : 'loss' }
  }

  function tagLastPoint(id, { shot = null, kind = null } = {}) {
    const m = matchById(id)
    const p = m?.points[m.points.length - 1]
    if (p) { if (shot !== null) p.shot = shot; if (kind !== null) p.kind = kind }
  }

  function undoLastPoint(id) {
    const m = matchById(id)
    if (!m || !m.points.length) return
    m.points.pop()
    m.status = 'live'; m.result = null
  }

  function deleteMatch(id) { matches.value = matches.value.filter((m) => m.id !== id) }
  function updateProfile(p) { profile.value = { ...profile.value, ...p } }
  function resetAll() { const s = defaultSeed(); profile.value = s.profile; matches.value = s.matches }

  // ── Stats ────────────────────────────────────────────────
  const done = computed(() => matches.value.filter((m) => m.status === 'done'))

  const winRate = computed(() => {
    if (!done.value.length) return null
    const w = done.value.filter((m) => m.result === 'win').length
    return Math.round((w / done.value.length) * 100)
  })

  const allPoints = computed(() => matches.value.flatMap((m) => m.points))

  const pointsWonPct = computed(() => {
    const tot = allPoints.value.length
    if (!tot) return null
    const mine = allPoints.value.filter((p) => p.winner === 'me').length
    return Math.round((mine / tot) * 100)
  })

  const winnersVsErrors = computed(() => {
    const g = allPoints.value.filter((p) => p.kind === 'Gagnant').length
    const f = allPoints.value.filter((p) => p.kind === 'Faute').length
    return { gagnants: g, fautes: f }
  })

  const errorsPerMatch = computed(() => {
    if (!done.value.length) return null
    const f = allPoints.value.filter((p) => p.kind === 'Faute').length
    return Math.round((f / done.value.length) * 10) / 10
  })

  // Répartition des coups gagnants (mes points marqués avec un coup taggé)
  const shotDistribution = computed(() => {
    const counts = Object.fromEntries(SHOTS.map((s) => [s, 0]))
    for (const p of allPoints.value) {
      if (p.kind === 'Gagnant' && p.shot) counts[p.shot] = (counts[p.shot] || 0) + 1
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return SHOTS.map((s) => ({ shot: s, count: counts[s], pct: total ? Math.round((counts[s] / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
  })

  // Forme récente : V/D des 8 derniers matchs (du + ancien au + récent)
  const recentForm = computed(() =>
    done.value.slice(0, 8).reverse().map((m) => m.result)
  )

  const totalMatches = computed(() => done.value.length)

  return {
    profile, matches, SHOTS, KINDS,
    matchById, startMatch, addPoint, tagLastPoint, undoLastPoint, deleteMatch, updateProfile, resetAll,
    winRate, pointsWonPct, winnersVsErrors, errorsPerMatch, shotDistribution, recentForm, totalMatches, done
  }
})
