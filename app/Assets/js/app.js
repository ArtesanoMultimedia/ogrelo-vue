
// Fix para que se muestre la pestaña de VUE en DevTools
// Vue.config.devtools = true;

const app = new Vue({
    el: '#wrapper',
    data: {
        page_title: 'Restaurante O Grelo'
    },
    store,
    methods:{
        comprueba24h: function () {
            store.dispatch('getReservas24h');
            setInterval(function () {
                store.dispatch('getReservas24h')
            }, 6000);
        }
    },
    mounted () {
        this.comprueba24h()
    }
});

// Fix para que se muestre la pestaña de VUE en DevTools
// window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
