<?php

use OGrelo\core\ControladorBase;

class ReservasController extends ControladorBase
{
    public function index24horas()
    {
        $entidad = new $this->model();
        $fecha_hasta = new DateTime('+24 hours', new DateTimeZone('Europe/Madrid'));
        $registros = $entidad->index(null, $fecha_hasta->format('Y-m-d H:i:s'));

        //Cargamos la vista index y le pasamos valores
        $this->view($this->slug . '.index',
            array(
                $this->slug => $registros,
                'index24horas' => true
            )
        );
    }

    public function count24horas() {
        $fecha_hasta = new DateTime('+24 hours', new DateTimeZone('Europe/Madrid'));
        $entidad = new $this->model();
        $num = $entidad->index(null, $fecha_hasta->format('Y-m-d H:i:s'), true);
        header('Content-type: Application-json');
        echo json_encode(['num_reservas' => $num['num_reservas']]);
    }
}
