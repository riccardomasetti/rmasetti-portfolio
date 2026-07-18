function createExperienceElement(experience, index) {
  const item = document.createElement('li');
  item.className = `timeline-item ${index % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right'}`;

  const marker = document.createElement('div');
  marker.className = `timeline-marker${experience.current ? ' timeline-marker-current' : ''}`;
  marker.setAttribute('aria-hidden', 'true');
  marker.innerHTML = `<span><i data-feather="${experience.icon || 'briefcase'}"></i></span>`;

  const card = document.createElement('article');
  card.className = 'experience-card';

  const header = document.createElement('div');
  header.className = 'experience-card-header';

  const heading = document.createElement('div');
  heading.className = 'experience-heading';

  const identity = document.createElement('div');
  identity.className = 'experience-identity';

  if (experience.logo) {
    const logo = document.createElement('img');
    logo.className = 'experience-logo';
    logo.src = experience.logo;
    logo.alt = experience.logoAlt || `${experience.company} logo`;
    logo.loading = 'lazy';
    identity.appendChild(logo);
  }

  const company = document.createElement('p');
  company.className = 'experience-company';
  company.textContent = experience.company;

  const role = document.createElement('h2');
  role.className = 'experience-role';
  role.textContent = experience.role;

  heading.append(company, role);
  identity.appendChild(heading);
  header.appendChild(identity);

  if (experience.current) {
    const currentBadge = document.createElement('span');
    currentBadge.className = 'experience-current';
    currentBadge.textContent = 'Ongoing';
    header.appendChild(currentBadge);
  }

  const meta = document.createElement('div');
  meta.className = 'experience-meta';

  const period = document.createElement('span');
  period.innerHTML = '<i data-feather="calendar"></i>';
  period.appendChild(document.createTextNode(experience.period));
  meta.appendChild(period);

  if (experience.location) {
    const location = document.createElement('span');
    location.innerHTML = '<i data-feather="map-pin"></i>';
    location.appendChild(document.createTextNode(experience.location));
    meta.appendChild(location);
  }

  const description = document.createElement('p');
  description.className = 'experience-description';
  description.textContent = experience.description;

  card.append(header, meta, description);

  item.append(card, marker);
  return item;
}

function initExperienceAnimation(container, items) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    container.style.setProperty('--timeline-progress', '1');
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  let animationFrameRequested = false;

  const updateTimeline = () => {
    const timelineBounds = container.getBoundingClientRect();
    const drawingPoint = window.innerHeight * 0.72;
    const timelineHeight = Math.max(timelineBounds.height, 1);
    const progress = Math.min(
      Math.max((drawingPoint - timelineBounds.top) / timelineHeight, 0),
      1
    );

    container.style.setProperty('--timeline-progress', progress.toFixed(4));

    items.forEach((item) => {
      if (item.classList.contains('is-visible')) return;

      const markerPosition = (item.offsetTop + item.offsetHeight / 2) / timelineHeight;
      if (progress >= markerPosition - 0.025) {
        item.classList.add('is-visible');
      }
    });

    animationFrameRequested = false;
  };

  const requestTimelineUpdate = () => {
    if (animationFrameRequested) return;

    animationFrameRequested = true;
    window.requestAnimationFrame(updateTimeline);
  };

  window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
  window.addEventListener('resize', requestTimelineUpdate);
  requestTimelineUpdate();
}

function initExperiences() {
  const container = document.getElementById('experiences-container');
  if (!container || typeof experiencesData === 'undefined') return;

  container.replaceChildren();

  const sortedExperiences = [...experiencesData].sort(
    (first, second) => new Date(second.startDate) - new Date(first.startDate)
  );

  const items = sortedExperiences.map((experience, index) => {
    const item = createExperienceElement(experience, index);
    container.appendChild(item);
    return item;
  });

  if (window.feather) feather.replace();
  initExperienceAnimation(container, items);
}
