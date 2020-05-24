<?php

namespace OGrelo\core;

use OGrelo\core\Exceptions\RouteNotFoundException;

class ResourceRoute
{
    protected $slug;
    protected $controller;

    /**
     * @param $slug
     * @param null $controller
     * @throws RouteNotFoundException
     */
    static public function add($slug, $controller = null) {

        if (!$controller) {
            $controller = ucfirst($slug);
        }

        $router = new Router('');
        $ajax = new Router('ajax/');

        $router->get("/$slug", function() use ($controller) {
            echo 'index';die;
            to("$controller#index");
        });

        $router->get("/$slug/create", function() use ($controller) {
            to("$controller#create");
        });

        $router->post("/$slug", function() use ($controller) {
            to("$controller#store");
        });

        $router->get("/$slug/([\w]+)*", function($id) use ($controller) {
            to("$controller#show", $id);
        });

        $router->get("/$slug/([\w]+)*/edit", function($id) use ($controller) {
            to("$controller#edit", $id);
        });

        $router->put("/$slug/([\w]+)*", function($id) use ($controller) {
            echo 'update';die;
            to("$controller#update", $id);
        });

        $router->delete("/$slug/([\w]+)*", function($id) use ($controller) {
            echo 'destroy'; die;
            to("$controller#destroy", $id);
        });

        $ajax->get("/$slug", function() use ($controller) {
            echo 'ajax.index';die;
            to("$controller#ajaxIndex");
        });

        $ajax->post("/$slug", function() use ($controller) {
            echo 'ajax.store';die;
            to("$controller#ajaxStore");
        });

        $ajax->get("/$slug/([\w]+)*", function($id) use ($controller) {
            echo 'ajax.show';die;
            to("$controller#ajaxShow", $id);
        });

        $ajax->put("/$slug/([\w]+)*", function($id) use ($controller) {
            to("$controller#ajaxUpdate", $id);
        });

        $ajax->delete("/$slug/([\w]+)*", function($id) use ($controller) {
            to("$controller#ajaxDestroy", $id);
        });


        try {
            $router->route();
        } catch (RouteNotFoundException $e) {
            $ajax->route();
        }


    }
    
}
