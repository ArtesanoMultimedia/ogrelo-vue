<?php

use OGrelo\core\ResourceRoute;
use OGrelo\core\Router;
use OGrelo\core\Exceptions\RouteNotFoundException;

$router = new Router('');
$assets = new Router('assets/');
$ajax = new Router('ajax/');

// Establecemos la ruta principal, las constantes se definen en config/Constants.php

$router->get('/', function() {
    to(implode('#', [DEFAULT_CONTROLLER, DEFAULT_ACTION]));
});

//$assets->get('/js/([\w]+)*.js', function() {
//    to('vue#jsasset');
//});

// Sobreescribimos la ruta principal para redirigir al index

$router->get('/reservas', function() {
    header("Location:/");
});

// Rutas especídifcas que no se crean automáticamente por ResourceRoute.

$ajax->get('/reservas/proximas24horas', function() {
    to('reservas#ajaxIndex24horas');
});

$ajax->get('/reservas/proximas24horas/count', function() {
    to('reservas#count24horas');
});

// Comparamos la url con las rutas registradas hasta este punto
try {
    $router->route();
} catch (RouteNotFoundException $e) {
    try {
        $ajax->route();
    } catch (RouteNotFoundException $e) {
        try {
            // Llegamos a este punto si la ruta solicitada no concuerda con las rutas especificadas más arriba

            // Aquí colocamos las rutas CRUD de los modelos:

            ResourceRoute::add('reservas');


        } catch (RouteNotFoundException $e) {
            // TODO: Implementar una vista para los errores y utilizarla para mostrar el error 404.
            echo '404';
        }
    }
}
