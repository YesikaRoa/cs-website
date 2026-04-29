// Normalizar estructura de datos (por si la API devuelve array directo o en un objeto data/posts)
function normalizeData(obj) {
    if (Array.isArray(obj)) return obj;
    if (obj && Array.isArray(obj.data)) return obj.data;
    if (obj && Array.isArray(obj.posts)) return obj.posts;
    if (obj && Array.isArray(obj.communities)) return obj.communities;
    return [];
}

// Añadir el parámetro communityId a una URL si hay comunidad seleccionada
function withCommunityId(url) {
    const comunidadId = localStorage.getItem('communityId');
    if (comunidadId) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}communityId=${comunidadId}`;
    }
    return url;
}

// Mostrar los botones en la modal
function renderCommunityButtons(communities) {
    const listGroup = document.getElementById('community-list-group');
    if (!listGroup) return;
    listGroup.innerHTML = '';
    if (!communities || communities.length === 0) {
        listGroup.innerHTML = '<div class="text-center text-muted">No hay comunidades disponibles.</div>';
        return;
    }
    const comunidadSeleccionada = localStorage.getItem('communityId');
    communities.forEach(comunidad => {
        const btn = document.createElement('button');
        btn.className = 'list-group-item list-group-item-action d-flex align-items-center border border-3 border-primary rounded-pill mb-3 px-4 py-3';
        if (String(comunidad.id) === comunidadSeleccionada) {
            btn.classList.add('active');
        }
        btn.innerHTML = `<i class="fa fa-map-marker-alt text-primary me-2"></i> <span class="text-truncate">${comunidad.name}</span>`;
        btn.onclick = function () {
            skip(comunidad.id, comunidad.name);
        };
        listGroup.appendChild(btn);
    });
}

// Renderizar la información del Footer (Location, Email, Phone)
function renderFooterInfo(info) {
    const location = info.find(i => i.title?.toUpperCase() === 'LOCATION');
    const email = info.find(i => i.title?.toUpperCase() === 'EMAIL');
    const phone = info.find(i => i.title?.toUpperCase() === 'PHONE_NUMBER');
    const footer = document.querySelector('.footer');

    if (footer) {
        const locationP = footer.querySelector('p i.fa-map-marker-alt')?.parentElement;
        const phoneP = footer.querySelector('p i.fa-phone-alt')?.parentElement;
        const emailP = footer.querySelector('p i.fa-envelope')?.parentElement;

        if (location && locationP) locationP.innerHTML = `<i class="fa fa-map-marker-alt me-3"></i>${location.value}`;
        if (phone && phoneP) phoneP.innerHTML = `<i class="fa fa-phone-alt me-3"></i>${phone.value}`;
        if (email && emailP) emailP.innerHTML = `<i class="fa fa-envelope me-3"></i>${email.value}`;
    }
}

// Renderizar últimos 3 posts en el Footer
function renderFooterPosts(posts) {
    const ultimos = posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
    const contenedor = document.getElementById('footer-posts-container');
    if (contenedor) {
        contenedor.innerHTML = ultimos.map(p => `
            <a class="text-light text-decoration-none custom-link-hover text-truncate mb-1" href="posts-details.html?id=${p.id}">
                <i class="fa fa-angle-right me-1 footer-icon"></i> ${p.title}
            </a>
        `).join('');
    }
}

// Cambiar la comunidad
window.skip = function (id, name) {
    localStorage.setItem('communityId', id);
    const communityModalEl = document.getElementById('communityId');
    if (communityModalEl) {
        const modal = bootstrap.Modal.getInstance(communityModalEl);
        if (modal) modal.hide();
    }
    const txtComunidad = document.getElementById('comunidadElegida');
    if (txtComunidad) txtComunidad.textContent = name;
    
    const btnComunidad = document.getElementById('mostrarComunidad');
    if (btnComunidad) btnComunidad.classList.remove('d-none');
    
    // Recargar la página para que se actualicen todos los datos basados en la nueva comunidad
    location.reload();
};

document.addEventListener('DOMContentLoaded', () => {
    const comunidadId = localStorage.getItem('communityId');
    const communityModalEl = document.getElementById('communityId');
    let modal = null;
    if (communityModalEl) {
        modal = new bootstrap.Modal(communityModalEl);
        // Evento de abrir el modal manualmente
        const btnMostrarComunidad = document.getElementById('mostrarComunidad');
        if (btnMostrarComunidad) {
            btnMostrarComunidad.addEventListener('click', () => modal.show());
        }
    }

    // Datos que son globales al Footer o barra de navegación
    Promise.all([
        fetch(`${window.CONFIG.API_BASE_URL}/api/communities`).then(r => r.json()),
        fetch(withCommunityId(`${window.CONFIG.API_BASE_URL}/api/community_information`)).then(r => r.json()),
        fetch(withCommunityId(`${window.CONFIG.API_BASE_URL}/api/posts`)).then(r => r.json())
    ]).then(([communitiesRaw, infoRaw, postsRaw]) => {
        const communities = normalizeData(communitiesRaw);
        const info = normalizeData(infoRaw);
        const posts = normalizeData(postsRaw);

        renderCommunityButtons(communities);
        renderFooterInfo(info);
        renderFooterPosts(posts);

        if (modal) {
            if (!comunidadId) {
                // Forzar mostrar el modal de comunidad si no hay ninguna seleccionada
                modal.show();
            } else {
                const selected = communities.find(c => String(c.id) === String(comunidadId));
                if (selected) {
                    const txtComunidad = document.getElementById('comunidadElegida');
                    if (txtComunidad) txtComunidad.textContent = selected.name;
                    
                    const btnComunidad = document.getElementById('mostrarComunidad');
                    if (btnComunidad) btnComunidad.classList.remove('d-none');
                }
            }
        }
        window.globalData = { communities, info, posts };
        document.dispatchEvent(new Event('globalDataLoaded'));
    }).catch(err => {
        console.error('Error al cargar datos globales:', err);
    });
});
