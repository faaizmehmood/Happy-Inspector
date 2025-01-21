// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFEOGL8BYog1JB6rA-KB1xQqsyPFDdyqc",
  authDomain: "inspect-2ad2a.firebaseapp.com",
  projectId: "inspect-2ad2a",
  storageBucket: "inspect-2ad2a.firebasestorage.app",
  messagingSenderId: "612136279732",
  appId: "1:612136279732:web:ab99851d0182050692c1e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

// const app = initializeApp(firebaseConfig);
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// export { auth, GoogleAuthProvider };