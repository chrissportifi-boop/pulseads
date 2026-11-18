// Utilidades comunes: servidor local de la web y arranque de Chrome.
const http = require('http'), fs = require('fs'), path = require('path');
const RAIZ = path.resolve(__dirname, '..');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.vtt': 'text/vtt', '.xml': 'application/xml', '.txt': 'text/plain' };

function servidor() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      let ruta = decodeURIComponent(req.url.split('?')[0]);
      if (ruta.endsWith('/')) ruta += 'index.html';
      const f = path.join(RAIZ, ruta);
      if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
      const total = fs.statSync(f).size, rango = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
      const cab = { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' };
      if (rango) {
        const ini = +rango[1] || 0, fin = rango[2] ? +rango[2] : total - 1;
        res.writeHead(206, { ...cab, 'Content-Range': `bytes ${ini}-${fin}/${total}`, 'Content-Length': fin - ini + 1 });
        return fs.createReadStream(f, { start: ini, end: fin }).pipe(res);
      }
      res.writeHead(200, { ...cab, 'Content-Length': total });
      fs.createReadStream(f).pipe(res);
    });
    s.listen(0, '127.0.0.1', () => ok({ url: `http://127.0.0.1:${s.address().port}/`, cerrar: () => { s.closeAllConnections(); s.close(); } }));
  });
}

function rutaChrome() {
  const c = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean);
  const r = c.find((p) => fs.existsSync(p));
  if (!r) throw new Error('No encuentro Chrome. Indica su ruta en la variable CHROME_PATH.');
  return r;
}

const navegador = () => require('puppeteer-core').launch({ executablePath: rutaChrome(), headless: 'new' });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
module.exports = { RAIZ, servidor, rutaChrome, navegador, espera };
