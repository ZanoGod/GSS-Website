<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/anti_spam.php';


/*
|--------------------------------------------------------------------------
| ONLY ACCEPT POST
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../pages/contact.html');
    exit;
}


/*
|--------------------------------------------------------------------------
| HELPER FUNCTIONS
|--------------------------------------------------------------------------
*/

/**
 * Remove CRLF from values used in email headers.
 */
function cleanHeaderValue($value)
{
    return str_replace(
        ["\r", "\n"],
        '',
        trim((string)$value)
    );
}


/**
 * Escape user input for HTML email.
 */
function e($value)
{
    return htmlspecialchars(
        (string)$value,
        ENT_QUOTES,
        'UTF-8'
    );
}


/*
|--------------------------------------------------------------------------
| ANTI-SPAM: SESSION + HONEYPOT + FORM TOKEN
|--------------------------------------------------------------------------
*/

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);

// Honeypot: bots commonly fill every visible-looking field.
// Return quietly; do not tell the spammer which protection triggered.
if (!empty($_POST['website'])) {
    http_response_code(200);
    exit;
}

/*
 * Cloudflare Turnstile: validate the browser token before any email is processed.
 * The secret key is kept server-side inside anti_spam.php.
 */
$turnstileToken = trim((string)($_POST['cf-turnstile-response'] ?? ''));
$clientIp = gss_get_client_ip();

if (!verifyTurnstile($turnstileToken, $clientIp)) {
    header('Location: ../pages/contact.html?status=error');
    exit;
}

$submittedToken = trim((string)($_POST['form_token'] ?? ''));
$sessionToken = (string)($_SESSION['gss_contact_form_token'] ?? '');
$formCreatedAt = (int)($_SESSION['gss_contact_form_created_at'] ?? 0);
$now = time();

// Token is short-lived and must be issued by the server when the form loads.
if (
    $submittedToken === '' ||
    $sessionToken === '' ||
    !hash_equals($sessionToken, $submittedToken) ||
    $formCreatedAt <= 0 ||
    ($now - $formCreatedAt) > 7200
) {
    gss_log_rejection('invalid_or_expired_form_token');
    header('Location: ../pages/contact.html?status=error');
    exit;
}

// A submission in under 2 seconds is suspicious. This is deliberately lenient
// so fast legitimate users are not rejected unnecessarily.
if (($now - $formCreatedAt) < 2) {
    gss_log_rejection('submitted_too_quickly');
    header('Location: ../pages/contact.html?status=error');
    exit;
}

/*
|--------------------------------------------------------------------------
| GET FORM DATA
|--------------------------------------------------------------------------
*/

$name = trim($_POST['name'] ?? '');

$email = trim($_POST['email'] ?? '');

$subject = trim($_POST['subject'] ?? '');

$message = trim($_POST['message'] ?? '');

// Rate limit before validation/PHPMailer: max 3 submissions per IP in 10 minutes.
if (!checkRateLimit($clientIp, 3, 600)) {
    gss_log_rejection('rate_limit_exceeded', $email);
    header('Location: ../pages/contact.html?status=error');
    exit;
}


/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/

if (
    $name === '' ||
    gss_string_length($name) > 100
) {
    header(
        'Location: ../pages/contact.html?status=validation'
    );
    exit;
}


if (
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    gss_string_length($email) > 320
) {
    header(
        'Location: ../pages/contact.html?status=validation'
    );
    exit;
}


if (
    $subject === '' ||
    gss_string_length($subject) > 150
) {
    header(
        'Location: ../pages/contact.html?status=validation'
    );
    exit;
}


if (
    $message === '' ||
    gss_string_length($message) > 5000
) {
    header(
        'Location: ../pages/contact.html?status=validation'
    );
    exit;
}


/*
|--------------------------------------------------------------------------
| CLEAN HEADER VALUES
|--------------------------------------------------------------------------
*/

$name = cleanHeaderValue($name);

$email = cleanHeaderValue($email);

$subject = cleanHeaderValue($subject);


/*
|--------------------------------------------------------------------------
| SPAM CONTENT / URL CHECK
|--------------------------------------------------------------------------
*/

if (isSpamMessage($subject, $message)) {
    gss_log_rejection('spam_content_or_urls', $email);
    header('Location: ../pages/contact.html?status=error');
    exit;
}


