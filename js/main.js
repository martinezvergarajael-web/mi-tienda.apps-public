/* Tutorial Desarrollo Móvil - JavaScript compartido (tema futurista) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Tema oscuro (por defecto) / claro ----------
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* almacenamiento no disponible */ }
  root.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');

  // color de la barra del sistema (app instalada) según el tema
  function setThemeColor(theme) {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', theme === 'light' ? '#e9f1fb' : '#04060d');
  }
  setThemeColor(root.getAttribute('data-theme'));

  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      readColors();
      setThemeColor(next);
    });
  }

  // ---------- Menú lateral móvil ----------
  var menuBtn = document.getElementById('menuBtn');
  var sidebar = document.getElementById('sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', function () { sidebar.classList.toggle('open'); });
    sidebar.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') sidebar.classList.remove('open');
    });
  }

  // ---------- Botones "Copiar" en bloques de código ----------
  document.querySelectorAll('.code-wrap').forEach(function (wrap) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copiar';
    btn.addEventListener('click', function () {
      var text = wrap.querySelector('code').innerText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copiado';
          setTimeout(function () { btn.textContent = 'Copiar'; }, 1500);
        });
      }
    });
    wrap.appendChild(btn);
  });

  // ---------- Pestañas ----------
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var group = tabs.parentElement;
    var buttons = tabs.querySelectorAll('.tab-btn');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.classList.remove('active'); });
        group.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        b.classList.add('active');
        var panel = group.querySelector('#' + b.dataset.target);
        if (panel) panel.classList.add('active');
      });
    });
  });

  // ---------- Quiz de autoevaluación ----------
  document.querySelectorAll('.quiz .q').forEach(function (q) {
    var correct = q.dataset.correct;
    var fb = q.querySelector('.fb');
    q.querySelectorAll('button.opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        q.querySelectorAll('button.opt').forEach(function (o) { o.classList.remove('ok', 'bad'); });
        var good = opt.dataset.v === correct;
        opt.classList.add(good ? 'ok' : 'bad');
        if (fb) fb.textContent = good ? '> respuesta correcta' : '> respuesta incorrecta, intenta de nuevo';
      });
    });
  });

  // ---------- Volver arriba + barra de progreso de lectura ----------
  var toTop = document.getElementById('toTop');
  var progress = document.createElement('div');
  progress.id = 'progress';
  document.body.appendChild(progress);

  function onScroll() {
    if (toTop) toTop.style.display = window.scrollY > 400 ? 'block' : 'none';
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ---------- Buscador de la página de inicio ----------
  var search = document.getElementById('search');
  if (search) {
    search.addEventListener('input', function () {
      var term = search.value.toLowerCase();
      document.querySelectorAll('.topic-card').forEach(function (c) {
        c.style.display = c.textContent.toLowerCase().indexOf(term) > -1 ? '' : 'none';
      });
    });
  }

  // ---------- Contadores animados del hero ----------
  document.querySelectorAll('.stat b[data-n]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-n'), 10);
    if (reduceMotion || !target) { el.textContent = target; return; }
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / 900);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });

  // ---------- Aparición suave al hacer scroll ----------
  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          el.classList.add('in');
          io.unobserve(el);
          // al terminar, devolver el elemento a su estilo normal (para que el hover sea ágil)
          setTimeout(function () { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 900);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.content h2, .content .card, .content .table-wrap, .content .code-wrap, .content .note, .content .resources, .content .apa-list, .content .tabs, .content .topic-card').forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (el.classList.contains('topic-card') ? (i % 4) * 60 : 0) + 'ms';
      io.observe(el);
    });
  }

  // ---------- PWA: modo sin conexión e instalación ----------
  var netChip = document.getElementById('netChip');
  function updateNet() {
    if (!netChip) return;
    var off = navigator.onLine === false;
    netChip.classList.toggle('offline', off);
    netChip.textContent = off ? 'Sin conexión' : 'Sistema en línea';
  }
  window.addEventListener('online', updateNet);
  window.addEventListener('offline', updateNet);
  updateNet();

  // Registrar el service worker (guarda todos los archivos para usarlos sin internet).
  // Requiere HTTPS o localhost; si se abre con file:// simplemente se omite.
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    var me = document.querySelector('script[src$="js/main.js"]');
    var swUrl = new URL('../sw.js', me ? me.src : location.href);
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(swUrl.href).catch(function () { /* sin SW la página sigue funcionando con internet */ });
    });
  }

  // Botón "Instalar" (Android/Chrome/Edge). En iPhone se instala desde Compartir > Añadir a pantalla de inicio.
  var installBtn = document.getElementById('installBtn');
  var deferredPrompt = null;
  var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn && !standalone) installBtn.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () { deferredPrompt = null; installBtn.hidden = true; });
    });
  }
  window.addEventListener('appinstalled', function () { if (installBtn) installBtn.hidden = true; });
  var box = document.getElementById('installBox');
  if (box && standalone) box.hidden = true;

  // ---------- Fondo animado: red de partículas ----------
  var canvas = document.createElement('canvas');
  canvas.id = 'fx';
  canvas.setAttribute('aria-hidden', 'true');
  var ctx = canvas.getContext ? canvas.getContext('2d') : null;
  var colors = { a: '0,229,255', b: '139,92,246' };

  function hexToRgb(hex) {
    hex = (hex || '').trim();
    if (hex.charAt(0) !== '#') return null;
    if (hex.length === 4) hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    var n = parseInt(hex.slice(1), 16);
    return isNaN(n) ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
  }
  function readColors() {
    var cs = getComputedStyle(root);
    colors.a = hexToRgb(cs.getPropertyValue('--cyan')) || colors.a;
    colors.b = hexToRgb(cs.getPropertyValue('--violet')) || colors.b;
  }
  readColors();

  if (ctx && !reduceMotion) {
    document.body.insertBefore(canvas, document.body.firstChild);
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), pts = [];
    var mouse = { x: -999, y: -999 };

    function resize() {
      W = document.documentElement.clientWidth || window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;      // el tamaño en pantalla lo da el CSS (100% fijo)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(24, Math.min(70, Math.round((W * H) / 24000)));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .7, c: i % 3 === 0 ? 'b' : 'a' });
      }
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

    var LINK = 130;
    function frame() {
      if (document.hidden) { requestAnimationFrame(frame); return; }
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            ctx.strokeStyle = 'rgba(' + colors.a + ',' + (0.22 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        var mx = p.x - mouse.x, my = p.y - mouse.y, md = mx * mx + my * my;
        if (md < 160 * 160) {
          ctx.strokeStyle = 'rgba(' + colors.b + ',' + (0.35 * (1 - Math.sqrt(md) / 160)).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(' + colors[p.c] + ',.85)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
