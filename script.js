
// NON SERVE?
// document.querySelectorAll('.nav-link').forEach(link => {
//     link.addEventListener('click', function (e) {
//       // Rimuove la classe dagli altri
//       document.querySelectorAll('.nav-link').forEach(el => {
//         el.classList.remove('clicked');
//       });
//       // Aggiunge la classe a quello cliccato
//       this.classList.add('clicked');
//     });
//   });

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  
  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      document.getElementById('formSuccess').classList.remove('d-none');
      form.reset();
      setTimeout(() => {
        document.getElementById('formSuccess').classList.add('d-none');
      }, 3000);
    }
  })
  .catch(error => console.error('Error:', error));
});

// Re-initialize feather icons after form submission
feather.replace();