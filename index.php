<?php

if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo 'No se ha encontrado el archivo vendor/autoload.php. Asegúrese de ejecutar "composer install" para instalar las dependencias.';
    die;
}

// Cargamos el framework
require 'global.php';

// Cargamos las rutas
require 'routes/web.php';
