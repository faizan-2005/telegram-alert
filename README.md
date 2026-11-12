# Telegram Alert Endpoint (Vercel)

GET request se number receive karke `@shinepayouts` par premium formatted Telegram alert bhejta hai.
Koi conversion API polling nahi, koi database/JSON storage nahi — har valid GET par ek alert.

## Structure

```
telegram-alert/
├── api/alert.js          # Vercel serverless function (main endpoint)
├── php/alert.php         # Optional: same logic for cPanel/VPS PHP hosting
├── vercel.json           # /alert  ->  /api/alert rewrite
├── .env.example          # Environment variable template
├── .gitignore
└── package.json
```

## Setup (Vercel)

1. GitHub par naya repo create karo (`telegram-alert`).
2. Is folder ki saari files upload karo.
3. Vercel → **Add New → Project** → repo import karo → **Deploy**.
4. **Settings → Environment Variables** mein ye 3 variables add karo:

| Name | Value |
| --- | --- |
| `BOT_TOKEN` | Naya Telegram bot token (BotFather se) |
| `CHAT_ID` | `@shinepayouts` |
| `API_KEY` | Apna long random secret key |

5. Save → **Redeploy** (env vars ke baad redeploy zaroori hai).

## Test

```
https://YOUR-PROJECT.vercel.app/api/alert?number=9876543210&key=YOUR_SECRET_KEY
```

Short alias (vercel.json rewrite):

```
https://YOUR-PROJECT.vercel.app/alert?number=9876543210&key=YOUR_SECRET_KEY
```

Success response:

```json
{"success":true}
```

### Responses

| Code | Body |
| --- | --- |
| 200 | `{"success":true}` |
| 400 | `{"success":false,"error":"Invalid number"}` |
| 401 | `{"success":false,"error":"Unauthorized"}` |
| 405 | `{"success":false,"error":"Method not allowed"}` |
| 500 | `{"success":false,"error":"Configuration missing"}` / `Request failed` |
| 502 | `{"success":false,"error":"Telegram failed"}` |

## Local test

```bash
npm i -g vercel
vercel dev
```

`http://localhost:3000/api/alert?number=9876543210&key=YOUR_SECRET_KEY`

## Security

- ⚠️ Jo bot token pehle chat me share hua tha usse **BotFather me revoke** karke naya token banao aur `BOT_TOKEN` me daalo.
- `.env` / `.env.local` kabhi commit mat karo (`.gitignore` already cover karta hai).
- `API_KEY` bina endpoint public ho jata hai — strong random value rakho aur rotate karte raho.
- Rate limiting Vercel dashboard se add kar sakte ho (hobby plan par external limit bhi chal jata hai).
