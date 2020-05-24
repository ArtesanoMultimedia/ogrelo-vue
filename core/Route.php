<?php

namespace OGrelo\core;

/**
 * A class representing a registered route. Each route is composed of a regular expression,
 * an array of allowed methods, and a callback function to execute if it matches.
 *
 * @package Router
 */
class Route
{
    /** @var string La expresión regular */
    private $expr;
    /** @var callable La función callback */
    private $callback;
    /** @var array Las coincidencias de $expr, que serán los argumentos del callback */
    private $matches;
    /** @var array Métodos permitidos para esta ruta */
    private $methods = array('GET', 'POST', 'HEAD', 'PUT', 'DELETE');

    /**
     * Constructor
     *
     * @param string $expr expresión regular que se comprobará
     * @param callable $callback función que se llamará si se llama a esta ruta
     * @param string|array $methods métodos permitidos
     */
    public function __construct($expr, $callback, $methods = null)
    {
        // La barra final es opcional
        $this->expr = '#^' . $expr . '/?$#';
        $this->callback = $callback;

        if ($methods !== null) {
            $this->methods = is_array($methods) ? $methods : array($methods);
        }
    }

    /**
     * Comprueba si la ruta coincide con la solicitada
     *
     * @param string $path
     * @return boolean
     */
    public function matches($path)
    {
        if (preg_match($this->expr, $path, $this->matches) &&
            in_array($_SERVER['REQUEST_METHOD'], $this->methods)) {
            return true;
        }

        return false;
    }

    /**
     * Ejecuta el callback.
     * La función matches debe ser llamada previamente y devolver true.
     */
    public function exec()
    {
        return call_user_func_array($this->callback, array_slice($this->matches, 1));
    }
}
