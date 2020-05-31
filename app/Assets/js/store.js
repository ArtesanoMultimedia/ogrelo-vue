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
        pageTitle: 'Reservas',
        errors: [],
        search: '',
        fechaDesde: '',
        fechaHasta: '',
        orderAsc: true,
        orderColumn: 'fecha',
        toggledSidebar: '',
        currentPage: 'table',
        showDetalleModal: false,
        showFormModal: false,
        formTitle: '',
        validClass: {
            nombre: '',
            apellidos: '',
            telefono: '',
            fecha: '',
            comensales: '',
            comentarios: '',
        },
    },
    getters: {
        count24h: state => state.reservas24h.length,
        reservasFiltradas: (state) => {
            return state.reservas.filter(reserva => {
                let fechaDesde;
                let fechaHasta;
                // Por si no tenemos fechas por las que filtrar o no son válidas,
                // las intentamos parsear dentro de un try - catch
                try {
                    fechaDesde = Date.parse(state.fechaDesde);
                    // Si la línea anterior no tira error, filtramos por fecha:
                    if (Date.parse(reserva.fecha) < fechaDesde) {
                        return false;
                    }
                } catch {}
                try {
                    fechaHasta= Date.parse(state.fechaHasta);
                    if (Date.parse(reserva.fecha) > fechaHasta) {
                        return false;
                    }
                } catch {}

                // Si llegamos hasta aquí es porque o bien no había fechas o bien la reserva
                // cumple el filtro de las fechas
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
        },
        setCount24h(state, count24h) {
            state.count24h = count24h;
        },
        setSearch(state, value) {
            state.search = value;
        },
        setFechaDesde(state, value) {
            state.fechaDesde = value;
        },
        setFechaHasta(state, value) {
            state.fechaHasta = value;
        },
        view24h(state) {
            state.viendo24h = true;
            state.reservas = state.reservas24h;
            this.commit('sortReservas');
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
        },
        setOrderColumn(state, value) {
            state.orderColumn = value;
        },
        setOrderAsc(state, value) {
            state.orderAsc = value;
        },
        sortReservas(state) {
            const reservas = state.reservas;
            // Como he pasado las fechas a formato es-ES (dd/mm/yyyy HH:MM) cuando las recibo de la base de datos,
            // Si dejo la comparación por defecto, ordenará primero por día, luego por mes, luego por año...
            // Añado también paso a minúsculas para la ordenación de strings.
            if (state.orderColumn === 'fecha') {
                if (state.orderAsc) {
                    reservas.sort((a, b) => new Date(a.fecha) > new Date(b.fecha) ? 1 : -1);
                } else {
                    reservas.sort((a, b) => new Date(a.fecha) < new Date(b.fecha) ? 1 : -1);
                }
            } else if(state.orderColumn === 'nombre' || state.orderColumn === 'apellidos') {
                if (state.orderAsc) {
                    reservas.sort((a, b) => a[state.orderColumn].toLowerCase() > b[state.orderColumn].toLowerCase() ? 1 : -1);
                } else {
                    reservas.sort((a, b) => a[state.orderColumn].toLowerCase() < b[state.orderColumn].toLowerCase() ? 1 : -1);
                }
            } else if(state.orderColumn === 'comensales') {
                if (state.orderAsc) {
                    reservas.sort((a, b) => parseInt(a[state.orderColumn]) > parseInt(b[state.orderColumn]) ? 1 : -1);
                } else {
                    reservas.sort((a, b) => parseInt(a[state.orderColumn]) < parseInt(b[state.orderColumn]) ? 1 : -1);
                }
            }
            state.reservas = reservas;
        },
        toggleSidebar(state) {
            state.toggledSidebar = (state.toggledSidebar === '' ? 'toggled' : '');
        },
        setShowFormModal(state, value) {
            state.showFormModal = value;
        },
        openFormModal(state) {
            this.commit('emptyErrors');
            this.commit('emptyValidClass');
            state.formTitle = 'Nueva reserva';
            state.showFormModal = true;
        },
        openDetalleModal(state) {
            state.showDetalleModal = true;
        },
        emptyValidClass(state) {
            Object.keys(state.validClass).forEach(item => state.validClass[item] = '');
        },
    },
    actions: {
        getReservas: async function({ commit }) {
            const res = await fetch('/ajax/reservas');
            const data = await res.json();
            data.forEach(reserva => {
                let date = new Date(reserva.fecha);
                let options = {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'};
                reserva.fecha = date.toLocaleString('es-ES', options);
            });
            commit('setReservas', data);
        },
        getReservas24h: async function({ commit }) {
            const res = await fetch('/ajax/reservas/proximas24horas');
            const data = await res.json();
            data.forEach(reserva => {
                let date = new Date(reserva.fecha);
                let options = {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'};
                reserva.fecha = date.toLocaleString('es-ES', options);
            });
            commit('setReservas24h', data);
            commit('setCount24h', data.length);
        },
        getReserva: async function({ commit }, id) {
            const res = await fetch('/ajax/reservas/' + id);
            const data = await res.json();
            let date = new Date(data.fecha);
            let options = {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'};
            data.fecha = date.toLocaleString('es-ES', options);
            commit('setReserva', data);
        },
        storeReserva: async function({ commit, state, dispatch }, id = '') {
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
