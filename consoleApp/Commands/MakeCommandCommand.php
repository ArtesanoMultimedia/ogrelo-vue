<?php

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class MakeCommandCommand extends Command
{
    protected $commandName = 'make:command';
    protected $commandDescription = 'Crea un nuevo comando de la aplicación de consola';
    protected $commandHelp = 'Este comando sirve para crear un nuevo comando con el nombre dado';

    protected $Comando = 'comando';
    protected $ComandoDescripcion = 'Comando que se desea generar, por ejemeplo: make:class';

    protected function configure()
    {
        $this
            ->setName($this->commandName)
            ->setDescription($this->commandDescription)
            ->setHelp($this->commandHelp)
            ->addArgument(
                $this->Comando,
                InputArgument::REQUIRED,
                $this->ComandoDescripcion
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $command = $input->getArgument($this->Comando);

        $camelCommand = str_replace(':', ' ', $command);
        $camelCommand = ucwords(strtolower($camelCommand));
        $camelCommand = str_replace(' ', '', $camelCommand);

        $newfile = __DIR__ . '/' . $camelCommand . 'Command.php';

        if (!is_file($newfile)) {
            $contents = "<?php\n
use Symfony\Component\Console\Command\Command;\n
use Symfony\Component\Console\Input\InputArgument;\n
use Symfony\Component\Console\Input\InputInterface;\n
use Symfony\Component\Console\Output\OutputInterface;\n
\n
class " . $camelCommand . "Command extends Command\n
{\n
    protected " . '$commandName' . " = '$command';\n
    protected " . '$commandDescription' . " = 'Descripción del comando';\n
    protected " . '$commandHelp' . " = 'Ayuda del comando';\n
\n
    protected " . '$Input' . " = 'input';\n
    protected " . '$InputDescription' . " = 'Descripción del input';\n
\n
    protected function configure()\n
    {\n
        " . '$this' . "\n" . '
            ->setName($this->commandName)' . "\n" . '
            ->setDescription($this->commandDescription)' . "\n" . '
            ->setHelp($this->commandHelp)' . "\n
            ->addArgument(\n" . '
                $this->Input,' . "\n
                InputArgument::REQUIRED,\n" . '
                $this->InputDescription' . "\n
            );\n
    }\n
\n" . '
    protected function execute(InputInterface $input, OutputInterface $output)' . "\n" . '
    {' . "\n" . '
        $text = "Texto de salida";' . "\n" . '
        $output->writeln($text);' . "\n
        return 0;\n
    }\n
}\n
\n";
            file_put_contents($newfile, $contents);
            $text = 'CORRECTO: Se ha generado el archivo ' . $newfile;
        } else {
            $text = "WARNING: El archivo $newfile ya existe. Debe ser eliminado para poder generar uno nuevo.";
        }
        $output->writeln($text);
        return 0;
    }
}
