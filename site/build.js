// Builds the Nestguard website into _site/ for GitHub Pages:
//   _site/index.html       the download page (site/index.html)
//   _site/play/index.html  the game itself (index.html), always the latest version
//   _site/media/           trailer and screenshots
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, '_site');
const page = body => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
</head>
<body>
${body}
</body>
</html>
`;
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'play'), { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), page(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')));
// The game page doubles as an installable app: "Add to Home Screen" on iPhone/Android opens it full screen, and it works offline.
const pwaHead = `<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#0b0a08">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Nestguard">
<link rel="apple-touch-icon" href="../media/icon-180.png">`;
const pwaSw = `<script>if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));</script>`;
const game = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
fs.writeFileSync(path.join(out, 'play', 'index.html'), page(game + '\n' + pwaSw).replace('</head>', pwaHead + '\n</head>'));
fs.writeFileSync(path.join(out, 'play', 'manifest.webmanifest'), JSON.stringify({
  name: 'Nestguard', short_name: 'Nestguard', description: 'A roguelike where a crow defends its nest. A game by crowdude.',
  start_url: './', scope: './', display: 'fullscreen', orientation: 'landscape', background_color: '#0b0a08', theme_color: '#0b0a08',
  icons: [{ src: '../media/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '../media/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }],
}, null, 2));
// Network first, so a new version shows up as soon as you're online; the cached copy is used offline.
const ver = (game.match(/>v(\d+\.\d+\.\d+)</) || [])[1] || Date.now();
fs.writeFileSync(path.join(out, 'play', 'sw.js'), `const C = 'nestguard-${ver}';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'manifest.webmanifest', '../media/icon-192.png', '../media/icon-512.png', '../media/icon-180.png']))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok && (r.type === 'basic' || r.type === 'cors')) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
`);
fs.cpSync(path.join(root, 'media'), path.join(out, 'media'), { recursive: true });
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('Built _site');
