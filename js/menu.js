/* ============================================
   MENU.JS — Menu mobile + scroll do header
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const toggle      = document.querySelector('.header__menu-toggle');
  const mobileNav   = document.querySelector('.header__mobile-nav');
  const header      = document.querySelector('.header');
  const mobileLinks = document.querySelectorAll('.header__mobile-nav a');

  const closeMenu = () => {
    if (!toggle || !mobileNav) return;
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  };

  /* --- MENU MOBILE --- */
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      // cola o menu logo abaixo do header, esteja a barra superior visível ou não
      if (header) mobileNav.style.setProperty('--menu-top', header.getBoundingClientRect().bottom + 'px');
      const isOpen = toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', String(isOpen));
      mobileNav.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Fecha com ESC e ao voltar para a tela grande
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.matchMedia('(min-width: 960px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  }

  /* --- HEADER SCROLL --- */
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

});
