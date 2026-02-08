document.addEventListener('DOMContentLoaded', function() {
    // Get project title from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectTitle = decodeURIComponent(urlParams.get('project'));
    
    if (!projectTitle) {
      window.location.href = 'projects.html';
      return;
    }
    
    // Find project in data
    const project = projectsData.find(p => p.title === projectTitle);
    
    if (!project) {
      window.location.href = 'projects.html';
      return;
    }
    
    // Populate page with project data
    document.getElementById('page-title').textContent = `${project.title} - Riccardo Masetti`;
    
    const iconElement = document.querySelector('#project-icon i');
    iconElement.setAttribute('data-feather', project.icon);
    
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-category').textContent = formatCategoryName(project.category);
    
    // Technologies as badges
    const techContainer = document.getElementById('project-technologies');
    const technologies = project.technologies.split(' • ');
    technologies.forEach(tech => {
      const badge = document.createElement('span');
      badge.className = 'tech-badge';
      badge.textContent = tech.trim();
      techContainer.appendChild(badge);
    });
    
    // Description (preserve line breaks)
    const descriptionContainer = document.getElementById('project-description');
    descriptionContainer.innerHTML = project.description.replace(/\n/g, '<br>');
    
    // GitHub link (only show if link exists and project is not under development)
    if (project.githubLink && !project.underDevelopment) {
      const githubLink = document.getElementById('project-github-link');
      githubLink.href = project.githubLink;
      githubLink.style.display = 'inline-block';
    }
    
    // Show "Under Development" badge if flag is set
    if (project.underDevelopment) {
      const badgeContainer = document.getElementById('project-badges') || document.querySelector('.project-actions');
      if (badgeContainer) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-warning text-white me-2 px-3 py-2 fw-bold';
        badge.style.fontSize = '0.9rem';
        badge.textContent = 'Under Development';
        badgeContainer.insertBefore(badge, badgeContainer.firstChild);
      }
    }
    
    // Initialize feather icons
    feather.replace();
  });
  
  function formatCategoryName(category) {
    switch(category) {
      case 'all': return 'All';
      case 'web': return 'Web Development';
      case 'mobile': return 'Mobile Apps';
      case 'data': return 'Data Science';
      case 'scripts': return 'Scripts & Tools';
      case 'game': return 'Games';
      case 'security': return 'Security';
      case 'Machine & Deep Learning': return 'Machine & Deep Learning';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  }