/*
|--------------------------------------------------------------------------
| DUPLICATE SUBMISSION CHECK
|--------------------------------------------------------------------------
*/

if (!checkDuplicateSubmission($clientIp, $email, $subject, $message, 3600)) {
    gss_log_rejection('duplicate_submission', $email);
    header('Location: ../pages/contact.html?status=error');
    exit;
}


/*
|--------------------------------------------------------------------------
| CURRENT DATE / TIME
|--------------------------------------------------------------------------
*/

date_default_timezone_set('Asia/Yangon');

$receivedDate = date(
    'd M Y, h:i A'
);


/*
|--------------------------------------------------------------------------
| THEME COLORS
|--------------------------------------------------------------------------
*/

$primaryColor = '#b68b2e';

$secondaryColor = '#ffb22c';

$darkColor = '#343a40';

$footerColor = '#8b540f';

$lightColor = '#f8f9fa';


/*
|--------------------------------------------------------------------------
| HTML-SAFE VALUES
|--------------------------------------------------------------------------
*/

$htmlName = e($name);

$htmlEmail = e($email);

$htmlSubject = e($subject);

/*
 * Convert line breaks in the customer's message
 * into HTML line breaks.
 */
$htmlMessage = nl2br(
    e($message)
);

$htmlDate = e($receivedDate);


/*
|--------------------------------------------------------------------------
| HTML EMAIL
|--------------------------------------------------------------------------
|
| Table-based layout is intentionally used because it is more reliable
| across Gmail and other email clients.
|
*/

$htmlBody = <<<HTML
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Website Inquiry</title>

</head>


<body
    style="
        margin:0;
        padding:0;
        background-color:#f4f4f4;
        font-family:Arial,Helvetica,sans-serif;
        color:{$darkColor};
    "
>


<!-- =====================================================
     OUTER CONTAINER
====================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        background-color:#f4f4f4;
        margin:0;
        padding:0;
    "
>

<tr>

<td
    align="center"
    style="padding:35px 15px;"
>


<!-- =====================================================
     MAIN EMAIL CONTAINER
====================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        max-width:680px;
        background:#ffffff;
        border-radius:14px;
        overflow:hidden;
        border:1px solid #e6e6e6;
    "
>


<!-- =====================================================
     GOLD HEADER
====================================================== -->

<tr>

<td
    style="
        background:linear-gradient(
            135deg,
            {$primaryColor},
            {$secondaryColor}
        );
        padding:28px 35px;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
>

<tr>

<td>

<div
    style="
        font-size:12px;
        font-weight:bold;
        letter-spacing:1.5px;
        color:#ffffff;
        text-transform:uppercase;
        margin-bottom:8px;
    "
>

GOLDEN SUPPORT SERVICE

</div>


<div
    style="
        font-size:25px;
        line-height:1.3;
        font-weight:bold;
        color:#ffffff;
    "
>

New Website Inquiry

</div>


<div
    style="
        margin-top:7px;
        font-size:13px;
        color:rgba(255,255,255,0.9);
    "
>

A new inquiry has been submitted through the website.

</div>

</td>

</tr>

</table>

</td>

</tr>


<!-- =====================================================
     CONTENT
====================================================== -->

<tr>

<td
    style="
        padding:32px 35px 20px 35px;
    "
>


<!-- INTRO -->

<p
    style="
        margin:0 0 24px 0;
        font-size:15px;
        line-height:1.7;
        color:#555555;
    "
>

You have received a new inquiry from the
<strong style="color:{$darkColor};">
Golden Support Service
</strong>
website.

</p>


<!-- =====================================================
     CONTACT INFORMATION TITLE
====================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
>

<tr>

<td
    style="
        padding-bottom:10px;
        border-bottom:2px solid {$primaryColor};
    "
>

<span
    style="
        font-size:15px;
        font-weight:bold;
        color:{$darkColor};
    "
>

CONTACT INFORMATION

</span>

</td>

</tr>

</table>


<!-- =====================================================
     CONTACT INFORMATION CARD
====================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin-top:15px;
        background:#fafafa;
        border:1px solid #eeeeee;
        border-radius:10px;
    "
>


<!-- NAME -->

<tr>

