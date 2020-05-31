Vue.component('form-modal', {
    template: `
        <div v-if="showFormModal">
            <transition appear>
            <div class="modal-mask">
                <div class="modal-wrapper">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">{{formTitle}}</h5>
                        <button type="button" @click="closeForm" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
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
                        <button type="button" class="btn btn-secondary" @click="closeForm">Cerrar</button>
                        <button type="button" class="btn btn-primary" @click="save(reserva.id)">Guardar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
        </div>
    `,
    mounted() {
        this.emptyValidClass();
        this.emptyErrors();
    },
    methods: {
        ...Vuex.mapMutations(['emptyErrors', 'emptyValidClass']),
        closeForm: function() {
            this.$store.state.showFormModal = false;
        },
        save: async function(id) {
            this.validate().then(async (success) => {
                if (success) {
                    await this.$store.dispatch('storeReserva', id);
                    this.$store.state.showFormModal = false;
                }
            });
        },
        validate: async function() {
            this.emptyErrors();
            this.emptyValidClass();
            this.validaCamposObligatorios();
            this.validaTelefono();
            this.validaComensales();
            this.validaFecha();
            return this.errors.length === 0;
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
    },
    computed: {
        ...Vuex.mapState(['reserva', 'errors', 'showFormModal', 'formTitle', 'validClass']),
    }
});
