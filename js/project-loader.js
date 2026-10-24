// Load navbar and footer for project pages
async function loadProjectComponents() {
  try {
    // Load navbar
    const navbarResponse = await fetch('../sections/navbar-projects.html');
    const navbarContent = await navbarResponse.text();
    document.getElementById('navbar-placeholder').innerHTML = navbarContent;
    initNavbarLogic();
    
    // Load footer
    const footerResponse = await fetch('../sections/footer.html');
    const footerContent = await footerResponse.text();
    document.getElementById('footer-placeholder').innerHTML = footerContent;
    
    // Initialize Feather Icons after content is loaded
    if (typeof feather !== 'undefined') {
      feather.replace();
    }

  } catch (error) {
    console.error('Error loading project components:', error);
  }
}

function initNavbarLogic() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.querySelector('#navbarNav');
  if (navLinks && navbarCollapse) {
    const closeMenu = () => {
      if (navbarCollapse.classList.contains('show')) {
        window.bootstrap?.Collapse.getInstance(navbarCollapse)?.hide();
      }
    };
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.querySelector('.portfolio-navbar')?.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navbarCollapse.classList.contains('show')) {
        closeMenu();
        document.querySelector('.navbar-toggler')?.focus();
      }
    });
  }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadProjectComponents);
