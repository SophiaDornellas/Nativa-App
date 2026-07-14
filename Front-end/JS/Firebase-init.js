
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
// [NOVO] Importação do serviço de armazenamento de arquivos (fotos)
import { getStorage } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyByIYdmZIm0TeYKK-DuEWcbZe_6Vlue2jE",
    authDomain: "nativa-app-c4f73.firebaseapp.com",
    projectId: "nativa-app-c4f73",
    storageBucket: "nativa-app-c4f73.firebasestorage.app",
    messagingSenderId: "402458105857",
    appId: "1:402458105857:web:0d7345ae5722dbbe764800",
    measurementId: "G-ZNNLKHPMFN"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  // Exporta os serviços para serem usados em outros ficheiros
export const auth = getAuth(app);
// [NOVO] Exportação do storage para corrigir o erro de SyntaxError
export const storage = getStorage(app);