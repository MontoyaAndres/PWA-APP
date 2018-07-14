import firebase from 'firebase';
import { signOut } from './auth';

const footer = () => {
  const d = document;
  const c = console.log;

  const footerScripts = setInterval(() => {
    if (d.readyState === 'complete') {
      clearInterval(footerScripts);

    }
  }, 100);

  return `
    <footer class="Footer Content-section u-show">
      ${signOut()}
    </footer>
  `;
};

export default footer;
