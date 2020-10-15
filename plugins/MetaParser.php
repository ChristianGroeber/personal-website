<?php


class MetaParser extends AbstractPicoPlugin
{
    private $config = [];
    private $page_meta = [];


    public function onConfigLoaded(array $config)
    {
        $this->config = $config;
    }

    public function onMetaParsed(array $meta)
    {
        $meta = array_change_key_case($meta);
        if (key_exists('title', $meta)) {
            $this->page_meta['title'] = $meta['title'];
        } elseif (key_exists('page_title', $this->config)) {
            $this->page_meta['title'] = $this->config['page_title'];
        } else {
            $this->page_meta['title'] = 'Magazine Blog';
        }
        if (key_exists('REQUEST_URI', $_SERVER)) {
            $this->page_meta['url'] = $_SERVER['REQUEST_URI'];
        } else {
            $this->page_meta['url'] = '/';
        }
        if (key_exists('description', $meta)) {
            $this->page_meta['description'] = $meta['description'];
        } elseif (key_exists('description', $this->config)) {
            $this->page_meta['description'] = $this->config['description'];
        } else {
            $this->page_meta['description'] = '';
        }
        if (key_exists('date', $meta)) {
            $this->page_meta['date'] = new \DateTime($meta['date']);
        } else {
            $this->page_meta['date'] = new DateTime();
        }
        if (key_exists('author', $meta)) {
            $this->page_meta['author'] = $meta['author'];
        } elseif (key_exists('author', $this->config)){
            $this->page_meta['author'] = $this->config['author'];
        } else {
            $this->page_meta['author'] = '';
        }
    }

    public function onPageRendering(Twig_Environment &$twig, array &$twigVariables, &$templateName)
    {
        $twigVariables['page_meta'] = $this->page_meta;
    }
}