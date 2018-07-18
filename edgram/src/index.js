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

// https://www.youtube.com/watch?v=rX4rEG3MIa8&index=54&list=PLtTGWoGMH2rN87GqdRbAwMShYShGP-46i
// current class -> https://github.com/jonmircha/edhtml5-pwa2017/tree/7dc0bcef2847a424444e5cc486d5473617410943
