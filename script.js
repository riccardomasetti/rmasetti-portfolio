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
  // The navbar is already in the HTML, so it can work while sections load.
  const updateNavbarSection = initNavbarLogic();

  // 1. Load independent sections together rather than waiting for each in turn.
  await Promise.all([
    loadSection('home-placeholder', 'sections/home.html'),
    loadSection('about-placeholder', 'sections/about.html'),
    loadSection('experience-placeholder', 'sections/experience.html'),
    loadSection('education-placeholder', 'sections/education.html'),
    loadSection('projects-placeholder', 'sections/projects_featured.html').then(initFeaturedProjects),
    loadSection('publications-placeholder', 'sections/publications.html').then(initPublications),
    loadSection('contacts-placeholder', 'sections/contacts.html'),
    loadSection('footer-placeholder', 'sections/footer.html')
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

  // 4. Initialize Featured Skills
  initFeaturedSkills();

  // 5. Initialize Contact Form
  initContactForm();

  // 6. Handle hash navigation after sections are loaded
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
  const navbarCollapse = document.querySelector('#navbarNav');
  const closeMenu = () => {
    if (navbarCollapse?.classList.contains('show')) {
      window.bootstrap?.Collapse.getInstance(navbarCollapse)?.hide();
    }
  };
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.querySelector('.portfolio-navbar')?.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navbarCollapse?.classList.contains('show')) {
      closeMenu();
      document.querySelector('.navbar-toggler')?.focus();
    }
  });

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

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            document.getElementById('formSuccess').classList.remove('d-none');
            form.reset();
            setTimeout(() => { document.getElementById('formSuccess').classList.add('d-none'); }, 3000);
          }
        });
    });
  }
}

// Embed the featured card icons so their first render does not need Feather.
function projectPreviewIcon(name, size) {
  const shapes = {
    'pie-chart': '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10Z"/>',
    'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'github': '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22"/>',
    'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'
  };

  // Keep supporting other projects if the featured selection changes.
  if (!shapes[name]) {
    return `<i data-feather="${name}" style="width: ${size}px; height: ${size}px;"></i>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-${name}" aria-hidden="true" focusable="false">${shapes[name]}</svg>`;
}

function initFeaturedProjects() {
  const featuredProjectsContainer = document.getElementById('featured-projects-container');
  if (!featuredProjectsContainer) return;

  // The homepage preview shows only the first two featured projects.
  const featuredProjects = projectsData.filter(project => project.featured).slice(0, 2);
  featuredProjectsContainer.replaceChildren();
  featuredProjects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'col-lg-6 mb-4';

    const detailLink = project.detailPage || '#';

    let githubButton = '';
    if (project.githubLink && !project.underDevelopment) {
      githubButton = `
              <a href="${project.githubLink}" target="_blank" class="btn btn-outline-dark me-2 position-relative" style="z-index: 2;" onclick="event.stopPropagation();">
                  ${projectPreviewIcon('github', 18)} GitHub
              </a>`;
    }

    projectCard.innerHTML = `
          <div class="card border-0 shadow-sm h-100 project-card-link" style="cursor: pointer;" onclick="window.location.href='${detailLink}'">
              <div class="card-body p-4">
                  <div class="d-flex align-items-center mb-3">
                      <span class="bg-primary text-white p-2 me-3 rounded">
                          ${projectPreviewIcon(project.icon, 24)}
                      </span>
                      <h3 class="fw-bold m-0">${project.title}</h3>
                  </div>
                  <p class="text-muted small mb-2">${project.technologies}</p>
                  <p>${project.description}</p>
                  <div class="d-flex mt-4 pt-2">
                      ${githubButton}
                      <span class="btn btn-primary">
                          Learn More ${projectPreviewIcon('arrow-right', 18)}
                      </span>
                  </div>
              </div>
          </div>`;
    featuredProjectsContainer.appendChild(projectCard);
  });
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

function initFeaturedSkills() {
  const featuredSkillsContainer = document.getElementById('featured-skills-container');
  if (!featuredSkillsContainer) return;

  const skillsToDisplay = (typeof featuredSkills !== 'undefined') ? featuredSkills : [
    { name: 'Python', icon: 'fab fa-python' },
    { name: 'PyTorch', icon: 'fas fa-brain' },
    { name: 'Django', icon: 'fab fa-python' },
    { name: 'C / C++', icon: 'fas fa-code' },
    { name: 'Java', icon: 'fab fa-java' },
    { name: 'Next.js & React', icon: 'fab fa-react' },
    { name: 'Linux', icon: 'fab fa-linux' },
    { name: 'Git', icon: 'fab fa-git-alt' }
  ];

  featuredSkillsContainer.innerHTML = '';
  skillsToDisplay.forEach(skill => {
    const skillCol = document.createElement('div');
    skillCol.className = 'col-6 col-md-3 mb-4';

    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item p-3';

    skillItem.innerHTML = `
      <i class="${skill.icon} fa-2x mb-3 text-primary"></i>
      <h5>${skill.name}</h5>
    `;

    skillCol.appendChild(skillItem);
    featuredSkillsContainer.appendChild(skillCol);
  });

  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// Start the loading process
document.addEventListener('DOMContentLoaded', initSite);
