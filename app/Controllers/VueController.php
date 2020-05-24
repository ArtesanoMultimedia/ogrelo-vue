<?php

use OGrelo\core\ControladorBase;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class VueController extends ControladorBase
{
    public function index()
    {
        $loader = new FilesystemLoader(__DIR__ . '/../Views/');
        $twig = new Environment($loader);

        echo $twig->render('app.html');
    }

    public function jsAsset($filename)
    {
        header('Content-Type: text/javascript');
        echo file_get_contents(__DIR__ . "/Assets/js/$filename.js");
    }
}
