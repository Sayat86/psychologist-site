<?php

declare(strict_types=1);


/*
|--------------------------------------------------------------------------
| Basic response settings
|--------------------------------------------------------------------------
*/

header('Content-Type: application/json; charset=utf-8');


/*
|--------------------------------------------------------------------------
| Only POST requests
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Load configuration
|--------------------------------------------------------------------------
*/

$config = require __DIR__ . '/config.php';


/*
|--------------------------------------------------------------------------
| Helper functions
|--------------------------------------------------------------------------
*/

function respond(
    bool $success,
    string $message,
    int $statusCode = 200
): never {

    http_response_code($statusCode);

    echo json_encode([
        'success' => $success,
        'message' => $message
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


function getClientIp(): string {

    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}


/*
|--------------------------------------------------------------------------
| 1. Honeypot
|--------------------------------------------------------------------------
|
| Real users never see this field.
| Bots often fill every available input.
|
*/

$honeypot = trim(
    (string)($_POST['website'] ?? '')
);

if ($honeypot !== '') {

    respond(
        false,
        'Request rejected.',
        403
    );
}


/*
|--------------------------------------------------------------------------
| 2. Basic browser information
|--------------------------------------------------------------------------
*/

$userAgent = trim(
    (string)($_SERVER['HTTP_USER_AGENT'] ?? '')
);

if ($userAgent === '') {

    respond(
        false,
        'Request rejected.',
        403
    );
}


/*
|--------------------------------------------------------------------------
| 3. Origin / Referer protection
|--------------------------------------------------------------------------
*/

$allowedOrigin = rtrim(
    (string)$config['allowed_origin'],
    '/'
);

$origin = rtrim(
    (string)($_SERVER['HTTP_ORIGIN'] ?? ''),
    '/'
);

$referer = (string)(
    $_SERVER['HTTP_REFERER'] ?? ''
);


$validOrigin = false;


/*
 * Check Origin if browser sent it.
 */

if (
    $origin !== '' &&
    $origin === $allowedOrigin
) {

    $validOrigin = true;

}


/*
 * Otherwise check Referer.
 */

if (
    !$validOrigin &&
    $referer !== '' &&
    str_starts_with(
        $referer,
        $allowedOrigin
    )
) {

    $validOrigin = true;

}


if (!$validOrigin) {

    respond(
        false,
        'Request rejected.',
        403
    );
}


/*
|--------------------------------------------------------------------------
| 4. Rate limiting
|--------------------------------------------------------------------------
*/

$ip = getClientIp();

$rateLimitSeconds = max(
    10,
    (int)$config['rate_limit_seconds']
);


$rateLimitDirectory =
    sys_get_temp_dir() . '/psychologist_form_rate_limit';


if (!is_dir($rateLimitDirectory)) {

    @mkdir(
        $rateLimitDirectory,
        0755,
        true
    );

}


/*
 * Hash the IP instead of using it directly
 * as a filename.
 */

$rateLimitFile =
    $rateLimitDirectory .
    '/' .
    hash('sha256', $ip);


$now = time();


if (is_file($rateLimitFile)) {

    $lastRequest = (int)(
        @file_get_contents($rateLimitFile)
    );


    if (
        $lastRequest > 0 &&
        ($now - $lastRequest) < $rateLimitSeconds
    ) {

        respond(
            false,
            'Please wait before sending another request.',
            429
        );

    }

}


/*
|--------------------------------------------------------------------------
| 5. Read form fields
|--------------------------------------------------------------------------
*/

$name = trim(
    (string)($_POST['name'] ?? '')
);

$phone = trim(
    (string)($_POST['phone'] ?? '')
);

$format = trim(
    (string)($_POST['format'] ?? '')
);

$message = trim(
    (string)($_POST['message'] ?? '')
);


/*
|--------------------------------------------------------------------------
| 6. Validate name
|--------------------------------------------------------------------------
*/

if ($name === '') {

    respond(
        false,
        'Please enter your name.',
        422
    );

}


if (mb_strlen($name) < 2) {

    respond(
        false,
        'Name is too short.',
        422
    );

}


if (mb_strlen($name) > 100) {

    respond(
        false,
        'Name is too long.',
        422
    );

}


/*
|--------------------------------------------------------------------------
| 7. Validate phone
|--------------------------------------------------------------------------
*/

if ($phone === '') {

    respond(
        false,
        'Please enter your phone number.',
        422
    );

}


$phoneDigits = preg_replace(
    '/\D+/',
    '',
    $phone
);


if (
    $phoneDigits === null ||
    strlen($phoneDigits) < 10 ||
    strlen($phoneDigits) > 15
) {

    respond(
        false,
        'Please enter a valid phone number.',
        422
    );

}


/*
|--------------------------------------------------------------------------
| 8. Validate consultation format
|--------------------------------------------------------------------------
*/

$allowedFormats = [
    'online',
    'offline'
];


if (!in_array(
    $format,
    $allowedFormats,
    true
)) {

    respond(
        false,
        'Please select a consultation format.',
        422
    );

}


/*
|--------------------------------------------------------------------------
| 9. Validate message
|--------------------------------------------------------------------------
*/

if (mb_strlen($message) > 2000) {

    respond(
        false,
        'Message is too long.',
        422
    );

}


/*
|--------------------------------------------------------------------------
| 10. Save rate-limit timestamp
|--------------------------------------------------------------------------
*/

@file_put_contents(
    $rateLimitFile,
    (string)$now,
    LOCK_EX
);


/*
|--------------------------------------------------------------------------
| 11. Prepare Telegram message
|--------------------------------------------------------------------------
*/

$formatName = match ($format) {

    'online' => 'Онлайн',

    'offline' => 'Офлайн',

    default => $format

};


$telegramMessage =
    "🔔 <b>Новая заявка с сайта</b>\n\n" .

    "👤 <b>Имя:</b> " .
    htmlspecialchars(
        $name,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    ) .
    "\n" .

    "📞 <b>Телефон:</b> " .
    htmlspecialchars(
        $phone,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    ) .
    "\n" .

    "💬 <b>Формат:</b> " .
    $formatName .
    "\n";


if ($message !== '') {

    $telegramMessage .=
        "\n📝 <b>Сообщение:</b>\n" .
        htmlspecialchars(
            $message,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        );

}


/*
|--------------------------------------------------------------------------
| 12. Send to Telegram
|--------------------------------------------------------------------------
*/

$botToken = trim(
    (string)$config['telegram_bot_token']
);

$chatId = trim(
    (string)$config['telegram_chat_id']
);


if (
    $botToken === '' ||
    $chatId === ''
) {

    respond(
        false,
        'Server configuration error.',
        500
    );

}


$telegramUrl =
    'https://api.telegram.org/bot' .
    $botToken .
    '/sendMessage';


$postData = [
    'chat_id' => $chatId,

    'text' => $telegramMessage,

    'parse_mode' => 'HTML'
];


$ch = curl_init($telegramUrl);


curl_setopt_array(
    $ch,
    [

        CURLOPT_POST => true,

        CURLOPT_POSTFIELDS =>
            http_build_query($postData),

        CURLOPT_RETURNTRANSFER => true,

        CURLOPT_CONNECTTIMEOUT => 5,

        CURLOPT_TIMEOUT => 10,

    ]
);


$response = curl_exec($ch);

$curlError = curl_error($ch);

$httpCode = (int)(
    curl_getinfo(
        $ch,
        CURLINFO_HTTP_CODE
    )
);


curl_close($ch);


/*
|--------------------------------------------------------------------------
| 13. Telegram error
|--------------------------------------------------------------------------
*/

if (
    $response === false ||
    $curlError !== '' ||
    $httpCode < 200 ||
    $httpCode >= 300
) {

    respond(
        false,
        'Unable to send request.',
        500
    );

}


/*
|--------------------------------------------------------------------------
| 14. Success
|--------------------------------------------------------------------------
*/

respond(
    true,
    'Your request has been sent.'
);