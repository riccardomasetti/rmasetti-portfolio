// Every page uses the same navigation and footer templates.
(() => {
  const siteRoot = new URL('../', document.currentScript.src);
  const isHome = document.body.dataset.page === 'home';
  const activeSection = document.body.dataset.page === 'skills' ? 'about' : isHome ? 'home' : 'projects';

  async function loadComponent(id, filename) {
    const placeholder = document.getElementById(id);
    if (!placeholder) return;
    const response = await fetch(new URL(`sections/${filename}`, siteRoot), { cache: 'no-store' });
    if (!response.ok) throw new Error(`Unable to load ${filename}: ${response.status}`);
    placeholder.innerHTML = await response.text();
    window.feather?.replace();
  }

  window.siteChromeReady = Promise.allSettled([
    loadComponent('navbar-placeholder', 'navbar.html').then(() => {
      const navbar = document.querySelector('.portfolio-navbar');
      if (!navbar) return;
      const menu = navbar.querySelector('#navbarNav');
      const closeMenu = () => {
        if (menu?.classList.contains('show')) {
          window.bootstrap?.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
        }
      };
      navbar.querySelectorAll('.nav-link').forEach(link => {
        const hash = link.getAttribute('href');
        if (!isHome) link.href = new URL(`index.html${hash}`, siteRoot).href;
        const active = hash === `#${activeSection}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
        link.addEventListener('click', closeMenu);
      });
      navbar.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu?.classList.contains('show')) {
          closeMenu();
          navbar.querySelector('.navbar-toggler')?.focus();
        }
      });
    }),
    loadComponent('footer-placeholder', 'footer.html')
  ]).then(results => {
    results.forEach(result => {
      if (result.status === 'rejected') console.error('Shared page layout failed:', result.reason);
    });
  });
})();
