document.addEventListener('globalDataLoaded', () => {
    // Get post ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 1;
    const postDetailUrl = `${window.CONFIG.API_BASE_URL}/api/posts/${id}`;

    fetch(withCommunityId(postDetailUrl))
        .then(r => r.json())
        .then(postDetailData => {
            let postData = postDetailData.data || {};

            // Renderizar detalle del post
            if (postData && postData.title) {
                document.getElementById('post-title').textContent = postData.title;
                document.getElementById('post-detail').innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="card shadow mb-5 rounded-5 border border-3 w-75">
                    <div class="row g-0 align-items-center">
                        <div class="col-md-4 text-center">
                            <img src="${postData.images && postData.images[0] ? postData.images[0].url : 'img/service-1.jpg'}" class="img-fluid rounded my-3" style="max-width: 90%;" alt="Imagen del post">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h2 class="card-title mb-3">${postData.title}</h2>
                                <div class="mb-2 text-muted" style="font-size: 0.95em;">
                                    <span><i class="far fa-calendar-alt"></i> ${new Date(postData.created_at).toLocaleDateString()}</span>
                                    &nbsp;|&nbsp;
                                    <span><i class="fa fa-user"></i> ${postData.user ? postData.user.first_name + ' ' + postData.user.last_name : ''}</span>
                                </div>
                                <div class="mb-2">
                                    <span class="badge bg-primary">${postData.category ? postData.category.name : ''}</span>
                                    ${postData.community && postData.community.name ? `<span class="badge bg-success ms-2">${postData.community.name}</span>` : ""}
                                </div>
                                <hr>
                                <div class="card-text" style="font-size: 1.1em;">${postData.content || ''}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
            } else {
                document.getElementById('post-detail').innerHTML = '<p>Error cargando el post.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('post-detail').innerHTML = '<p>Error de conexión al cargar el post.</p>';
        });
});
