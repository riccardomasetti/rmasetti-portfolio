document.addEventListener('DOMContentLoaded', function() {
    const experiencesContainer = document.getElementById('experiences-container');
    
    if (!experiencesContainer || typeof experiencesData === 'undefined') {
      return;
    }
    
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
    
    if (window.feather) {
      feather.replace();
    }
  });