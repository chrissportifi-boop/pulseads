/* =========================================================
   PulseAds · JavaScript mínimo
   0. Animaciones  1. Menú móvil  2. Vídeos de ejemplo  3. Formulario
   ========================================================= */
(function () {
  'use strict';

  // Email al que llegan los mensajes del formulario
  var CONTACT_EMAIL = 'ceigiggm@gmail.com';
  // Formspree: pega aquí el ID de tu formulario de Formspree, p. ej. 'xyzabcde'
  // (es lo que va detrás de https://formspree.io/f/ en la web de Formspree).
  // Con el ID puesto, los mensajes llegan directamente a CONTACT_EMAIL.
  // Si lo dejas vacío (''), el formulario abre el programa de correo del visitante (mailto).
  var FORMSPREE_ID = 'xljbbava';
  // WhatsApp: pon aquí el número con prefijo y sin espacios ni +, p. ej. '34600111222'.
  // Mientras esté vacío, los botones de WhatsApp no se muestran.
  var WHATSAPP_NUMERO = '';
  var WHATSAPP_TEXTO = 'Hola, me gustaría pedir una demo gratis de PulseAds para mi local.';

  /* ---------- 0. Animaciones ----------
     Va primero: si algo de más abajo fallara, el contenido nunca se queda invisible.
     Nada se mueve solo de forma continua: todo ocurre una vez al aparecer o va ligado al scroll.
     Con "reducir movimiento" no se activa nada de esto y todo se ve tal cual. */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var observeReveal = function (n) { n.classList.add('is-visible'); };

  // Parte un texto en palabras (spans) sin cambiar lo que leen los lectores de pantalla
  function splitWords(node, wrapClass) {
    if (!node || node.dataset.split) return [];
    // Solo si el elemento contiene únicamente texto (para no romper enlaces o etiquetas internas)
    for (var c = 0; c < node.childNodes.length; c++) { if (node.childNodes[c].nodeType !== 3) return []; }
    var words = node.textContent.trim().split(/\s+/);
    node.textContent = '';
    var spans = [];
    words.forEach(function (w, i) {
      var outer = document.createElement('span');
      outer.className = wrapClass;
      var inner = document.createElement('span');
      inner.textContent = w;
      inner.style.setProperty('--w', i);
      outer.appendChild(inner);
      node.appendChild(outer);
      if (i < words.length - 1) node.appendChild(document.createTextNode(' '));
      spans.push(outer);
    });
    node.dataset.split = '1';
    return spans;
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('reveal-on');

    var highlight = document.querySelector('.js-highlight');
    var hlWords = [];

    // Números que cuentan hasta su valor al aparecer
    function countUp(el) {
      var end = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(end) || el.dataset.counted) return;
      el.dataset.counted = '1';
      var start = null, dur = 1200;
      function tick(t) {
        if (!start) start = t;
        var p = Math.min(1, (t - start) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      }
      el.textContent = '0';
      requestAnimationFrame(tick);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var t = entry.target;
        t.classList.add('is-visible');
        t.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(t);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    var targets = '.reveal, .reveal-clip, .reveal-up, .facts';
    document.querySelectorAll(targets).forEach(function (n) { io.observe(n); });

    // Partir los textos animados cuando el navegador esté libre (no retrasa la carga)
    function setupWords() {
      // Titulares: cada palabra sube desde una máscara
      document.querySelectorAll('.display, .h2-light').forEach(function (h) {
        if (splitWords(h, 'wl').length) { h.classList.add('words-reveal'); io.observe(h); }
      });
      // Frase destacada: las palabras se van "encendiendo" al bajar
      hlWords = splitWords(highlight, 'hw');
      requestFrame();
    }
    if (window.requestIdleCallback) requestIdleCallback(setupWords, { timeout: 1500 });
    else setTimeout(setupWords, 200);
    observeReveal = function (n) { io.observe(n); };
    // Si algo recibe el foco con teclado antes de aparecer, se muestra al momento
    document.addEventListener('focusin', function (e) {
      var r = e.target.closest && e.target.closest('.reveal, .reveal-clip, .reveal-up');
      if (r) r.classList.add('is-visible');
    });

    // Efectos ligados al scroll (un único bucle con requestAnimationFrame)
    var header = document.querySelector('.site-header');
    var progress = document.querySelector('.scroll-progress');
    var marquees = Array.prototype.slice.call(document.querySelectorAll('.marquee-track, .band-track'));
    var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
    var lastY = window.scrollY, ticking = false;

    function onFrame() {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;

      if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

      // Cabecera: se esconde al bajar y vuelve al subir (nunca si tiene el foco o el menú abierto)
      if (header) {
        var hide = y > lastY && y > vh * 0.6 && !header.contains(document.activeElement) && !document.querySelector('.nav-list.is-open');
        header.classList.toggle('is-hidden', hide);
      }
      lastY = y;

      // Parallax suave
      parallax.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-speed'));
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.setProperty('--py', offset.toFixed(1) + 'px');
      });

      // Texto gigante horizontal (data-direction="1" lo mueve en sentido contrario)
      marquees.forEach(function (track) {
        var mr = track.parentNode.getBoundingClientRect();
        if (mr.bottom < 0 || mr.top > vh) return;
        var p = (vh - mr.top) / (vh + mr.height);
        var dir = track.getAttribute('data-direction') === '1';
        var x = dir ? (-35 + p * 30) : (-p * 35);
        track.style.transform = 'translate3d(' + x.toFixed(2) + '%,0,0)';
      });

      // Elementos que crecen hasta su tamaño al llegar al centro de la pantalla
      // (se buscan en cada fotograma porque los vídeos se añaden después)
      document.querySelectorAll('.js-scale').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.75)));
        el.style.setProperty('--sc', (0.86 + p * 0.14).toFixed(3));
      });

      // Frase destacada
      if (hlWords.length) {
        var hr = highlight.getBoundingClientRect();
        var hp = (vh * 0.85 - hr.top) / (hr.height + vh * 0.35);
        var lit = Math.round(Math.max(0, Math.min(1, hp)) * hlWords.length);
        hlWords.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
      }
    }
    // Brillo de la portada que sigue al ratón (solo con ratón, nunca en táctil)
    var heroSec = document.getElementById('inicio');
    if (heroSec && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var gx = 70, gy = 40, glowTick = false;
      heroSec.addEventListener('pointermove', function (e) {
        var r = heroSec.getBoundingClientRect();
        gx = ((e.clientX - r.left) / r.width) * 100;
        gy = ((e.clientY - r.top) / r.height) * 100;
        if (!glowTick) {
          glowTick = true;
          requestAnimationFrame(function () {
            glowTick = false;
            heroSec.style.setProperty('--gx', gx.toFixed(1) + '%');
            heroSec.style.setProperty('--gy', gy.toFixed(1) + '%');
          });
        }
      });
      heroSec.addEventListener('pointerenter', function () { heroSec.classList.add('has-glow'); });
      heroSec.addEventListener('pointerleave', function () { heroSec.classList.remove('has-glow'); });
    }

    function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', requestFrame);
    onFrame();
  } else {
    document.querySelectorAll('.reveal, .reveal-clip, .reveal-up').forEach(function (n) { n.classList.add('is-visible'); });
  }

  /* ---------- 0b. Botón flotante "Pide tu anuncio" (móvil) ----------
     Visible tras la portada y oculto cuando se ve el formulario o el pie. Solo entra en el
     orden de tabulación mientras está visible. */
  var floatCta = document.querySelector('.float-cta');
  var heroEl = document.getElementById('inicio');
  var contactEl = document.getElementById('contacto');
  if (floatCta && heroEl && contactEl && 'IntersectionObserver' in window) {
    var pastHero = false, atContact = false, atFooter = false;
    var updateCta = function () {
      var show = pastHero && !atContact && !atFooter;
      floatCta.classList.toggle('is-shown', show);
      floatCta.tabIndex = show ? 0 : -1;
      if (show) floatCta.removeAttribute('aria-hidden'); else floatCta.setAttribute('aria-hidden', 'true');
    };
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; updateCta(); }).observe(heroEl);
    new IntersectionObserver(function (e) { atContact = e[0].isIntersecting; updateCta(); }, { rootMargin: '0px 0px -30% 0px' }).observe(contactEl);
    new IntersectionObserver(function (e) { atFooter = e[0].isIntersecting; updateCta(); }).observe(document.querySelector('.site-footer'));
    updateCta();
  }

  /* ---------- 0c. WhatsApp y servicio elegido ---------- */
  if (WHATSAPP_NUMERO) {
    document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
      a.href = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(WHATSAPP_TEXTO);
      a.target = '_blank';
      a.rel = 'noopener';
      a.hidden = false;
    });
  }
  // Los botones de demo y de packs dejan elegida esa opción en el formulario
  document.addEventListener('click', function (e) {
    var enlace = e.target.closest && e.target.closest('[data-interes]');
    var campo = document.getElementById('interes');
    if (enlace && campo) campo.value = enlace.getAttribute('data-interes');
  });

  /* ---------- 1. Menú móvil ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu-principal');
  var mobileQuery = window.matchMedia('(max-width: 63.99rem)');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    root.classList.toggle('menu-abierto', open);
  }

  if (toggle && menu) {
    toggle.hidden = false;
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // Al elegir una sección, se cierra el menú
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') && mobileQuery.matches) setMenu(false);
    });
    // Escape cierra el menú y devuelve el foco al botón
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    // Si el foco sale del menú (Tab), se cierra: sin trampas de teclado
    document.querySelector('.site-nav').addEventListener('focusout', function (e) {
      if (mobileQuery.matches && !e.currentTarget.contains(e.relatedTarget)) setMenu(false);
    });
    mobileQuery.addEventListener('change', function () { setMenu(false); });
  }

  /* ---------- 2. Vídeos de ejemplo (datos en data/videos.js) ---------- */
  var list = document.getElementById('lista-videos');
  var videos = window.PULSEADS_VIDEOS || [];

  // Crea un elemento con atributos y texto de forma segura (sin innerHTML con datos)
  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text) node.textContent = text;
    return node;
  }

  function renderVideo(v, i) {
    var vertical = v.formato === 'vertical';
    var item = el('li', { 'class': 'video-card reveal' + (v.destacado ? ' is-featured' : '') });
    var media = el('div', { 'class': 'video-media js-scale' + (vertical ? ' is-vertical' : '') });

    if (v.archivo) {
      // Reproductor nativo: sin autoplay, silenciado, solo metadatos al cargar.
      // Los subtítulos están disponibles en el botón CC del reproductor.
      var video = el('video', {
        controls: '', muted: '', playsinline: '', preload: 'metadata',
        width: vertical ? '720' : '1280', height: vertical ? '1280' : '720'
      });
      video.muted = true;
      if (v.poster) video.setAttribute('poster', v.poster);
      video.appendChild(el('source', { src: v.archivo, type: 'video/mp4' }));
      if (v.subtitulos) {
        video.appendChild(el('track', { kind: 'captions', src: v.subtitulos, srclang: 'es', label: 'Español' }));
      }
      video.setAttribute('aria-label', 'Vídeo: ' + v.titulo);
      media.appendChild(video);
    } else {
      // Marcador de posición (9:16 o 16:9) claramente identificado
      var ph = el('div', { 'class': 'video-placeholder', role: 'img', 'aria-label': 'Marcador de posición: vídeo pendiente de subir' });
      ph.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
      ph.appendChild(el('p', { 'aria-hidden': 'true' }, 'Vídeo pendiente'));
      ph.appendChild(el('small', { 'aria-hidden': 'true' }, 'Marcador ' + (vertical ? '9:16' : '16:9') + ' · se sustituirá por el vídeo'));
      media.appendChild(ph);
    }

    var body = el('div', { 'class': 'video-body' });
    // Fila superior: número de pieza, año y etiqueta de muestra
    var top = el('div', { 'class': 'video-top' });
    top.appendChild(el('span', {}, (i + 1 < 10 ? '0' : '') + (i + 1) + (v.anio ? ' · ' + v.anio : '')));
    top.appendChild(el('span', { 'class': 'badge' }, 'Pieza de muestra'));
    body.appendChild(top);
    if (v.categoria) body.appendChild(el('p', { 'class': 'video-category' }, v.categoria));
    body.appendChild(el('h3', {}, v.titulo));
    if (v.descripcion) body.appendChild(el('p', {}, v.descripcion));

    // Ficha técnica como lista de definiciones (etiqueta → valor)
    if (v.ficha && v.ficha.length) {
      var dl = el('dl', { 'class': 'video-specs' });
      v.ficha.forEach(function (row) {
        var div = el('div');
        div.appendChild(el('dt', {}, row[0]));
        div.appendChild(el('dd', {}, row[1]));
        dl.appendChild(div);
      });
      body.appendChild(dl);
    }

    if (v.transcripcion) {
      var det = el('details', { 'class': 'transcript' });
      var sum = el('summary', {}, 'Ver transcripción');
      sum.appendChild(el('span', { 'class': 'visually-hidden' }, ' de «' + v.titulo + '»'));
      det.appendChild(sum);
      det.appendChild(el('p', { 'class': 'transcript-text' }, v.transcripcion));
      body.appendChild(det);
    }

    item.appendChild(media);
    item.appendChild(body);
    return item;
  }

  if (list) {
    videos.forEach(function (v, i) {
      var card = renderVideo(v, i);
      list.appendChild(card);
      observeReveal(card);
    });
  }

  /* ---------- 3. Formulario de contacto con validación accesible ---------- */
  var form = document.getElementById('form-contacto');

  if (form) {
    var summary = document.getElementById('resumen-errores');
    var status = document.getElementById('estado-formulario');
    var submitted = false;

    // Reglas y mensajes de error claros para cada campo
    var rules = {
      nombre: function (v) { return v ? '' : 'Escribe tu nombre.'; },
      local: function (v) { return v ? '' : 'Escribe el nombre de tu local.'; },
      email: function (v, input) {
        if (!v) return 'Escribe tu email.';
        if (input.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          return 'El email no parece correcto. Revisa que tenga @ y un dominio, como nombre@milocal.es.';
        }
        return '';
      },
      mensaje: function (v) {
        if (!v) return 'Cuéntanos qué quieres anunciar.';
        if (v.length < 10) return 'Escribe un poco más (al menos 10 caracteres) para que podamos ayudarte.';
        return '';
      },
      privacidad: function (v, input) {
        return input.checked ? '' : 'Debes aceptar la política de privacidad para enviar la solicitud.';
      }
    };

    function checkField(name) {
      var input = form.elements[name];
      var msg = rules[name](input.value.trim(), input);
      var error = document.getElementById(name + '-error');
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
        error.textContent = 'Error: ' + msg;
        error.hidden = false;
      } else {
        input.removeAttribute('aria-invalid');
        error.textContent = '';
        error.hidden = true;
      }
      return msg;
    }

    // Tras el primer intento, cada campo se revalida al salir de él
    Object.keys(rules).forEach(function (name) {
      form.elements[name].addEventListener('blur', function () { if (submitted) checkField(name); });
    });

    // Estado del envío a Formspree
    var sending = false;
    var button = form.querySelector('button[type="submit"]');
    var buttonText = button.textContent;
    // El mensaje de estado puede recibir el foco (sin entrar en el orden de tabulación)
    status.setAttribute('tabindex', '-1');

    form.addEventListener('submit', function (e) {
      // Mientras se envía, un segundo clic no hace nada (evita envíos dobles)
      if (sending) { e.preventDefault(); return; }
      submitted = true;
      status.textContent = '';
      status.classList.remove('is-success');

      var errors = [];
      Object.keys(rules).forEach(function (name) {
        var msg = checkField(name);
        if (msg) errors.push({ name: name, msg: msg });
      });

      if (errors.length) {
        e.preventDefault();
        // Resumen de errores con enlaces a cada campo; recibe el foco y se anuncia
        var ul = summary.querySelector('ul');
        ul.textContent = '';
        errors.forEach(function (err) {
          var li = el('li');
          var a = el('a', { href: '#' + err.name }, err.msg);
          a.addEventListener('click', function (ev) { ev.preventDefault(); form.elements[err.name].focus(); });
          li.appendChild(a);
          ul.appendChild(li);
        });
        summary.querySelector('h3').textContent = errors.length === 1
          ? 'Hay 1 campo por revisar'
          : 'Hay ' + errors.length + ' campos por revisar';
        summary.hidden = false;
        summary.focus();
        return;
      }

      summary.hidden = true;
      e.preventDefault();

      var data = getData();
      if (FORMSPREE_ID && window.fetch && window.FormData) {
        sendToFormspree(data);
      } else {
        openMailto(data);
      }
    });

    // Valores limpios de los cuatro campos
    function getData() {
      return {
        nombre: form.elements.nombre.value.trim(),
        local: form.elements.local.value.trim(),
        email: form.elements.email.value.trim(),
        mensaje: form.elements.mensaje.value.trim(),
        interes: form.elements.interes.value
      };
    }

    // Enlace mailto con el mensaje ya escrito (respaldo y alternativa si falla el envío)
    function mailtoHref(data) {
      var subject = data.interes + ' para ' + data.local;
      var bodyText = 'Me interesa: ' + data.interes + '\nNombre: ' + data.nombre + '\nLocal: ' + data.local + '\nEmail: ' + data.email + '\n\n' + data.mensaje;
      return 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
    }

    // Sin Formspree: abre el programa de correo del visitante
    function openMailto(data) {
      window.location.href = mailtoHref(data);
      status.textContent = '¡Gracias, ' + data.nombre + '! Se abrirá tu programa de correo con el mensaje preparado. Si no se abre, escríbenos a ' + CONTACT_EMAIL + '.';
      status.classList.add('is-success');
    }

    // Botón ocupado: aria-disabled en lugar de disabled para que el foco no se pierda
    function setSending(on) {
      sending = on;
      button.textContent = on ? 'Enviando…' : buttonText;
      if (on) button.setAttribute('aria-disabled', 'true');
      else button.removeAttribute('aria-disabled');
    }

    // Con Formspree: envío en segundo plano (fetch), sin salir de la página
    function sendToFormspree(data) {
      var body = new FormData();
      body.append('nombre', data.nombre);
      body.append('local', data.local);
      body.append('email', data.email); // Formspree lo usa como "Responder a"
      body.append('mensaje', data.mensaje);
      body.append('interes', data.interes);
      body.append('privacidad', 'Aceptada');
      body.append('subject', 'PulseAds · ' + data.interes + ': ' + data.local); // asunto del correo
      body.append('_gotcha', form.elements._gotcha ? form.elements._gotcha.value : ''); // trampa antispam

      setSending(true);
      status.textContent = 'Enviando tu mensaje…';

      // Si la conexión se queda colgada, se corta a los 20 segundos
      var controller = window.AbortController ? new AbortController() : null;
      var timer = controller ? setTimeout(function () { controller.abort(); }, 20000) : null;

      fetch('https://formspree.io/f/' + encodeURIComponent(FORMSPREE_ID), {
        method: 'POST',
        body: body,
        headers: { 'Accept': 'application/json' },
        signal: controller ? controller.signal : undefined
      }).then(function (response) {
        if (response.ok) return null;
        // Formspree explica el fallo como { errors: [{ message: '…' }] }
        return response.json().then(function (json) {
          return (json && json.errors && json.errors.length)
            ? json.errors.map(function (er) { return er.message; }).join(' ')
            : 'Error ' + response.status;
        }, function () { return 'Error ' + response.status; });
      }).then(function (problem) {
        clearTimeout(timer);
        setSending(false);
        if (problem) {
          showFailure(data, problem);
        } else {
          showSuccess(data);
        }
      }, function (err) {
        clearTimeout(timer);
        setSending(false);
        showFailure(data, err && err.message ? err.message : 'Fallo de red');
      });
    }

    function showSuccess(data) {
      status.textContent = '¡Gracias, ' + data.nombre + '! Hemos recibido tu mensaje y te responderemos lo antes posible en ' + data.email + '.';
      status.classList.add('is-success');
      form.reset();
      submitted = false; // el formulario vacío no debe marcar errores al salir de los campos
      status.focus(); // el foco va a la confirmación, justo debajo del botón
    }

    function showFailure(data, detail) {
      // El detalle técnico solo va a la consola (para quien mantiene la web)
      if (window.console) console.warn('Formspree:', detail);
      status.classList.remove('is-success');
      status.textContent = '';
      // Reutiliza el estilo de error de los campos (color + icono, no solo color)
      var box = el('span', { 'class': 'field-error' });
      var msg = el('span');
      msg.appendChild(document.createTextNode('No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos o escríbenos directamente a '));
      msg.appendChild(el('a', { href: mailtoHref(data) }, CONTACT_EMAIL));
      msg.appendChild(document.createTextNode(' (se abrirá tu correo con el mensaje ya escrito).'));
      box.appendChild(msg);
      status.appendChild(box);
      button.focus(); // el foco vuelve al botón para reintentar; el enlace es lo siguiente con Tab
    }
  }

})();
