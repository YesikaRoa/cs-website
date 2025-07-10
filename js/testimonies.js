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