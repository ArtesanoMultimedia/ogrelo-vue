Vue.component('page-content', {
    template: `
        <!-- Begin Page Content -->
        <div class="container-fluid">

            <!-- Page Heading -->
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 mb-0 text-gray-800">{{pageTitle}}</h1>
                <button @click="nueva" class="btn btn-primary"><i class="fas fa-sm fa-plus"></i> Nueva</button>
            </div>
    
            <!-- Content Row -->
            <div class="row">
            
                <reservas-table v-if="currentPage === 'table'"></reservas-table>     
            
                <form-modal></form-modal>
                <detalle-modal></detalle-modal>
            </div>
            
        </div>
        <!-- /.container-fluid -->
    `,
    methods: {
        nueva: function() {
            this.$store.commit('emptyReserva');
            this.$store.commit('openFormModal', 'Nueva reserva');
        },
    },
    computed: {
        ...Vuex.mapState(['pageTitle', 'currentPage'])
    }
});
