import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import ToastService from 'primevue/toastservice';

import router from './router'

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ToastService);

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.mount('#app')