<td
    width="145"
    style="
        padding:13px 15px;
        font-size:13px;
        color:#777777;
        font-weight:bold;
        vertical-align:top;
    "
>

Name

</td>

<td
    style="
        padding:13px 15px;
        font-size:14px;
        color:{$darkColor};
        vertical-align:top;
    "
>

{$htmlName}

</td>

</tr>


<!-- EMAIL -->

<tr>

<td
    width="145"
    style="
        padding:13px 15px;
        font-size:13px;
        color:#777777;
        font-weight:bold;
        vertical-align:top;
        border-top:1px solid #eeeeee;
    "
>

Email

</td>

<td
    style="
        padding:13px 15px;
        font-size:14px;
        vertical-align:top;
        border-top:1px solid #eeeeee;
    "
>

<a
    href="mailto:{$htmlEmail}"
    style="
        color:{$primaryColor};
        text-decoration:none;
        font-weight:bold;
    "
>

{$htmlEmail}

</a>

</td>

</tr>


<!-- SUBJECT -->

<tr>

<td
    width="145"
    style="
        padding:13px 15px;
        font-size:13px;
        color:#777777;
        font-weight:bold;
        vertical-align:top;
        border-top:1px solid #eeeeee;
    "
>

Subject

</td>

<td
    style="
        padding:13px 15px;
        font-size:14px;
        color:{$darkColor};
        vertical-align:top;
        border-top:1px solid #eeeeee;
    "
>

{$htmlSubject}

</td>

</tr>


<!-- RECEIVED -->

<tr>

<td
    width="145"
    style="
        padding:13px 15px;
        font-size:13px;
        color:#777777;
        font-weight:bold;
        vertical-align:top;
        border-top:1px solid #eeeeee;
    "
>

Received

</td>

<td
    style="
        padding:13px 15px;
        font-size:14px;
        color:{$darkColor};
        vertical-align:top;
        border-top:1px solid #eeeeee;
    "
>

{$htmlDate}

</td>

</tr>

</table>


<!-- =====================================================
     MESSAGE TITLE
====================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="margin-top:30px;"
>

<tr>

<td
    style="
        padding-bottom:10px;
        border-bottom:2px solid {$primaryColor};
    "
>

<span
    style="
        font-size:15px;
        font-weight:bold;
        color:{$darkColor};
    "
>

MESSAGE

</span>

</td>

</tr>

</table>


<!-- =====================================================
     MESSAGE BOX
====================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        margin-top:15px;
    "
>

<tr>

<td
    style="
        background:#fffaf0;
        border-left:4px solid {$secondaryColor};
        border-radius:7px;
        padding:20px;
        font-size:14px;
        line-height:1.8;
        color:#444444;
    "
>

{$htmlMessage}

</td>

</tr>

</table>


<!-- =====================================================
     REPLY BUTTON
====================================================== -->

<table
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="margin-top:28px;"
>

<tr>

<td
    align="center"
    style="
        border-radius:50px;
        background:{$primaryColor};
    "
>

<a
    href="mailto:{$htmlEmail}"
    style="
        display:inline-block;
        padding:12px 25px;
        font-size:14px;
        font-weight:bold;
        color:#ffffff;
        text-decoration:none;
        border-radius:50px;
    "
>

Reply to Customer

</a>

</td>

</tr>

</table>


</td>

</tr>


<!-- =====================================================
     FOOTER
====================================================== -->

<tr>

<td
    style="
        background:{$footerColor};
        padding:22px 35px;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
>

<tr>

<td>

<div
    style="
        font-size:14px;
        font-weight:bold;
        color:#ffffff;
        margin-bottom:6px;
    "
>

Golden Support Service

</div>


<div
    style="
        font-size:12px;
        line-height:1.6;
        color:rgba(255,255,255,0.82);
    "
>

This inquiry was submitted through the
Golden Support Service website contact form.

</div>

</td>


<td
    align="right"
    valign="middle"
>

<div
    style="
        font-size:11px;
        color:rgba(255,255,255,0.7);
        text-align:right;
    "
>

Website Inquiry

</div>

</td>

</tr>

</table>

</td>

</tr>


</table>


<!-- =====================================================
     COPYRIGHT / SYSTEM FOOTER
====================================================== -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="max-width:680px;"
>

<tr>

