import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';
import App from './App.vue';

import './tailwind.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#ogo-delivery');

/* Initialize the plugin */