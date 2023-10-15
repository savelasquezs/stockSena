// Import the functions you need from the SDKs you need

// Importación de la autentificación
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

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
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const app2 = initializeApp(firebaseConfig);

// constante de autentificación
const auth = getAuth(app);
const auth2 = getAuth(app2);

const db = initializeFirestore(app, {
  cache: CACHE_SIZE_UNLIMITED,
  localCache: persistentLocalCache(
    /* settings */ { tabManager: persistentMultipleTabManager() }
  ),
});

const storage = getStorage(app);
const functions = getFunctions(app);

export { db, auth, storage, auth2, functions };
