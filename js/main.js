/* =========================================================
   PulseAds · JavaScript mínimo
   0. Aparición al hacer scroll  1. Menú móvil  2. Vídeos de ejemplo  3. Formulario
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

  /* ---------- 0. Aparición suave al hacer scroll ----------
     Va primero: si algo de más abajo fallara, el contenido nunca se queda invisible.
     Para lo que se añade después (vídeos), se usa observeReveal(). */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observeReveal = function (n) { n.classList.add("is-visible"); };
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (n) { n.classList.add('is-visible'); });
  } else {
    // Solo a partir de aquí se ocultan los bloques para animarlos (ver .reveal-on en el CSS)
    document.documentElement.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (n) { io.observe(n); });
    observeReveal = function (n) { io.observe(n); };
    // Si algo recibe el foco con teclado antes de aparecer, se muestra al momento
    document.addEventListener('focusin', function (e) {
      var r = e.target.closest && e.target.closest('.reveal');
      if (r) r.classList.add('is-visible');
    });
  }

  /* ---------- 1. Menú móvil ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu-principal');
  var mobileQuery = window.matchMedia('(max-width: 63.99rem)');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
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
    var media = el('div', { 'class': 'video-media' + (vertical ? ' is-vertical' : '') });

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
    body.appendChild(el('span', { 'class': 'badge' }, 'Ejemplo provisional'));
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
        mensaje: form.elements.mensaje.value.trim()
      };
    }

    // Enlace mailto con el mensaje ya escrito (respaldo y alternativa si falla el envío)
    function mailtoHref(data) {
      var subject = 'Quiero un anuncio para ' + data.local;
      var bodyText = 'Nombre: ' + data.nombre + '\nLocal: ' + data.local + '\nEmail: ' + data.email + '\n\n' + data.mensaje;
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
      body.append('subject', 'Nuevo encargo para PulseAds: ' + data.local); // asunto del correo
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
