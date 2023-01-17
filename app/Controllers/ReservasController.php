<?php

use OGrelo\core\ControladorBase;

class ReservasController extends ControladorBase
{
    public function ajaxindex24horas()
    {
        $entidad = new $this->model();
        $fecha_hasta = new DateTime('+24 hours', new DateTimeZone('Europe/Madrid'));
        $registros = $entidad->getAll(null, $fecha_hasta->format('Y-m-d H:i:s'));

        header('Content-type: Application-json');
        echo json_encode($registros);
    }
}
