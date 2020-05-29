
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
        loading: true,
        reservas: {},
        reservas24h: {},
        viendo24h: false,
        search: '',
    },
    getters: {
        count24h: state => state.reservas24h.length,
        reservasFiltradas: (state) => {
            return state.reservas.filter(reserva => {
                return (`${reserva.nombre} ${reserva.apellidos}`).toLowerCase().includes(state.search.toLowerCase())
            })
        }
    },
    mutations: {
        setReserva(state, reserva) {
            state.reserva = reserva;
        },
        setReservas(state, reservas) {
            state.reservas = reservas;
            state.loading = false;
        },
        setReservas24h(state, reservas24h) {
            state.reservas24h = reservas24h;
            // state.reservas24h = data.sort((a, b) => a.fecha > b.fecha ? 1 : -1);
        },
        setCount24h(state, count24h) {
            state.count24h = count24h;
        },
        updateSearch(state, value) {
            state.search = value;
        }
    },
    actions: {
        getReservas: async function({ commit }) {
            const res = await fetch('/ajax/reservas');
            const data = await res.json();
            commit('setReservas', data);
        },
        getReservas24h: async function({ commit }) {
            const res = await fetch('/ajax/reservas/proximas24horas');
            const data = await res.json();
            commit('setReservas24h', data);
            commit('setCount24h', data.length);
        },
        getReserva: async function({commit}, id) {
            const res = await fetch('/ajax/reservas/' + id);
            const data = await res.json();
            commit('setReserva', data);
        },
        storeReserva: async function({commit}, id) {
            const res = await fetch('/ajax/reservas/' + id, {
                method: 'PUT',
                body: reserva
            });
            this.getReservas({commit});
        }
    }
});

Vue.config.devtools = true;

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

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
