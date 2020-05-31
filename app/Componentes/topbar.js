Vue.component('topbar', {
    template: `
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

            <!-- Sidebar Toggle (Topbar) -->
            <button @click="toggleSidebar" id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                <i class="fa fa-bars"></i>
            </button>
            
            <!-- Topbar Search -->
            <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div class="input-group">
                    <input @keyup="search" v-model="texto" class="form-control bg-light border-0 small" placeholder="Buscar cliente..." aria-label="Buscar" aria-describedby="basic-addon2">
                </div>
            </form>
            
            <form class="d-none d-sm-inline form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div class="input-group">
                    <input v-model="fechaDesde" class="form-control bg-light border-0 small" placeholder="Fecha desde..." aria-label="Buscar" aria-describedby="basic-addon2">
                    <input v-model="fechaHasta" class="form-control bg-light border-0 small" placeholder="Fecha hasta..." aria-label="Buscar" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button @click="filtrarPorFecha" class="btn btn-primary" type="button">
                            <i class="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div>
            </form>
            
            <!-- Topbar Navbar -->
            <ul class="navbar-nav ml-auto">
            
                <!-- Nav Item - Search Dropdown (Visible Only XS) -->
                <li class="nav-item dropdown no-arrow d-sm-none">
                  <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-search fa-fw"></i>
                  </a>
                  <!-- Dropdown - Messages -->
                  <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                    <form class="form-inline mr-auto w-100 navbar-search">
                      <div class="input-group">
                        <input @keyup="search" v-model="texto" class="form-control bg-light border-0 small" placeholder="Buscar cliente..." aria-label="Search" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                          <button class="btn btn-primary" type="button">
                            <i class="fas fa-search fa-sm"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </li>
            
                <!-- Nav Item - Alerts -->
                <li v-if="count24h > 0 && !viendo24h" title="Hay reservas en las próximas 24 horas" class="nav-item dropdown no-arrow mx-1">
                  <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="mr-2 text-gray-600 small">Ver 24h</span>
                    <i class="fas fa-bell fa-fw"></i>
                    <!-- Counter - Alerts -->
                    <span class="badge badge-danger badge-counter">{{count24h}}</span>
                  </a>
                  <!-- Dropdown - Alerts -->
                  <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                    <h6 class="dropdown-header">
                      Reservas en las próximas 24 horas
                    </h6>
                    <a v-for="reserva in reservas24h" class="dropdown-item d-flex align-items-center" href="#">
                      <div class="mr-3">
                        <div class="icon-circle bg-primary">
                          <i class="fas fa-file-alt text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div class="small text-gray-500">{{reserva.fecha}}</div>
                        <span class="font-weight-bold">{{reserva.nombre}}</span>
                      </div>
                    </a>
                    <a class="dropdown-item text-center small text-gray-500" href="#" @click="ver24h">Mostrar reservas de las próximas 24h</a>
                  </div>
                </li>
                
                <li v-if="viendo24h" class="nav-item"  @click="verTodas">
                  <a class="nav-link" href="#" role="button" >
                    <span class="mr-2 text-gray-600 small">Ver todas</span>
                    <i class="fas fa-redo"></i>
                  </a>
                </li>
            </ul>
        </nav>
    `,
    data() {
        return {
            texto: '',
            fechaDesde: '',
            fechaHasta: '',
        }
    },
    methods: {
        ...Vuex.mapMutations(['toggleSidebar']),
        ver24h: function() {
            this.$store.commit('view24h');
            this.$store.commit('setPageTitle', 'Reservas Próximas 24h');
        },
        verTodas: function() {
            this.$store.dispatch('getReservas');
            this.$store.commit('setViendo24h', false);
            this.$store.commit('setPageTitle', 'Reservas');
        },
        search: function() {
            this.$store.commit('setSearch', this.texto);
        },
        filtrarPorFecha: function() {
            let fechaDesde;
            let fechaHasta;

            try {
                let desdeParts = this.fechaDesde.split("/");
                // Los meses empiezan en 0, por eso necesitamos desdeParts[1] - 1
                fechaDesde = new Date(+desdeParts[2], desdeParts[1] - 1, +desdeParts[0]);
            } catch {
                // TODO Mostrar al usuario el error
                fechaDesde = '';
            }

            try {
                let hastaParts = this.fechaHasta.split("/");
                fechaHasta = new Date(+hastaParts[2], hastaParts[1] - 1, +hastaParts[0]);
            } catch {
                // TODO Mostrar al usuario el error
                fechaHasta = '';
            }


            this.$store.commit('setFechaDesde', fechaDesde);
            this.$store.commit('setFechaHasta', fechaHasta);
        }
    },
    computed: {
        ...Vuex.mapGetters(['count24h']),
        ...Vuex.mapState(['viendo24h', 'reservas24h']),
    },

});






