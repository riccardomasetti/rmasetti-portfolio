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
  
    // 5. Initialize Featured Skills
    initFeaturedSkills();
  
    // 6. Initialize Navbar Mobile Toggle Logic
    initNavbarLogic();
  
    // 7. Initialize Contact Form
    initContactForm();
  
    // 8. Handle hash navigation after sections are loaded
    handleHashNavigation();
  }

// Function to scroll to a hash target
function scrollToHash(hash) {
  if (!hash) return;
  
  const targetElement = document.querySelector(hash);
  if (targetElement) {
    // Account for fixed navbar height (CSS already has scroll-padding-top, but we ensure it works)
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight - 20; // 20px extra padding
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Function to handle hash navigation after sections are loaded
function handleHashNavigation() {
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

function initFeaturedSkills() {
  const featuredSkillsContainer = document.getElementById('featured-skills-container');
  if (!featuredSkillsContainer || typeof skillsData === 'undefined') return;

  // Define featured skills (key skills to show in about section)
  const featuredSkillNames = ['Python', 'Java', 'C', 'SQL', 'PyTorch', 'Scikit-learn', 'Django', 'Git'];
  
  // Get featured skills from data
  const featuredSkills = featuredSkillNames.map(name => 
    skillsData.find(skill => skill.name === name)
  ).filter(skill => skill !== undefined);

  // Icon mapping for skills
  const skillIcons = {
    'Python': 'fab fa-python',
    'Java': 'fab fa-java',
    'C': 'fas fa-code',
    'SQL': 'fas fa-database',
    'PyTorch': 'fas fa-brain',
    'Scikit-learn': 'fas fa-chart-line',
    'Django': 'fab fa-python',
    'Git': 'fab fa-git-alt',
    'JavaScript': 'fab fa-js',
    'HTML/CSS': 'fab fa-html5',
    'BASH': 'fas fa-terminal',
    'Linux': 'fab fa-linux',
    'Docker': 'fab fa-docker',
    'React': 'fab fa-react'
  };

  featuredSkills.forEach(skill => {
    const skillCol = document.createElement('div');
    skillCol.className = 'col-6 col-md-3 mb-4';
    
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item p-3';
    
    const iconClass = skillIcons[skill.name] || 'fas fa-code';
    skillItem.innerHTML = `
      <i class="${iconClass} fa-2x mb-3 text-primary"></i>
      <h5>${skill.name}</h5>
    `;
    
    skillCol.appendChild(skillItem);
    featuredSkillsContainer.appendChild(skillCol);
  });
  
  feather.replace();
}

// Start the loading process
document.addEventListener('DOMContentLoaded', initSite);  