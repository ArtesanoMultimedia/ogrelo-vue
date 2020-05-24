<?php

namespace OGrelo\core;

//use OGrelo\core\QueryBuilder;
//use atk4\dsql\Exception;
use Exception;
use OGrelo\config\Database;
use mysqli;
//use PDO;
//use atk4\dsql\Query;
//use PDOException;

class DB
{
    private $driver, $host, $port, $user, $pass, $database, $charset;

    public function __construct()
    {
        $this->driver = Database::$driver;
        $this->host = Database::$host;
        $this->port = Database::$port;
        $this->user = Database::$user;
        $this->pass = Database::$pass;
        $this->database = Database::$database;
        $this->charset = Database::$charset;
    }

    public function conexion()
    {
        try {
           $connection = new mysqli($this->host, $this->user, $this->pass, $this->database);
            if ($connection->connect_error) {
                throw new Exception('Error en la conexión a MySQL. Revise la configuración en config/Database.php - ' . $connection->connect_error);
            }
            $connection->set_charset($this->charset);
//        $connection = new PDO("mysql:host=localhost;dbname=ezetablog;charset=utf8", $this->user, $this->pass);
            $query = new QueryBuilder(['connection' => $connection]);
        } catch (Exception $e) {
            if (strpos($e, 'Host desconocido')) {

            }

            echo($e);
            die;
        }
        return $query;
    }

    public function error($error) {
        if ($this->show_errors) {
            exit($error);
        }
    }

    private function _gettype($var) {
        if (is_string($var)) return 's';
        if (is_float($var)) return 'd';
        if (is_int($var)) return 'i';
        return 'b';
    }

}
