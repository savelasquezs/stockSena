// Import the functions you need from the SDKs you need

// Importación de la autentificación
import { getAuth } from "firebase/auth";

// Inicializador de firebase
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrYRDVCdhClF3vRmX5YaecuybVnf8KLBU",
  authDomain: "sena-stock-management.firebaseapp.com",
  projectId: "sena-stock-management",
  storageBucket: "sena-stock-management.appspot.com",
  messagingSenderId: "290528563591",
  appId: "1:290528563591:web:1dd4c325a9c7c19d164322",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// constante de autentificación
const auth = getAuth(app);

const db = initializeFirestore(app, {
  cache: CACHE_SIZE_UNLIMITED,
  localCache: persistentLocalCache(
    /* settings */ { tabManager: persistentMultipleTabManager() }
  ),
});

export { db, auth };
