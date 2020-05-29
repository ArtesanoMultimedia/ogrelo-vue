<?php

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class MakeExceptionCommand extends Command
{
    protected $commandName = 'make:exception';
    protected $commandDescription = 'Crea una nueva clase de excepción';
    protected $commandHelp = 'Este comando sirve para crear un nueva excepción con el nombre dado que heredará de BaseException.';

    protected $Nombre = 'nombre';
    protected $NombreDescripcion = 'Nombre de la Excepción que se desea generar, por ejemplo: InvalidArgument';

    protected function configure()
    {
        $this
            ->setName($this->commandName)
            ->setDescription($this->commandDescription)
            ->setHelp($this->commandHelp)
            ->addArgument(
                $this->Nombre,
                InputArgument::REQUIRED,
                $this->NombreDescripcion
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $nombre = $input->getArgument($this->Nombre);

        if (strpos('Exception', $nombre) == 0) {
            $nombre .= 'Exception';
        }

        $exceptionsFile = __DIR__ . '/../../core/Exceptions.php';

        if (is_file($exceptionsFile)) {
            $contents = "\nclass $nombre extends BaseException {}\n";
            file_put_contents($exceptionsFile, $contents, FILE_APPEND);
            $text = 'CORRECTO: Se ha creado la Excepción: ' . $nombre;
        } else {
            $text = "ERROR: No se ha encontrado el archivo de Excepciones: $exceptionsFile";
        }
        $output->writeln($text);
        return 0;
    }
}
