Vue.component('detalle-modal', {
    template: `
        <div v-if="showDetalleModal">
            <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Detalle de la reserva</h5>
                                    <button @click="closeForm" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true" @click="showDetalleModal = false">&times;</span>
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
                                    <button type="button" @click="closeForm" class="btn btn-secondary">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    `,
    methods: {
        closeForm: function() {
            this.$store.state.showDetalleModal = false;
        },
    },
    computed: {
        ...Vuex.mapState(['reserva', 'showDetalleModal']),
    },
});
