import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { createApp } from 'vue'
import App from './App.vue'
import ToastService from 'primevue/toastservice';
import { createMemoryHistory, createRouter } from 'vue-router'

import GameView from './views/GameView.vue'
import StatsView from './views/StatsView.vue'
import AccountView from './views/AccountView.vue'

const routes = [
  { path: '/', component: GameView },
  { path: '/stats', component: StatsView },
  { path: '/account', component: AccountView }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

const app = createApp(App).use(router).use(ToastService)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.mount('#app')
