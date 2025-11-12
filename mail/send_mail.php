<?php
// Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Load Composer's autoloader
// This path goes UP one level from 'mail' to the root, then into 'vendor'
require '../vendor/autoload.php';

// Check if it's a POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // 1. Get Form Data
    $name    = htmlspecialchars(trim($_POST["name"] ?? ''));
    $email   = htmlspecialchars(trim($_POST["email"] ?? ''));
    $subject = htmlspecialchars(trim($_POST["subject"] ?? ''));
    $message = htmlspecialchars(trim($_POST["message"] ?? ''));

    // 2. Create an instance of PHPMailer
    $mail = new PHPMailer(true); // Passing `true` enables exceptions

    try {
        // 3. Server settings (UPDATE THESE)
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                 // Enable for testing
        $mail->isSMTP();                                        // Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                 // SET YOUR SMTP SERVER
        $mail->SMTPAuth   = true;                               // Enable SMTP authentication
        $mail->Username   = 'zinwaiyan1443@gmail.com';           // SET YOUR SMTP USERNAME
        $mail->Password   = 'ocjf dngb inqp xzii';              // SET YOUR SMTP PASSWORD
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;         // Enable implicit SMTPS
        $mail->Port       = 465;                                // Port 465 for SMTPS

        // 4. Recipients
        $mail->setFrom($email, $name);                          // From (the user)
        $mail->addAddress('operator-group@nicemyanmartravel.com');      // To (your company)
        $mail->addReplyTo($email, $name);                       // Reply-To (the user)

        // 5. Content
        $mail->isHTML(false);                                   // Plain text
        $mail->Subject = "Contact Form Submission: $subject";
        
        $email_body = "You have received a new message from your website contact form:\n\n" .
                      "Name: $name\n" .
                      "Email: $email\n\n" .
                      "Message:\n$message";
                      
        $mail->Body = $email_body;

        // 6. Send the email
        $mail->send();
        // Redirect to your contact page (note the path is up one level from 'mail')
        echo "<script>alert('✅ Your message has been sent successfully.'); window.location.href = '../pages/contact.html';</script>";

    } catch (Exception $e) {
        // If it fails, show the error
        // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"; // Use this line for debugging
        echo "<script>alert('❌ Message could not be sent. Please try again later.'); window.location.href = '../pages/contact.html';</script>";
    }

} else {
    // Not a POST request, redirect
    header("Location: ../pages/contact.html");
    exit();
}
?>