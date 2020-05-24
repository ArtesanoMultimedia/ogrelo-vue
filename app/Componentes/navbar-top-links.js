Vue.component('navbar-top-links', {
    template: `
        <ul class="nav navbar-top-links navbar-right">
            <li><a href="/reservas/proximas24horas" id="boton24h" class="hidden">
                    <span class="d-sm-inline">
                        <i class="fa fa-bell fa-fw"></i> Hay reservas en las </span>Próximas 24 horas</a></li>
            <li><a href="/" id="botonTodas" class="">
                    <i class="fa fa-calendar-times fa-fw"></i> Ver todas las reservas</a></li>
            <li><a href="/reservas/create" id="botonNueva" class="">
                    <i class="fa fa-plus"></i> Nueva reserva</a></li>
        </ul>
    `
});