<td
    align="center"
    style="
        padding:18px 15px 0 15px;
        font-size:11px;
        line-height:1.6;
        color:#999999;
    "
>

This is an automated notification from
Golden Support Service.

<br>

Please do not reply to this notification address.

</td>

</tr>

</table>


</td>

</tr>

</table>


</body>

</html>
HTML;


/*
|--------------------------------------------------------------------------
| PLAIN TEXT FALLBACK
|--------------------------------------------------------------------------
|
| This is important for mail clients that don't render HTML.
|
*/

$plainTextBody =
    "GOLDEN SUPPORT SERVICE\n"
    . "NEW WEBSITE INQUIRY\n\n"
    . "You have received a new inquiry from the Golden Support Service website.\n\n"
    . "----------------------------------------\n"
    . "CONTACT INFORMATION\n"
    . "----------------------------------------\n\n"
    . "Name: "
    . $name
    . "\n"
    . "Email: "
    . $email
    . "\n"
    . "Subject: "
    . $subject
    . "\n"
    . "Received: "
    . $receivedDate
    . "\n\n"
    . "----------------------------------------\n"
    . "MESSAGE\n"
    . "----------------------------------------\n\n"
    . $message
    . "\n\n"
    . "----------------------------------------\n"
    . "Golden Support Service\n"
    . "Website Contact Form\n";


/*
|--------------------------------------------------------------------------
| CREATE PHPMailer
|--------------------------------------------------------------------------
*/

$mail = new PHPMailer(true);


try {

    /*
    |--------------------------------------------------------------------------
    | SMTP
    |--------------------------------------------------------------------------
    */

    $mail->isSMTP();

    $mail->Host =
        'mail.goldensupportservice.com';

    $mail->SMTPAuth =
        true;

    $mail->Username =
        'no-reply@goldensupportservice.com';

    /*
     * IMPORTANT:
     * Keep your CURRENT WORKING no-reply mailbox password here.
     *
     * Do not change it if your current setup is already working.
     */
    $mail->Password = 'dD7TdiUZdB9hdBg';

    $mail->SMTPSecure =
        PHPMailer::ENCRYPTION_SMTPS;

    $mail->Port =
        465;


    /*
    |--------------------------------------------------------------------------
    | CHARACTER SET
    |--------------------------------------------------------------------------
    */

    $mail->CharSet =
        'UTF-8';


    /*
    |--------------------------------------------------------------------------
    | SENDER
    |--------------------------------------------------------------------------
    */

    $mail->setFrom(
        'no-reply@goldensupportservice.com',
        'Golden Support Service'
    );


    /*
    |--------------------------------------------------------------------------
    | RECIPIENT
    |--------------------------------------------------------------------------
    */

    $mail->addAddress(
        'operator-group@nicemyanmartravel.com',
        'Operator Group'
    );


    /*
    |--------------------------------------------------------------------------
    | REPLY TO CUSTOMER
    |--------------------------------------------------------------------------
    |
    | When your staff clicks Reply in Gmail,
    | the reply will go to the person who submitted
    | the contact form.
    |
    */

    $mail->addReplyTo(
        $email,
        $name
    );


    /*
    |--------------------------------------------------------------------------
    | HTML EMAIL
    |--------------------------------------------------------------------------
    */

    $mail->isHTML(true);

    $mail->Subject =
        'Website Inquiry: ' . $subject;

    $mail->Body =
        $htmlBody;

    $mail->AltBody =
        $plainTextBody;


    /*
    |--------------------------------------------------------------------------
    | SEND
    |--------------------------------------------------------------------------
    */

    $mail->send();

    // Consume the server-issued token only after successful delivery.
    unset(
        $_SESSION['gss_contact_form_token'],
        $_SESSION['gss_contact_form_created_at']
    );


    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    header(
        'Location: ../pages/contact.html?status=success'
    );

    exit;


} catch (Exception $e) {

    /*
    |--------------------------------------------------------------------------
    | LOG ERROR
    |--------------------------------------------------------------------------
    */

    error_log(
        'Golden Support Service contact form error: '
        . $mail->ErrorInfo
        . ' | Exception: '
        . $e->getMessage()
    );


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    header(
        'Location: ../pages/contact.html?status=error'
    );

    exit;

}

?>