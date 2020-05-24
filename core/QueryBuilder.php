<?php

namespace OGrelo\core;

use Exception;

class QueryBuilder
{
    public $query_count = 0;
    protected $connection;
    protected $table;
    protected $query;
    protected $sql;
    protected $fields = [];
    protected $keys = [];
    protected $values = [];
    protected $where = '';
    protected $limit;
    protected $show_errors = TRUE;
    protected $query_closed = TRUE;
    protected $mode;
    protected $errors = [];
    protected $templateSelect;
    protected $templateInsert;
    protected $templateReplace;
    protected $templateUpdate;
    protected $templateDelete;
    protected $templateTruncate;

    public function __construct($args)
    {
        $this->connection = $args['connection'];
    }

    public function table($table) {
        $this->table = $table;
        return $this;
    }

    public function insert($keys, $values) {
        $this->mode = 'INSERT';
        $this->keys = $keys;
        $this->values = $values;
        $this->setQuery();
        $this->query($this->sql, $values);
        return $this->lastInsertId();
    }

    public function update($keys, $values) {
        $this->mode = 'UPDATE';
        $this->keys = $keys;
        $this->values = $values;
        $this->setQuery();
        $this->query($this->sql, $values);
        return $this->affectedRows();
    }

    public function select() {
        $this->mode = 'SELECT';
        return $this;
    }

    public function delete($where) {
        $this->mode = 'DELETE';
        $this->where = $where;
        return $this;
    }

    public function do() {
        $this->setQuery();
        $this->query($this->sql);
        return $this;
    }

    public function get() {
        $this->setQuery();
        return $this->query($this->sql)->fetchArray();
    }

    public function getAll() {
        $this->setQuery();
        return $this->query($this->sql)->fetchAll();
    }

    private function setQuery() {
        switch ($this->mode) {
            case 'INSERT':
                $interrogantes = array();
                for ($i = 0; $i < count($this->keys); $i++) {
                    $interrogantes[] = '?';
                }
                $this->sql = "INSERT INTO $this->table ( " . implode(', ', $this->keys) . " ) VALUES ( " . implode(', ' , $interrogantes) . " )";
                break;
            case 'DELETE':
                if ($this->where) {
                    $this->sql = "DELETE FROM $this->table WHERE $this->where";
                } else {
                    throw new Exception('Debe indicarse alguna condición WHERE al hacer un DELETE');
                }
                break;
            case 'UPDATE':
                if ($this->where) {
                    $arrayCampos = [];
                    foreach($this->keys as $key) {
                        $arrayCampos[] = "$key = ?";
                    }
                    $campos = implode(', ', $arrayCampos);
                    $this->sql = "update $this->table SET $campos WHERE $this->where";
                } else {
                    throw new Exception('Debe indicarse alguna condición WHERE al hacer un DELETE');
                }
                break;
            case 'SELECT':
            default:
                if (!$this->fields) {
                    $this->fields = '*';
                }
                if (is_array($this->fields)) {
                    $this->sql = "SELECT " . implode(',', $this->fields) . " FROM $this->table";
                } else {
                    $this->sql = "SELECT $this->fields FROM $this->table";
                }
                if ($this->where) {
                    $this->sql .= " WHERE $this->where";
                }
                break;
        }
    }

    public function field($field, $alias = null) {
        if (is_array($field) && !$alias) {
            $this->fields($field);
        } elseif ($alias) {
            $this->fields[] = "$field \"$alias\"";
        } else {
            $this->fields[] = $field;
        }
    }

    public function fields($fields) {
        if ($this->hasStringKeys($fields)) {
            foreach ($fields as $field => $alias) {
                $this->fields[] = "$field \"$alias\"";
            }
        } else {
            foreach ($fields as $field) {
                $this->fields[] = $field;
            }
        }
    }

    public function where($where) {
        if ($this->where) {
            $this->where .= " AND $where ";
        } else {
            $this->where = $where;
        }
        return $this;
    }

    public function andWhere($where) {
        $this->where .= " AND $where ";
        return $this;
    }

    public function orWhere($where) {
        $this->where .= " OR $where ";
        return $this;
    }

    private function hasStringKeys(array $array) {
        return count(array_filter(array_keys($array), 'is_string')) > 0;
    }

    public function query($query) {
        if (!$this->query_closed) {
            $this->query->close();
        }
        if ($this->query = $this->connection->prepare($query)) {
            if (func_num_args() > 1) {
                $x = func_get_args();
                $args = array_slice($x, 1);
                $types = '';
                $args_ref = array();
                foreach ($args as $k => &$arg) {
                    if (is_array($args[$k])) {
                        foreach ($args[$k] as $j => &$a) {
                            $types .= $this->_gettype($args[$k][$j]);
                            $args_ref[] = &$a;
                        }
                    } else {
                        $types .= $this->_gettype($args[$k]);
                        $args_ref[] = &$arg;
                    }
                }
                array_unshift($args_ref, $types);
                call_user_func_array(array($this->query, 'bind_param'), $args_ref);
            }
            $this->query->execute();
            if ($this->query->errno) {
                $this->error('No se ha podido procesar la query (revise los parámetros) - ' . $this->query->error);
            }
            $this->query_closed = FALSE;
            $this->query_count++;
        } else {
            $this->error('No se ha podido preparar la sentencia MySQL (revise la sintaxis) - ' . $this->connection->error);
        }
        return $this;
    }

    public function fetchAll($callback = null) {
        $params = array();
        $row = array();
        $meta = $this->query->result_metadata();
        while ($field = $meta->fetch_field()) {
            $params[] = &$row[$field->name];
        }
        call_user_func_array(array($this->query, 'bind_result'), $params);
        $result = array();
        while ($this->query->fetch()) {
            $r = array();
            foreach ($row as $key => $val) {
                $r[$key] = $val;
            }
            if ($callback != null && is_callable($callback)) {
                $value = call_user_func($callback, $r);
                if ($value == 'break') break;
            } else {
                $result[] = $r;
            }
        }
        $this->query->close();
        $this->query_closed = TRUE;
        return $result;
    }

    public function fetchArray() {
        $params = array();
        $row = array();
        $meta = $this->query->result_metadata();
        while ($field = $meta->fetch_field()) {
            $params[] = &$row[$field->name];
        }
        call_user_func_array(array($this->query, 'bind_result'), $params);
        $result = array();
        while ($this->query->fetch()) {
            foreach ($row as $key => $val) {
                $result[$key] = $val;
            }
        }
        $this->query->close();
        $this->query_closed = TRUE;
        return $result;
    }

    public function close() {
        return $this->connection->close();
    }

    public function numRows() {
        $this->query->store_result();
        return $this->query->num_rows;
    }

    public function affectedRows() {
        return $this->query->affected_rows;
    }

    public function lastInsertID() {
        return $this->query->insert_id;
    }

    protected function error($error) {
        $this->errors[] = ['error' => $error, 'query' => $this->sql];
    }

    public function getErrors() {
        return $this->errors;
    }

    private function _gettype($var) {
        if (is_string($var)) return 's';
        if (is_float($var)) return 'd';
        if (is_int($var)) return 'i';
        return 'b';
    }

}
