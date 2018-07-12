//Registro de Características de PWA's
((d, w, n, c) => {
  //Registro de SW
  if ('serviceWorker' in n) {
    w.addEventListener('load', () => {
      n.serviceWorker.register('./sw.js')
        .then(registration => {
          c(registration)
          c(
            'Service Worker registrado con éxito',
            registration.scope
          )
        })
        .catch(err => c(`Registro de Service Worker fallido`, err))
    })
  }

  //Activar Notificaciones
  if (w.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(status => {
      console.log(status)
      let n = new Notification('Título', {
        body: 'Soy una notificación :)',
        icon: './img/icon_192x192.png'
      })
    })
  }

  // Activar sincronización de fondo
  if ('serviceWorker' in n && 'SyncManager' in w) {
    function registerBGSync() {
      n.serviceWorker.ready
        .then(registration => {
          return registration.sync.register('github')
            .then(() => c('Sincronización de fondo registrada'))
            .catch(err => c('Fallo la sincronización de fondo', err))
        })
    }
    registerBGSync();
  }

  // Compartiendo contenido con el api share
  if (n.share !== undefined) {
    d.addEventListener('DOMContentLoaded', e => {
      let shareButton = d.getElementById('share');

      shareButton.addEventListener('click', e => {
        n.share({
          title: d.title,
          text: 'Hola soy un contenido para compartir',
          url: w.location.href
        })
          .then(() => c('contenido compartido'))
          .catch(err => c('error al compartir', err))
      })
    })
  }
})(document, window, navigator, console.log);

//Detección del Estado de la Conexión
((d, w, n, c) => {
  const header = d.querySelector('.Header');
  const metaTagTheme = d.querySelector('meta[name=theme-color]');

  function networkStatus(e) {
    c(e, e.type)

    if (n.onLine) {
      metaTagTheme.setAttribute('content', '#F7DF1E')
      header.classList.remove('u-offline')
      alert('Conexión Recuperada :)')
    } else {
      metaTagTheme.setAttribute('content', '#666')
      header.classList.add('u-offline')
      alert('Conexión Perdida :(')
    }
  }

  d.addEventListener('DOMContentLoaded', e => {
    if (!n.onLine) {
      networkStatus(this)
    }

    w.addEventListener('online', networkStatus)
    w.addEventListener('offline', networkStatus)
  })
})(document, window, navigator, console.log);

//Aplicación Demo interactuando con el API de GitHub y la sincronización de Fondo
((d, w, n, c) => {
  const userInfo = d.querySelector('.GitHubUser');
  const searchForm = d.querySelector('.GitHubUser-form');

  function fetchGitHubUser(username, requestFormBGSync) {
    const name = username || 'montoyaandres';
    const url = `https://api.github.com/users/${name}`;

    fetch(url, { method: 'GET' })
      .then(response => response.json())
      .then(userData => {
        if (!requestFormBGSync) {
          localStorage.removeItem('github');
        }

        let template = `
          <article class="GitHubUser-info">
            <h2>${userData.name}</h2>
            <img src="${userData.avatar_url}" alt="${userData.login}">
            <p>${userData.bio}</p>
            <ul>
              <li>User GitHub ${userData.login}</li>
              <li>Url GitHub ${userData.html_url}</li>
              <li>Seguidores ${userData.followers}</li>
              <li>Siguiendo ${userData.following}</li>
              <li>Ubicación ${userData.location}</li>
            </ul>
          </article>
        `
        userInfo.innerHTML = template;
      })
      .catch(err => {
        //Si el usuario esta offline y envía una petición, está se almacenará en localStorage
        //Una vez que el usuario esté online, se activará la sincronización de fondo para recuperar la petición fallida
        localStorage.setItem('github', name)
        c(err)
      })
  }

  fetchGitHubUser(localStorage.getItem('github'));

  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    let user = d.getElementById('search').value;

    if (user === '') return;

    localStorage.setItem('github', user);
    fetchGitHubUser(user);

    e.target.reset();
  })

  n.serviceWorker.addEventListener('message', e => {
    console.log('Desde la Sincronización de Fondo: ', e.data);
    fetchGitHubUser(localStorage.getItem('github'), true)
  })
})(document, window, navigator, console.log);
