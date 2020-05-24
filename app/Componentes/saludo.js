Vue.component('saludo', {
    template: `
        <div>
            <h1 class="page-header">{{saludo}}</h1>
            <h3>prueba</h3>        
        </div>
    `,
    data(){
        return {
            saludo: 'Hola desde Vue'
        }
    }
});
