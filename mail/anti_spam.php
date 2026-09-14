<?php
/**
 * Free server-side anti-spam helpers for the Golden Support Service contact form.
 * No external service or database is required.
 */

declare(strict_types=1);

function gss_string_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function gss_get_client_ip(): string
{
    // REMOTE_ADDR is used deliberately. Do not trust arbitrary X-Forwarded-For
    // headers because they can be supplied by a client.
    return trim((string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'));
}

function gss_log_rejection(string $reason, string $email = ''): void
{
    $safeReason = preg_replace('/[^a-zA-Z0-9_.:\- ]/', '', $reason) ?? 'unknown';
    $safeEmail = filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : '';
    $message = sprintf(
        '[GSS Contact Anti-Spam] %s | IP=%s | Email=%s',
        $safeReason,
        gss_get_client_ip(),
        $safeEmail
    );
    error_log($message);
}

/**
 * Detect promotional/automated spam without blocking a normal single URL.
 * 0 URLs = allow; 1 URL = normally allow; 2+ URLs = reject.
 */
/**
 * Validate a Cloudflare Turnstile token server-side.
 * The secret key must never be exposed to the browser.
 */
function verifyTurnstile(string $token, string $remoteIp = ''): bool
{
    $secret = '0x4AAAAAAEzid88uamSfBzGwSL7WXDReSGY';

    if ($token === '' || strlen($token) > 2048) {
        gss_log_rejection('turnstile_missing_or_invalid');
        return false;
    }

    $endpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $postData = [
        'secret' => $secret,
        'response' => $token,
    ];

    if ($remoteIp !== '') {
        $postData['remoteip'] = $remoteIp;
    }

    $responseBody = false;

    // cURL is preferred because it allows a hard timeout and explicit TLS handling.
    if (function_exists('curl_init')) {
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($postData),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded',
            ],
        ]);

        $responseBody = curl_exec($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($responseBody === false || $httpCode < 200 || $httpCode >= 300) {
            gss_log_rejection('turnstile_verification_request_failed');
            return false;
        }
    } else {
        // Hosting-compatible fallback when cURL is unavailable.
        $context = stream_context_create([
            'http' => [
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($postData),
                'timeout' => 10,
                'ignore_errors' => true,
            ],
        ]);

        $responseBody = @file_get_contents($endpoint, false, $context);

        if ($responseBody === false) {
            gss_log_rejection('turnstile_verification_request_failed');
            return false;
        }
    }

    $result = json_decode($responseBody, true);

    if (!is_array($result) || empty($result['success'])) {
        $codes = [];
        if (is_array($result) && isset($result['error-codes']) && is_array($result['error-codes'])) {
            $codes = array_map('strval', $result['error-codes']);
        }
        gss_log_rejection(
            'turnstile_verification_failed' . ($codes ? ':' . implode(',', $codes) : '')
        );
        return false;
    }

    // We set data-action="contact" on the widget, so reject a token for another action.
    if (isset($result['action']) && $result['action'] !== '' && $result['action'] !== 'contact') {
        gss_log_rejection('turnstile_action_mismatch');
        return false;
    }

    return true;
}

