/* 4D Hotelaria e Turismo — aviso de cookies (lembra o aceite no navegador) */
var KEY = '4dht-cookies-ok';

export function initCookies() {
  var box = document.querySelector('.cookies');
  if (!box) return;
  var seen = false;
  try { seen = localStorage.getItem(KEY) === '1'; } catch (e) { /* navegador sem armazenamento */ }
  if (seen) return;
  box.hidden = false;
  box.querySelector('button').addEventListener('click', function () {
    try { localStorage.setItem(KEY, '1'); } catch (e) { /* segue sem lembrar */ }
    box.hidden = true;
  });
}
