// Shared project presentation for the homepage and the complete list.
function projectCategoryLabel(category) {
  const labels = { all: 'All', web: 'Web Development', mobile: 'Mobile Apps', data: 'Data Science', security: 'Security' };
  return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

function createProjectListEntry(project) {
  const item = document.createElement('article');
  item.className = 'card project-entry project-item';
  item.dataset.category = project.category;
  const destination = project.detailPage || 'projects.html';

  const identity = document.createElement('div');
  identity.className = 'project-entry-identity';
  const marker = document.createElement('div');
  marker.className = 'project-entry-marker';
  const icon = document.createElement('span');
  icon.className = 'project-entry-icon';
  icon.setAttribute('aria-hidden', 'true');
  const glyph = document.createElement('i');
  glyph.dataset.feather = project.icon;
  icon.append(glyph);
  const category = document.createElement('span');
  category.className = 'project-entry-category';
  category.textContent = projectCategoryLabel(project.category);
  marker.append(icon, category);

  const title = document.createElement('h3');
  title.className = 'project-entry-title mb-2';
  const titleLink = document.createElement('a');
  titleLink.href = destination;
  titleLink.textContent = project.title;
  title.append(titleLink);
  const technologies = document.createElement('p');
  technologies.className = 'project-entry-technologies small text-muted mb-0';
  technologies.textContent = project.technologies;
  identity.append(marker, title, technologies);

  const content = document.createElement('div');
  content.className = 'project-entry-content';
  const description = document.createElement('p');
  description.className = 'project-entry-description mb-0';
  description.textContent = project.description.replace(/\s+/g, ' ').trim();
  const actions = document.createElement('div');
  actions.className = 'project-entry-actions';
  if (project.githubLink && !project.underDevelopment) {
    const github = document.createElement('a');
    github.href = project.githubLink;
    github.className = 'project-entry-github';
    github.target = '_blank';
    github.rel = 'noopener noreferrer';
    github.setAttribute('aria-label', `GitHub repository: ${project.title} (opens in a new tab)`);
    github.innerHTML = '<i data-feather="github" aria-hidden="true"></i> GitHub';
    actions.append(github);
  }
  if (project.underDevelopment) {
    const status = document.createElement('span');
    status.className = 'project-entry-status';
    status.textContent = 'Under development';
    actions.append(status);
  }
  content.append(description);
  if (actions.childElementCount) content.append(actions);
  item.append(identity, content);
  return item;
}
