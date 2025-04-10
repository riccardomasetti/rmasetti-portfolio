document.addEventListener('DOMContentLoaded', function() {

    // creating an array in which there are all the possible categories of progects filtered from project-data
    const categories = ['all', ...new Set(projectsData.map(project => project.category))];
  
    // For every category it creates a filter (it create the button, assign the funtion)
    const categoryFiltersContainer = document.getElementById('category-filters');
    categories.forEach(category => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `btn btn-outline-primary m-1 ${category === 'all' ? 'active' : ''}`;
      button.onclick = () => filterProjects(category);
      button.textContent = formatCategoryName(category);
      categoryFiltersContainer.appendChild(button);
    });
  
    // Generate project cards
    const projectsContainer = document.getElementById('projects-container');
    
    // For every project that is contained in project-data.js, a card is creates with its data
    projectsData.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'col-lg-6 mb-4 project-item';
        projectCard.setAttribute('data-category', project.category);
        
        let projectCardHTML = `
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
              <div class="d-flex mt-4 pt-2">`;
      
        // Aggiungi il bottone GitHub solo se il titolo del progetto non è "Expiration Tracker"
        if (project.title !== "Expiration Tracker") {
          projectCardHTML += `
            <a href="${project.githubLink}" target="_blank" class="btn btn-outline-dark">
              <i data-feather="github" style="width: 18px; height: 18px;"></i> GitHub
            </a>`;
        }
      
        projectCardHTML += `
              </div>
            </div>
          </div>`;
      
        // Inserisci il contenuto nel div della card
        projectCard.innerHTML = projectCardHTML;
      
        // Aggiungi la card al contenitore
        projectsContainer.appendChild(projectCard);
      });
  
    feather.replace();
  
    // Function that for every category associate the name inside the button
    function formatCategoryName(category) {
      switch(category) {
        case 'all': return 'All';
        case 'web': return 'Web Development';
        case 'mobile': return 'Mobile Apps';
        case 'data': return 'Data Science';
        case 'security': return 'Security';
        default: return category.charAt(0).toUpperCase() + category.slice(1);
      }
    }
  });
  
  // Function that filter the projects visible on the screen looking at their category
  function filterProjects(category) {
    const projectItems = document.querySelectorAll('.project-item');
    const filterButtons = document.querySelectorAll('.btn-group .btn');
    
    // Update active button
    filterButtons.forEach(button => {
      button.classList.remove('active');
      if (button.textContent.toLowerCase().includes(category) || 
          (category === 'all' && button.textContent.toLowerCase().includes('all'))) {
        button.classList.add('active');
      }
    });
    
    // Iterate on every item and display them only if the category matches with the chosen one,
    // or the chosen one is "All"
    projectItems.forEach(item => {
      if (category === 'all' || item.getAttribute('data-category') === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }