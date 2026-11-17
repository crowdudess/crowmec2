// Wraps ../index.html (the game) (written without <html>/<head>/<body> tags) into a full page for the desktop app.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
</head>
<body>
${src}
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'game.html'), page);
console.log('Wrote game.html');
