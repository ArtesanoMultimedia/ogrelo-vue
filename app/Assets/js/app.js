
const store = new Vuex.Store({
    state: {
        reserva: {
            nombre: null,
            apellidos: null,
            telefono: null,
            fecha: null,
            comensales: null,
            comentarios: null
        },
        loading: false,
        reservas: {},
        reservas24h: {},
        primerasReservas24h: {},
        count24h: null,
        viendo24h: false
    },
    mutations: {
        updateReserva(state, reserva) {
            state.reserva = reserva;
        },
        getReservas(state) {
            state.loading = true;
            $.getJSON('/ajax/reservas')
                .done(data => state.reservas = data)
                .always(() => state.loading = false)
                .always(() => state.viendo24h = false)
        },
        getReservas24h(state) {
            $.getJSON('/ajax/reservas/proximas24horas')
                .done(data => {
                    state.reservas24h = data;
                })
        },
        getCount24h(state) {
            $.getJSON('/ajax/reservas/proximas24horas/count')
                .done(data => state.count24h = data.num_reservas)
        },
        view24h(state) {
            state.loading = true;
            $.getJSON('/ajax/reservas/proximas24horas')
                .done(data => state.reservas = data)
                .always(() => state.viendo24h = true)
                .always(() => state.loading = false)
        }
    }
});

new Vue({
    el: '#wrapper',
    data: {
        page_title: 'Restaurante O Grelo'
    },
    store,
    methods:{
        comprueba24h: function () {
            store.commit('getCount24h');
            store.commit('getReservas24h');
            setInterval(function () {
                store.commit('getCount24h');
                store.commit('getReservas24h')
            }, 6000);
        }
    },
    mounted () {
        this.comprueba24h()
    }
});
