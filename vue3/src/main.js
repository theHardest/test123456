import app from "./app";
import router from "./router";
import './router/permission'
import store from './store'

import "./assets/style.css"

app.use(router)
app.use(store);
app.mount('#app');
