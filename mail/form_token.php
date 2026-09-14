<?php
/**
 * Issues a short-lived server-side form token used for bot timing protection.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false]);
    exit;
}

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);

try {
    $token = bin2hex(random_bytes(32));
} catch (Throwable $e) {
    http_response_code(500);
    error_log('[GSS Contact Anti-Spam] Token generation failed: ' . $e->getMessage());
    echo json_encode(['success' => false]);
    exit;
}

$_SESSION['gss_contact_form_token'] = $token;
$_SESSION['gss_contact_form_created_at'] = time();

echo json_encode([
    'success' => true,
    'token' => $token,
]);
