<?php

include_once('/assets/httpstatus.php');

function sanitize(&$value)
{
    $value = trim($value);
}

if (!key_exists('name', $_POST) || $_POST['name'] === '' || !key_exists('content', $_POST) || $_POST['content'] === '' || !key_exists('url', $_POST) || $_POST['url'] === '') {
    header($http[400]);
    header('Location: https://pico.christian-groeber.ch');
    die();
}

$postFilter = [
    'name' => ['filter' => FILTER_SANITIZE_STRING, 'flags' => FILTER_FLAG_ENCODE_AMP],
    'content' => ['filter' => FILTER_SANITIZE_STRING, 'flags' => FILTER_FLAG_ENCODE_AMP],
    'url' => ['filter' => FILTER_SANITIZE_ENCODED, 'flags' => FILTER_FLAG_STRIP_LOW],
];

function getTotalInterval($interval, $type)
{
    switch ($type) {
        case 'years':
            return $interval->format('%Y');
            break;
        case 'months':
            $years = $interval->format('%Y');
            $months = 0;
            if ($years) {
                $months += $years * 12;
            }
            $months += $interval->format('%m');
            return $months;
            break;
        case 'days':
            return $interval->format('%a');
            break;
        case 'hours':
            $days = $interval->format('%a');
            $hours = 0;
            if ($days) {
                $hours += 24 * $days;
            }
            $hours += $interval->format('%H');
            return $hours;
            break;
        case 'minutes':
            $days = $interval->format('%a');
            $minutes = 0;
            if ($days) {
                $minutes += 24 * 60 * $days;
            }
            $hours = $interval->format('%H');
            if ($hours) {
                $minutes += 60 * $hours;
            }
            $minutes += $interval->format('%i');
            return $minutes;
            break;
        case 'seconds':
            $days = $interval->format('%a');
            $seconds = 0;
            if ($days) {
                $seconds += 24 * 60 * 60 * $days;
            }
            $hours = $interval->format('%H');
            if ($hours) {
                $seconds += 60 * 60 * $hours;
            }
            $minutes = $interval->format('%i');
            if ($minutes) {
                $seconds += 60 * $minutes;
            }
            $seconds += $interval->format('%s');
            return $seconds;
            break;
        case 'milliseconds':
            $days = $interval->format('%a');
            $seconds = 0;
            if ($days) {
                $seconds += 24 * 60 * 60 * $days;
            }
            $hours = $interval->format('%H');
            if ($hours) {
                $seconds += 60 * 60 * $hours;
            }
            $minutes = $interval->format('%i');
            if ($minutes) {
                $seconds += 60 * $minutes;
            }
            $seconds += $interval->format('%s');
            $milliseconds = $seconds * 1000;
            return $milliseconds;
            break;
        default:
            return NULL;
    }
}


/**
 * TODO: Make this take client ip argument and only search for comments by this user
 * @param array $comments
 * @param int   $minDifference The allowed difference between now and the last comment in seconds
 * @throws HttpException
 * @throws Exception
 */
function isAllowedToComment(array $comments, $minDifference = 5)
{
    $now = new DateTime();
    foreach ($comments as $comment) {
        $strPosted = date(DateTime::ISO8601, $comment['time']);
        $posted = new DateTime($strPosted);;
        $diff = getTotalInterval($now->diff($posted), 'seconds');
        if ($diff < $minDifference) {
            throw new HttpException('You are not allowed to comment');
        }
    }
}


array_filter($_POST, 'sanitize');

$newPost = filter_var_array($_POST, $postFilter);

$content = file_get_contents('comments.json');
$jsonContent = json_decode($content, true);
$now = new \DateTime();
$arrPost = ['name' => $newPost['name'], 'content' => $newPost['content'], 'time' => $now->getTimestamp()];

if (!key_exists($newPost['url'], $jsonContent)) {
    $jsonContent[$newPost['url']] = [];
}

try {
    isAllowedToComment($jsonContent[$newPost['url']]);
} catch(HttpException $e) {
    header("Message: " . $e->getMessage());
    header("Location: https://pico.christian-groeber.ch" . $_POST['url'] . '#comments');
    die();
} catch (Exception $e) {
}

array_push($jsonContent[$newPost['url']], $arrPost);

file_put_contents('comments.json', json_encode($jsonContent));

//header("Location: https://pico.christian-groeber.ch" . $_POST['url'] . '#comments');