'use strict';
(() => {
  const install = document.getElementById('installApp');
  const status = document.getElementById('pwaStatus');
  let promptEvent = null;
  const installed = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const connection = () => {
    status.textContent = navigator.onLine ? '' : 'Offline. OneDrive cloud saves need an internet connection.';
    status.hidden = navigator.onLine;
  };
  connection();
  window.addEventListener('online', connection);
  window.addEventListener('offline', connection);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    if (installed()) return;
    promptEvent = event;
    install.hidden = false;
  });
  install.addEventListener('click', async () => {
    if (!promptEvent) return;
    install.disabled = true;
    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch (error) {
      console.warn('Use the browser menu to install Little wings preschool ledger.', error);
    } finally {
      promptEvent = null;
      install.hidden = true;
      install.disabled = false;
    }
  });
  window.addEventListener('appinstalled', () => { promptEvent = null; install.hidden = true; });
  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', {scope: './',updateViaCache:'none'})
        .catch(error => console.warn('App installation setup failed. Try refreshing online.', error));
    });
  }
})();
