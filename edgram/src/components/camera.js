import firebase from 'firebase';
import { progressBar, progressStatus, showProgress, hideProgress } from './upload_progress';
import { errorMsg, successMsg } from './helpers/messages';
import { savePḧotoInDB } from './helpers/photos_db';

const camera = () => {
  const d = document;
  const c = console.log;
  const n = navigator;

  const cameraScripts = setInterval(() => {
    if (d.readyState === 'complete') {
      clearInterval(cameraScripts);
      const cameraApp = d.querySelector('.Camera');
      const video = d.getElementById('camera-stream');
      const photo = d.getElementById('photo');
      const startCameraBtn = d.getElementById('start-camera');
      const output = d.querySelector('.Camera').querySelector('.Progress-output');
      const takePhotoBtn = d.getElementById('take-photo');
      const deletePhotoBtn = d.getElementById('delete-photo');
      const uploadPhotoBtn = d.getElementById('upload-photo');
      const downloadPhotoBtn = d.getElementById('download-photo');
      const canvas = d.getElementById('canvas-snap');
      const context = canvas.getContext('2d');

      let snapshot;

      function cameraInit() {
        n.getMedia = (
          n.getUserMedia ||
          n.webkitGetUserMedia ||
          n.mozGetUserMedia ||
          n.msGetUserMedia
        );

        if (!n.getMedia) {
          output.innerHTML = errorMsg('Tu navegador NO soporta el uso de la cámara de tu dispositivo', null)
        } else {
          n.getMedia(
            { video: true },
            stream => {
              video.srcObject = stream;
              video.play();
            },
            err => output.innerHTML = errorMsg(`Hubo un error al acceder a la cámara de tu dispositivo: ${err.mesagge}`, err)
          );
        }
      }

      function takeSnapshot() {
        // Ancho y alto de video
        let width = video.videoWidth;
        let height = video.videoHeight;

        canvas.width = width;
        canvas.height = height;

        context.drawImage(video, 0, 0, width, height);

        return canvas.toDataURL('image/png');
      }

      function cameraReset() {
        // Volver a mostrar y reproducir el vídeo.
        video.style.display = 'block';
        video.play();

        //Limpiar el snapshot de la imagen dinámica y del enlace de descarga
        photo.style.display = 'none';
        photo.setAttribute('src', '');
        downloadPhotoBtn.querySelector('a').href = '#';

        //Deshabilitar botones de eliminar, subir y descargar
        deletePhotoBtn.classList.add('u-disabled')
        uploadPhotoBtn.classList.add('u-disabled')
        downloadPhotoBtn.classList.add('u-disabled')
      }

      cameraInit();
      photo.style.display = 'none';
      canvas.style.display = 'none';

      startCameraBtn.addEventListener('click', e => {
        e.preventDefault();
        video.play();
        video.style.display = 'block';
        photo.style.display = 'none';
      });

      takePhotoBtn.addEventListener('click', e => {
        e.preventDefault();

        // Pausamos y ocultamos el vídeo
        video.style.display = 'none';
        video.pause();

        // Mostramos la captura de la cámara en una imagen.
        snapshot = takeSnapshot();
        photo.style.display = 'block';
        photo.setAttribute('src', snapshot);

        // Asignar la imagen capturada al enlace de descarga.
        downloadPhotoBtn.querySelector('a').href = snapshot;

        //Habilitar botones de eliminar, subir y descargar
        deletePhotoBtn.classList.remove('u-disabled');
        uploadPhotoBtn.classList.remove('u-disabled');
        downloadPhotoBtn.classList.remove('u-disabled');
      });

      deletePhotoBtn.addEventListener('click', e => {
        e.preventDefault();
        cameraReset();
      });

      uploadPhotoBtn.addEventListener('click', e => {
        e.preventDefault();

        const storageRef = firebase.storage().ref().child('edgram/photos');
        const dbRef = firebase.database().ref().child('edgram/photos');
        const user = firebase.auth().currentUser;

        let photoName = `photo_${Math.floor(Math.random() * 10000000)}`;
        let uploadTask = storageRef.child(photoName).putString(snapshot, 'data_url');

        uploadTask.on('state_changed', data => {
          showProgress();
          progressStatus(data);
        }, err => {
          output.innerHTML = errorMsg(`${err.mesagge}`, err);
        }, () => {
          storageRef.child(photoName).getDownloadURL()
            .then(url => {
              output.innerHTML = successMsg('Tu foto se ha subido');
              savePḧotoInDB(url, user);
              hideProgress();

              // Luego de un tiempo, formatear la camara
              setTimeout(() => output.innerHTML = '', 3000)
              cameraReset()
            })
            .catch(err => output.innerHTML = errorMsg(`${err.mesagge}`, err));
        });
      });
    }
  }, 100);

  return `
    <article class="Camera Content-section u-hide">
      <video muted id="camera-stream" class="Camera-video"></video>
      <img id="photo" class="Camera-photo">
      <nav class="Camera-menu">
        <button id="start-camera" title="Iniciar Cámara"><i class="fa fa-power-off"></i></button>
        <button id="take-photo" title="Tomar Foto"><i class="fa fa-camera"></i></button>
        <button class="u-disabled" id="delete-photo" title="Borrar Foto"><i class="fa fa-trash"></i></button>
        <button class="u-disabled" id="upload-photo" title="Subir Foto"><i class="fa fa-upload"></i></button>
        <button class="u-disabled" id="download-photo" title="Guardar Foto"><a href="#" download="selfie_${Math.floor(Math.random() * 10000000)}.png"><i class="fa fa-download"></i></a></button>
      </nav>
      <canvas id="canvas-snap"></canvas>
      ${progressBar()}
    </article>
  `;
};

export default camera;
