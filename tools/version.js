// Pone en index.html una versión (?v=) calculada a partir del contenido de CSS y JS.
// Así el navegador descarga los archivos nuevos en cuanto cambian. Uso: npm run version
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { RAIZ } = require('./lib.js');
const ARCHIVOS = ['css/base.css', 'css/secciones.css', 'css/portada.css', 'css/animaciones.css', 'js/main.js', 'data/videos.js'];

function calcular() {
  const h = crypto.createHash('sha1');
  ARCHIVOS.forEach((f) => h.update(fs.readFileSync(path.join(RAIZ, f), 'utf8').replace(/\r\n/g, '\n')));
  return h.digest('hex').slice(0, 10);
}
const patron = /((?:css\/[\w-]+\.css|js\/main\.js|data\/videos\.js)\?v=)[\w-]+/g;
function actual() { return [...fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8').matchAll(patron)].map((m) => m[0].split('?v=')[1]); }

if (require.main === module) {
  const f = path.join(RAIZ, 'index.html'), v = calcular();
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(patron, '$1' + v));
  console.log('Versión actualizada: ' + v);
}
module.exports = { calcular, actual };
