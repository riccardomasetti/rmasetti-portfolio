// Load and render skills from skills-data.js
document.addEventListener('DOMContentLoaded', function () {
  const skillsContainer = document.getElementById('skills-container');

  if (!skillsContainer || typeof skillSections === 'undefined') {
    return;
  }

  skillsContainer.innerHTML = '';

  skillSections.forEach(section => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'mb-5';

    const headerHTML = `
      <div class="mb-4">
        <h2 class="fw-bold text-primary mb-2">${section.title}</h2>
        <p class="text-muted mb-0">${section.description}</p>
      </div>
    `;

    const skillsRow = document.createElement('div');
    skillsRow.className = 'row g-3';

    section.skills.forEach(skill => {
      const col = document.createElement('div');
      col.className = 'col-6 col-md-4 col-lg-3';

      col.innerHTML = `
        <div class="card border-0 shadow-sm h-100 text-center p-3">
          <div class="card-body d-flex flex-column align-items-center justify-content-center p-2">
            <i class="${skill.icon} fa-2x mb-3 text-primary"></i>
            <h5 class="fw-bold m-0 fs-6">${skill.name}</h5>
          </div>
        </div>
      `;

      skillsRow.appendChild(col);
    });

    sectionDiv.innerHTML = headerHTML;
    sectionDiv.appendChild(skillsRow);
    skillsContainer.appendChild(sectionDiv);
  });

  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});
