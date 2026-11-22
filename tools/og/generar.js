// Genera img/og-image.png (la imagen que sale al compartir el enlace) a partir de og.html
const path = require('path');
const { navegador, espera } = require('../lib.js');
(async () => {
  const b = await navegador(), p = await b.newPage();
  await p.setViewport({ width: 1200, height: 630 });
  await p.goto(require('url').pathToFileURL(path.join(__dirname, 'og.html')).href, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready); await espera(200);
  const out = path.join(__dirname, '..', '..', 'img', 'og-image.png');
  await p.screenshot({ path: out, type: 'png' });
  console.log(out);
  await b.close();
})();
