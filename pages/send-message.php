<?php

if (strtolower($_SERVER['REQUEST_METHOD']) === 'post') {
    $message = $_REQUEST['contact_message'];
    $message .= "\n\nFrom: " . $_REQUEST["contact_name"];
    $message .= "\n\nE-Mail: " . $_REQUEST['contact_email'];
    
    // $success = mail('christian.groeber@bluewin.ch', "New Contact Entry by " . $_REQUEST['contact_name'], $message, ['from', 'christian.groeber@nxtlvl.ch']);
    $success = true;
}

header('content-type: application/json');

$ret = ['success' => $success];

echo json_encode($ret);
