<?php

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;



class MakeModelCommand extends Command
{
    protected $commandName = 'make:model';
    protected $commandDescription = 'Descripción del comando';
    protected $commandHelp = 'Ayuda del comando';

    protected $Input = 'modelo';
    protected $InputDescription = 'Nombre del modelo que se desesa generar';

    protected function configure()
    {
        $this
            ->setName($this->commandName)
            ->setDescription($this->commandDescription)
            ->setHelp($this->commandHelp)
            ->addArgument(
                $this->Input,
                InputArgument::REQUIRED,
                $this->InputDescription
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $text = "Texto de salida";
        $output->writeln($text);
        return 0;
    }
}
