import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { installUi } from './utils/ui'
import './styles/global.css'

const app = createApp(App)
app.use(router)
installUi(app)
app.mount('#app')
