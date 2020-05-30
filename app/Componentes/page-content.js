Vue.component('page-content', {
    template: `
        <!-- Begin Page Content -->
        <div class="container-fluid">

            <!-- Page Heading -->
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 mb-0 text-gray-800">{{pageTitle}}</h1>
            </div>
    
            <!-- Content Row -->
            <div class="row">
            
                <reservas-table></reservas-table>     
            
                
            
            </div>
            
        </div>
        <!-- /.container-fluid -->
    `,
    computed: {
        ...Vuex.mapState(['pageTitle'])
    }
});
