<?php


/**
 * Class Request
 */
class Request extends AbstractPicoPlugin
{
    public function onPageRendering(Twig_Environment &$twig, array &$twigVariables, &$templateName)
    {
        $twigVariables['request'] = ['query' => $_GET, 'request' => $_POST, 'cookies' => $_COOKIE, 'server' => $_SERVER];
    }
}