function isSpamMessage(string $subject, string $message): bool
{
    $text = trim($subject . "\n" . $message);
    $lower = strtolower($text);

    // HTTP(S) URLs and www.example.com style URLs.
    preg_match_all(
        '~(?:https?://|www\.)[^\s<>()\[\]"\']+~iu',
        $text,
        $urlMatches
    );
    $urlCount = count($urlMatches[0] ?? []);

    if ($urlCount >= 2) {
        return true;
    }

    // Known promotional/spam phrases. These are intentionally phrase-based;
    // words such as "AI" by themselves are not blocked.
    $spamPatterns = [
        '~\bhire\s+(?:an?\s+)?(?:ai|software|web|app|mobile)?\s*developers?\b~i',
        '~\b(?:hire|outsource)\s+(?:our\s+)?developers?\b~i',
        '~\bget\s+(?:your|my|our)\s+(?:code|website|app)\s+fixed\b~i',
        '~\bguest\s+posts?\b~i',
        '~\bguest\s+posting\b~i',
        '~\bbacklinks?\b.*\b(?:offer|service|package|buy|cheap)\b~is',
        '~\b(?:buy|cheap|guaranteed)\s+backlinks?\b~i',
        '~\blink\s*building\s+(?:service|offer|package)\b~i',
        '~\bbuy\s+(?:website\s+)?traffic\b~i',
        '~\bweb\s+design\s+(?:offer|service|proposal)\b~i',
        '~\bseo\s+(?:service|offer|proposal|agency|company|package)\b~i',
        '~\b(?:casino|viagra)\b~i',
        '~\b(?:crypto|cryptocurrency)\s+(?:investment|trading|offer|promotion)\b~i',
    ];

    foreach ($spamPatterns as $pattern) {
        if (preg_match($pattern, $text) === 1) {
            return true;
        }
    }

    // Suspicious promotional domains. Kept intentionally small and easy to edit.
    $suspiciousDomainPatterns = [
        '~(?:^|\.)bit\.ly$~i',
        '~(?:^|\.)tinyurl\.com$~i',
        '~(?:^|\.)t\.co$~i',
        '~(?:^|\.)linktr\.ee$~i',
        '~(?:^|\.)casino[^.]*\.[a-z]{2,}$~i',
        '~(?:^|\.)viagra[^.]*\.[a-z]{2,}$~i',
        '~(?:^|\.)backlinks?[^.]*\.[a-z]{2,}$~i',
        '~(?:^|\.)guestpost[^.]*\.[a-z]{2,}$~i',
        '~(?:^|\.)linkbuilding[^.]*\.[a-z]{2,}$~i',
    ];

    foreach ($urlMatches[0] ?? [] as $url) {
        $candidate = preg_match('~^(?:https?://)?(?:www\.)?([^/\s?#]+)~iu', $url, $parts)
            ? strtolower(rtrim($parts[1], '.'))
            : '';

        foreach ($suspiciousDomainPatterns as $pattern) {
            if ($candidate !== '' && preg_match($pattern, $candidate) === 1) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Lightweight file-based rate limiter: maximum 3 submissions per IP in 10 minutes.
 */
function checkRateLimit(string $ip, int $maxAttempts = 3, int $windowSeconds = 600): bool
{
    $path = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'gss_contact_rate_limit.json';
    $now = time();

    $handle = @fopen($path, 'c+');
    if ($handle === false) {
        // Fail open rather than preventing legitimate contact if the hosting
        // environment does not allow temporary-file storage.
        return true;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return true;
        }

        rewind($handle);
        $contents = stream_get_contents($handle);
        $data = json_decode($contents ?: '{}', true);
        if (!is_array($data)) {
            $data = [];
        }

        // Remove stale entries to keep the file small.
        foreach ($data as $storedIp => $timestamps) {
            if (!is_array($timestamps)) {
                unset($data[$storedIp]);
                continue;
            }
            $data[$storedIp] = array_values(array_filter(
                $timestamps,
                static fn($timestamp): bool => is_int($timestamp) && $timestamp > ($now - $windowSeconds)
            ));
            if ($data[$storedIp] === []) {
                unset($data[$storedIp]);
            }
        }

        $attempts = $data[$ip] ?? [];
        if (count($attempts) >= $maxAttempts) {
            flock($handle, LOCK_UN);
            fclose($handle);
            return false;
        }

        $attempts[] = $now;
        $data[$ip] = $attempts;

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($data, JSON_UNESCAPED_SLASHES));
        fflush($handle);
        flock($handle, LOCK_UN);
        fclose($handle);
        return true;
    } catch (Throwable $e) {
        @flock($handle, LOCK_UN);
        @fclose($handle);
        error_log('[GSS Contact Anti-Spam] Rate limiter error: ' . $e->getMessage());
        return true;
    }
}

/**
 * Prevent the same IP from repeatedly sending exactly the same inquiry.
 */
function checkDuplicateSubmission(string $ip, string $email, string $subject, string $message, int $windowSeconds = 3600): bool
{
    $path = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'gss_contact_duplicates.json';
    $now = time();
    $hash = hash('sha256', $ip . "\n" . strtolower($email) . "\n" . $subject . "\n" . $message);

    $handle = @fopen($path, 'c+');
    if ($handle === false) {
        return true;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return true;
        }

        rewind($handle);
        $contents = stream_get_contents($handle);
        $data = json_decode($contents ?: '{}', true);
        if (!is_array($data)) {
            $data = [];
        }

        foreach ($data as $storedHash => $timestamp) {
            if (!is_int($timestamp) || $timestamp <= ($now - $windowSeconds)) {
                unset($data[$storedHash]);
            }
        }

        if (isset($data[$hash])) {
            flock($handle, LOCK_UN);
            fclose($handle);
            return false;
        }

        $data[$hash] = $now;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($data, JSON_UNESCAPED_SLASHES));
        fflush($handle);
        flock($handle, LOCK_UN);
        fclose($handle);
        return true;
    } catch (Throwable $e) {
        @flock($handle, LOCK_UN);
        @fclose($handle);
        error_log('[GSS Contact Anti-Spam] Duplicate checker error: ' . $e->getMessage());
        return true;
    }
}
