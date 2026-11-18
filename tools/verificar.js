// Comprueba toda la web y da un resumen corto.
// Uso: npm run verificar  ·  con Lighthouse: npm run completo
const fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os'), { spawnSync, spawn } = require('child_process');
const { RAIZ, servidor, navegador, espera, rutaChrome } = require('./lib.js');
const version = require('./version.js');
const axeFuente = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const fallos = [];
function res(nombre, ok, detalle) {
  console.log(`${ok ? 'OK ' : 'MAL'} ${nombre}${detalle ? ' · ' + detalle : ''}`);
  if (!ok) fallos.push(nombre);
}
const nodo = (args) => spawnSync(process.execPath, args, { cwd: __dirname, encoding: 'utf8', maxBuffer: 5e7 });

async function pagina(b, { w = 1440, h = 900, tema = 'light', mov = 'reduce', intro = false } = {}) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema }, { name: 'prefers-reduced-motion', value: mov }]);
  if (!intro) await p.evaluateOnNewDocument(() => { try { sessionStorage.setItem('pa-intro', '1'); } catch (e) { /* sin almacenamiento */ } });
  return p;
}

(async () => {
  // 1. Archivos
  const js = [];
  for (const f of ['js/main.js', 'data/videos.js']) {
    try { new vm.Script(fs.readFileSync(path.join(RAIZ, f), 'utf8')); } catch (e) { js.push(f + ': ' + e.message); }
  }
  res('Sintaxis JavaScript', !js.length, js.join(' | '));

  const bin = path.join(path.dirname(require.resolve('html-validate/package.json')), 'bin', 'html-validate.mjs');
  const hv = nodo([bin, '--config', '.htmlvalidate.json', ...version.PAGINAS.map((f) => '../' + f)]);
  res('HTML válido', hv.status === 0, hv.status === 0 ? '' : (hv.stdout + hv.stderr).trim().split('\n').slice(0, 8).join(' / '));

  const v = version.calcular(), vs = version.actual();
  const alDia = vs.length === 12 && vs.every((x) => x === v);
  res('Versión ?v= al día', alDia, alDia ? '' : 'ejecuta: npm run version');

  const srv = await servidor(), b = await navegador(), errores = [];
  const vigilar = (p) => {
    p.on('pageerror', (e) => errores.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errores.push(m.text()); });
    p.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(srv.url)) errores.push(r.status() + ' ' + r.url().replace(srv.url, '')); });
  };

  // 2. Tamaños y accesibilidad
  const desb = [], viol = [];
  for (const w of [320, 390, 768, 1024, 1440, 1920]) {
    for (const tema of ['light', 'dark']) {
      const p = await pagina(b, { w, tema });
      vigilar(p);
      await p.goto(srv.url, { waitUntil: 'networkidle0' });
      const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (o > 0) desb.push(`${w}px +${o}`);
      if (w === 390 || w === 1440) {
        await p.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
        await p.evaluate(axeFuente);
        const r = await p.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }));
        r.violations.forEach((x) => viol.push(`${w}/${tema} ${x.id}: ${x.nodes[0].target}`));
      }
      await p.close();
    }
  }
  res('Sin scroll horizontal (320-1920 px)', !desb.length, desb.join(', '));
  res('Accesibilidad axe (claro y oscuro)', !viol.length, viol.slice(0, 6).join(' | '));

  // Páginas legales
  const legal = [];
  for (const f of version.PAGINAS.slice(1)) {
    for (const tema of ['light', 'dark']) {
      const q = await pagina(b, { w: 390, tema });
      vigilar(q);
      await q.goto(srv.url + f, { waitUntil: 'networkidle0' });
      await q.evaluate(axeFuente);
      const r = await q.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }));
      r.violations.forEach((x) => legal.push(`${f}/${tema} ${x.id}`));
      const o = await q.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (o > 0) legal.push(`${f} desborda ${o}px`);
      await q.close();
    }
  }
  res('Páginas legales accesibles', !legal.length, legal.slice(0, 6).join(' | '));

  // 3. Animaciones
  let p = await pagina(b, { w: 1280, h: 800, mov: 'no-preference' });
  vigilar(p);
  await p.goto(srv.url, { waitUntil: 'networkidle0' });
  await espera(1800);
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= alto; y += 350) { await p.evaluate((n) => window.scrollTo(0, n), y); await espera(70); }
  await espera(1600);
  const ocultos = await p.evaluate(() => [...document.querySelectorAll('.reveal, .reveal-clip, .reveal-up')].filter((n) => !n.classList.contains('is-visible')).length);
  res('Todo aparece al bajar', ocultos === 0, ocultos ? ocultos + ' bloques sin aparecer' : '');
  await p.close();

  p = await pagina(b, { intro: true });
  await p.goto(srv.url, { waitUntil: 'networkidle0' });
  await espera(300);
  const activas = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
  const conIntro = await p.evaluate(() => document.documentElement.classList.contains('intro'));
  res('«Reducir movimiento» respetado', activas === 0 && !conIntro, activas ? activas + ' animaciones activas' : '');
  await p.close();

  // 4. Si el JavaScript principal no carga
  p = await pagina(b, { w: 390, mov: 'no-preference' });
  await p.setRequestInterception(true);
  p.on('request', (r) => (r.url().includes('/js/main.js') ? r.abort() : r.continue()));
  await p.goto(srv.url, { waitUntil: 'networkidle0' });
  await espera(1800);
  const sinJs = await p.evaluate(() => ({
    menu: getComputedStyle(document.querySelector('.nav-list')).display !== 'none',
    ocultos: [...document.querySelectorAll('.reveal, .reveal-clip, .reveal-up')].filter((n) => getComputedStyle(n).opacity === '0').length,
  }));
  res('Funciona si falla el JavaScript', sinJs.menu && sinJs.ocultos === 0, sinJs.menu && !sinJs.ocultos ? '' : JSON.stringify(sinJs));
  await p.close();

  // 5. Teclado y formulario (no se envía nada)
  p = await pagina(b, { w: 1280, h: 800 });
  vigilar(p);
  await p.goto(srv.url, { waitUntil: 'networkidle0' });
  const sinFoco = [];
  let pasos = 0;
  for (; pasos < 90; pasos++) {
    await p.keyboard.press('Tab');
    const f = await p.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      return { t: e.tagName + ' ' + (e.id || e.textContent.trim().slice(0, 24)), ok: getComputedStyle(e).outlineStyle !== 'none' || !!e.closest('.video-media') };
    });
    if (!f) break;
    if (!f.ok) sinFoco.push(f.t);
  }
  res('Teclado con foco visible', !sinFoco.length, `${pasos} paradas${sinFoco.length ? ' · sin foco: ' + sinFoco.slice(0, 5).join(', ') : ''}`);
  await p.$eval('#form-contacto button[type=submit]', (e) => e.click());
  await espera(200);
  const form = await p.evaluate(() => ({ foco: document.activeElement.id, inv: document.querySelectorAll('#form-contacto [aria-invalid=true]').length }));
  res('Formulario avisa de los errores', form.foco === 'resumen-errores' && form.inv === 5, form.inv === 5 ? '' : JSON.stringify(form));
  await p.close();

  res('Sin errores de consola ni archivos rotos', !errores.length, [...new Set(errores)].slice(0, 5).join(' | '));
  await b.close();

  // 6. Lighthouse (solo con --completo)
  if (process.argv.includes('--completo')) {
    for (const modo of ['movil', 'escritorio']) {
      const sal = path.join(os.tmpdir(), `pulseads-lh-${modo}.json`);
      const cli = path.join(path.dirname(require.resolve('lighthouse/package.json')), 'cli', 'index.js');
      // Debe ser asíncrono: el servidor local vive en este mismo proceso
      await new Promise((fin) => {
        spawn(process.execPath, [cli, srv.url, "--quiet", "--chrome-flags=--headless=new", "--output=json", `--output-path=${sal}`,
          "--only-categories=performance,accessibility,best-practices,seo"].concat(modo === "escritorio" ? ["--preset=desktop"] : []),
        { cwd: __dirname, stdio: "ignore", env: { ...process.env, CHROME_PATH: rutaChrome() } }).on("close", fin);
      });
      const r = JSON.parse(fs.readFileSync(sal, 'utf8'));
      const n = Object.values(r.categories).map((c) => Math.round(c.score * 100));
      res(`Lighthouse ${modo} (rendimiento/accesibilidad/prácticas/SEO)`, n.every((x) => x >= 95), `${n.join(' / ')} · LCP ${r.audits['largest-contentful-paint'].displayValue}`);
    }
  }

  srv.cerrar();
  console.log(fallos.length ? `\nHAY ${fallos.length} PROBLEMA(S): ${fallos.join(', ')}` : '\nTODO CORRECTO');
  process.exit(fallos.length ? 1 : 0);
})().catch((e) => { console.error('Error en las pruebas:', e.message); process.exit(2); });
