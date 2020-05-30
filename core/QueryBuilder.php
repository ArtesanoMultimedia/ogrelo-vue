<?php

namespace OGrelo\core;

use DomainException;
use Exception;
use InvalidArgumentException;

class QueryBuilder
{
    private $connection;
    private $mode;
    private $table;
    private $select;
    private $from;
    private $join;
    private $where;
    private $order;
    private $limit;
    private $keys;
    private $values;
    private $debug = false;


    /**
     * QueryBuilder constructor.
     */
    public function __construct($args)
    {

        $this->connection = $args['connection'];

    }

    public function run() {
        $query = $this->getQuery();
        return $this->query($query);
    }

    public function clear() {
        $this->select = null;
        $this->join = null;
        $this->where = null;
        $this->order = null;
        $this->limit = null;
        $this->keys = null;
        $this->values = null;
        $this->debug = false;
    }

    public function lastInsertedId() {
        return $this->connection->insert_id;
    }

    public function get($query = null, $fetch_type = FetchTypeEnum::FETCH_ASSOC)
    {
        if (!$query) {
            $query = $this->getQuery();
        }
        if ($this->debug) {
            return $query;
        }
        $result = $this->limit(1)->query($query);
        return $result->fetch_array($fetch_type);
    }

    /**
     * @param $query
     * @return array|bool|string
     */
    public function getAll($query = null)
    {
        if (!$query) {
            $query = $this->getQuery();
        }
        if ($this->debug) {
            return $query;
        }
        $result = $this->query($query);
        if (!$result) {
            return [];
        }
        $return = array();
        while ($row = $result->fetch_assoc()) {
            $return[] = $row;
        }
        return $return;
    }

    public function debug()
    {
        $this->debug = true;
        return $this;
    }

    public function query($query)
    {
        if ($this->debug) {
            return $query;
        }
        return $this->connection->query($query);
    }

    public function num_rows($stmt)
    {
        return $stmt->num_rows;
    }

    public function error()
    {
        return $this->connection->error;
    }

    public function getMode()
    {
        return $this->mode;
    }

    public function getSelect()
    {
        return $this->select;
    }

    public function getFrom()
    {
        return $this->from;
    }

    public function getJoin()
    {
        return $this->join;
    }

    public function getWhere()
    {
        return $this->where;
    }

    public function getOrder()
    {
        return $this->order;
    }

    public function getQuery()
    {
        global $log;
        switch ($this->mode) {
            case 'INSERT':
                $query = 'INSERT INTO ' . $this->table . ' ( ' . implode(', ', $this->keys) . ' ) VALUES ( ' . implode(', ', $this->values) . ' ) ';
                break;
            case 'SELECT':
                $query = $this->select . $this->from . $this->join . $this->where . $this->order . $this->limit;
                break;
            case 'UPDATE':
                $campos = [];
                foreach($this->keys as $index => $key) {
                    $campos[] = $key . ' = ' . $this->values[$index];
                }
                $query = 'UPDATE ' . $this->table . ' SET ' . implode(', ', $campos) . ' ' . $this->where;
                break;
            case 'DELETE':
                $query = 'DELETE ' . $this->from . $this->where;
                break;
            default:
                $query = '';
        }

        $log->info($query);
        if ($query) {
            return $query;
        } else {
            return false;
        }
    }

    public function select($fields = null)
    {
        $this->clear();
        $this->mode = 'SELECT';
        if (!$fields) {
            $fields = '*';
        }
        if (!is_array($fields)) {
            if (!$this->select) {
                $this->select = 'SELECT ' . $fields . ' ';
            } else {
                $this->select .= ', ' . $fields . ' ';
            }
        } else {
            $this->select = 'SELECT ';
            foreach ($fields as $key => $value) {
                $this->select .= "$key AS $value , ";
            }
            $this->select = rtrim($this->select, ', ') . ' ';
        }
        return $this;
    }

    public function update($keys, $values) {
        $this->clear();
        $this->mode = 'UPDATE';
        $this->keys = $keys;
        $this->values = $values;
        return $this;
    }

    public function insert($keys, $values) {
        $this->clear();
        $this->mode = 'INSERT';
        $this->keys = $keys;
        $this->values = $values;
        return $this;
    }


    public function delete($where)
    {
        $this->clear();
        $this->mode = 'DELETE';
        $this->where($where);
        return $this;
    }

    public function table($table)
    {
        $this->table = $table;
        return $this->from($table);

    }

    public function from($from)
    {
        $this->from = 'FROM ' . $from . ' ';
        return $this;
    }

    public function ljoin($tabla, $campos = null)
    {
        $campos = $this->setCampos($tabla, $campos);
        $this->join .= 'LEFT JOIN ' . $tabla . ' ON ' . $campos . ' ';
        return $this;
    }

    public function rjoin($tabla, $campos = null)
    {
        $campos = $this->setCampos($tabla, $campos);
        $this->join .= 'RIGHT JOIN ' . $tabla . ' ON ' . $campos . ' ';
        return $this;
    }

    public function join($tabla, $campos = null)
    {
        $campos = $this->setCampos($tabla, $campos);
        $this->join .= 'INNER JOIN ' . $tabla . ' ON ' . $campos . ' ';
        return $this;
    }

    public function where($where, $valor = null, $nexo = 'AND')
    {
        if (!$where) {
            throw new InvalidArgumentException('No se han pasado condiciones a la función where');
        }
        $this->where .= !$this->where ? 'WHERE ' : $nexo . ' ';
        if (!$valor) {
            $this->where .= $where . ' ';
        } else {
            $this->where .= $where . ' = ' . $valor . ' ';
        }
        return $this;
    }

    public function andWhere($where, $valor = null)
    {
        $this->where($where, $valor, 'AND');
        return $this;
    }

    public function orWhere($where, $valor = null)
    {
        $this->where($where, $valor, 'OR');
        return $this;
    }

    public function order($order)
    {
        $this->order = "ORDER BY $order ";
        return $this;
    }

    public function limit($limit)
    {
        $this->limit = "LIMIT $limit ";
        return $this;
    }

    public function setCampos($tabla, $campos)
    {
        if (!$campos) {
            $from = substr($this->getFrom(), 5, -1);
            if ($from) {
                $campos = $tabla . '.id_' . $tabla . ' = ' . $from . '.id_' . $tabla;
            } else {
                $message = 'No se ha podido construir la cadena. Indique primero el campo form o especifique los campos del join.';
                throw new DomainException($message);
            }
        }
        $vinculadas = false;
        if (!is_array($campos)) {
            $nexos = [' OR ', ','];
            foreach ($nexos as $nexo) {
                if (strpos($campos, $nexo) > 0) {
                    $vinculadas = explode($nexo, $campos);
                    break;
                }
            }
        }

        if (is_array($campos)) {
            $vinculadas = $campos;
        }

        if ($vinculadas) {
            $campos = '( ';
            foreach ($vinculadas as $vinculada) {
                $campos .= $tabla . '.id_' . $tabla . ' = ' . trim($vinculada) . '.id_' . $tabla . ' OR ';
            }
            $campos = rtrim($campos, 'OR ');
            $campos .= ' )';
        }

        if (strpos($campos, '=') === false) {
            $campos = $tabla . '.id_' . $tabla . ' = ' . $campos . '.id_' . $tabla;
        }

        return $campos;
    }
}

class FetchTypeEnum
{
    const FETCH_NUMERIC = MYSQLI_NUM;
    const FETCH_ASSOC = MYSQLI_ASSOC;
    const FETCH_BOTH = MYSQLI_BOTH;
}

class QueryPrepareException extends Exception
{
}

