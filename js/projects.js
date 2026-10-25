document.addEventListener('DOMContentLoaded', () => {
  const categories = ['all', ...new Set(projectsData.map(project => project.category))];
  const filters = document.getElementById('category-filters');
  categories.forEach(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn btn-outline-primary${category === 'all' ? ' active' : ''}`;
    button.dataset.category = category;
    button.setAttribute('aria-pressed', String(category === 'all'));
    button.textContent = projectCategoryLabel(category);
    button.addEventListener('click', () => filterProjects(category));
    filters.append(button);
  });
  const container = document.getElementById('projects-container');
  container.replaceChildren(...projectsData.map(createProjectListEntry));
  window.feather?.replace();
});

function filterProjects(category) {
  document.querySelectorAll('#category-filters button').forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('#projects-container .project-item').forEach(item => {
    item.hidden = category !== 'all' && item.dataset.category !== category;
  });
}
