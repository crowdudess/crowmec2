// Wraps ../index.html (the game) into www/index.html for the Android app,
// with a small bridge: full screen, and the phone's back button acts like Escape.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const bridge = `<script>
(function () {
  const P = window.Capacitor && window.Capacitor.Plugins;
  if (!P) return;
  try { P.StatusBar.setOverlaysWebView({ overlay: true }); P.StatusBar.hide(); } catch (e) {}
  try {
    P.App.addListener('backButton', () => {
      const open = document.querySelector('.overlay:not([hidden])');
      dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' }));
      if (!open && document.getElementById('hud') && document.getElementById('hud').hidden) P.App.minimizeApp();
    });
    P.App.addListener('pause', () => dispatchEvent(new Event('blur')));
  } catch (e) {}
})();
</script>`;
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0b0a08">
</head>
<body>
${src}
${bridge}
</body>
</html>
`;
fs.mkdirSync(path.join(__dirname, 'www'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'www', 'index.html'), page);
console.log('Wrote www/index.html');
