# TikSaver — TikTok Downloader (No Watermark)

Cara run lokal (dengan backend proxy):
1. Clone repo
2. cd tiksaver
3. npm install
4. Place frontend files into /public
5. npm start
6. Buka http://localhost:3000

Deploy ke Vercel (frontend+server):
- Jika ingin deploy server Node, gunakan Render atau Railway (Vercel Serverless juga bisa).
- Untuk frontend-only (static), cukup deploy folder /public ke Vercel / Netlify / Lovable.dev.

Catatan:
- Layanan pihak ketiga (mis. tikwm) dapat berubah / rate-limit. Gunakan caching & rate limiter.
- Gunakan sesuai kebijakan TikTok.
