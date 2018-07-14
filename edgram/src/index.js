import { init } from './components/helpers/init';
import { isAuth } from './components/auth';

// css
import './style.scss';

// initialize firebase
init();

const page = `
  <main class="EDgram">
    ${isAuth()}
  </main>
`;

document.getElementById('root').innerHTML = page;

// https://www.youtube.com/watch?v=RwVInG6l6lk&list=PLtTGWoGMH2rN87GqdRbAwMShYShGP-46i&index=42
// current class -> https://github.com/jonmircha/edhtml5-pwa2017/tree/master/edgram
