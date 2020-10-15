<?php

/**
 * Class SubPages
 */
class SubPages extends AbstractPicoPlugin
{
    private $navPages;

    public function onPagesLoaded(array $pages)
    {
        $ret = [];
        foreach($pages as $page) {
            $meta = $page['meta'];
            if (key_exists('template', $meta)) {
                if ($meta['template'] === 'subindex' && !in_array($page['title'], $ret)) {
                    $ret[$page['title']] = [];
                }
                if ($meta['template'] === 'single') {
                    $arrUrl = array_reverse(explode('/', $page['url']));
                    array_pop($arrUrl);
                    $arrUrl = array_reverse($arrUrl);
                    array_pop($arrUrl);
                    $url = implode('/', $arrUrl);
                    if (key_exists($url, $ret)) {
                        array_push($ret[$url], $page);
                    }
                }
            }
        }
        $this->navPages = $ret;
    }

    public function onPageRendering(Twig_Environment &$twig, array &$twigVariables, &$templateName)
    {
        $twigVariables['nav'] = $this->navPages;
    }
}