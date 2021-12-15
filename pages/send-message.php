<?php

header('content-type: application/json');

if (strtolower($_SERVER['REQUEST_METHOD']) !== 'post') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST is allowed', $_SERVER, getallheaders()]);
    die();
}

$message = $_REQUEST['contact_message'];
$email = $_REQUEST['contact_email'];
$name = $_REQUEST['contact_name'];

$emailValid = filter_var($email, FILTER_VALIDATE_EMAIL);
if (!$emailValid) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a valid email']);
    die();
}

$messageExists = $message && $message !== '';
if (!$messageExists) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a message']);
    die();
}
$messageTooLong = strlen($message) > 5000;
if ($messageTooLong) {
    http_response_code(400);
    echo json_encode(['error' => 'This message is too long']);
    die();
}

$ipsPath = $_SERVER['DOCUMENT_ROOT'] . '/contact_ips.json';
if (!file_exists($ipsPath)) {
    file_put_contents($ipsPath, json_encode([]));
}

$ips = json_decode(file_get_contents($ipsPath), true);

$ip = $_SERVER['HTTP_CLIENT_IP']
    ? $_SERVER['HTTP_CLIENT_IP']
    : ($_SERVER['HTTP_X_FORWARDED_FOR']
        ? $_SERVER['HTTP_X_FORWARDED_FOR']
        : $_SERVER['REMOTE_ADDR']);

$now = new DateTime();

if (key_exists($ip, $ips)) {
    $dateLastRequest = new DateTime($ips[$ip]);
    $now->modify('-1 day');
    $diff = $now->diff($dateLastRequest);

    if ($diff->invert === 0) {
        http_response_code(429);
        echo json_encode(['error' => 'You are only allowed one message per day']);
        die();
    }
}
$now = new DateTime();

$msg = $message;
$msg .= "\n\nFrom: " . $name;
$msg .= "\n\nE-Mail: " . $email;

// $success = mail('christian.groeber@bluewin.ch', "New Contact Entry by " . $_REQUEST['contact_name'], $message, ['from', 'christian.groeber@nxtlvl.ch']);
$success = true;

$ips[$ip] = $now->format('Y-m-d h:i:s');
file_put_contents($ipsPath, json_encode($ips));

$ret = ['success' => $success];

echo json_encode($ret);
