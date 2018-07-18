import firebase from 'firebase/app';

const config = {
  apiKey: "AIzaSyDZ3jl0M3Agbig6YIZs_8PmSrJXlayRg7c",
  authDomain: "edgram-41488.firebaseapp.com",
  databaseURL: "https://edgram-41488.firebaseio.com",
  projectId: "edgram-41488",
  storageBucket: "edgram-41488.appspot.com",
  messagingSenderId: "646739027075"
};
const d = document;
const w = window;
const n = navigator;

export const init = () => firebase.initializeApp(config);

export const pwa = () => {
  // Registro de SW
  if ('serviceWorker' in n) {
    n.serviceWorker.register('./sw.js');
  }

  // Activar Notificaciones
  if (w.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(status => {
      new Notification('EDgram', {
        body: 'Welcome!',
        icon: './icon_192x192.png'
      });
    });
  }

  // Activar Sincronización de Fondo
  if ('serviceWorker' in n && 'SyncManager' in w) {
    n.serviceWorker.ready
      .then(registration => registration.sync.register('github'));
  }
};

export const isOnLine = () => {
  // Detección del Estado de la Conexión
  const header = d.querySelector('.Header');
  const footer = d.querySelector('.Footer');
  const metaTagTheme = d.querySelector('meta[name=theme-color]');

  function networkStatus() {
    if (n.onLine) {
      metaTagTheme.setAttribute('content', '#F7DF1E');
      header.classList.remove('u-offline');
      footer.classList.remove('u-offline');
    } else {
      metaTagTheme.setAttribute('content', '#666');
      header.classList.add('u-offline');
      footer.classList.add('u-offline');
    }
  }

  w.addEventListener('online', networkStatus);
  w.addEventListener('offline', networkStatus);
};
