<?php

/**
 * Class Comment
 */
class Comment extends AbstractPicoPlugin
{
    private $url;

    public function onRequestUrl($url)
    {
        $this->url = '/' . $url;
    }

    public function onPageRendering(Twig_Environment &$twig, array &$twigVariables, &$templateName)
    {
        $content = file_get_contents('/app/assets/comments.json');
        $jsonContent = json_decode($content, true);
        $sanitizedUrl = filter_var($this->url, FILTER_SANITIZE_ENCODED, ['flags' => FILTER_FLAG_STRIP_LOW]);
        $comments = [];
        if (key_exists($sanitizedUrl, $jsonContent)) {
            $comments = $jsonContent[$sanitizedUrl];
        }

        $comments = array_reverse($comments);

        $twigVariables['comments'] = $comments;
    }
}