document.addEventListener('globalDataLoaded', () => {
    const { info } = window.globalData;

    const locationInfo = info.find(i => i.title && i.title.toUpperCase() === 'LOCATION');
    const email = info.find(i => i.title && i.title.toUpperCase() === 'EMAIL');
    const phone = info.find(i => i.title && i.title.toUpperCase() === 'PHONE_NUMBER');

    if (locationInfo) {
        const el = document.getElementById('contactoDireccion');
        if (el) el.textContent = locationInfo.value;
    }
    if (phone) {
        const el = document.getElementById('contactoTelefono');
        if (el) el.textContent = phone.value;
    }
    if (email) {
        const el = document.getElementById('contactoCorreo');
        if (el) el.textContent = email.value;
    }
});
