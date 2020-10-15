<?php


class EnableServiceWorkersScope extends AbstractPicoPlugin
{
    public function onPluginsLoaded(array $config)
    {
        header('Service-Worker-Allowed: /');
    }
}