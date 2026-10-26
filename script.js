const navigationEntry = performance.getEntriesByType('navigation')[0];
const pageWasReloaded = navigationEntry?.type === 'reload';

if (pageWasReloaded && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Function to load an HTML file into a specific element
async function loadSection(elementId, filePath) {
  try {
    const response = await fetch(filePath, { cache: 'no-store' });
    const content = await response.text();
    document.getElementById(elementId).innerHTML = content;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

// Function to initialize logic after components are loaded
async function initSite() {
  // Wait for the shared navigation before attaching homepage section tracking.
  await window.siteChromeReady;
  const updateNavbarSection = initNavbarLogic();

  // 1. Load independent sections together rather than waiting for each in turn.
  await Promise.all([
    loadSection('home-placeholder', 'sections/home.html'),
    loadSection('about-placeholder', 'sections/about.html'),
    loadSection('experience-placeholder', 'sections/experience.html'),
    loadSection('education-placeholder', 'sections/education.html'),
    loadSection('projects-placeholder', 'sections/projects_featured.html').then(initFeaturedProjects),
    loadSection('publications-placeholder', 'sections/publications.html').then(initPublications),
    loadSection('contacts-placeholder', 'sections/contacts.html')
  ]);
  updateNavbarSection();
  initAboutPhotos();
  initPointerGlow();

  // 2. Initialize Feather Icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }

  // 3. Initialize Experiences
  initExperiences();

  // 4. Handle hash navigation after sections are loaded
  handleHashNavigation();
}

// Function to scroll to a hash target
function scrollToHash(hash) {
  if (!hash) return;

  const targetElement = document.querySelector(hash);
  if (targetElement) {
    // Account for fixed navbar height (CSS already has scroll-padding-top, but we ensure it works)
    const navbar = document.querySelector('.portfolio-navbar');
    // Use the closed header height while the mobile menu is collapsing.
    const navbarHeight = navbar
      ? parseFloat(getComputedStyle(navbar).minHeight) || navbar.offsetHeight
      : 0;
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Function to handle hash navigation after sections are loaded
function handleHashNavigation() {
  if (pageWasReloaded) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return;
  }

  const hash = window.location.hash;
  if (hash) {
    // Wait a bit for the DOM to be fully updated
    setTimeout(() => {
      scrollToHash(hash);
    }, 100);
  }

  // Also listen for hash changes (when clicking links on the same page)
  window.addEventListener('hashchange', () => {
    setTimeout(() => {
      scrollToHash(window.location.hash);
    }, 50);
  });
}

function initNavbarLogic() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const updateActiveSection = () => {
    const marker = Math.max(100, window.innerHeight * 0.25);
    let activeLink = null;
    navLinks.forEach(link => {
      const section = document.getElementById(link.hash.slice(1));
      if (section && section.getBoundingClientRect().top <= marker) activeLink = link;
    });
    navLinks.forEach(link => {
      const active = link === activeLink;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  let framePending = false;
  const scheduleUpdate = () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => {
      updateActiveSection();
      framePending = false;
    });
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  return updateActiveSection;
}

// Embed the featured card icons so their first render does not need Feather.
function initFeaturedProjects() {
  const container = document.getElementById('featured-projects-container');
  if (!container) return;
  const featured = projectsData.filter(project => project.featured).slice(0, 2);
  container.replaceChildren(...featured.map(createProjectListEntry));
  window.feather?.replace();
}

// Start the loading process
document.addEventListener('DOMContentLoaded', initSite);
