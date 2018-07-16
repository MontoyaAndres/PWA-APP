import firebase from 'firebase';
import { progressBar, progressStatus, showProgress, hideProgress } from './upload_progress';
import { errorMsg, successMsg } from './helpers/messages';
import { savePḧotoInDB } from './helpers/photos_db';

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
            const uploadTask = storageRef.child(file.name).put(file);

            uploadTask.on('state_changed', data => {
              showProgress();
              progressStatus(data);
            }, err => {
              output.innerHTML = errorMsg(`${err.message}`, err);
            }, () => {
              storageRef.child(file.name).getDownloadURL()
                .then(url => {
                  output.insertAdjacentHTML(
                    'afterbegin',
                    `${successMsg('Tu foto se ha subido')}<img src="${url}">`
                  )
                  savePḧotoInDB(url, user);
                  hideProgress();
                })
                .catch(err => output.innerHTML = errorMsg(`${err.mesagge}`, err))
            });
          } else {
            output.innerHTML = errorMsg('debe ser imagen', null);
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
