<?php

namespace OGrelo\core;

//use OGrelo\core\QueryBuilder;
//use atk4\dsql\Exception;
use Exception;
use OGrelo\config\Database;
use mysqli;
use OGrelo\core\Exceptions\DatabaseAccesDeniedException;
use OGrelo\core\Exceptions\DatabaseConnectionException;
use OGrelo\core\Exceptions\UnknownHostException;
use OGrelo\core\Exceptions\UnknownDatabaseException;

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
       $connection = new mysqli($this->host, $this->user, $this->pass, $this->database);
        if ($connection->connect_error) {
            throw new DatabaseConnectionException('Error en la conexión a MySQL. Revise la configuración en config/Database.php - ' . $connection->connect_error);
        }
        $connection->set_charset($this->charset);

        $query = new QueryBuilder(['connection' => $connection]);

        return $query;
    }
//
//    public function error($error) {
//        if ($this->show_errors) {
//            exit($error);
//        }
//    }
//
//    private function _gettype($var) {
//        if (is_string($var)) return 's';
//        if (is_float($var)) return 'd';
//        if (is_int($var)) return 'i';
//        return 'b';
//    }

}
