import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAJ20wtlrrkAUizVuEUTsR9apUm7dFfK-M",
  authDomain: "edubot-47b75.firebaseapp.com",
  projectId: "edubot-47b75",
  storageBucket: "edubot-47b75.firebasestorage.app",
  messagingSenderId: "1017917720831",
  appId: "1:1017917720831:web:edbc678e8b43b3d9bfe4ca",
  measurementId: "G-V7XM0YTW8Q"
};

export const firebaseApp = initializeApp(firebaseConfig);