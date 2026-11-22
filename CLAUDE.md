# PulseAds · instrucciones para Claude

Web estática de una sola página (HTML, CSS y JS sin frameworks) de **PulseAds**, negocio real en fase de lanzamiento de vídeos publicitarios con IA para locales, de Christian Gómez Moreno (Chris) y César Iglesias. La web es provisional mientras hablan con los primeros negocios. Publicada en https://chrissportifi-boop.github.io/pulseads/ (GitHub Pages, rama `main`).

Los dos trabajan con su propio Claude y no programan: responde en español, en lenguaje sencillo, y hazlo todo sin pedirles pasos técnicos.

## Flujo de trabajo
1. **Antes de empezar:** `git pull --ff-only`.
2. Haz el cambio.
3. **Si tocaste CSS, `js/main.js` o `data/videos.js`:** `npm --prefix tools run version`.
4. **Comprueba:** `npm --prefix tools run verificar` (si `tools/node_modules` no existe: `npm --prefix tools install`). Antes de publicar cambios grandes: `npm --prefix tools run completo` (añade Lighthouse, tarda varios minutos).
5. **Publica:** commit y `git push`. La web se actualiza sola en un minuto.

## Reglas del contenido
- Español de España, tono profesional y cercano.
- **No inventes** clientes, testimonios, cifras, premios ni precios.
- Faltan el NIF y el domicilio en `aviso-legal.html` y `privacidad.html` (busca `[Sustituir]`). Nunca los inventes.
- Los precios están en `index.html` (sección de precios y FAQ) y en `condiciones.html`: mantenlos iguales.
- WhatsApp: los botones se activan rellenando `WHATSAPP_NUMERO` en `js/main.js`.
- Los vídeos de muestra son de negocios inventados (Brasa 21, Café Alba, Navaja Barber Club, Hierro Gym): su descripción debe seguir diciendo que el nombre, los precios y la dirección son de ejemplo. No uses marcas reales.
- Si cambia el vídeo destacado, actualiza también el bloque `<noscript>` de la sección de trabajos.

## Reglas técnicas
- **Orden de los CSS:** se cargan en este orden: base, secciones, portada, animaciones. **El orden importa**: no muevas reglas de un archivo a otro sin comprobar el resultado.
- **Accesibilidad WCAG 2.2 AA:** contraste 4,5:1 en texto y 3:1 en componentes, foco visible, teclado completo y un solo `h1`.
- **Movimiento:** nada se mueve solo más de 5 segundos; las animaciones ocurren una vez o van ligadas al scroll. Todo debe respetar `prefers-reduced-motion` y la web debe verse completa sin JavaScript.
- Sin dependencias externas ni CDN en la web publicada. Debe abrirse con doble clic.
- Lighthouse 95 o más en las cuatro categorías.
- Marca: web toda oscura; Rojo Pulso `#F04A2D` en botones principales, palabras clave de los titulares (`<em>`) y el bloque de la demo; Mostaza `#F6B92B` solo en pegatinas y la oferta. Titulares en Bricolage Grotesque 800. Más detalle en `BRAND.md`.
- Formulario: Formspree, ID `xljbbava`. No hagas envíos reales de prueba: cada uno gasta uno de los 50 mensajes gratis al mes.

## Para gastar pocos tokens
- No leas archivos enteros: localiza con `grep` y lee solo esas líneas.
- Para ver un cambio, captura solo su sección: `npm --prefix tools run captura -- 390 "#servicios"` (admite `dark` al final). Evita capturas de la página completa.
- Fíate del resumen de `verificar`; no repitas sus comprobaciones a mano.
- Usa subagentes solo si te lo piden: cada revisión completa gasta más de 100.000 tokens.
