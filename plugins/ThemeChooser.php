<?php


class ThemeChooser extends AbstractPicoPlugin
{
    public function onPageRendering(Twig_Environment &$twig, array &$twigVariables, &$templateName)
    {
        $theme = 'default';
        if (key_exists('theme', $_COOKIE)) {
            $theme = $_COOKIE['theme'];
        }

        $twigVariables['color_theme'] = $theme;
    }
}