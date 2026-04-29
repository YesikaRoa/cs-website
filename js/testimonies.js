const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

function hasSubmittedToday() {
  const lastSent = localStorage.getItem('lastPost');
  if (!lastSent) return false;

  const timeElapsed = Date.now() - parseInt(lastSent, 10);
  return timeElapsed < ONE_DAY_MS;
}

function markSubmissionTime() {
  localStorage.setItem('lastPost', Date.now().toString());
}

function showTestimonyToast(message = 'Hubo un error al enviar el testimonio.') {
    const toast = document.getElementById('testimonyToast');
    if(!toast) return;
    toast.querySelector('.toast-body').textContent = message;
    toast.classList.remove('d-none');
    toast.classList.add('show');

    setTimeout(() => {
        hideTestimonyToast();
    }, 4000);
}

function hideTestimonyToast() {
    const toast = document.getElementById('testimonyToast');
    if(!toast) return;
    toast.classList.remove('show');
    toast.classList.add('d-none');
}

function showSuccessToast(message = '¡Testimonio enviado con éxito!') {
    const toast = document.getElementById('testimonySuccessToast');
    if(!toast) return;
    toast.querySelector('.toast-body').textContent = message;
    toast.classList.remove('d-none');
    toast.classList.add('show');

    setTimeout(() => {
        hideSuccessToast();
    }, 4000);
}

function hideSuccessToast() {
    const toast = document.getElementById('testimonySuccessToast');
    if(!toast) return;
    toast.classList.remove('show');
    toast.classList.add('d-none');
}

function showWarningToast(message = 'Ya has enviado este formulario en las últimas 24 horas. Intenta mañana.') {
    const toast = document.getElementById('testimonyWarningToast');
    if(!toast) return;
    toast.querySelector('.toast-body').textContent = message;
    toast.classList.remove('d-none');
    toast.classList.add('show');

    setTimeout(() => {
        hideWarningToast();
    }, 4000);
}

function hideWarningToast() {
    const toast = document.getElementById('testimonyWarningToast');
    if(!toast) return;
    toast.classList.remove('show');
    toast.classList.add('d-none');
}

function renderTestimonies(testimonies) {
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (!testimonialCarousel) return;
    testimonialCarousel.innerHTML = '';
    testimonies.forEach((testimonio) => {
        testimonialCarousel.innerHTML += `
            <div class="testimonial-item text-center">
                <div class="testimonial-text text-center p-4">
                    <p style="font-size: 1.9em;">${testimonio.comment}</p>
                    <h5 class="mb-1" style="font-size: 1.5em;">${testimonio.name}</h5>
                    <span class="fst-italic" style="font-size: 1.4em;">${testimonio.community && testimonio.community.name ? testimonio.community.name : 'Vecino de la Comunidad'}</span>
                </div>
            </div>
        `;
    });
    if ($(testimonialCarousel).hasClass('owl-carousel')) {
        $(testimonialCarousel).trigger('destroy.owl.carousel');
        $(testimonialCarousel).owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            items: 1,
            dots: true,
            loop: true,
            nav: false
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch testimonies globally if the carousel exists on the page
    if (document.querySelector('.testimonial-carousel')) {
        fetch(withCommunityId(`${window.CONFIG.API_BASE_URL}/api/testimonies`))
            .then(res => res.json())
            .then(data => {
                let testimonies = normalizeData(data);
                testimonies = testimonies
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 3);
                renderTestimonies(testimonies);
            }).catch(err => console.error("Error loading testimonies", err));
    }

    const testimonyForm = document.getElementById('testimonyForm');
    if(testimonyForm) {
        testimonyForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (hasSubmittedToday()) {
                showWarningToast("Ya has enviado este formulario en las últimas 24 horas. Intenta mañana.");
                return;
            }

            const name = document.getElementById('testimonyName').value.trim();
            const comment = document.getElementById('testimonyComment').value.trim();
            const communityId = Number(localStorage.getItem('communityId'));

            if (!name || !comment) return alert('Por favor completa todos los campos.');

            fetch(withCommunityId(`${window.CONFIG.API_BASE_URL}/api/testimonies`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, comment, community_id: communityId })
            })
            .then(res => {
                if(!res.ok) throw new Error("Error submitting testimony");
                return res.json();
            })
            .then(() => {
                showSuccessToast('¡Testimonio enviado con éxito!');
                testimonyForm.reset();
                const modalEl = document.getElementById('testimonyModal');
                if (modalEl) {
                    const modalInstance = bootstrap.Modal.getInstance(modalEl);
                    if (modalInstance) modalInstance.hide();
                }
                markSubmissionTime();
            })
            .catch(error => {
                console.error('Error al enviar testimonio:', error);
                showTestimonyToast();
            });
        });
    }
});