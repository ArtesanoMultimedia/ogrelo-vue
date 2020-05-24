<?php


//use ezetablog\Controllers\PageController\PagesController;
use ezetablog\Controllers\PagesController;
use PHPUnit\Framework\TestCase;

class PagesControllerTest extends TestCase
{
    public function testInitial()
    {
        require 'index.php';
//        $stack = [];
//        $this->assertSame(0, count($stack));
//
//        array_push($stack, 'foo');
//        $this->assertSame('foo', $stack[count($stack) - 1]);
//        $this->assertSame(1, count($stack));
//
//        $this->assertSame('foo', array_pop($stack));
//        $this->assertSame(0, count($stack));
        $index = PagesController::index();
        $this->assertTrue($index);
    }
}
