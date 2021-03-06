<?php

namespace OGrelo\core;

use DateTime;
use JsonSerializable;
use stdClass;

class EntidadBase implements JsonSerializable
{
    private $tableName;
    private $db;
    /** @var QueryBuilder $table */
    protected $table;
    protected $id;
    protected $campos;
    protected $camposPublicos;
    protected $camposRellenables;

    public function __construct()
    {
        global $conexion;
        $this->setTableName();
        $this->db = $conexion;
        $this->table = $this->db->table($this->tableName);
    }

    /*
     * Si la tabla no guarda el estándar de plural, hay que sobreescribir esta función en la clase hija
     */
    protected function setTableName()
    {
        $len = strlen(static::class);
        $pos = strrpos(static::class, "\\");
        if ($pos !== false) {
            $this->tableName = strtolower(substr(static::class, $pos + 1, $len - $pos)) . 's';
        } else {
            $this->tableName = strtolower(static::class) . 's';
        }
    }

    public function db()
    {
        return $this->db;
    }

    public function getAll()
    {
        $this->setCamposPublicos();
        $campos = implode(', ', $this->camposPublicos);
        $registros = $this->table->select($campos);
        return $registros->getAll();
    }

    public function getById($id)
    {
        global $log;
        $log->info('getById, $id=' . $id);
        $array = $this->table->select()->where("id = $id")->get();
        $this->id = $array['id'];
        foreach ($this->campos as $campo => $tipo) {
            $this->$campo = $array[$campo];
        }
        return $array;
    }

    public function getBy($column, $value)
    {
        $query = $this->db->query("SELECT * FROM $this->tableName WHERE $column='$value'");

        while ($row = $query->fetch_object()) {
            $resultSet[] = $row;
        }

        return $resultSet;
    }

    public function deleteById($id)
    {
        return $this->deleteBy('id', $id);
    }

    public function deleteBy($column, $value)
    {
        $result = $this->table->delete("$column=$value")->run();
        if ($result) {
            return ['deleted' => true];
        }
        return ['deleted' => false];
    }

    public function save()
    {
        if ($this->id) {
            return $this->actualizar($this->id);
        } else {
            return $this->nueva();
        }
    }


    public function nueva()
    {
        $keys = array();
        $values = array();

        foreach ($this->campos as $campo => $tipo) {
            $keys[] = $campo;
            if ($tipo === 'datetime') {
                if (is_object($this->$campo)) {
                    $values[] = "'".($this->$campo)->format('Y-m-d H:i')."'";
                } else {
                    if (strpos($this->$campo, '/')) {
                        $date = DateTime::createFromFormat('d/m/Y H:i', $this->$campo);
                    } else {
                        $date = new DateTime($this->$campo);
                    }
                    $values[] = "'".$date->format('Y-m-d H:i')."'";
                }
            } else if ($tipo === 'string') {
                $values[] = "'".$this->$campo."'";
            } else {
                $values[] = $this->$campo;
            }
        }
        $this->table->insert($keys, $values)->run();
        $id = $this->table->lastInsertedId();

        if ($id) {
            $this->id = $id;
            return true;
        } else {
            return false;
        }
    }

    public function actualizar($id)
    {
        $keys = array();
        $values = array();

        foreach ($this->campos as $campo => $tipo) {
            $keys[] = $campo;
            if ($tipo === 'datetime') {
                if (is_object($this->$campo)) {
                    $values[] = "'".($this->$campo)->format('Y-m-d H:i')."'";
                } else {
                    if (strpos($this->$campo, '/')) {
                        $date = DateTime::createFromFormat('d/m/Y H:i', $this->$campo);
                    } else {
                        $date = new DateTime($this->$campo);
                    }
                    $values[] = "'".$date->format('Y-m-d H:i')."'";
                }
            } else if ($tipo === 'string') {
                $values[] = "'".$this->$campo."'";
            } else {
                $values[] = $this->$campo;
            }
        }
        $rows = $this->table->update($keys, $values)->where("id = $id")->run();

        $this->getById($id);
        if ($rows > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function __get($property)
    {
        if (property_exists($this, $property)) {
            return $this->$property;
        }
    }

    public function __set($property, $value)
    {
        if (property_exists($this, $property)) {
            $this->$property = $value;
        }
    }

    public function fromRequest() {
        if($_SERVER['REQUEST_METHOD'] == 'PUT') {
            parse_str(file_get_contents("php://input"),$_REQUEST);
        }
        if (is_string($_REQUEST)) {
            $_REQUEST = json_decode($_REQUEST);
        }

        if (array_key_exists('id', $_REQUEST) && $_REQUEST['id'] > 0) {
            $this->id = $_REQUEST['id'];
            global $log;
            $log->error('id = ' . $this->id);
            $this->getById($this->id);
        }

        if (!$this->camposRellenables) {
            $this->camposRellenables = array_keys($this->campos);
        }
        foreach ($this->camposRellenables as $campo) {
            if (array_key_exists($campo, $_REQUEST)) {
                $this->$campo = $_REQUEST[$campo];
            }
        }
        return $this;
    }

    private function setCamposPublicos() {
        if (!$this->camposPublicos) {
            $this->camposPublicos = array_keys($this->campos);
        }
    }

    public function jsonSerialize()
    {
        $this->setCamposPublicos();

        $export = new stdClass();
        $export->id = $this->id;
        foreach ($this->camposPublicos as $campo) {
            $export->$campo = $this->$campo;
        }

        return $export;
    }
    /*
     * Aquí podemos montarnos un montón de métodos que nos ayuden
     * a hacer operaciones con la base de datos de la entidad
     */

}
