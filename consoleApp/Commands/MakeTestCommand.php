<?php

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class MakeTestCommand extends Command
{
    protected $commandName = 'make:test';
    protected $commandDescription = 'Crea un archivo de test';
    protected $commandHelp = 'Este comando genera un archivo en la carpeta tests con el nombre que le pasemos.';

    protected $Nombre = 'nombre';
    protected $NombreDescription = 'Nombre del archivo que se creará';

    protected $Desc = 'descripcion';
    protected $DescDescription = 'Breve explicación que se usará como nombre del método';

    protected function configure()
    {
        $this
            ->setName($this->commandName)
            ->setDescription($this->commandDescription)
            ->setHelp($this->commandHelp)
            ->addArgument(
                $this->Nombre,
                InputArgument::REQUIRED,
                $this->NombreDescription
            )
            ->addArgument(
                $this->Desc,
                InputArgument::OPTIONAL,
                $this->DescDescription
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $nombre = $input->getArgument($this->Nombre);
        $desc = $input->getArgument($this->Desc);

        $camelDesc = str_replace(array('-', '_'), ' ', $desc);
        $camelDesc = ucwords(strtolower($camelDesc));
        $camelDesc = str_replace(' ', '', $camelDesc);

        $newfile = __DIR__ . '\..\..\tests\\' . $nombre . 'Test.php';

        if (!is_file($newfile)) {
            $contents = "<?php\n";
            $contents .= "use PHPUnit\Framework\TestCase;\n";
            $contents .= "class $nombre" . "Test extends TestCase\n";
            $contents .= "{\n";
            $contents .= '    public function test' . $camelDesc . "()\n";
            $contents .= "    {\n";
            $contents .= "        // Given...\n";
            $contents .= "        \n";
            $contents .= "        // When...\n";
            $contents .= "        \n";
            $contents .= "        // Then...\n";
            $contents .= '        $this->assert();' . "\n";
            $contents .= "    }\n";
            $contents .= "}\n";
            file_put_contents($newfile, $contents);
            $text = 'CORRECTO: Se ha generado el archivo ' . $newfile;
        } else {
            $text = "WARNING: El archivo $newfile ya existe. Debe ser eliminado para poder generar uno nuevo.";
        }
        $output->writeln($text);
        return 0;
    }
}
