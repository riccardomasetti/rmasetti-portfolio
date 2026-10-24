function initAboutPhotos() {
  const carousel = document.getElementById('aboutPhotoCarousel');
  if (!carousel || typeof aboutPhotosData === 'undefined' || !window.bootstrap?.Carousel) return;

  const slides = document.getElementById('about-photo-slides');
  const indicators = document.getElementById('about-photo-indicators');
  const status = document.getElementById('about-photo-status');

  aboutPhotosData.forEach((photo, index) => {
    const slide = document.createElement('div');
    slide.className = `carousel-item${index === 0 ? ' active' : ''}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${aboutPhotosData.length}`);

    const frame = document.createElement('div');
    frame.className = `about-photo-frame${photo.cutout ? ' about-photo-cutout' : ''}`;
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.width = photo.width;
    img.height = photo.height;
    img.loading = 'lazy';
    frame.appendChild(img);
    slide.appendChild(frame);
    slides.appendChild(slide);

    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.setAttribute('data-bs-target', '#aboutPhotoCarousel');
    indicator.setAttribute('data-bs-slide-to', index);
    indicator.setAttribute('aria-label', `Show photo ${index + 1}: ${photo.alt}`);
    if (index === 0) {
      indicator.classList.add('active');
      indicator.setAttribute('aria-current', 'true');
    }
    indicators.appendChild(indicator);
  });

  carousel.querySelector('.about-photo-controls').hidden = aboutPhotosData.length < 2;
  carousel.addEventListener('slid.bs.carousel', event => {
    status.textContent = `Photo ${event.to + 1} of ${aboutPhotosData.length}: ${aboutPhotosData[event.to].alt}`;
  });
  new bootstrap.Carousel(carousel, { interval: false, ride: false, touch: true, keyboard: true });
}
