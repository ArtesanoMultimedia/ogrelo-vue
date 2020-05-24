<?php

namespace OGrelo\core;

use Twig\Environment;
use Twig\Extension\DebugExtension;
use Twig\Loader\FilesystemLoader;

class ControladorBase
{
    /** @var EntidadBase model */
    protected $model;
    protected $slug;

    /**
     * ControladorBase constructor.
     */
    public function __construct()
    {
        //Incluir todos los modelos (Podría considerarse cargar sólo el modelo necesario, pero podría presentar problemas si hubiera modelos dependientes).
        foreach (glob("app/Models/*.php") as $file) {
            require_once $file;
        }

        $this->model = substr(static::class, 0, -11);
        $this->slug = strtolower(substr(static::class, 0, -10));

    }

    public function index()
    {
        $registros = $this->getRegistros();

        //Cargamos la vista index y le pasamos valores
        $this->view($this->slug . '.index', array(
            $this->slug => $registros
        ));
    }

    public function create()
    {
        //Cargamos la vista create
        // Podemos pasar como data un objeto
        // $data = new StdClass();
        // $data->nombre = 'otra prueba';
        // o un array
        // $data = ['nombre' => 'prueba'];
//        $this->view($this->slug . '.create', $data);
        $this->view($this->slug . '.create');
    }

    public function show($id)
    {
        /** @var EntidadBase $entidad */
        $entidad = new $this->model();
        $registro = $entidad->getById($id);

        //Cargamos la vista index y le pasamos valores
        $this->view($this->slug . '.show', array(
            substr($this->slug, 0, -1) => $registro
        ));
    }

    public function edit($id)
    {
        /** @var EntidadBase $entidad */
        $entidad = new $this->model();
        $entidad->getById($id);
        $this->view($this->slug . '.edit', $entidad);
    }

    public function store()
    {
        $errors = [];

         /** @var EntidadBase $entidad */
        $entidad = $this->saveFromRequest();

        if (!$entidad->id) {
            $errors[] = ['SystemError' => 'Se ha producido un error al guardar el registro'];
        }

        header('Content-type: Application-json');
        if (empty($errors)) {
            echo json_encode(['ok' => true, 'errors' => $errors ?: null]);
        } else {
            echo json_encode(['ok' => false, 'errors' => $errors ?: null]);
        }
    }

    public function ajaxUpdate()
    {
        $this->store();
    }

    private function saveFromRequest() {
        /** @var EntidadBase $entidad */
        $entidad = new $this->model();
        $entidad->fromRequest()->save();
        return $entidad;
    }

    public function destroy($id)
    {
        $this->ajaxDestroy($id);
        $this->redirect($this->slug, 'index');
    }

    public function ajaxDestroy($id)
    {
        $entidad = new $this->model();
        $result = $entidad->deleteById($id);
        header('Content-type: Application-json');
        echo json_encode($result);
    }

    private function getRegistros()
    {
        $entidad = new $this->model();
        return $entidad->getAll();
    }

    /*
    * Este método lo que hace es recibir los datos del controlador en forma de array
    * los recorre y crea una variable dinámica con el indice asociativo y le da el
    * valor que contiene dicha posición del array, luego carga los helpers para las
    * vistas y carga la vista que le llega como parámetro. En resumen un método para
    * renderizar vistas.
    */
    public function view($vista, $datos = [])
    {
        $loader = new FilesystemLoader(__DIR__ . '/../app/Views/');
        $twig = new Environment($loader, [
            'debug' => DEBUG,
        ]);
        if (DEBUG) {
            $twig->addExtension(new DebugExtension());
        }
        $helper = new HelperVistas();
        if (!is_array($datos)) {
            $datos = json_decode(json_encode($datos), true);
        }
        echo $twig->render(str_replace('.', '/', $vista) . '.html', array_merge($datos, ['helper' => $helper]));

    }

    public function redirect($controlador = DEFAULT_CONTROLLER, $accion = DEFAULT_ACTION)
    {
        $controlador = strtolower($controlador);
        $accion = strtolower($accion);
        header("Location:/$controlador/$accion");
    }

}
