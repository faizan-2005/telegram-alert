function firstValue(candidates) {
    for (const candidate of candidates) {
        if (candidate === undefined || candidate === null) continue;
        const value = Array.isArray(candidate) ? candidate[0] : candidate;
        const trimmed = String(value).trim();
        if (trimmed !== "") return trimmed;
    }
    return "";
}

function isValidIdentifier(value) {
    if (value.length < 2 || value.length > 64) return false;
    return /^\+?[A-Za-z0-9][A-Za-z0-9._+\-@]*$/.test(value);
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;
    const API_KEY = process.env.API_KEY;

    const { key } = req.query;

    const raw = firstValue([
        req.query.number,
        req.query.p1,
        req.query.upi,
        req.query.phone,
        req.query.user,
        req.query.value
    ]);

    const number = raw;

    if (!API_KEY || key !== API_KEY) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    if (!number) {
        return res.status(400).json({
            success: false,
            error: "Number missing"
        });
    }

    if (!isValidIdentifier(number)) {
        return res.status(400).json({
            success: false,
            error: "Invalid number"
        });
    }

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({
            success: false,
            error: "Configuration missing"
        });
    }

    const user = number.length <= 4
        ? number
        : number.slice(0, 4) + "XXXX" + number.slice(-2);

    const message = `
<b>🎯 CONVERSION TRACKED!</b>
<blockquote>🟢 New Registration Received</blockquote>

<b>🎁 OFFER DETAILS</b>
━━━━━━━━━━━━━━━━━━
<b>Offer:</b> Gift card generate
<b>Event:</b> Register

<b>👤 USER INFORMATION</b>
━━━━━━━━━━━━━━━━━━
<b>📱 User:</b> <code>${user}</code>

<b>💰 USER AMOUNT</b>
<blockquote><b>₹8.00</b></blockquote>

<b>💳 Payment Status:</b> 🟡 PENDING

━━━━━━━━━━━━━━━━━━
<tg-spoiler>Powered by @ShineCamps</tg-spoiler>
`;

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: "HTML"
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.ok) {
            return res.status(502).json({
                success: false,
                error: "Telegram failed"
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Request failed"
        });
    }
}
