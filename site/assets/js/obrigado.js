/* 4D Hotelaria e Turismo — página de obrigado */
import { whatsappUrl } from './config.js';

document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) { a.href = whatsappUrl(); });

var el = document.querySelector('[data-date]');
if (el) el.textContent = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
