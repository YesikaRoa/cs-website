document.addEventListener('globalDataLoaded', () => {
    const { info } = window.globalData;

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

document.addEventListener('DOMContentLoaded', () => {
    const communityId = localStorage.getItem('communityId');
    if (!communityId) return;

    const leadersContainer = document.getElementById('leaders-container');
    if (!leadersContainer) return;
    
    leadersContainer.innerHTML = `<div class="text-center text-muted">Cargando líderes...</div>`;

    fetch(`${window.CONFIG.API_BASE_URL}/api/users/leaders?communityId=${communityId}`)
        .then(res => res.json())
        .then(data => {
            let leaders = Array.isArray(data.data) ? data.data : normalizeData(data);

            leaders = leaders.filter(user =>
                user.role?.name === 'Community_Leader' || user.role?.name === 'Street_Leader'
            );

            if (leaders.length === 0) {
                leadersContainer.innerHTML = `<div class="text-center text-muted">No hay líderes registrados.</div>`;
                return;
            }

            leadersContainer.innerHTML = '';
            leaders.forEach((leader, index) => {
                const fullName = `${leader.first_name} ${leader.last_name}`;
                const communityName = leader.community?.name || 'Comunidad';
                const imageUrl = leader.url_image?.trim() ? leader.url_image : 'img/team-0.png';
                const delay = 0.1 + index * 0.2;
                const role = leader.role?.name === 'Community_Leader' ? 'Jefe de Comunidad' : 'Jefe de Calle';

                const leaderCard = `
                    <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="${delay}s">
                        <div class="team-item">
                            <div class="overflow-hidden position-relative">
                                <img class="img-fluid" src="${imageUrl}" alt="${fullName}">
                            </div>
                            <div class="text-center border border-5 border-light border-top-0 p-4">
                                <h5 class="mb-0">${fullName}</h5>
                                <small>${role} - ${communityName}</small>
                            </div>
                        </div>
                    </div>
                `;
                leadersContainer.insertAdjacentHTML('beforeend', leaderCard);
            });
        })
        .catch(err => {
            console.error('Error al cargar líderes:', err);
            leadersContainer.innerHTML = `<div class="text-center text-danger">Error al cargar los líderes.</div>`;
        });
});
