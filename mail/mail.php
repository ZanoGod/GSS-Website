<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name    = htmlspecialchars(trim($_POST["name"]));
    $email   = htmlspecialchars(trim($_POST["email"]));
    $subject = htmlspecialchars(trim($_POST["subject"]));
    $message = htmlspecialchars(trim($_POST["message"]));

    $to = "info@goldensupportservices.com"; // change this to your real email
    $email_subject = "Contact Form Submission: $subject";
    $email_body = "You have received a new message from the contact form on your website.\n\n".
                  "Name: $name\n".
                  "Email: $email\n\n".
                  "Message:\n$message";

    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($to, $email_subject, $email_body, $headers)) {
        echo "<script>alert('Your message has been sent successfully.'); window.location.href = 'pages/contact.html';</script>";
    } else {
        echo "<script>alert('Message could not be sent. Please try again later.'); window.location.href = 'pages/contact.html';</script>";
    }
} else {
    header("Location: pages/contact.html");
    exit();
}
