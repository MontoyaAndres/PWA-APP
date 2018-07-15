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

// https://www.youtube.com/watch?v=BqobnIw721A&index=46&list=PLtTGWoGMH2rN87GqdRbAwMShYShGP-46i
// current class -> https://github.com/jonmircha/edhtml5-pwa2017/tree/d8d4ce4787119728cddfbc70d2fdc64dfaeaefe8
