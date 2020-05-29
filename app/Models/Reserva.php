<?php

use OGrelo\core\EntidadBase;

class Reserva extends EntidadBase
{
    protected $id;
    protected $nombre;
    protected $apellidos;
    protected $telefono;
    protected $fecha;
    protected $comensales;
    protected $comentarios;

    protected $campos = [
        'nombre' => 'string',
        'apellidos' => 'string',
        'telefono' => 'string',
        'fecha' => 'datetime',
        'comensales' => 'int',
        'comentarios' => 'string'
    ];

    // Para algunas funciones podemos utilizar las funciones genéricas de EntidadBase
    // Otras las tenemos que reescribir de acuerdo al Dominio con el que trabajamos.
    // En este caso, sobreescribimos la función getAll(), para que muestre sólo las reservas futuras.

    public function getAll($fecha_desde = null, $fecha_hasta = null)
    {
        if (!$fecha_desde) {
            $fecha_desde = (new DateTime())->setTimezone(new DateTimeZone('Europe/Madrid'))->format('Y-m-d H:i');
        }

        $registros = $this->table->select('*')->where("fecha >= '$fecha_desde'");

        if ($fecha_hasta) {
            $registros->andWhere("fecha <= '$fecha_hasta'");
        }

        $registros->order('fecha');

        return $registros->getAll();
    }

//    public function count24horas()
//    {
//        $fecha_desde = (new DateTime())->format('Y-m-d H:i');
//        $fecha_hasta = (new DateTime('+24 hours'))->format('Y-m-d H:i');
//        $res = $this->table->select('COUNT(*) num')
//                           ->where("fecha >= '$fecha_desde'")
//                           ->andWhere("fecha <= '$fecha_hasta'")
//                           ->get();
//        if (!$res) {
//            return 0;
//        }
//        return $res['num'];
//    }

}
