// Function to load an HTML file into a specific element
async function loadSection(elementId, filePath) {
  try {
      const response = await fetch(filePath);
      const content = await response.text();
      document.getElementById(elementId).innerHTML = content;
  } catch (error) {
      console.error(`Error loading ${filePath}:`, error);
  }
}

// Function to initialize logic after components are loaded
async function initSite() {
    // 1. Load all sections
    await loadSection('nav-placeholder', 'sections/navbar.html');
    await loadSection('home-placeholder', 'sections/home.html');
    await loadSection('about-placeholder', 'sections/about.html');
    await loadSection('education-placeholder', 'sections/education.html');
    await loadSection('projects-placeholder', 'sections/projects_featured.html');
    await loadSection('contacts-placeholder', 'sections/contacts.html');
    await loadSection('footer-placeholder', 'sections/footer.html');
  
    // 2. Initialize Feather Icons
    feather.replace();
  
    // 3. Initialize Home Projects (featured list)
    initFeaturedProjects();
  
    // 4. Initialize Experiences
    initExperiences();
  
    // 5. Initialize Navbar Mobile Toggle Logic
    initNavbarLogic();
  
    // 6. Initialize Contact Form
    initContactForm();
  }

function initNavbarLogic() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.querySelector('#navbarNav');
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
              bootstrap.Collapse.getInstance(navbarCollapse).hide();
          }
      });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
      form.addEventListener('submit', function(e) {
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

function initFeaturedProjects() {
  const featuredProjectsContainer = document.getElementById('featured-projects-container');
  if (!featuredProjectsContainer) return;

  const featuredProjects = projectsData.filter(project => project.featured);
  featuredProjects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'col-lg-6 mb-4';
      projectCard.innerHTML = `
          <div class="card border-0 shadow-sm h-100">
              <div class="card-body p-4">
                  <div class="d-flex align-items-center mb-3">
                      <span class="bg-primary text-white p-2 me-3 rounded">
                          <i data-feather="${project.icon}" style="width: 24px; height: 24px;"></i>
                      </span>
                      <h3 class="fw-bold m-0">${project.title}</h3>
                  </div>
                  <p class="text-muted small mb-2">${project.technologies}</p>
                  <p>${project.description}</p>
                  <div class="d-flex mt-4 pt-2">
                      <a href="${project.githubLink}" target="_blank" class="btn btn-outline-dark">
                          <i data-feather="github" style="width: 18px; height: 18px;"></i> GitHub
                      </a>
                  </div>
              </div>
          </div>`;
      featuredProjectsContainer.appendChild(projectCard);
  });
  feather.replace(); // Refresh icons for the newly added projects
}

function initExperiences() {
    const experiencesContainer = document.getElementById('experiences-container');
    if (!experiencesContainer || typeof experiencesData === 'undefined') return;
  
    experiencesData.forEach((experience, index) => {
      const experienceCard = document.createElement('div');
      experienceCard.className = 'col-md-6 mb-3' + (index >= experiencesData.length - 2 ? ' mb-md-0' : '');
      
      experienceCard.innerHTML = `
        <div class="d-flex mb-2">
          <i data-feather="${experience.icon}" class="text-primary me-2"></i>
          <h5 class="fw-bold">${experience.title}</h5>
        </div>
        <p class="text-muted mb-0">${experience.period}</p>
        <p>${experience.description}</p>
      `;
      
      experiencesContainer.appendChild(experienceCard);
    });
    
    feather.replace();
  }

// Start the loading process
document.addEventListener('DOMContentLoaded', initSite);  