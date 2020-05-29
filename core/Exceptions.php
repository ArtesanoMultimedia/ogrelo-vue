<?php

namespace OGrelo\core\Exceptions;

use Exception;

class BaseException extends Exception
{
    public function __construct($message = '', $code = 0, Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function __toString()
    {
        return static::class . ": [{$this->code}]: {$this->message}\n";
    }
}

/* Database Exceptions */
class DatabaseConnectionException extends BaseException {}

/* Router Exceptions */
class RouteNotFoundException extends BaseException {}

class PrefixException extends BaseException {}

