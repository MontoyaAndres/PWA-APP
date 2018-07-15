import firebase from 'firebase';
import { progressBar } from './upload_progress';
import { errorMsg, successMsg } from './helpers/messages';

const uploader = () => {
  const d = document;
  const c = console.log;

  const uploaderScripts = setInterval(() => {
    if (d.readyState === 'complete') {
      clearInterval(uploaderScripts);

      const storageRef = firebase.storage().ref().child('edgram/photos');
      const dbRef = firebase.database().ref().child('edgram/photos');
      const user = firebase.auth().currentUser;
      const form = d.getElementById('upload');
      const uploader = d.getElementById('uploader');
      const output = d.querySelector('.Uploader').querySelector('.Progress-output');

      uploader.addEventListener('change', e => {
        Array.from(e.target.files).forEach(file => {
          if (file.type.match('image.*')) {
            output.innerHTML = successMsg('awesome');
          } else {
            output.innerHTML = errorMsg('debe ser imagen');
          }
        });

        form.reset();
      });
    }
  }, 100);

  return `
    <article class="Uploader Content-section u-hide">
      <h2 class="u-title">Sube tus Fotos</h2>
      <form name="upload" id="upload">
        <input type="file" id="uploader" multiple>
        <label for="uploader">
          <i class="fa fa-cloud-upload" title="Subir Foto(s)"></i>
        </label>
      </form>
      ${progressBar()}
    </article>
  `;
};

export default uploader;
