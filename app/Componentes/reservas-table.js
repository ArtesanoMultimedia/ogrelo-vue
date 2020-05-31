Vue.component('reservas-table', {
    template: `
        <div class="col-12">
            <div v-if="loading">Cargando...</div>

<!--            <a @click="nueva" style="position: relative; left: 574px; top: -30px; overflow: auto; margin-bottom: -60px;" href="#" class="btn btn-primary btn-circle btn-lg">-->
<!--                <i class="fas fa-plus"></i>-->
<!--            </a>-->

            <table v-if="!loading" class="table table-striped table-bordered table-hover" id="reservas">
                <thead>
                    <tr>
                        <th @click="ordenaNombre" class="pointer">
                            <i v-if="orderColumn != 'nombre'" class="fas fa-sort"></i>
                            <i v-else-if="orderAsc" class="fas fa-sort-up"></i>
                            <i v-else="orderAsc" class="fas fa-sort-down"></i>
                             Nombre</th>
                        <th @click="ordenaApellidos" class="pointer">
                            <i v-if="orderColumn != 'apellidos'" class="fas fa-sort"></i>
                            <i v-else-if="orderAsc" class="fas fa-sort-up"></i>
                            <i v-else="orderAsc" class="fas fa-sort-down"></i>
                             Apellidos</th>
                        <th @click="ordenaFecha" class="pointer">
                            <i v-if="orderColumn != 'fecha'" class="fas fa-sort"></i>
                            <i v-else-if="orderAsc" class="fas fa-sort-up"></i>
                            <i v-else="orderAsc" class="fas fa-sort-down"></i>
                             Fecha</th>
                        <th @click="ordenaComensales" class="pointer">
                            <i v-if="orderColumn != 'comensales'" class="fas fa-sort"></i>
                            <i v-else-if="orderAsc" class="fas fa-sort-up"></i>
                            <i v-else="orderAsc" class="fas fa-sort-down"></i>
                             Comensales</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="reservasFiltradas.length > 0">
                    <tr v-for="reserva in reservasFiltradas" :key="reserva.id" class="odd gradeX">
                        <td>{{ reserva.nombre }}</td>
                        <td>{{ reserva.apellidos }}</td>
                        <td>{{ reserva.fecha }}</td>
                        <td class="text-right">{{ reserva.comensales }}</td>
                        <td class="text-center">
                            <button @click="detalle(reserva.id)" class="btn btn-sm btn-primary">
                                <i class="far fa-eye fa-sm"></i>
                            </button>
                            <button @click="editar(reserva.id)" data-action="editar" class="btn btn-sm btn-primary">
                                <i class="fas fa-pen fa-sm"></i>
                            </button>
                            <button @click="eliminar(reserva.id)" data-action="eliminar" class="btn btn-sm btn-danger">
                                <i class="fas fa-trash fa-sm"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr><td colspan="5">No hay reservas</td></tr>
                </tbody>
            </table>
            
        </div>
        `,
    mounted() {
        this.$store.dispatch('getReservas')
    },
    methods: {
        ...Vuex.mapMutations(['sortReservas', 'setOrderColumn', 'setOrderAsc']),
        detalle: function (id) {
            this.$store.dispatch('getReserva', id);
            this.$store.commit('openDetalleModal', 'Editar reserva');
        },
        editar: function (id) {
            this.$store.dispatch('getReserva', id);
            this.$store.commit('openFormModal', 'Editar reserva');
        },
        eliminar: function (id) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success m-2',
                    cancelButton: 'btn btn-danger m-2'
                },
                buttonsStyling: false
            });

            swalWithBootstrapButtons.fire({
                title: '¿Está seguro de que desea eliminar esta reserva?',
                text: "Esta acción es irreversible",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'No, cancelar',
                reverseButtons: true,
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !swalWithBootstrapButtons.isLoading()
            }).then((result) => {
                if (result.value) {
                    $.ajax({
                        url: 'ajax/reservas/'+id,
                        type: 'DELETE'}
                    )
                        .done(response => {
                            if (response.deleted) {
                                Swal.fire('Eliminada', 'Se ha eliminado la reserva', 'success')
                                    .then(() => {
                                        let indice = this.$store.state.reservas.findIndex(r => r.id === id);
                                        this.$store.state.reservas.splice(indice, 1);
                                    });
                            } else {
                                Swal.fire('Error', 'No se ha podido eliminar la reserva', 'error');
                            }
                        });
                }
            })
        },
        ordenaNombre: function() {
            if (this.orderColumn === 'nombre') {
                this.setOrderAsc(!this.orderAsc);
            } else {
                this.setOrderColumn('nombre');
                this.setOrderAsc(true);
            }
            this.sortReservas();
        },
        ordenaApellidos: function() {
            if (this.orderColumn === 'apellidos') {
                this.setOrderAsc(!this.orderAsc);
            } else {
                this.setOrderColumn('apellidos');
                this.setOrderAsc(true);
            }
            this.sortReservas();
        },
        ordenaFecha: function() {
            if (this.orderColumn === 'fecha') {
                this.setOrderAsc(!this.orderAsc);
            } else {
                this.setOrderColumn('fecha');
                this.setOrderAsc(true);
            }
            this.sortReservas();
        },
        ordenaComensales: function() {
            if (this.orderColumn === 'comensales') {
                this.setOrderAsc(!this.orderAsc);
            } else {
                this.setOrderColumn('comensales');
                this.setOrderAsc(true);
            }
            this.sortReservas();
        },
    },
    computed: {
        ...Vuex.mapGetters(['reservasFiltradas']),
        ...Vuex.mapState(['reserva', 'loading', 'reservas', 'orderColumn', 'orderAsc']),
    }
});
