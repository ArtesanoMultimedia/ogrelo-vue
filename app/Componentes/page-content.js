Vue.component('page-content', {
    template: `
        <!-- Begin Page Content -->
        <div class="container-fluid">

            <!-- Page Heading -->
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 mb-0 text-gray-800">{{pageTitle}}</h1>
                <button class="btn btn-primary">Nueva</button>
            </div>
    
            <!-- Content Row -->
            <div class="row">
            
                <reservas-table v-if="currentPage === 'table'"></reservas-table>     
            
                <reservas-form v-else-if="currentPage === 'form'"></reservas-form>
            
            </div>
            
        </div>
        <!-- /.container-fluid -->
    `,
    computed: {
        ...Vuex.mapState(['pageTitle', 'currentPage'])
    }
});
