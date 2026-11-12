<?php
// Optional: same logic for traditional PHP hosting (cPanel / VPS / shared hosting).
// Telegram credentials yahan set karo ya env vars se pull karo.

header('Content-Type: application/json');

$BOT_TOKEN = getenv('BOT_TOKEN') ?: 'YOUR_NEW_BOT_TOKEN';
$CHAT_ID   = getenv('CHAT_ID') ?: '@shinepayouts';

$number = trim($_GET['number'] ?? '');

if ($number === '') {
    http_response_code(400);
    exit(json_encode(['success' => false, 'error' => 'Number missing']));
}

if (!preg_match('/^\+?\d{1,20}$/', $number)) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'error' => 'Invalid number']));
}

function mask_number($number) {
    $number = (string) $number;

    if (strlen($number) <= 4) {
        return $number;
    }

    return substr($number, 0, 4) . 'XXXX' . substr($number, -2);
}

$user = mask_number($number);

$message = "
<b>🎯 CONVERSION TRACKED!</b>
<blockquote>🟢 New Registration Received</blockquote>

<b>🎁 OFFER DETAILS</b>
━━━━━━━━━━━━━━━━━━
<b>Offer:</b> Gift card generate
<b>Event:</b> Register

<b>👤 USER INFORMATION</b>
━━━━━━━━━━━━━━━━━━
<b>📱 User:</b> <code>{$user}</code>

<b>💰 USER AMOUNT</b>
<blockquote><b>₹8.00</b></blockquote>

<b>💳 Payment Status:</b> 🟡 PENDING

━━━━━━━━━━━━━━━━━━
<tg-spoiler>Powered by @ShineCamps</tg-spoiler>
";

$url = "https://api.telegram.org/bot{$BOT_TOKEN}/sendMessage";

$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => [
        'chat_id' => $CHAT_ID,
        'text' => $message,
        'parse_mode' => 'HTML'
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 15
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

$result = json_decode($response ?: '', true);

if ($httpCode === 200 && !empty($result['ok'])) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Telegram failed']);
}
