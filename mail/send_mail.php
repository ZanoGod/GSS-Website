<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/../vendor/autoload.php'; // robust dirname

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../pages/contact.html');
    exit();
}

// Helper: strip CRLF to avoid header injection
function strip_crlf(string $s): string {
    return str_replace(["\r", "\n"], '', $s);
}

// Get + sanitize inputs
$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Basic validation
$errors = [];
if ($name === '' || strlen($name) > 100) {
    $errors[] = 'Invalid name.';
}
if ($subject === '' || strlen($subject) > 150) {
    $errors[] = 'Invalid subject.';
}
if ($message === '' || strlen($message) > 5000) {
    $errors[] = 'Invalid message.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 320) {
    $errors[] = 'Invalid email address.';
}

if (!empty($errors)) {
    // Return user-friendly message (you can also redirect)
    echo "<script>alert('Please fill the form correctly.'); window.location.href = '../pages/contact.html';</script>";
    exit();
}

// Remove CRLF/newlines from header-type fields to avoid header injection & ModSec triggers
$name    = strip_crlf($name);
$subject = strip_crlf($subject);
$email   = strip_crlf($email);

// Compose email body (plain text)
$email_body = "You have received a new message from your website contact form:\n\n" .
              "Name: {$name}\n" .
              "Email: {$email}\n\n" .
              "Subject: {$subject}\n\n" .
              "Message:\n{$message}";

// PHPMailer
$mail = new PHPMailer(true);

try {
    // SMTP settings — use correct credentials & app password
    $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';                 // SET YOUR SMTP SERVER
        $mail->SMTPAuth   = true;                               // Enable SMTP authentication
        $mail->Username   = 'seteam@nicemyanmartravel.com';           // SET YOUR SMTP USERNAME
        $mail->Password   = 'paog yrqs gtwc tkdq';              // SET YOUR SMTP PASSWORD
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;         // Enable implicit SMTPS
        $mail->Port       = 465;   

    // IMPORTANT: Use a domain-controlled From address (do NOT use the user's email here)
    $mail->setFrom('noreply@nicemyanmartravel.com', 'NiceMyanmarTravel Contact Form');

    // Recipient
    $mail->addAddress('seteam@nicemyanmartravel.com');

    // Put user's email in Reply-To (safe)
    $mail->addReplyTo($email, $name);

    $mail->isHTML(false);
    $mail->Subject = "Contact Form: {$subject}";
    $mail->Body    = $email_body;

    $mail->send();

    echo "<script>alert('✅ Your message has been sent successfully.'); window.location.href = '../pages/contact.html';</script>";
    exit();

} catch (Exception $e) {
    // Log the real error server-side for debugging (do NOT display to users)
    error_log('Mail error: ' . $mail->ErrorInfo . ' Exception: ' . $e->getMessage());

    echo "<script>alert('❌ Message could not be sent. Please try again later.'); window.location.href = '../pages/contact.html';</script>";
    exit();
}
?>
