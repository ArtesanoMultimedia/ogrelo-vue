Vue.component('reservas-table', {
    template: `
        <div>
            <div v-if="loading">Cargando...</div>

            <a @click="nueva" style="position: relative; left: 574px; top: -30px; overflow: auto; margin-bottom: -60px;" href="#" class="btn btn-primary btn-circle btn-lg">
                <i class="fas fa-plus"></i>
            </a>

            <table v-if="!loading" width="100%" class="table table-striped table-bordered table-hover" id="reservas">
                <thead>
                    <tr>
                        <th @click="ordenaNombre" class="pointer">
                            <i v-if="orderColumn != 'nombre'" class="fas fa-sort"></i>
                            <i v-else-if="orderAsc" class="fas fa-sort-down"></i>
                            <i v-else="orderAsc" class="fas fa-sort-up"></i>
                             Nombre</th>
                        <th @click="ordenaApellidos" class="pointer">
                            <i v-if="orderColumn != 'apellidos'" class="fas fa-sort"></i>
                            <i v-else-if="orderAsc" class="fas fa-sort-down"></i>
                            <i v-else="orderAsc" class="fas fa-sort-up"></i>
                             Apellidos</th>
                        <th @click="ordenaFecha" class="pointer">
                            <i v-if="orderColumn != 'fecha'" class="fas fa-sort"></i>
                            <i v-else-if="orderAsc" class="fas fa-sort-down"></i>
                            <i v-else="orderAsc" class="fas fa-sort-up"></i>
                             Fecha</th>
                        <th @click="ordenaComensales" class="pointer">
                            <i v-if="orderColumn != 'comensales'" class="fas fa-sort"></i>
                            <i v-else-if="orderAsc" class="fas fa-sort-down"></i>
                            <i v-else="orderAsc" class="fas fa-sort-up"></i>
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
            
            
            <!-- Detalle Modal-->
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
                
            <div v-if="showDetalleModal">
                <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title">Detalle de la reserva</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
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
                            <button type="button" class="btn btn-secondary" @click="showDetalleModal = false">Cerrar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
            </div>
            
            <div v-if="showFormModal">
                <transition appear>
                <div class="modal-mask">
                    <div class="modal-wrapper">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title">{{formTitle}}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true" @click="showFormModal = false">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
<!--                          <form id="form" action="{{ form_action }}" method="{{ form_method }}">-->
                              <div v-if="errors.length > 0" class="alert alert-danger alert-dismissible fade show" role="alert">
                                <p v-for="error in errors"><strong>{{error.campo.charAt(0).toUpperCase() + error.campo.slice(1)}}:</strong> {{error.mensaje}}</p>
                                <button @click="emptyErrors" type="button" class="close" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <form id="form">
                                <div id="group-nombre" class="form-group has-danger">
                                    <label for="nombre" class="control-label">Nombre</label>
                                    <input id="nombre" name="nombre" v-model="reserva.nombre" class="form-control" :class="validClass.nombre" >
                                </div>
                                <div id="group-apellidos" class="form-group has-success">
                                    <label for="apellidos" class="control-label">Apellidos</label>
                                    <input id="apellidos" name="apellidos" v-model="reserva.apellidos" class="form-control" :class="validClass.apellidos" >
                                </div>
                                <div id="group-telefono" class="form-group">
                                    <label for="telefono" class="control-label">Teléfono</label>
                                    <input id="telefono" name="telefono" v-model="reserva.telefono" class="form-control" :class="validClass.telefono" minlength="6" maxlength="12">
                                </div>
                                <div id="group-fecha" class="form-group">
                                    <label for="fecha" class="control-label">Fecha</label>
                                    <input id="fecha" name="fecha" v-model="reserva.fecha" class="form-control" :class="validClass.fecha" autocomplete="off" placeholder="dd/mm/yyyy hh:mm" >
                                </div>
                                <div id="group-comensales" class="form-group">
                                    <label for="comensales" class="control-label">Comensales</label>
                                    <input id="comensales" name="comensales" v-model="reserva.comensales" class="form-control" :class="validClass.comensales" >
                                </div>
                                <div id="group-comentarios" class="form-group">
                                    <label for="comentarios" class="control-label">Comentarios</label>
                                    <input id="comentarios" name="comentarios" v-model="reserva.comentarios" class="form-control" :class="validClass.comentarios" >
                                </div>
                            </form>
 
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="showFormModal = false">Cerrar</button>
                            <button type="button" class="btn btn-primary" @click="store(reserva.id)">Guardar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
            </div>
            
        </div>
        `,
    data() {
        return {
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
        }
    },
    mounted() {
        this.$store.dispatch('getReservas')
    },
    methods: {
        ...Vuex.mapMutations(['emptyErrors', 'sortReservas', 'setOrderColumn', 'setOrderAsc']),
        detalle: function (id) {
            this.$store.dispatch('getReserva', id);
            this.showDetalleModal = true;
        },
        editar: function (id) {
            this.$store.dispatch('getReserva', id);
            this.formTitle = 'Editar reserva';
            this.emptyValidClasses();
            this.emptyErrors();
            this.showFormModal = true;
        },
        nueva: function() {
            this.$store.commit('emptyReserva');
            this.formTitle = 'Nueva reserva';
            this.emptyValidClasses();
            this.emptyErrors();
            this.showFormModal = true;
        },
        store: async function(id) {
            this.validate().then(async (success) => {
                if (success) {
                    await this.$store.dispatch('storeReserva', id);
                    this.showFormModal = false;
                }
            });
        },
        validate: async function() {
            this.emptyErrors();
            this.emptyValidClasses();
            this.validaCamposObligatorios();
            this.validaTelefono();
            this.validaComensales();
            this.validaFecha();
            return this.errors.length === 0;
        },
        emptyValidClasses: function() {
            Object.keys(this.validClass).forEach(item => this.validClass[item] = '');
        },
        addError: function(error) {
            this.validClass[error.campo] = 'is-invalid';
            this.$store.commit('addError', error);
        },
        validaCamposObligatorios: function() {
            let camposObligatorios = ['nombre', 'apellidos', 'telefono', 'fecha', 'comensales'];
            camposObligatorios.forEach((campo) => {
                if (!this.reserva[campo]) {
                    this.addError({campo: campo, mensaje: `El campo ${campo} es obligatorio.`});
                }
            }, this);
        },
        validaTelefono: function() {
            if (this.reserva.telefono) {
                if (isNaN(this.reserva.telefono)) {
                    this.addError({campo: 'telefono', mensaje: 'Formato incorrecto. Ejemplo de número válido: 666555444.'});
                } else if (this.reserva.telefono.length !== 9) {
                    this.addError({campo: 'telefono', mensaje: 'Número de caracteres incorrecto. Ejemplo de número válido: 666555444.'});
                }
            }
        },
        validaComensales: function() {
            if (isNaN(this.reserva.comensales)) {
                this.addError({campo: 'comensales', mensaje: 'Debe indicar un número.'});
            } else if (this.reserva.comensales > 10) {
                this.addError({campo: 'comensales', mensaje: 'El número de comensales no puede ser mayor a 10.'});
            }
        },
        validaFecha: function() {
            if (this.reserva.fecha) {
                let fecha;
                let hora;
                let fechaParts;
                let horaParts;
                let valor;
                try {
                    [fecha, hora] = this.reserva.fecha.split(' ');
                    fechaParts = fecha.split('/');
                    horaParts = hora.split(':');
                    valor = new Date(+fechaParts[2], fechaParts[1] - 1, +fechaParts[0], +horaParts[0], +horaParts[1]);
                } catch {
                    this.addError({campo: 'fecha', mensaje:'Formato incorrecto, utilice el formato: dd/mm/yyyy hh:mm.'});
                    return;
                }

                if (this.fueraDelHorarioDeApertura(+horaParts[0])) {
                    this.addError({campo: 'fecha', mensaje:'El horario de apertura es de 12 a 16 y de 19 a 23.'});
                }


                let tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                if (valor < tomorrow) {
                    this.addError({campo: 'fecha', mensaje:'La fecha debe ser, al menos, 24 horas superior a la fecha actual.'});
                }
            }
        },
        fueraDelHorarioDeApertura: function(hora) {
            return hora < 12 || (hora >= 16 && hora < 19) || hora >= 23;
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
        ...Vuex.mapState(['reserva', 'loading', 'reservas', 'errors', 'orderColumn', 'orderAsc']),
    }
});
