<?php

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo 'No se ha encontrado el archivo vendor/autoload.php. Asegúrese de ejecutar "composer install" para instalar las dependencias.';
    die;
}


// Cargamos el framework
require 'global.php';

// create a log channel
$log = new Logger('name');
$log->pushHandler(new StreamHandler(__DIR__ . '/logs/backend.log', Logger::DEBUG));

// Cargamos las rutas
require 'routes/web.php';
