/* ============================================
   MAIN.JS — Funcionalidades do site GAMEC
   1. Status "Aberto agora" (horário de Brasília)
   2. Formulário de orçamento → WhatsApp
   3. Animações ao rolar (reveal)
   4. Ano do rodapé
   ============================================ */

/* --- CONFIGURAÇÃO (edite aqui) --- */
const GAMEC = {
  whatsapp: '5511939013340',
  timezone: 'America/Sao_Paulo',
  // 0 = domingo ... 6 = sábado  →  [abre, fecha] em horas
  hours: { 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18] }
};

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. STATUS ABERTO / FECHADO ---------- */
  const statusEl = document.querySelector('[data-status]');

  if (statusEl) {
    const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

    // Hora atual em Brasília, independente do fuso do visitante
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: GAMEC.timezone, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());

    const get = type => parts.find(p => p.type === type).value;
    const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    const now = (parseInt(get('hour'), 10) % 24) + parseInt(get('minute'), 10) / 60;
    const today = GAMEC.hours[dayIdx];

    const textEl = statusEl.querySelector('.status-text');
    let isOpen = false;
    let message;

    if (today && now >= today[0] && now < today[1]) {
      isOpen = true;
      message = `Aberto agora · fecha às ${today[1]}h`;
    } else {
      // procura o próximo dia de funcionamento
      let next = null;
      for (let i = 0; i < 7; i++) {
        const d = (dayIdx + i) % 7;
        const h = GAMEC.hours[d];
        if (!h) continue;
        if (i === 0 && now >= h[0]) continue; // hoje já passou do horário de abertura
        next = { i, d, h };
        break;
      }
      if (next) {
        const when = next.i === 0 ? 'hoje' : next.i === 1 ? 'amanhã' : dayNames[next.d];
        message = `Fechado agora · abre ${when} às ${next.h[0]}h`;
      } else {
        message = 'Fechado agora';
      }
    }

    statusEl.dataset.open = String(isOpen);
    if (textEl) textEl.textContent = message;
  }

  /* ---------- 2. FORMULÁRIO → WHATSAPP ---------- */
  const form = document.getElementById('quote-form');

  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const name    = form.elements.nome.value.trim();
      const vehicle = form.elements.veiculo.value.trim();
      const service = form.elements.servico.value;

      // validação simples e visível
      let valid = true;
      [form.elements.nome, form.elements.veiculo].forEach(field => {
        const ok = field.value.trim().length > 1;
        field.closest('.form-field').classList.toggle('form-field--error', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        form.querySelector('.form-field--error input').focus();
        return;
      }

      const text =
        `Olá, GAMEC! Meu nome é ${name}.\n` +
        `Veículo: ${vehicle}\n` +
        `Preciso de: ${service}\n` +
        `Podem me ajudar com o orçamento e um horário?`;

      const url = `https://wa.me/${GAMEC.whatsapp}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
    });

    form.addEventListener('input', e => {
      const wrap = e.target.closest('.form-field');
      if (wrap) wrap.classList.remove('form-field--error');
    });
  }

  /* ---------- 3. REVEAL AO ROLAR ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- 4. ANO DO RODAPÉ ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
