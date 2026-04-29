function renderFilteredPosts(postsToRender) {
    const container = document.getElementById('posts-container');
    if (!container) return;
    container.innerHTML = '';

    postsToRender.forEach((post, idx) => {
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
                        <a class="fw-medium" href="posts-details.html?id=${post.id}">
                            Leer más <i class="fa fa-arrow-right ms-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}

document.addEventListener('globalDataLoaded', () => {
    const { posts } = window.globalData;
    
    // Fetch categories and populate select
    fetch(`${window.CONFIG.API_BASE_URL}/api/posts_categories`)
        .then(r => r.json())
        .then(data => {
            let categories = Array.isArray(data.data) ? data.data : normalizeData(data);
            const select = document.getElementById('filtroCategoria');
            if(select) {
                categories.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat.id;
                    opt.textContent = cat.name;
                    select.appendChild(opt);
                });
            }
        });

    renderFilteredPosts(posts);

    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function () {
            const nombre = document.getElementById('filtroNombre').value.toLowerCase();
            const categoria = document.getElementById('filtroCategoria').value;
            const desde = document.getElementById('filtroDesde').value;
            const hasta = document.getElementById('filtroHasta').value;

            let filtered = posts;
            if (nombre) {
                filtered = filtered.filter(p => p.title.toLowerCase().includes(nombre));
            }
            if (categoria) {
                filtered = filtered.filter(p => p.category && String(p.category.id) === categoria);
            }
            if (desde) {
                const dateDesde = new Date(desde);
                dateDesde.setHours(0, 0, 0, 0);
                filtered = filtered.filter(p => new Date(p.created_at) >= dateDesde);
            }
            if (hasta) {
                const dateHasta = new Date(hasta);
                dateHasta.setHours(23, 59, 59, 999);
                filtered = filtered.filter(p => new Date(p.created_at) <= dateHasta);
            }
            renderFilteredPosts(filtered);
        });
    }
});
