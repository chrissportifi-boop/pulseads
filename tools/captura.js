// Captura una sola sección (gasta muchos menos tokens que la página entera).
// Uso: npm run captura -- 390 "#servicios" [dark]
const path = require('path'), fs = require('fs');
const { servidor, navegador, espera } = require('./lib.js');

(async () => {
  const [w = '1440', sel = 'body', tema = 'light'] = process.argv.slice(2);
  const dir = path.join(__dirname, 'capturas');
  fs.mkdirSync(dir, { recursive: true });
  const srv = await servidor(), b = await navegador(), p = await b.newPage();
  await p.setViewport({ width: +w, height: +w < 700 ? 844 : 900 });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(srv.url, { waitUntil: 'networkidle0' });
  await espera(200);
  await p.evaluate(() => { document.querySelector('.site-header').style.position = 'static'; });
  const f = path.join(dir, `${w}-${sel.replace(/\W+/g, '') || 'pagina'}-${tema}.png`);
  await (await p.$(sel)).screenshot({ path: f });
  console.log(f);
  await b.close();
  srv.cerrar();
})();
