(function () {
  const BPM = +document.body.dataset.bpm, B = 60 / BPM;
  const DUR = { slam: .32, rise: .5, drop: .5, pop: .45, fade: .55, fadeonly: .5, grow: .42, stamp: .5, shake: .32, letter: .42, blurin: .7, left: .5, right: .5, zoomtxt: 3 };
  const EASE = { slam: 'cubic-bezier(.2,.9,.3,1)', grow: 'cubic-bezier(.7,0,.2,1)', shake: 'linear', zoomtxt: 'linear' };
  const TR = { zoom: [.4, 'cubic-bezier(.2,.8,.2,1)'], up: [.38, 'cubic-bezier(.75,0,.2,1)'], left: [.36, 'cubic-bezier(.75,0,.2,1)'], circle: [.55, 'cubic-bezier(.6,0,.2,1)'], diag: [.5, 'cubic-bezier(.6,0,.2,1)'], bars: [.36, 'cubic-bezier(.7,0,.2,1)'], fade: [.6, 'ease'], cut: [.001, 'linear'] };
  function anim(el, name, dur, delay, ease, iter, dir) {
    el.classList.add('a');
    const prev = el.style.animation ? el.style.animation + ', ' : '';
    el.style.animation = prev + `${name} ${dur}s ${ease || 'cubic-bezier(.2,.8,.2,1)'} ${delay}s ${iter || 1} ${dir || "normal"} both`;
  }
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    return words.map((w, i) => { const s = document.createElement('span'); s.className = 'w'; s.textContent = w + (i < words.length - 1 ? ' ' : ''); el.appendChild(s); return s; });
  }
  function splitLetters(el) {
    const t = el.textContent; el.textContent = '';
    return [...t].map(c => { const s = document.createElement('span'); s.className = 'w'; s.textContent = c; el.appendChild(s); return s; });
  }
  function setup(el, base) {
    const fx = el.dataset.fx, at = base + (+el.dataset.at || 0) * B;
    const dur = +el.dataset.dur || DUR[fx] || .5, ease = el.dataset.ease || EASE[fx];
    if (el.dataset.split) {
      const parts = el.dataset.split === 'letters' ? splitLetters(el) : splitWords(el);
      const step = el.dataset.split === 'letters' ? (+el.dataset.step || .035) : (+el.dataset.step || .5) * B;
      parts.forEach((p, i) => anim(p, fx, dur, at + i * step, ease));
    } else anim(el, fx, dur, at, ease);
  }
  let t = 0;
  const scenes = [...document.querySelectorAll('.scene')];
  scenes.forEach(sc => {
    const dur = (+sc.dataset.beats) * B, tr = TR[sc.dataset.tr || 'cut'];
    sc.dataset.start = t;
    if (sc.dataset.img) {
      const ph = document.createElement('div'); ph.className = 'ph';
      ph.style.backgroundImage = `url(${sc.dataset.img})`;
      if (sc.dataset.pos) ph.style.backgroundPosition = sc.dataset.pos;
      const k = (sc.dataset.kb || '1.22,1.04,0,0,2%,0').split(',');
      ['--s0', '--s1', '--x0', '--x1', '--y0', '--y1'].forEach((v, i) => ph.style.setProperty(v, k[i]));
      sc.prepend(ph);
      anim(ph, 'kb', dur + .7, t, 'cubic-bezier(.25,.1,.25,1)');
    }
    anim(sc, 'tr-' + (sc.dataset.tr || 'cut'), tr[0], t, tr[1]);
    if (sc.hasAttribute('data-flash')) {
      const f = document.createElement('div'); f.className = 'flash'; document.getElementById('stage').appendChild(f);
      anim(f, 'flash', .28, t, 'ease-out');
    }
    sc.querySelectorAll('[data-fx]').forEach(el => setup(el, t));
    sc.querySelectorAll('[data-loop]').forEach(el => anim(el, el.dataset.loop, +el.dataset.ldur || 1.2, t + (+el.dataset.lat || 0) * B, el.dataset.lease || (['marquee', 'spin'].includes(el.dataset.loop) ? 'linear' : 'ease-in-out'), 'infinite', el.dataset.ldir));
    t += dur;
  });
  document.querySelectorAll('.bug [data-fx], .bug[data-fx]').forEach(el => setup(el, 0));
  window.TOTAL = t + (+document.body.dataset.tail || 0);
  window.CUTS = scenes.map(s => +s.dataset.start);
  window.BEAT = B;
  window.ready = document.fonts.ready.then(() => Promise.all([...document.querySelectorAll('.ph')].map(p => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = p.style.backgroundImage.slice(5, -2); })))).then(() => {
    const as = document.getAnimations(); as.forEach(a => a.pause());
    window.seek = s => { for (const a of as) a.currentTime = s * 1000; };
    window.seek(0);
    return true;
  });
})();
