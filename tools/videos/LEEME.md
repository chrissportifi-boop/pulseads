# Fuentes de los vídeos de muestra

Cada anuncio es una página HTML animada en `ads/` (textos, colores y orden de escenas).
El motor (`engine.js`, `engine.css`) sincroniza cortes y textos con el ritmo, `synth.mjs` crea la música
y `build.mjs` graba cada fotograma con Chrome y lo junta todo en un MP4 de 720×1280.

- Instalar (una vez): `npm --prefix tools install` y `npm --prefix tools/videos install`
- Vista previa de fotogramas: `cd tools/videos && node build.mjs brasa21 sheet` → `out/brasa21_sheet.png`
- Vídeo completo: `node build.mjs brasa21 full 1.9` (el número es el segundo que se usa como póster)
- Después: copiar `out/<id>.mp4` a `videos/` y `out/<id>.webp` a `img/videos/` con su nombre, y repasar
  `data/videos.js` y el `.vtt` si cambian textos o tiempos.

Fotos: hechas con FLUX.1-schnell (Hugging Face) salvo `burger3` y `barberfade` (Pollinations).
`fotos.mjs` genera nuevas usando el token de Hugging Face guardado en Claude Code (cupo gratis limitado al día).
Todos los negocios son inventados: no uséis marcas reales.
