Vue.component('topbar', {
    template: `
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

            <!-- Sidebar Toggle (Topbar) -->
            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                <i class="fa fa-bars"></i>
            </button>
            
            <!-- Topbar Search -->
            <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div class="input-group">
                    <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button">
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
                        <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2">
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
                    <i class="fas fa-bell fa-fw"></i>
                    <!-- Counter - Alerts -->
                    <span class="badge badge-danger badge-counter">{{count24h}}+</span>
                  </a>
                  <!-- Dropdown - Alerts -->
                  <div @click="view24h" class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
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
                    <a class="dropdown-item text-center small text-gray-500" href="#" @click="view24h">Mostrar reservas de las próximas 24h</a>
                  </div>
                </li>
                            
<!--                <li><a href="/reservas/proximas24horas" id="boton24h" class="hidden">-->
<!--                        <span class="d-sm-inline">-->
<!--                            <i class="fa fa-bell fa-fw"></i> Hay reservas en las </span>Próximas 24 horas</a></li>-->
<!--                <li><a href="/" id="botonTodas" class="">-->
<!--                        <i class="fa fa-calendar-times fa-fw"></i> Ver todas las reservas</a></li>-->
<!--                <li><a href="/reservas/create" id="botonNueva" class="">-->
<!--                        <i class="fa fa-plus"></i> Nueva reserva</a></li>-->
            </ul>
        </nav>
    `,
    data() {
        return {
            // count24h: null
        }
    },
    methods: {
        view24h: function() {
            this.$store.commit('view24h');
        }
    },
    computed: {
        count24h() {
            return this.$store.state.count24h;
        },
        viendo24h() {
            return this.$store.state.viendo24h;
        },
        reservas24h() {
            return this.$store.state.reservas24h;
        }
    },

});






