const handleDocumentSelection = () => {
    const documentType = document.getElementById('documentType').value;
    const dynamicFields = document.getElementById('dynamicFields');
    const sendInfoBtn = document.getElementById('sendInfoBtn');

    dynamicFields.innerHTML = ''; // Limpiar campos dinámicos
    sendInfoBtn.disabled = true; // Deshabilitar botón

    if (documentType === 'residence') {
        dynamicFields.innerHTML = `
            <div class="col-12">
                <input type="text" class="form-control border-0" name="fullName" placeholder="Nombre Completo" style="height: 55px;" required>
            </div>
            <div class="col-12">
                <input type="text" class="form-control border-0" name="idNumber" placeholder="Cédula de Identidad" style="height: 55px;" required>
            </div>
            <div class="col-12">
                <input type="text" class="form-control border-0" name="residence" placeholder="Dirección de Residencia" style="height: 55px;" required>
            </div>`;
    } else if (documentType === 'disincorporation') {
        dynamicFields.innerHTML = `
            <div class="col-12">
                <input type="text" class="form-control border-0" name="fullName" placeholder="Nombre Completo" style="height: 55px;" required>
            </div>
            <div class="col-12">
                <input type="text" class="form-control border-0" name="idNumber" placeholder="Cédula de Identidad" style="height: 55px;" required>
            </div>
            <div class="col-12">
                <input type="text" class="form-control border-0" name="destinario" placeholder="Destinatario" style="height: 55px;" required>
            </div>`
    }

    dynamicFields.addEventListener('input', () => {
        const inputs = dynamicFields.querySelectorAll('input');
        sendInfoBtn.disabled = Array.from(inputs).some(input => !input.value.trim());
    });
};
const submitDocumentRequest = async () => {
    const form = document.getElementById('documentForm');
    const formData = new FormData(form);
    const personalData = Object.fromEntries(formData.entries());
    const documentType = document.getElementById('documentType').value;
    const communityId = localStorage.getItem('communityId');
    const sendInfoBtn = document.getElementById('sendInfoBtn');
    const downloadBtnContainer = document.getElementById('downloadBtnContainer');
    const downloadBtn = document.getElementById('downloadBtn');

    // Mostrar spinner y deshabilitar botón mientras se procesa la solicitud
    sendInfoBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';
    sendInfoBtn.disabled = true;

    try {
        // Simular espera para spinner (3 segundos)
        await new Promise(resolve => setTimeout(resolve, 3000));

        const response = await fetch('https://cs-backend-35kl.onrender.com/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ communityId, documentType, personalData }),
            });
        if (!response.ok) {
            const errorData = await response.json();
          showTemporaryError(errorData.message);;
 // Mostrará el mensaje descriptivo
            throw new Error(errorData.message);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Ocultar el botón "Enviar Información" y mostrar el botón de descarga
        sendInfoBtn.style.display = 'none';
        downloadBtnContainer.style.display = 'block';
        downloadBtn.disabled = false;

        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = url;
            let fileName = '';
            if (documentType === 'residence') {
                fileName = 'Carta de Residencia.pdf';
            } else if (documentType === 'disincorporation') {
                fileName = 'Carta de Desincorporación.pdf';
            } else {
                fileName = `${documentType}.pdf`;
            }
            link.download = fileName;
            link.click();
        };

        // Deshabilitar el botón de descarga después de 15 segundos
        setTimeout(() => {
            downloadBtn.disabled = true;
        }, 15000);

        // Restablecer al estado inicial después de 15 segundos
        setTimeout(() => {
            downloadBtnContainer.style.display = 'none';
            sendInfoBtn.style.display = 'block';
            sendInfoBtn.disabled = true;
            sendInfoBtn.innerHTML = 'Enviar Información'; // Restablecer texto original
            document.getElementById('documentType').value = '';
            document.getElementById('dynamicFields').innerHTML = '';
        }, 15000);
    } catch (error) {
       showTemporaryError(error.message);

        // Restaurar botón en caso de error
        sendInfoBtn.innerHTML = 'Enviar Información';
        sendInfoBtn.disabled = false;
    }
};

function showTemporaryError(message) {
  const toastEl = document.getElementById('errorToast');
  const toastMsg = document.getElementById('toastMessage');

  if (!toastEl || !toastMsg) return;

  // Traducción automática de mensajes conocidos
  if (message.toLowerCase().includes('no leaders found')) {
    message = '⚠️ No se encontraron líderes registrados en esta comunidad.';
  }

  toastMsg.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i> ${message}`;

  const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
  toast.show();
}






