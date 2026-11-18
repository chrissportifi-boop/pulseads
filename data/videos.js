/* =========================================================
   VÍDEOS DE EJEMPLO · Edita solo este archivo para cambiarlos
   ---------------------------------------------------------
   Cada vídeo es un bloque { ... }. Campos:
     titulo        → título visible
     categoria     → texto pequeño encima del título (opcional)
     descripcion   → una o dos frases
     archivo       → ruta al vídeo, p. ej. "videos/cafeteria.mp4"
                     (déjalo vacío "" para mostrar un marcador de posición)
     poster        → imagen que se ve antes de reproducir, p. ej. "img/videos/cafeteria.webp"
     formato       → "vertical" (9:16) u "horizontal" (16:9)
     destacado     → true = ocupa todo el ancho, con la ficha al lado
     ficha         → datos técnicos: lista de [etiqueta, valor] (opcional)
     subtitulos    → archivo .vtt con los subtítulos en español
     transcripcion → texto completo de lo que se ve y se oye en el vídeo
   Para añadir un vídeo copia un bloque entero; para quitarlo, bórralo.
   Todos se muestran con la etiqueta "Pieza de muestra".
   ========================================================= */
window.PULSEADS_VIDEOS = [
  {
    titulo: "Black Friday para una relojería",
    categoria: "Comercio local · Relojería",
    descripcion: "Anuncio vertical para redes que presenta un cronógrafo con detalles técnicos animados al ritmo de un reloj y termina con la oferta de Black Friday y la dirección de la tienda. Pieza de muestra de producción propia, sin relación comercial con la marca que aparece.",
    archivo: "videos/black-friday-relojeria.mp4",
    poster: "img/videos/black-friday-relojeria.webp",
    formato: "vertical",
    destacado: true,
    ficha: [
      ["Objetivo", "Llevar visitas a la tienda en Black Friday"],
      ["Formato", "Vertical 9:16 · Reels, TikTok e historias"],
      ["Duración", "13 segundos"],
      ["Sonido", "Diseño sonoro sin voz, con subtítulos"],
      ["Producción", "Creado con herramientas de IA"]
    ],
    subtitulos: "videos/black-friday-relojeria.vtt",
    transcripcion:
      "Vídeo sin voz, solo con efectos de sonido.\n" +
      "0–2 s · Primer plano de un cronógrafo de esfera verde. Texto: «Grande Randonnée». Suena un tic-tac con golpes de aire suaves.\n" +
      "2–3 s · Detalle de la corona. Texto: «Cronógrafo Mecaquartz».\n" +
      "3–4 s · Tapa trasera grabada. Texto: «Diseñado y ensamblado en Francia».\n" +
      "4–6 s · Animación de los engranajes del movimiento. Texto: «Movimiento Mecaquartz». Un sonido mecánico va subiendo.\n" +
      "6–9 s · El reloj se recompone pieza a pieza. Textos: «Acero 316L · Ø 39 mm» y «Cristal de zafiro · 10 ATM». Golpes de aire y, al final, una campanilla suave que sigue sonando.\n" +
      "9–11 s · Plano completo con la correa. Textos: «Charlie Paris», «GR — Cronógrafo Mecaquartz» y «Verde · Correa de nailon».\n" +
      "11–13 s · Cierre. Textos: «Black Friday», «10 % de descuento en tienda» y «Calle Narváez 43, Madrid». Golpe grave final."
  }

  /* Plantilla para el siguiente vídeo: quita los símbolos de comentario,
     pon una coma después de la llave } del vídeo anterior y rellena los campos.
  ,{
    titulo: "Menú del día para un restaurante",
    categoria: "Hostelería",
    descripcion: "Vídeo vertical que presenta el menú de la semana.",
    archivo: "",
    poster: "",
    formato: "vertical",
    destacado: false,
    ficha: [],
    subtitulos: "videos/ejemplo-1.vtt",
    transcripcion: "[Sustituir] Transcripción completa del vídeo."
  }
  */
];
