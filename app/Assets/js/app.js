
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
        pageTitle: 'Reservas',
        errors: [],
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
        },
        view24h(state) {
            state.viendo24h = true;
            state.reservas = state.reservas24h;
        },
        setViendo24h(state, value) {
            state.viendo24h = value;
        },
        setPageTitle(state, value) {
            state.pageTitle = value;
        },
        emptyReserva(state) {
            let setNull = (obj) => Object.keys(obj).forEach(k => obj[k] = null);
            setNull(state.reserva);
        },
        emptyErrors(state) {
            state.errors = [];
        },
        addError(state, error) {
            state.errors.push(error);
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
        storeReserva: async function({commit, state, dispatch}, id = '') {
            id = (id === null ? '' : id);
            let url = '/ajax/reservas/' + id;
            let type = 'POST';
            if (id) {
                type = 'PUT';
            }
            let data = state.reserva;

            $.ajax({url, type, data})
                .done(function() {
                    dispatch('getReservas');
                });
        }
    }
});

// Fix para que se muestre la pestaña de VUE en DevTools
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
            // setInterval(function () {
            //     store.dispatch('getReservas24h')
            // }, 6000);
        }
    },
    mounted () {
        this.comprueba24h()
    }
});

// Fix para que se muestre la pestaña de VUE en DevTools
window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
