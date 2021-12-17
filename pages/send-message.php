<?php

header('content-type: application/json');

function saveData($dataPath, $data)
{
    foreach ($data['ips'] as $ip => $ipObj) {
        $ipObj['lastAccess'] = $ipObj['lastAccess']->format('Y-m-d H:i:s');
        $data['ips'][$ip] = $ipObj;
    }

    file_put_contents($dataPath, json_encode($data));
}

$ip = $_SERVER['HTTP_CLIENT_IP']
    ? $_SERVER['HTTP_CLIENT_IP']
    : ($_SERVER['HTTP_X_FORWARDED_FOR']
        ? $_SERVER['HTTP_X_FORWARDED_FOR']
        : $_SERVER['REMOTE_ADDR']);

$dataPath = $_SERVER['DOCUMENT_ROOT'] . '/db.json';

if (!file_exists($dataPath)) {
    file_put_contents($dataPath, json_encode(['ips' => [], 'lastMessage' => '1970-01-01']));
}

$data = json_decode(file_get_contents($dataPath), true);

foreach ($data['ips'] as $ip => $ipObj) {
    $data['ips'][$ip]['lastAccess'] = DateTime::createFromFormat('Y-m-d H:i:s', $ipObj['lastAccess']);
}

// Check IP
$data['ips'][$ip]['accessCount']++;

if (!key_exists($ip, $data['ips'])) {
    $ipObj = [
        'lastAccess' => '1970-01-01',
        'accessCount' => 0,
        'blocked' => false,
    ];
} else {
    $ipObj = $data['ips'][$ip];
}
$data['ips'][$ip] = $ipObj;

$data['ips'][$ip]['lastAccess'] = new DateTime();
saveData($dataPath, $data);

if ($ipObj['blocked']) {
    http_response_code(401);
    echo json_encode(['error' => 'You\'ve been blocked']);
    die();
}

// Check Request Method
if (strtolower($_SERVER['REQUEST_METHOD']) !== 'post') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST is allowed']);
    die();
}

$message = $_REQUEST['contact_message'];
$email = $_REQUEST['contact_email'];
$name = $_REQUEST['contact_name'];

// Check E-Mail validity
$emailValid = filter_var($email, FILTER_VALIDATE_EMAIL);
if (!$emailValid) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a valid email']);
    die();
}

// Check Message validity
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

$now = new DateTime();

$dateLastRequest = $ipObj['lastAccess'];
$now->modify('-1 day');
$diff = $now->diff($dateLastRequest);

if ($diff->invert === 0) {
    http_response_code(429);
    echo json_encode(['error' => 'You are only allowed one message per day']);
    die();
}

$now = new DateTime();

//Build Message
$msg = $message;
$msg .= "\n\nFrom: " . $name;
$msg .= "\n\nE-Mail: " . $email;

// $success = mail('christian.groeber@bluewin.ch', "New Contact Entry by " . $_REQUEST['contact_name'], $message, ['from', 'christian.groeber@nxtlvl.ch']);
$success = true;

$data['lastMessage'] = $now;
saveData($dataPath, $data);

$ret = ['success' => $success];

echo json_encode($ret);
