function createPublicationElement(publication, index) {
  const item = document.createElement('li');
  const row = document.createElement('article');
  row.className = 'publication-row';
  row.setAttribute('aria-labelledby', `publication-title-${index}`);

  const year = document.createElement('span');
  year.className = 'publication-year text-muted fw-bold';
  year.textContent = publication.year;

  const details = document.createElement('div');
  details.className = 'publication-details';

  const title = document.createElement('h2');
  title.id = `publication-title-${index}`;
  title.className = 'h5 fw-bold mb-1';
  title.textContent = publication.title;

  const authors = document.createElement('p');
  authors.className = 'small text-muted mb-1';
  publication.authors.forEach((author, authorIndex) => {
    if (authorIndex > 0) authors.appendChild(document.createTextNode(', '));
    const name = document.createElement(author.highlight ? 'strong' : 'span');
    name.textContent = author.name;
    authors.appendChild(name);
    if (author.equalContribution) {
      const marker = document.createElement('sup');
      marker.textContent = '*';
      authors.appendChild(marker);
    }
  });

  const venue = document.createElement('p');
  venue.className = 'small text-muted mb-0';
  const conference = document.createElement('abbr');
  conference.title = publication.venue;
  conference.textContent = publication.conference;
  venue.append(conference, document.createTextNode(` · ${publication.statusNote || publication.status}`));
  details.append(title, authors, venue);

  const link = document.createElement('a');
  link.className = 'publication-link small';
  link.href = publication.href;
  link.textContent = publication.linkLabel;
  link.setAttribute('aria-label', `${publication.linkLabel}: ${publication.title}${publication.external ? ' (opens in a new tab)' : ''}`);
  if (publication.external) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = publication.external ? '↗' : '→';
  link.appendChild(arrow);
  if (publication.authors.some(author => author.equalContribution)) {
    venue.appendChild(document.createTextNode(' · * Equal contribution'));
  }

  row.append(year, details, link);
  item.appendChild(row);
  return item;
}

function initPublications() {
  const container = document.getElementById('publications-container');
  if (!container || typeof publicationsData === 'undefined') return;

  container.replaceChildren(...publicationsData.map(createPublicationElement));
}
