// Renders the Nestguard app icons: node media/icon-src/render.js "$PWD/media/icon-src" writes icon/round/fg/bgonly/splash PNGs next to icon.html.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const dir = process.argv[2];
 for (const m of ['icon', 'round', 'fg', 'bgonly', 'splash']) { const size = m === 'splash' ? 2732 : 1024; const p = await b.newPage({ viewport: { width: size, height: size } });
  await p.goto('file://' + dir + '/icon.html?m=' + m); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  console.log(m, await p.evaluate(() => document.fonts.check('800 100px "Grenze Gotisch"')), await p.evaluate(() => document.getElementById('t') ? document.getElementById('t').getBoundingClientRect().width : 0));
  await p.locator('#c').screenshot({ path: dir + '/' + m + '.png', omitBackground: true }); await p.close(); }
 await b.close(); })();
