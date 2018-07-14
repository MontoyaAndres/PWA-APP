import firebase from 'firebase';
import app from './app';

const d = document;
const c = console.log;

const githubSignIn = () => {
  const provider = new firebase.auth.GithubAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => c(result))
    .catch(err => c(err));
};

const githubSignOut = () => {
  firebase.auth().signOut()
    .then(() => c('bye bye'))
    .catch(err => c(err))
};

const signIn = () => {
  d.addEventListener('click', e => {
    if (e.target.matches('.Sign-button'))
      githubSignIn();
  });

  return `
    <div class="Sign">
      <h1 class="Sign-title">EDgram</h1>
      <button class="Sign-button">
        <i class="fa fa-sign-in"></i>
        entra con
        <i class="fa fa-github"></i>
      </button>
    </div>
  `;
};

export const signOut = () => {
  d.addEventListener('click', e => {
    if (e.target.matches('.logout'))
      githubSignOut();
  })

  return `
    <button class="logout" title="Salir">
      <i class="logout fa fa-sign-out"></i>
    </button>
  `;
};

export const isAuth = () => {
  firebase.auth().onAuthStateChanged(user => {
    const EDgram = d.querySelector('.EDgram');

    if (user) {
      EDgram.innerHTML = app();
    } else {
      EDgram.innerHTML = signIn();
    }
  });
};
