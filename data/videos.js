/* =========================================================
   VÍDEOS DE EJEMPLO · Edita solo este archivo para cambiarlos
   ---------------------------------------------------------
   Cada vídeo es un bloque { ... }. Campos:
     titulo        → título visible
     categoria     → texto pequeño encima del título (opcional)
     anio          → año de la pieza, p. ej. "2026" (opcional)
     resumen       → una frase corta que se ve siempre bajo el título
     descripcion   → una o dos frases (se ven al pulsar «Ver detalles»)
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
    titulo: "Smash burgers para una hamburguesería",
    categoria: "Hostelería · Hamburguesería",
    resumen: "Gancho que da hambre, la carne de cerca y la oferta de los martes.",
    anio: "2026",
    descripcion: "Anuncio vertical para redes con cortes al ritmo de la música: abre con un gancho que da hambre, enseña el producto de cerca, lanza la oferta de los martes y cierra con una llamada a pedir. Negocio inventado para enseñar el estilo: el nombre, los precios y la dirección son de ejemplo.",
    archivo: "videos/hamburgueseria-brasa21.mp4",
    poster: "img/videos/hamburgueseria-brasa21.webp",
    formato: "vertical",
    destacado: true,
    ficha: [
      ["Formato", "Vertical 9:16"],
      ["Duración", "14 segundos"],
      ["Producción", "Imágenes con IA, montaje y música propios"]
    ],
    subtitulos: "videos/hamburgueseria-brasa21.vtt",
    transcripcion:
      "Vídeo sin voz, con música urbana con graves y efectos de barrido en cada corte.\n" +
      "0–2 s · Primer plano de una hamburguesa doble con queso fundido. Etiqueta «Aviso» y, palabra a palabra: «Esto da hambre».\n" +
      "2–4 s · La carne se aplasta en la plancha, con humo. Textos: «Smash», «aplastada a la plancha» y «100 % vaca · picada cada mañana».\n" +
      "4–6 s · Detalle del queso cayendo. Textos: «Doble cheddar» y una pegatina: «fundido de verdad».\n" +
      "6–8 s · Cucurucho de patatas fritas. Textos: «+ patatas», «caseras, crujientes» y «y con sal en escamas».\n" +
      "8–10 s · Fondo naranja con rayos girando. Textos: «Los martes», un sello grande «2×1» y «en todas las smash».\n" +
      "10–14 s · Cierre con el logotipo «Brasa 21 · Smash burgers», botón «Pide ya», «Recogida o a domicilio», «Calle Mayor, 21 · Abierto hasta las 00:00» y la nota «Negocio ficticio · Anuncio de muestra hecho por PulseAds». Golpe grave final."
  },
  {
    titulo: "Desayunos para una cafetería",
    categoria: "Hostelería · Cafetería",
    resumen: "Café, bollería y tostadas, con el precio del desayuno al final.",
    anio: "2026",
    descripcion: "Pieza cálida y tranquila para atraer clientela por la mañana: café, bollería y tostadas con textos que aparecen con suavidad, y un cierre con el precio del desayuno y el horario. Negocio inventado para enseñar el estilo: el nombre, los precios y la dirección son de ejemplo.",
    archivo: "videos/cafeteria-cafe-alba.mp4",
    poster: "img/videos/cafeteria-cafe-alba.webp",
    formato: "vertical",
    destacado: false,
    ficha: [
      ["Formato", "Vertical 9:16"],
      ["Duración", "13 segundos"],
      ["Producción", "Imágenes con IA, montaje y música propios"]
    ],
    subtitulos: "videos/cafeteria-cafe-alba.vtt",
    transcripcion:
      "Vídeo sin voz, con música lo-fi suave de piano y sonido de vinilo.\n" +
      "0–3 s · Un capuchino sobre la barra de madera. Textos: «Buenos días,» y «empiezan aquí.».\n" +
      "3–5 s · Un barista vierte la leche y dibuja en la espuma. Textos: «Cada taza, al momento» y «Café recién molido».\n" +
      "5–7 s · Croissant junto a un café en una mesa de mármol. Textos: «Croissant de mantequilla» y una pegatina: «recién horneado».\n" +
      "7–9 s · Tostada de aguacate con huevo y tomates vista desde arriba. Texto: «Tostadas para empezar con ganas».\n" +
      "9–13 s · Cierre en color crema con el logotipo «Café Alba · Desayunos · Brunch», la tarjeta «Desayuno completo: café + tostada + zumo natural» con el precio «4,50 €», «Lunes a viernes · de 8:00 a 12:00», «Calle del Sol, 8» y la nota «Negocio ficticio · Anuncio de muestra hecho por PulseAds»."
  },
  {
    titulo: "Reservas para una barbería",
    categoria: "Belleza · Barbería",
    resumen: "Una pregunta directa, los servicios con precio y reserva por WhatsApp.",
    anio: "2026",
    descripcion: "Anuncio elegante en negro y dorado que empieza con una pregunta directa, enseña los servicios y termina con la lista de precios y el botón de reservar por WhatsApp. Negocio inventado para enseñar el estilo: el nombre, los precios y la dirección son de ejemplo.",
    archivo: "videos/barberia-navaja.mp4",
    poster: "img/videos/barberia-navaja.webp",
    formato: "vertical",
    destacado: false,
    ficha: [
      ["Formato", "Vertical 9:16"],
      ["Duración", "13 segundos"],
      ["Producción", "Imágenes con IA, montaje y música propios"]
    ],
    subtitulos: "videos/barberia-navaja.vtt",
    transcripcion:
      "Vídeo sin voz, con música hip hop clásica y efectos de barrido en cada corte.\n" +
      "0–3 s · Un sillón de barbero vacío en una barbería con luz cálida. Texto, palabra a palabra: «¿Cuánto hace que no te cuidas el pelo?».\n" +
      "3–5 s · Nuca de un cliente con un degradado recién hecho. Textos: «Degradados» y «a máquina y a navaja».\n" +
      "5–7 s · Perfil de un hombre con barba y una navaja. Textos: «Barba», «perfilada a navaja» y «con toalla caliente».\n" +
      "7–9 s · Herramientas de barbero sobre madera. Textos: «Sin esperas» y «reserva tu hora en un minuto».\n" +
      "9–13 s · Cierre en negro y dorado con «Est. 2026», el logotipo «Navaja · Barber Club», los precios «Corte 14 €» y «Corte + barba 20 €», el botón «Reserva por WhatsApp», «Calle Real, 12 · Martes a sábado» y la nota «Negocio ficticio · Anuncio de muestra hecho por PulseAds»."
  },
  {
    titulo: "Captación para un gimnasio",
    categoria: "Deporte · Gimnasio",
    resumen: "Ritmo rápido, clases y horario, y una semana gratis como reclamo.",
    anio: "2026",
    descripcion: "Ritmo rápido y tipografía grande para captar socios: un gancho que interpela, clases y horario en movimiento, y un cierre con la semana gratis como reclamo. Negocio inventado para enseñar el estilo: el nombre, los precios y la dirección son de ejemplo.",
    archivo: "videos/gimnasio-hierro.mp4",
    poster: "img/videos/gimnasio-hierro.webp",
    formato: "vertical",
    destacado: false,
    ficha: [
      ["Formato", "Vertical 9:16"],
      ["Duración", "11 segundos"],
      ["Producción", "Imágenes con IA, montaje y música propios"]
    ],
    subtitulos: "videos/gimnasio-hierro.vtt",
    transcripcion:
      "Vídeo sin voz, con música electrónica rápida y efectos de barrido en cada corte.\n" +
      "0–2 s · Fondo negro. Palabras que golpean al ritmo: «No esperes al lunes».\n" +
      "2–4 s · Una mujer entrena con cuerdas de batalla en un gimnasio oscuro. Textos: «Entrena» y «con entrenadores en sala».\n" +
      "4–6 s · Fondo rojo con filas de texto en movimiento: «Fuerza · HIIT · Cross · Cardio» y «Boxeo · Yoga · Spinning». En el centro: «Clases todos los días».\n" +
      "6–8 s · Otra vez la deportista, más cerca. Textos: «Abierto», «6:00», «23:00» y «De lunes a domingo».\n" +
      "8–11 s · Cierre en negro con «Primera semana gratis», el logotipo «Hierro Gym», el botón «Apúntate hoy», «Avenida del Puerto, 40 · Ven con un amigo» y la nota «Negocio ficticio · Anuncio de muestra hecho por PulseAds». Golpe grave al aparecer la oferta."
  }

  /* Plantilla para el siguiente vídeo: quita los símbolos de comentario,
     pon una coma después de la llave } del vídeo anterior y rellena los campos.
  ,{
    titulo: "Menú del día para un restaurante",
    categoria: "Hostelería",
    resumen: "Una frase corta que resuma el vídeo.",
    anio: "2026",
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
