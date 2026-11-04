/* ============================================
   LUXURY.JS — Animações e interações de luxo
   Abertura, progresso, cursor, hero, partículas,
   tilt, ímã nos botões, contadores, FAQ suave.
   ============================================ */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const safe = fn => { try { fn(); } catch (e) { console.warn('luxury.js:', e); } };

  /* ---------- 1. ABERTURA (1x por sessão) ---------- */
  let seen = false;
  try { seen = sessionStorage.getItem('gamec-intro') === '1'; } catch (e) {}
  if (!reduced && !seen) {
    root.classList.add('is-loading');
    const pre = document.createElement('div');
    pre.className = 'preloader';
    pre.innerHTML = '<span class="preloader__mark">GAMEC</span><span class="preloader__line"></span><span class="preloader__sub">OFICINA MECÂNICA</span>';
    document.body.prepend(pre);
    const finish = () => {
      pre.classList.add('done');
      root.classList.remove('is-loading');
      setTimeout(() => pre.remove(), 1300);
      try { sessionStorage.setItem('gamec-intro', '1'); } catch (e) {}
    };
    setTimeout(finish, 1900);
  }

  document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 2. BARRA DE PROGRESSO + HEADER INTELIGENTE ---------- */
    safe(() => {
      const bar = document.createElement('div');
      bar.className = 'scroll-progress';
      document.body.prepend(bar);
      const header = $('.header');
      let lastY = scrollY, ticking = false;
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.style.setProperty('--p', max > 0 ? Math.min(scrollY / max, 1) : 0);
        const menuOpen = $('.header__mobile-nav.active');
        if (header) header.classList.toggle('header--hidden', scrollY > lastY && scrollY > 360 && !menuOpen);
        lastY = scrollY; ticking = false;
      };
      addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
      onScroll();
    });

    /* ---------- 3. TÍTULO DO HERO PALAVRA POR PALAVRA ---------- */
    safe(() => {
      const title = $('.hero__title');
      if (!title || reduced) return;
      let n = 0;
      const split = node => {
        [...node.childNodes].forEach(child => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(part => {
              if (!part.trim()) { if (part) frag.append(' '); return; }
              const w = document.createElement('span'); w.className = 'w';
              const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', n++);
              w.append(s); frag.append(w);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === 1) split(child);
        });
      };
      title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
      split(title);
    });

    /* ---------- 4. HERO: LUZ QUE SEGUE O MOUSE, PARALAXE E BRASAS ---------- */
    safe(() => {
      const hero = $('.hero');
      if (!hero || reduced) return;

      if (fine) {
        let raf = 0;
        hero.addEventListener('mousemove', e => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            const r = hero.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            hero.style.setProperty('--mx', (x * 100) + '%');
            hero.style.setProperty('--my', (y * 100) + '%');
            hero.style.setProperty('--px', ((x - .5) * -40) + 'px');
            hero.style.setProperty('--py', ((y - .5) * -40) + 'px');
            raf = 0;
          });
        });
      }

      const cv = document.createElement('canvas');
      cv.className = 'hero__canvas'; cv.setAttribute('aria-hidden', 'true');
      hero.prepend(cv);
      const ctx = cv.getContext('2d');
      let W, H, dots = [], run = false, visible = true;
      const count = innerWidth < 768 ? 22 : 46;
      const make = fromBottom => ({
        x: Math.random() * W, y: fromBottom ? H + 10 : Math.random() * H,
        r: Math.random() * 1.6 + .4, v: Math.random() * .35 + .12,
        a: Math.random() * .5 + .2, t: Math.random() * 6.28, d: (Math.random() - .5) * .25
      });
      const size = () => {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        W = hero.clientWidth; H = hero.clientHeight;
        cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dots = Array.from({ length: count }, () => make(false));
      };
      const frame = () => {
        if (!run) return;
        ctx.clearRect(0, 0, W, H);
        dots.forEach((p, i) => {
          p.y -= p.v; p.x += p.d; p.t += .02;
          if (p.y < -10) dots[i] = make(true);
          const o = p.a * (.6 + .4 * Math.sin(p.t));
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, `rgba(255,154,85,${o})`); g.addColorStop(1, 'rgba(232,99,28,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.28); ctx.fill();
        });
        requestAnimationFrame(frame);
      };
      const toggle = () => {
        const should = visible && !document.hidden;
        if (should && !run) { run = true; requestAnimationFrame(frame); } else if (!should) run = false;
      };
      size(); addEventListener('resize', size);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; toggle(); }).observe(hero);
      document.addEventListener('visibilitychange', toggle);
      toggle();
    });

    /* ---------- 5. CURSOR LARANJA (só mouse) ---------- */
    safe(() => {
      if (!fine || reduced) return;
      const ring = document.createElement('div'); ring.className = 'cursor';
      const dot = document.createElement('div'); dot.className = 'cursor-dot';
      document.body.append(ring, dot);
      let tx = 0, ty = 0, rx = 0, ry = 0;
      addEventListener('mousemove', e => {
        tx = e.clientX; ty = e.clientY;
        ring.classList.add('is-on'); dot.classList.add('is-on');
        dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      });
      document.addEventListener('mouseleave', () => { ring.classList.remove('is-on'); dot.classList.remove('is-on'); });
      (function loop() {
        rx += (tx - rx) * .16; ry += (ty - ry) * .16;
        ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        requestAnimationFrame(loop);
      })();
      document.addEventListener('mouseover', e => {
        ring.classList.toggle('is-hover', !!e.target.closest('a, button, summary, input, select, label'));
      });
    });

    /* ---------- 6. BOTÕES COM ÍMÃ ---------- */
    safe(() => {
      if (!fine || reduced) return;
      $$('.btn--lg, .header__cta, .wa-float').forEach(btn => {
        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
      });
    });

    /* ---------- 7. CARTÕES: INCLINAÇÃO 3D + LUZ ---------- */
    safe(() => {
      $$('.service-card, .step').forEach(card => {
        const done = e => { if (e.propertyName === 'transform' && card.classList.contains('is-visible')) card.classList.add('revealed'); };
        card.addEventListener('transitionend', done);
        if (reduced) card.classList.add('revealed');
        if (!fine || reduced) return;
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          card.style.setProperty('--ry', ((x - .5) * 9) + 'deg');
          card.style.setProperty('--rx', ((.5 - y) * 9) + 'deg');
          card.style.setProperty('--mx', (x * 100) + '%');
          card.style.setProperty('--my', (y * 100) + '%');
        });
        card.addEventListener('mouseleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
      });
    });

    /* ---------- 8. CONTADORES ---------- */
    safe(() => {
      const els = $$('.stat__value, .rating-card__score');
      const fmt = (v, dec) => v.toFixed(dec).replace('.', ',');
      const run = el => {
        const node = [...el.childNodes].find(n => n.nodeType === 3 && /\d/.test(n.textContent));
        if (!node) return;
        const raw = node.textContent.trim();
        const m = raw.match(/[\d.,]+/);
        const dec = (m[0].split(',')[1] || '').length;
        const target = parseFloat(m[0].replace(',', '.'));
        const suffix = raw.replace(m[0], '');
        if (reduced) return;
        const t0 = performance.now(), dur = 1800;
        const tick = now => {
          const k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 4);
          node.textContent = (dec ? fmt(target * e, dec) : Math.round(target * e)) + suffix;
          if (k < 1) requestAnimationFrame(tick);
        };
        node.textContent = (dec ? fmt(0, dec) : '0') + suffix;
        requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver((entries, obs) => entries.forEach(en => {
        if (en.isIntersecting) { run(en.target); obs.unobserve(en.target); }
      }), { threshold: .6 });
      els.forEach(el => io.observe(el));
    });

    /* ---------- 9. ESTRELAS EM SEQUÊNCIA + LUZ NO CTA ---------- */
    safe(() => {
      $$('.stars').forEach(st => $$('.icon', st).forEach((ic, i) => ic.style.setProperty('--s', i)));
      const cta = $('.cta-banner');
      if (cta && !reduced) { const l = document.createElement('span'); l.className = 'cta-banner__light'; l.setAttribute('aria-hidden', 'true'); cta.prepend(l); }
    });

    /* ---------- 10. FAQ COM ABERTURA SUAVE ---------- */
    safe(() => {
      if (reduced || !Element.prototype.animate) return;
      $$('.faq__item').forEach(item => {
        const sum = $('summary', item), ans = $('.faq__answer', item);
        sum.addEventListener('click', e => {
          e.preventDefault();
          if (item.dataset.busy) return;
          item.dataset.busy = '1';
          const opening = !item.open;
          if (opening) item.open = true;
          const h = ans.offsetHeight;
          const a = ans.animate(
            opening ? [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }] : [{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
            { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' }
          );
          ans.style.overflow = 'hidden';
          a.onfinish = () => { if (!opening) item.open = false; ans.style.overflow = ''; delete item.dataset.busy; };
        });
      });
    });
  });
})();
