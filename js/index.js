document.addEventListener('globalDataLoaded', () => {
    const { info, posts } = window.globalData;

    // Renderizar últimos 3 proyectos
    const container = document.getElementById('proyectos-dinamicos');
    if (container) {
        container.innerHTML = '';
        posts.slice(0, 3).forEach((post, idx) => {
            let imageUrl = 'img/service-1.jpg';
            if (Array.isArray(post.images) && post.images.length > 0) {
                imageUrl = post.images[0].url;
            }
            const fecha = new Date(post.created_at).toLocaleDateString();
            const categoria = post.category?.name || 'Sin categoría';

            container.innerHTML += `
                <div class="col-md-6 col-lg-4 wow fadeInUp" data-wow-delay="${0.1 + idx * 0.2}s">
                    <div class="service-item">
                        <div class="overflow-hidden">
                            <img class="img-fluid" src="${imageUrl}" alt="">
                        </div>
                        <div class="p-4 text-center border border-5 border-light border-top-0">
                            <div class="mb-2 text-muted" style="font-size: 0.9em;">
                                <i class="far fa-calendar-alt"></i> ${fecha}
                                &nbsp;|&nbsp;
                                <span class="badge bg-primary">${categoria}</span>
                            </div>
                            <h4 class="mb-3">${post.title}</h4>
                            <p>${post.summary || ''}</p>
                            <a class="fw-medium" href="posts-details.html?id=${post.id}">Leer más<i class="fa fa-arrow-right ms-2"></i></a>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Renderizar Misión, Visión, y About
    const mision = info.find(i => i.title && i.title.toUpperCase() === 'MISSION');
    const vision = info.find(i => i.title && i.title.toUpperCase() === 'VISION');
    const about = info.find(i => i.title && i.title.toUpperCase() === 'ABOUT');
    
    if (mision) {
        const misionH5 = document.querySelector('.portfolio-item.first h5');
        if (misionH5) misionH5.textContent = mision.value;
    }
    if (vision) {
        const visionH5 = document.querySelector('.portfolio-item.second h5');
        if (visionH5) visionH5.textContent = vision.value;
    }
    if (about) {
        const aboutP = document.querySelector('.about-text p');
        if (aboutP) aboutP.textContent = about.value;
    }
});
