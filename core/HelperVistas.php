<?php

namespace OGrelo\core;

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class HelperVistas
{
    protected $twig;

    public function __construct()
    {
        $loader = new FilesystemLoader(__DIR__ . '/../app/Views/');
        $this->twig = new Environment($loader);
    }

    public function url($controlador = DEFAULT_CONTROLLER, $accion = DEFAULT_ACTION, $id = null)
    {
        switch ($accion) {
            case 'index':
            case 'store':
                return $controlador;
                break;
            case 'create':
                return $controlador . '/create';
                break;
            case 'show':
            case 'update':
            case 'destroy':
                return $controlador . '/' . $id;
                break;
            case 'edit':
                return $controlador . '/' . $id . '/edit';
                break;
            default:
                return $controlador . '/' . $accion;
        }
    }

    public function ajaxUrl($controlador = DEFAULT_CONTROLLER, $accion = DEFAULT_ACTION, $id = null)
    {
        return 'ajax/' . $this->url($controlador, $accion, $id);
    }

    public function assets($file) {
        return '/app/Assets/' . $file;
    }

    public function assetsJS($js) {
        if (substr($js,0,3) !== 'js/') {
            $js = 'js/' . $js;
        }

        if (substr($js,-3,3) !== '.js') {
            $js .= '.js';
        }
        return html_entity_decode('<script src="/app/Assets/'.$js.'"></script>');
    }

    public function assetsCSS($css) {
        if (substr($css,0,4) !== 'css/') {
            $css = 'css/' . $css;
        }

        if (substr($css,-4,4) !== '.css') {
            $css .= '.css';
        }

        return html_entity_decode('<link href="/app/Assets/'.$css.'" rel="stylesheet"></link>');
    }

    public function input($type, $name, $label, $class = 'form-control', $placeholder = null) {
        $vars = ['type' => $type, 'name' => $name, 'label' => $label, 'class' => $class, 'placeholder' => $placeholder];
        $this->twig->display('forms/input.html', $vars);
    }

    public function submit($form, $value, $class) {
        $vars = ['form' => $form, 'value' => $value, 'class' => $class];
        $this->twig->display('usuarios/forms/submit.html', $vars);
    }

    //Helpers para las vistas
}
