import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: 'Accueil', icon: 'home', tab: true } },
  { path: '/matchs', name: 'matches', component: () => import('../views/MatchesView.vue'), meta: { title: 'Matchs', icon: 'list', tab: true } },
  { path: '/stats', name: 'stats', component: () => import('../views/StatsView.vue'), meta: { title: 'Stats', icon: 'chart', tab: true } },
  { path: '/profil', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { title: 'Profil', icon: 'user', tab: true } },
  { path: '/live/:id', name: 'live', component: () => import('../views/LiveMatchView.vue'), meta: { title: 'Suivi live' } }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
