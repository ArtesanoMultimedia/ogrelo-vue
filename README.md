# Práctica: Cómo hacer una web con Vue.js para poder gestionar un restaurante

Para esta práctica, he utilizado el mismo backend que para la anterior, aunque he hecho unas cuantas modificaciones; la más destacable es que he creado un nuevo QueryBuilder, lo que me ha hecho modificar las consultas por completo.

En cuanto a Vue, he dividido la aplicación en algunos componentes y he utilizado Vuex para controlar el estado de todas las variables compartidas de la aplicación.

## Instalación

He utilizado Vue importado desde CDN, por lo que no hace falta instalar node ni ningún paquete de npm para el FrontEnd.

Para el Backend:

- Instalar dependencias:

    ```
    composer install
    ```

- Configurar base de datos en el archivo `config/Database.php`:
    ```
    static public $driver   = 'mysql';
    static public $host     = 'localhost';
    static public $port     = '3307';
    static public $user     = 'root';
    static public $pass     = '';
    static public $database = 'ogrelo';
    static public $charset  = 'utf8';
    ```
    Por ahora, sólo está disponible el driver **mysql**.

## Distribución de carpetas

### /app

Contiene los archivos específicos del proyecto. El CSS y el Javascript de la aplicación, en la carpeta `Assets`, y los Modelos y Controladores del backend. También el html base de la aplicación.



#### `/app/Assets/css`

Contiene el css, generado a partir de SCSS.

#### `/app/Assets/js`

Contiene la definición de la aplicación Vue en `app.js` así como la store de Vuex en `store.js`. En este último archivo se definen los datos y todos los métodos de Vuex: mutaciones, getters, acciones,...

#### `/app/Controllers`

Los controladores del Backend que extienden a core/ControladorBase. Las funciones de comportamiento genérico, están definidas en la clase padre y en la clase hija sólo se sobreescriben las funciones que necesiten un comportamiento diferente al genérico o se escriben nuevas funciones específicas del dominio.

Aquí he añadido un nuevo controlador, que es el que gestiona la vista. Recibe la petición y redirige al punto de entrada de la aplicación Vue.

#### `/app/Modelos`

Los modelos extienden a core/EntidadBase. Al igual que con los controladores, la lógica genérica está implementada en la clase padre.

#### `/app/Views`

Contiene el archivo `app.html`, con el layout del html de la aplicación. Desde aquí se carga todo lo demás.

>**Faltaría:**

### /config

Aquí van los archivos de configuración propios del proyecto.

* En `Constants.php`, se define el controlador y la acción por defecto, que se llamarán al cargar la ruta "/".

    También se establece la constante DEBUG. Si se establece en true, se puede usasr `{{ dump() }}` en las vistas para depurar las variables de Twig.
    
* En `Database.php`, se configuran los datos de acceso a la base de datos.

### /consoleApp

La idea es crear una aplicación de línea de comandos para agilizar futuros desarrollos, pero por ahora sólo hay unos archivos de prueba para comprobar que la aplicación funciona.

Con respecto a la práctica anterior he añadido un comando que me permitía crear Excepciones personalizadas, que podían ser útiles en el desarrollo del backend.

### /core

Archivos del framework que son comunes a cualquier dominio dentro de un proyecto y también independientes del proyecto. Es decir, en el futuro el framework sería una dependencia del proyecto y esta carpeta iría dentro de `/vendor`.

Los archivos que más atención merecen son:

- `ControladorBase.php`: Aquí se implementan los métodos genéricos de los controladores. Acciones como: index(), create(), update(), destroy(), etc.
    
    Utiliza la propiedad `model` para cargar la clase relativa al Modelo del dominio. Es decir, en ReservasController, se puede llamar al modelo Reserva mediante `new $this->model();`. Esto permite abstraer la lógica común de los controladores a esta clase padre.

