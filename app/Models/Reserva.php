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
    // En este caso, sobreescribimos la función index(), para que por defecto muestre sólo las

    public function index($fecha_desde = null, $fecha_hasta = null, $length = false)
    {
        $fecha_desde = $fecha_desde ?: date('Y-m-d H:i:s');
        $fechas = [$fecha_desde];
        if ($length) {
            $query = "SELECT COUNT(*) as num_reservas FROM $this->tableName WHERE fecha >= ?";
        } else {
            $query = "SELECT * FROM $this->tableName WHERE fecha >= ?";
        }
        if ($fecha_hasta) {
            $query .= ' AND fecha <= ?';
            $fechas[] = $fecha_hasta;
        }
        $query .= ' ORDER BY fecha';
        if ($length) {
            $result = $this->table->query($query, $fechas)->fetchArray();
        } else {
            $result = $this->table->query($query, $fechas)->fetchAll();
        }
        return $result;
    }

}
