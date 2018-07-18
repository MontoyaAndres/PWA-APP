import firebase from 'firebase';

const profile = () => {
  const d = document;
  const c = console.log;
  const user = firebase.auth().currentUser;
  const dbRef = firebase.database().ref().child('edgram/photos');

  let profilePhotos = '';

  const profileScripts = setInterval(() => {
    if (d.readyState === 'complete') {
      clearInterval(profileScripts);

      dbRef.once('value', data => {
        data.forEach(photo => {
          if (photo.val().uid === user.uid) {
            profilePhotos += `<img src="${photo.val().photoURL}">`;
          }
        });
        d.querySelector('.Profile-photos').innerHTML = profilePhotos;
      });

      dbRef.on('child_added', data => {
        if (data.val().uid === user.uid) {
          d.querySelector('.Profile-photos').innerHTML += `<img src="${data.val().photoURL}">`;
        }
      });
    }
  }, 100);

  return `
    <article class="Profile Content-section u-hide">
      <h2 class="Profile-name">${user.displayName}</h2>
      <p class="Profile-email">${user.email}</p>
      <img class="Profile-avatar" src="${user.photoURL}">
      <h3 class="u-title">Tus Fotos</h3>
      <aside class="Profile-photos"></aside>
    </article>
  `;
};

export default profile;
