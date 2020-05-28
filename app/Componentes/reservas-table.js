Vue.component('reservas-table', {
    template: `
        <div>
            <div v-if="loading">Cargando...</div>

            <table v-if="!loading" width="100%" class="table table-striped table-bordered table-hover" id="reservas">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Teléfono</th>
                        <th>Fecha</th>
                        <th>Comensales</th>
                        <th>Comentarios</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reserva in reservas" :id="reserva.id" class="odd gradeX">
                        <td>{{ reserva.nombre }}</td>
                        <td>{{ reserva.apellidos }}</td>
                        <td>{{ reserva.telefono }}</td>
                        <td>{{ reserva.fecha }}</td>
                        <td class="text-right">{{ reserva.comensales }}</td>
                        <td>{{ reserva.comentarios }}</td>
                        <td class="text-center">
                            <button @click="detalle(reserva.id)" data-action="detalle" class="btn btn-sm btn-primary">
                            <span class="material-icons md-18 align-middle">visibility</span>
                            </button>
                            <button @click="editar(reserva.id)" data-action="editar" class="btn btn-sm btn-primary">
                            <span class="material-icons md-18 align-middle">edit</span>
                            </button>
                            <button @click="eliminar(reserva.id)" data-action="eliminar" class="btn btn-sm btn-danger">
                            <span class="material-icons md-18 align-middle">delete_forever</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Logout Modal-->
            <div class="modal fade" id="detalleModal" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="detalleModalLabel">Detalle de la reserva</h5>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Nombre: </strong> {{ reserva.nombre }}</p>
                            <p><strong>Apellidos: </strong> {{ reserva.apellidos }}</p>
                            <p><strong>Teléfono: </strong> {{ reserva.telefono }}</p>
                            <p><strong>Fecha: </strong> {{ reserva.fecha }}</p>
                            <p><strong>Comensales: </strong> {{ reserva.comensales }}</p>
                            <p><strong>Comentarios: </strong> {{ reserva.comentarios }}</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" type="button" data-dismiss="modal">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `,
    mounted() {
        this.$store.commit('getReservas')
    },
    methods: {
        detalle: function (id) {
            $.get('/ajax/reservas/' + id)
                .done((reserva) => {
                        this.$store.commit('updateReserva', reserva);
                    }
                );
            $('#detalleModal').modal();

        },
        editar: function (id) {
            console.log('editar: ' + id)
        },
        eliminar: function (id) {
            console.log('eliminar: ' + id)
        }
    },
    computed: {
        reserva() {
            return this.$store.state.reserva;
        },
        loading() {
            return this.$store.state.loading;
        },
        reservas() {
            return this.$store.state.reservas;
        }
    }
});
