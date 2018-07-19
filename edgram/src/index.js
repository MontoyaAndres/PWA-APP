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
