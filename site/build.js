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
fs.writeFileSync(path.join(out, 'play', 'index.html'), page(fs.readFileSync(path.join(root, 'index.html'), 'utf8')));
fs.cpSync(path.join(root, 'media'), path.join(out, 'media'), { recursive: true });
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('Built _site');
