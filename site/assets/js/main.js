/* 4D Hotelaria e Turismo — interações da landing page */
import { CONFIG, whatsappUrl } from './config.js';
import { initCookies } from './cookies.js';

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- WhatsApp (número vem do config.js) ---------- */
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) { a.href = whatsappUrl(); });

/* ---------- Nav ---------- */
var nav = document.querySelector('.nav');
var toggle = document.querySelector('.nav__toggle');

function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 40); }
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toggle.addEventListener('click', function () {
  var open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('.nav__links a').forEach(function (a) {
  a.addEventListener('click', function () {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Revelar ao rolar ---------- */
var toReveal = document.querySelectorAll('.reveal');
document.querySelectorAll('.pains__list, .floors__list, .about__proofs, .hero__copy').forEach(function (group) {
  group.querySelectorAll('.reveal').forEach(function (el, i) { el.style.setProperty('--d', (i * 0.09) + 's'); });
});

if ('IntersectionObserver' in window && !reduceMotion) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  toReveal.forEach(function (el) { io.observe(el); });
} else {
  toReveal.forEach(function (el) { el.classList.add('is-in'); });
}

/* ---------- Painel do hero: números contam até o valor ---------- */
if (!reduceMotion) {
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = +el.dataset.count;
    el.textContent = '0';
    setTimeout(function () {
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, Math.max(0, (t - t0) / 1400));
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }, 600);
  });
}

/* ---------- Andares: o painel do elevador acompanha a rolagem ---------- */
var floors = document.querySelectorAll('.floor');
var liftN = document.querySelector('.lift__n');
var current = 0;

function updateLift() {
  var mark = window.innerHeight * 0.5;
  var n = 1;
  floors.forEach(function (f, i) { if (f.getBoundingClientRect().top < mark) n = i + 1; });
  if (n === current) return;
  current = n;
  floors.forEach(function (f, i) { f.classList.toggle('is-current', i + 1 === n); });
  liftN.textContent = n;
  if (!reduceMotion) {
    liftN.classList.remove('is-tick');
    void liftN.offsetWidth;
    liftN.classList.add('is-tick');
  }
}
if (floors.length && liftN) {
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateLift(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateLift);
  updateLift();
}

/* ---------- CTA fixo no celular: aparece depois do hero, some no formulário ---------- */
var sticky = document.querySelector('.sticky-cta');
var heroCtas = document.querySelector('.hero__ctas');
var contact = document.getElementById('diagnostico');
if (sticky && heroCtas && contact && 'IntersectionObserver' in window) {
  var heroVisible = true;
  var formVisible = false;
  var sync = function () {
    var on = !heroVisible && !formVisible;
    sticky.classList.toggle('is-on', on);
    document.body.classList.toggle('has-sticky', on);
  };
  new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; sync(); }).observe(heroCtas);
  new IntersectionObserver(function (e) { formVisible = e[0].isIntersecting; sync(); }, { rootMargin: '0px 0px -20% 0px' }).observe(contact);
}

/* ---------- Formulário ---------- */
var form = document.getElementById('form-diagnostico');
var status = form.querySelector('.form__status');
var phone = form.querySelector('[name="your-phone"]');

phone.addEventListener('input', function () {
  var d = phone.value.replace(/\D/g, '').slice(0, 11);
  var out = d;
  if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
  phone.value = out;
});

function fieldOf(el) { return el.closest('.field') || el.closest('.check'); }

form.addEventListener('change', function (e) {
  var f = fieldOf(e.target);
  if (f) f.classList.remove('is-invalid');
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var firstBad = null;
  var seen = {};
  form.querySelectorAll('[required]').forEach(function (el) {
    var ok;
    if (el.type === 'radio') {
      if (seen[el.name]) return;
      seen[el.name] = true;
      ok = !!form.querySelector('[name="' + el.name + '"]:checked');
    } else if (el.type === 'checkbox') {
      ok = el.checked;
    } else if (el.name === 'your-phone') {
      ok = el.value.replace(/\D/g, '').length >= 10;
    } else {
      ok = el.value.trim() !== '' && el.checkValidity();
    }
    var f = fieldOf(el);
    if (f) f.classList.toggle('is-invalid', !ok);
    if (!ok && !firstBad) firstBad = el;
  });

  if (firstBad) {
    status.className = 'form__status is-err';
    status.textContent = 'Confira os campos destacados para continuar.';
    firstBad.focus({ preventScroll: true });
    fieldOf(firstBad).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    return;
  }

  var btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  status.className = 'form__status';
  status.textContent = 'Enviando…';

  var done = function () { window.location.href = CONFIG.thankYouPage; };
  var fail = function () {
    status.className = 'form__status is-err';
    status.textContent = 'Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp.';
    btn.disabled = false;
  };

  if (!CONFIG.formEndpoint) { setTimeout(done, 600); return; }
  fetch(CONFIG.formEndpoint, { method: 'POST', body: new FormData(form) })
    .then(function (r) { r.ok ? done() : fail(); })
    .catch(fail);
});

/* ---------- Cookies + ano no rodapé ---------- */
initCookies();
var y = document.querySelector('[data-year]');
if (y) y.textContent = new Date().getFullYear();
