# PulseAds · Web

Web de una sola página de **PulseAds**, la agencia de vídeos con IA para locales.
*Proyecto académico ficticio de Christian Gómez Moreno y César Iglesias.*

## Cómo abrirla
Haced doble clic en `index.html` y se abrirá en el navegador.
> Los subtítulos (`.vtt`) de los vídeos solo se cargan cuando la web está publicada o servida desde un servidor; abriéndola con doble clic, el navegador los bloquea. Todo lo demás funciona igual.

## Estructura
```
index.html          → la página
css/base.css        → colores, tipografías, botones, cabecera y menú
css/secciones.css   → estudio, trabajos, servicios, método, equipo, preguntas, contacto y pie
css/portada.css     → portada y anuncios flotantes
css/animaciones.css → intro, apariciones y efectos de scroll
js/main.js          → menú móvil, vídeos, formulario y animaciones
data/videos.js      → LISTA DE VÍDEOS (edita aquí)
videos/             → archivos .mp4 y subtítulos .vtt
img/                → favicons, imagen para redes, pósters (img/videos/)
img/brand/          → logos en todas sus versiones + hoja de marca (index.html)
img/logo-options/   → las 3 propuestas iniciales de logo
fonts/              → tipografías autoalojadas (licencia OFL)
BRAND.md            → guía de marca
CLAUDE.md           → instrucciones para el Claude de cada uno
tools/              → pruebas automáticas (no forman parte de la web)
```

## Qué tenéis que personalizar
Lo que queda por ajustar (en los archivos, lo pendiente lleva la marca `[Sustituir]`):
1. **Vídeos:** copiad los `.mp4` a `videos/` y los pósters a `img/videos/`. En `data/videos.js` hay una plantilla comentada: rellenad `archivo`, `poster`, `formato` y `transcripcion`. Si `archivo` está vacío, sale un marcador de posición.
2. **Subtítulos:** un `.vtt` por vídeo; tenéis la plantilla `videos/ejemplo-1.vtt` y un ejemplo completo en `videos/black-friday-relojeria.vtt`.
   Si cambiáis el vídeo destacado, actualizad también la versión sin JavaScript que hay dentro de `<noscript>` en `index.html`.
3. **Email de contacto (si cambia):** en `index.html` (contacto y aviso legal) y en `js/main.js` (`CONTACT_EMAIL`).
4. **Dirección de la web:** ya está puesta (`https://chrissportifi-boop.github.io/pulseads/`). Si algún día usáis un dominio propio, cambiadla en `index.html`, `sitemap.xml` y `robots.txt`.
5. **Precios:** si algún día tenéis tarifas, cambiad la pregunta "¿Cuánto cuesta?".

## Comprobar y publicar cambios
Dentro de la carpeta `tools` (la primera vez, `npm install`):
- `npm run version`: actualiza la versión de CSS y JS para que los navegadores no usen copias antiguas. Hay que ejecutarlo después de cambiar esos archivos.
- `npm run verificar`: comprueba HTML, accesibilidad, tamaños de pantalla, animaciones, teclado y formulario en menos de dos minutos.
- `npm run completo`: lo mismo y además Lighthouse.
- `npm run captura -- 390 "#servicios"`: guarda una captura de esa sección en `tools/capturas`.

Si la web se ve descolocada tras un cambio, pulsad **Ctrl+F5**.

## Formulario
El formulario ya está **conectado a Formspree** (ID `xljbbava`): los mensajes llegan directamente a `ceigiggm@gmail.com` con el asunto «Nuevo encargo para PulseAds: (nombre del local)», y al pulsar Responder en Gmail se contesta al cliente.

- El ID está en `js/main.js` (`FORMSPREE_ID`) y al final del `action` del `<form>` en `index.html`. Si algún día creáis otro formulario, cambiadlo en los dos sitios.
- Si alguna vez sale «No hemos podido enviar tu mensaje»: en Formspree → vuestro formulario → **Settings** → **Spam protection**, desactivad **reCAPTCHA** (no funciona con formularios enviados en segundo plano). La web ya trae su propio campo trampa antispam.
- Recomendado: en **Settings → Restrict to Domain** poned `chrissportifi-boop.github.io` para aceptar solo mensajes enviados desde la web.
- Si un mensaje no aparece, mirad la carpeta de spam de Gmail y marcadlo como «No es spam».

**Límite del plan gratuito:** 50 envíos al mes (formularios ilimitados), según [formspree.io/plans](https://formspree.io/plans) en noviembre de 2026.

## Diseño y animaciones
Estilo editorial «estudio 2026»: portada oscura con el nombre gigante, secciones claras y oscuras alternas que se superponen como láminas, titulares grandes en letra fina y el rojo de la marca como acento.

Animaciones (en `js/main.js`, apartado 0, y en `css/animaciones.css`):
- Intro con cortina: solo la primera visita de cada sesión.
- Nombre de la portada letra a letra, titulares palabra a palabra, frase del estudio que se «enciende» al bajar y números que cuentan.
- Franjas de texto gigante y efecto de profundidad (parallax) ligados al scroll: no se mueven solos.
- Cabecera que se esconde al bajar, barra de progreso, brillo que sigue al ratón y botón flotante «Pide tu anuncio» en móvil.

Accesibilidad: si el visitante tiene activado «reducir movimiento» en su sistema, no se anima nada y todo se ve tal cual. Sin JavaScript, la web también se ve completa.

## Publicarla gratis
**GitHub Pages**
1. Cread un repositorio en GitHub y subid todo el contenido de esta carpeta.
2. Id a *Settings → Pages*, elegid la rama `main` y la carpeta `/ (root)`.
3. En un minuto estará en `https://vuestro-usuario.github.io/nombre-del-repo/`. La de PulseAds es **https://chrissportifi-boop.github.io/pulseads/**.

**Netlify**
1. Entrad en [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastrad esta carpeta. Os dará una dirección al momento.

## Calidad comprobada
- Lighthouse: escritorio 100 en las cuatro categorías; móvil 96 en Rendimiento (por la intro animada) y 100 en Accesibilidad, Buenas prácticas y SEO.
- axe-core (WCAG 2.2 AA), en modo claro y oscuro, en móvil y escritorio: 0 errores.
- HTML validado con html-validate: sin errores.
- Navegación completa con teclado, sin scroll horizontal de 320 a 1920 px, modo oscuro automático y sin animaciones para quien elige reducir el movimiento.
