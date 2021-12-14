<?php

header('content-type: application/json');

if (strtolower($_SERVER['REQUEST_METHOD']) !== 'post') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST is allowed']);
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


$msg = $message;
$msg .= "\n\nFrom: " . $name;
$msg .= "\n\nE-Mail: " . $email;

// $success = mail('christian.groeber@bluewin.ch', "New Contact Entry by " . $_REQUEST['contact_name'], $message, ['from', 'christian.groeber@nxtlvl.ch']);
$success = true;

$ret = ['success' => $success];

echo json_encode($ret);
