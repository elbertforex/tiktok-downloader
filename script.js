// script.js
const btn = document.getElementById('btn');
const urlInput = document.getElementById('url');
const status = document.getElementById('status');
const preview = document.getElementById('preview');
const videoEl = document.getElementById('video');
const titleEl = document.getElementById('title');
const downloadBtn = document.getElementById('downloadBtn');

// Config: jika pakai backend proxy, set BACKEND = true
const BACKEND = true; // ubah ke false jika mau langsung ke public API
const BACKEND_URL = '/api/fetch'; // endpoint proxy (server.js). Jika deploy frontend-only, ubah sesuai domain.

btn.addEventListener('click', onDownload);
urlInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') onDownload(); });

async function onDownload() {
  const link = urlInput.value.trim();
  if (!link) { alert('Masukkan link TikTok'); return; }

  status.textContent = 'Memproses...';
  preview.hidden = true;
  titleEl.textContent = '';

  try {
    let resp;
    if (BACKEND) {
      resp = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link })
      });
    } else {
      // langsung ke tikwm (public) — mungkin terblokir oleh CORS
      const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(link)}`;
      resp = await fetch(api);
    }

    if (!resp.ok) throw new Error('Network response not ok');

    const json = await resp.json();

    // struktur object beragam tergantung API; handle beberapa kemungkinan
    // contoh tikwm: {data:{play: "...", title: "..."}}
    let videoUrl = null;
    let title = '';

    if (json.data && json.data.play) {
      videoUrl = json.data.play; // no watermark
      title = json.data.title || '';
    } else if (json.video && json.video.no_wm) {
      videoUrl = json.video.no_wm;
      title = json.video.title || '';
    } else if (json.download && json.download.nowm) {
      videoUrl = json.download.nowm;
      title = json.title || '';
    } else {
      // fallback: tampilkan JSON untuk debugging
      status.textContent = 'Gagal ekstrak video. Response API: lihat console';
      console.log('API response', json);
      return;
    }

    titleEl.textContent = title || 'TikTok Video';
    videoEl.src = videoUrl;
    downloadBtn.href = videoUrl;
    downloadBtn.setAttribute('download', 'tiktok_nowm.mp4');

    preview.hidden = false;
    status.textContent = 'Sukses! Preview tersedia di bawah.';
  } catch (err) {
    console.error(err);
    status.textContent = 'Terjadi kesalahan. Cek console atau coba lagi nanti.';
  }
}
