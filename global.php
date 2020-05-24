<?php

use OGrelo\core\DB;
use OGrelo\core\QueryBuilder;

load([
    'vendor' => 'autoload',
    'config' => [
        'Constants',
        'Database',
    ],
    'core' => [
        'ControladorBase',
        'DB',
        'EntidadBase',
        'HelperVistas',
        'QueryBuilder',
        'Route',
        'Router',
        'ResourceRoute',
        'Exceptions/RouteNotFoundException',
    ],
]);

$conectar = new DB();
/** @var QueryBuilder $conexion */
$conexion = $conectar->conexion();

function load($modules) {
    foreach ($modules as $dir => $classes) {
        if (is_array($classes)) {
            requireArray($dir, $classes);
        } else {
            requireClass($dir, $classes);
        }
    }
}

function requireArray($dir, $classes) {
    foreach ($classes as $class) {
        requireClass($dir, $class);
    }
}

function requireClass($dir, $class) {
    require_once __DIR__ . '/' . $dir . '/' . $class . '.php';
}

function cargarControlador($controller)
{
    $controlador = ucwords($controller) . 'Controller';
    $strFileController = 'app/Controllers/' . $controlador . '.php';

    if (!is_file($strFileController)) {
        $strFileController = 'app/Controllers/' . ucwords(DEFAULT_CONTROLLER) . 'Controller.php';
    }

    require_once $strFileController;
    $controllerObj = new $controlador();
    return $controllerObj;
}

function cargarAccion($controllerObj, $action, $params = null)
{
    $accion = $action;
    if (is_array($params)) {
        call_user_func_array(array($controllerObj, $accion), $params);
    } else {
        call_user_func(array($controllerObj, $accion), $params);
    }
}

function to($input, $params = null) {
    [$controlador, $accion] = explode('#', $input);
    $controllerObj = cargarControlador($controlador);
    cargarAccion($controllerObj, $accion, $params);
}
