document.addEventListener('DOMContentLoaded', function() {
    const featuredProjectsContainer = document.getElementById('featured-projects-container');
    
    const featuredProjects = projectsData.filter(project => project.featured);
    
    featuredProjects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'col-lg-6 mb-4';
      
      // Build action buttons/badges
      let actionsHTML = '';
      if (project.githubLink && !project.underDevelopment) {
        actionsHTML = `<a href="${project.githubLink}" target="_blank" class="btn btn-outline-dark">
          <i data-feather="github" style="width: 18px; height: 18px;"></i> GitHub
        </a>`;
      }
      if (project.underDevelopment) {
        actionsHTML += `<span class="badge bg-warning text-white px-3 py-2 fw-bold" style="font-size: 0.9rem;">Under Development</span>`;
      }
      
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
            <div class="d-flex align-items-center justify-content-between mt-4 pt-2">
              ${actionsHTML}
            </div>
          </div>
        </div>
      `;
      
      featuredProjectsContainer.appendChild(projectCard);
    });
    
    if (window.feather) {
      feather.replace();
    }
  });