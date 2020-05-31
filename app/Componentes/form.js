Vue.component('reservas-form', {
    template: `
<div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">{{formTitle}}</h6>
    </div>
    <div class="card-body">
<div v-if="errors.length > 0" class="alert alert-danger alert-dismissible fade show" role="alert">
    <p v-for="error in errors"><strong>{{error.campo.charAt(0).toUpperCase() + error.campo.slice(1)}}:</strong> {{error.mensaje}}</p>
    <button @click="emptyErrors" type="button" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<form id="form">
    <div id="group-nombre" class="form-group">
    <label for="nombre" class="control-label">Nombre</label>
    <input v-model="reserva.nombre" class="form-control">
    <div id="error-nombre" class="alert alert-danger mt-2 collapse" role="alert"></div>
    </div>
    <div id="group-apellidos" class="form-group">
    <label for="apellidos" class="control-label">Apellidos</label>
    <input v-model="reserva.apellidos" class="form-control" >
    <div id="error-apellidos" class="alert alert-danger mt-2 collapse" role="alert"></div>
    </div>
    <div id="group-telefono" class="form-group">
    <label for="telefono" class="control-label">Teléfono</label>
    <input v-model="reserva.telefono" class="form-control" minlength="6" maxlength="12">
    <div id="error-telefono" class="alert alert-danger mt-2 collapse" role="alert"></div>
    </div>
    <div id="group-fecha" class="form-group">
    <label for="fecha" class="control-label">Fecha</label>
    <input v-model="reserva.fecha" class="form-control" autocomplete="off" placeholder="dd/mm/yyyy hh:mm" >
    <div id="error-fecha" class="alert alert-danger mt-2 collapse" role="alert"></div>
    </div>
    <div id="group-comensales" class="form-group">
    <label for="comensales" class="control-label">Comensales</label>
    <input v-model="reserva.comensales" class="form-control" >
    <div id="error-comensales" class="alert alert-danger mt-2 collapse" role="alert"></div>
    </div>
    <div id="group-comentarios" class="form-group">
    <label for="comentarios" class="control-label">Comentarios</label>
    <input v-model="reserva.comentarios" class="form-control" >
    <div id="error-comentarios" class="alert alert-danger mt-2 collapse" role="alert"></div>
    </div>
</form>


    </div>
</div>


            <div>
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
                              <div v-if="errors.length > 0" class="alert alert-danger alert-dismissible fade show" role="alert">
                                <p v-for="error in errors"><strong>{{error.campo.charAt(0).toUpperCase() + error.campo.slice(1)}}:</strong> {{error.mensaje}}</p>
                                <button @click="emptyErrors" type="button" class="close" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <form id="form">
                                <div id="group-nombre" class="form-group">
                                    <label for="nombre" class="control-label">Nombre</label>
                                    <input v-model="reserva.nombre" class="form-control">
                                    <div id="error-nombre" class="alert alert-danger mt-2 collapse" role="alert"></div>
                                </div>
                                <div id="group-apellidos" class="form-group">
                                    <label for="apellidos" class="control-label">Apellidos</label>
                                    <input v-model="reserva.apellidos" class="form-control" >
                                    <div id="error-apellidos" class="alert alert-danger mt-2 collapse" role="alert"></div>
                                </div>
                                <div id="group-telefono" class="form-group">
                                    <label for="telefono" class="control-label">Teléfono</label>
                                    <input v-model="reserva.telefono" class="form-control" minlength="6" maxlength="12">
                                    <div id="error-telefono" class="alert alert-danger mt-2 collapse" role="alert"></div>
                                </div>
                                <div id="group-fecha" class="form-group">
                                    <label for="fecha" class="control-label">Fecha</label>
                                    <input v-model="reserva.fecha" class="form-control" autocomplete="off" placeholder="dd/mm/yyyy hh:mm" >
                                    <div id="error-fecha" class="alert alert-danger mt-2 collapse" role="alert"></div>
                                </div>
                                <div id="group-comensales" class="form-group">
                                    <label for="comensales" class="control-label">Comensales</label>
                                    <input v-model="reserva.comensales" class="form-control" >
                                    <div id="error-comensales" class="alert alert-danger mt-2 collapse" role="alert"></div>
                                </div>
                                <div id="group-comentarios" class="form-group">
                                    <label for="comentarios" class="control-label">Comentarios</label>
                                    <input v-model="reserva.comentarios" class="form-control" >
                                    <div id="error-comentarios" class="alert alert-danger mt-2 collapse" role="alert"></div>
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
            </div>
            
    `,
});
