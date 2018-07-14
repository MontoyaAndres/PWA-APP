import firebase from 'firebase/app';

const config = {
  apiKey: "AIzaSyDZ3jl0M3Agbig6YIZs_8PmSrJXlayRg7c",
  authDomain: "edgram-41488.firebaseapp.com",
  databaseURL: "https://edgram-41488.firebaseio.com",
  projectId: "edgram-41488",
  storageBucket: "edgram-41488.appspot.com",
  messagingSenderId: "646739027075"
};

export const init = () => firebase.initializeApp(config);
