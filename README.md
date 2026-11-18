# PulseAds · Web

Web de una sola página de **PulseAds**, la agencia de vídeos con IA para locales.
*Proyecto académico ficticio de Christian Gómez Moreno y César Iglesias.*

## Cómo abrirla
Haced doble clic en `index.html` y se abrirá en el navegador.
> Los subtítulos (`.vtt`) de los vídeos solo se cargan cuando la web está publicada o servida desde un servidor; abriéndola con doble clic, el navegador los bloquea. Todo lo demás funciona igual.

## Estructura
```
index.html          → la página
css/styles.css      → estilos (colores y tamaños arriba, en :root)
js/main.js          → menú móvil, vídeos, formulario y animaciones
data/videos.js      → LISTA DE VÍDEOS (edita aquí)
videos/             → archivos .mp4 y subtítulos .vtt
img/                → favicons, imagen para redes, pósters (img/videos/)
img/brand/          → logos en todas sus versiones + hoja de marca (index.html)
img/logo-options/   → las 3 propuestas iniciales de logo
fonts/              → tipografías autoalojadas (licencia OFL)
BRAND.md            → guía de marca
```

## Qué tenéis que personalizar
Lo que queda por ajustar (en los archivos, lo pendiente lleva la marca `[Sustituir]`):
1. **Formspree:** pegad el ID del formulario (ver la sección «Formulario» más abajo).
2. **Vídeos:** copiad los `.mp4` a `videos/` y los pósters a `img/videos/`. En `data/videos.js` hay una plantilla comentada: rellenad `archivo`, `poster`, `formato` y `transcripcion`. Si `archivo` está vacío, sale un marcador de posición.
3. **Subtítulos:** un `.vtt` por vídeo; tenéis la plantilla `videos/ejemplo-1.vtt` y un ejemplo completo en `videos/black-friday-relojeria.vtt`.
4. **Email de contacto (si cambia):** en `index.html` (contacto y aviso legal) y en `js/main.js` (`CONTACT_EMAIL`).
5. **Dirección de la web:** ya está puesta (`https://chrissportifi-boop.github.io/pulseads/`). Si algún día usáis un dominio propio, cambiadla en `index.html`, `sitemap.xml` y `robots.txt`.
6. **Precios:** si algún día tenéis tarifas, cambiad la pregunta "¿Cuánto cuesta?".

## Si la web se ve descolocada tras un cambio
Es la caché del navegador mezclando archivos nuevos y viejos: pulsad **Ctrl+F5**. Para evitarlo, cada vez que cambiéis `css/styles.css`, `js/main.js` o `data/videos.js`, subid el número `?v=` que aparece en `index.html` (por ejemplo, de `?v=20261118-2` a `?v=20261118-3`).

## Formulario
Los mensajes del formulario se envían con **Formspree** (servicio gratuito) y llegan directamente a `ceigiggm@gmail.com`, sin que el visitante tenga que abrir su correo.
Mientras no pongáis el ID de Formspree, el formulario sigue funcionando a la antigua: abre el programa de correo del visitante con el mensaje ya escrito.

**Cómo conectarlo (5 minutos, una sola vez):**
1. Entrad en [formspree.io](https://formspree.io) con la cuenta de `ceigiggm@gmail.com` (si no la tenéis, creadla gratis con ese correo y confirmad el email que os llega).
2. Cread un formulario nuevo (botón de añadir formulario, *New Form*), ponedle de nombre «Contacto PulseAds» y comprobad que el correo de destino es `ceigiggm@gmail.com`.
3. Formspree os enseña una dirección como `https://formspree.io/f/xyzabcde`. **El ID son las letras del final** (en el ejemplo, `xyzabcde`). Copiadlo.
4. Abrid `js/main.js` con el Bloc de notas, buscad `FORMSPREE_ID = ''` y pegad el ID entre las comillas: `FORMSPREE_ID = 'xyzabcde';`. Guardad.
5. (Recomendado) En `index.html`, buscad `action="https://formspree.io/f/"` y añadid el mismo ID al final: `action="https://formspree.io/f/xyzabcde"`. Así funciona también si alguien tiene JavaScript desactivado.
6. Publicad la web y enviad un mensaje de prueba. Debería llegar a `ceigiggm@gmail.com` en un minuto (si no, mirad también la carpeta de spam de Gmail).

**Si al enviar sale «No hemos podido enviar tu mensaje»:**
- En Formspree, abrid el formulario → pestaña **Settings** → apartado **Spam protection** y **desactivad reCAPTCHA**. La página de reCAPTCHA que pone Formspree por defecto no funciona con formularios enviados en segundo plano como este. La web ya trae otra protección antispam (un campo trampa invisible) y Formspree filtra spam por su cuenta.
- (Opcional) En **Settings** podéis usar **Restrict to Domain** y poner el dominio de la web (sin `https://`, p. ej. `pulseads.es`) para que solo se acepten mensajes enviados desde ella. Ojo: si la probáis desde otra dirección (vuestro ordenador, otro dominio), esos mensajes irán a la carpeta de spam de Formspree.

**Límite del plan gratuito:** 50 envíos al mes (formularios ilimitados), según [formspree.io/plans](https://formspree.io/plans) en noviembre de 2026.

## Publicarla gratis
**GitHub Pages**
1. Cread un repositorio en GitHub y subid todo el contenido de esta carpeta.
2. Id a *Settings → Pages*, elegid la rama `main` y la carpeta `/ (root)`.
3. En un minuto estará en `https://vuestro-usuario.github.io/nombre-del-repo/`. La de PulseAds es **https://chrissportifi-boop.github.io/pulseads/**.

**Netlify**
1. Entrad en [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastrad esta carpeta. Os dará una dirección al momento.

## Calidad comprobada
- Lighthouse (móvil y escritorio): 100 en Rendimiento, Accesibilidad, Buenas prácticas y SEO.
- axe-core (WCAG 2.2 AA), en modo claro y oscuro, en móvil y escritorio: 0 errores.
- HTML validado con html-validate: sin errores.
- Navegación completa con teclado, sin scroll horizontal de 320 a 1920 px, modo oscuro automático y sin animaciones para quien elige reducir el movimiento.