- `EntidadBase.php`: Es la clase de la que heredan los modelos.

    Por defecto, se asume el modelo recibirá el nombre en singular y la tabla de la base de datos, en plural, del modo:
    
    - Modelo: Reserva, Tabla: reservas.
    - Modelo: Usuario, Tabla: usuarios.
    
    Si no fuera así, en la clase hija habría que implementar el siguiente método:
    
    ```php
    protected function setTableName()
    {
        $this->tableName = 'NOMBRE_TABLA';
    }
    ```
    
    En las clases hijas se debe definir la propiedad `$campos` como un array asociativo que indica el nombre de los campos de la base de datos y el tipo de dato que almacenan.
    
    De la misma forma, se puede definir `$camposPublicos`, que se usará cuando se vaya a mostrar un objeto (por ejemplo, en el modelo Usuario, no contendría el campo password).
    
    También se puede definir `$camposRellenables`, que serían los que se permitirían editar por el usuario. (Por ejemplo, no estarían dentro de ese array campos como timestamps o campos calculados).
    
    >**Faltaría:**
    >
    >- [ ] Traducir los usos de `$this->db->query` para utilizar el QueryBuilder: `$this->table->`.

- `ResourceRoute.php`: Es el archivo que genera automáticamente todas las rutas genéricas relativas al CRUD de un dominio, tal y como se detallan en la siguiente tabla, donde {prefix} se detalla al instanciar el Router (por ejemplo 'ajax') y {slug} es el nombre del recurso (reservas, usuarios, posts,...):
    
    | Método | Ruta              | Acción                    | Descripción                                                                                   |
    |--------|-------------------|---------------------------|-----------------------------------------------------------------------------------------------|
    | GET    | /{prefix}/{slug}           | Controller->{prefix}index()       | Muestra la vista con la lista de registros                                                    |
    | GET    | /{prefix}/{slug}/create    | Controller->{prefix}create()      | Muestra el formulario para crear un nuevo registro                                            |
    | POST   | /{prefix}/{slug}           | Controller->{prefix}store()       | Crea un nuevo registro y muestra una vista de confirmación o, (por defecto) redirige al index |
    | GET    | /{prefix}/{slug}/{id}      | Controller->{prefix}show()        | Muestra una vista individual de un registro                                                   |
    | GET    | /{prefix}/{slug}/{id}/edit | Controller->{prefix}edit()        | Muestra el formulario para editar un registro                                                 |
    | POST   | /{prefix}/{slug}/{id}      | Controller->{prefix}update()      | Actualiza un registro y muestra una vista de confirmación                                     |
    | DELETE | /{prefix}/{slug}/{id}      | Controller->{prefix}destroy()     | Elimina un registro y redirige al index                                                       |

- `Router.php` y `Route.php`: Conforman la lógica del enrutador que procesa las rutas de todas las peticiones.

- `QueryBuilder.php`: Poco a poco he ido creando un query builder para abstraer la lógica sql de los modelos.

### /routes

Aquí se configuran las rutas de la aplicación.

Si se quiere sobreescribir alguna ruta de las que se generan por defecto por el ResourceRoute, se colocan antes del bloque **try**.

### /tests

Es el lugar en el que irían los tests.

### /vendor

Es la carpeta en la que Composer guardará las dependencias.

## Archivos raíz

* **.htaccess** dirige todas las peticiones al archivo index.php.

* **index.php** carga global.php y routes/web.php, que será el encargado de dirigir las peticiones a los métodos correspondientes de los controladores.

* **global.php** carga la configuración, el core del framework y las dependencias. También define funciones globales.

* **ogrelo** es el ejecutable del CLI. Se utilizaría como: php ogrelo comando argumentos --opciones

* **README.md** es el presente documento, en el que se explica la práctica y el contenido del framework. La idea es que sirva tanto de guía para el docente que vaya a corregir la práctica como para mi YO futuro, cuando quiera rescatar este trabajo para aprovecharlo en otros desarrollos.

## Añadir un nuevo dominio

Para añadir un nuevo Dominio a nuestra aplicación (Empleados, Turnos,...), tendríamos que:

* Crear el **Modelo**, el **Controlador** y las **Vistas**.
* Añadir un enlace al sidebar en `/app/Views/common/partials/sidebar.html`.
* Añadir las rutas en `routes/web.php`.
