// Load and render skills from skills-data.js
document.addEventListener('DOMContentLoaded', function() {
  const skillsContainer = document.getElementById('skills-container');
  
  if (!skillsContainer || !skillsData) {
    return;
  }
  
  // Group skills by category
  const skillsByCategory = {};
  skillsData.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });
  
  const orderedCategories = categoryOrder.filter(cat => skillsByCategory[cat]);
  // Add any categories not in the order array at the end
  Object.keys(skillsByCategory).forEach(cat => {
    if (!categoryOrder.includes(cat)) {
      orderedCategories.push(cat);
    }
  });
  
  orderedCategories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'mb-5';
    
    const categoryTitle = document.createElement('h2');
    categoryTitle.className = 'fw-bold mb-4 text-primary';
    categoryTitle.textContent = category;
    categoryDiv.appendChild(categoryTitle);
    
    const skillsRow = document.createElement('div');
    skillsRow.className = 'row';
    
    skillsByCategory[category].forEach(skill => {
      const skillCol = document.createElement('div');
      skillCol.className = 'col-md-6 mb-4';
      
      const skillCard = document.createElement('div');
      skillCard.className = 'card border-0 shadow-sm h-100';
      
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      
      // Check if skill should show level (default to true if not specified)
      const showLevel = skill.showLevel !== false && skill.level !== undefined;
      
      if (showLevel) {
        // Skill name and level (with progress bar)
        const skillName = document.createElement('div');
        skillName.className = 'd-flex justify-content-between align-items-center mb-2';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'fw-bold';
        nameSpan.textContent = skill.name;
        
        const levelSpan = document.createElement('span');
        levelSpan.className = 'text-muted small';
        levelSpan.textContent = skill.level + '%';
        
        skillName.appendChild(nameSpan);
        skillName.appendChild(levelSpan);
        cardBody.appendChild(skillName);
        
        // Progress bar
        const progressDiv = document.createElement('div');
        progressDiv.className = 'progress';
        progressDiv.style.height = '8px';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar bg-primary';
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuenow', skill.level);
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        progressBar.style.width = skill.level + '%';
        
        progressDiv.appendChild(progressBar);
        cardBody.appendChild(progressDiv);
      } else {
        // Skill name only (no level, no progress bar)
        const skillName = document.createElement('div');
        skillName.className = 'fw-bold';
        skillName.textContent = skill.name;
        cardBody.appendChild(skillName);
      }
      
      skillCard.appendChild(cardBody);
      skillCol.appendChild(skillCard);
      skillsRow.appendChild(skillCol);
    });
    
    categoryDiv.appendChild(skillsRow);
    skillsContainer.appendChild(categoryDiv);
  });
  
  // Initialize Feather Icons after content is loaded
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});

