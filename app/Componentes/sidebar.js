Vue.component('sidebar', {
    template: `
        <!-- Sidebar -->
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            :class="toggledSidebar" id="accordionSidebar">
            <!-- Sidebar - Brand -->
            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                <div class="sidebar-brand-icon rotate-n-15">
                  <i class="fas fa-pepper-hot"></i>
                </div>
                <div class="sidebar-brand-text mx-3">O Grelo <sup>VUE</sup></div>
            </a>
            
            <!-- Divider -->
            <hr class="sidebar-divider my-0">

            <!-- Nav Item - Dashboard -->
            <li class="nav-item active">
                <a class="nav-link" href="/">
                    <i class="fas fa-fw fa-tachometer-alt"></i>
                    <span>Gestión de reservas</span></a>
            </li>
            
            <!-- Divider -->
            <hr class="sidebar-divider d-none d-md-block">
            
            <!-- Sidebar Toggler (Sidebar) -->
            <div class="text-center d-none d-md-inline">
                <button @click="toggleSidebar" class="rounded-circle border-0" id="sidebarToggle"></button>
            </div>
        </ul>
        <!-- End of Sidebar -->
    `,
    methods: {
        ...Vuex.mapMutations(['toggleSidebar']),
    },
    computed: {
        ...Vuex.mapState(['toggledSidebar']),
    }
});






